package org.example.apichat.service.impl;

import com.nimbusds.jose.shaded.gson.Gson;
import org.example.apichat.dto.Animal;
import org.example.apichat.dto.Vaccine;
import org.example.apichat.entity.ChatSession;
import org.example.apichat.entity.Consultation;
import org.example.apichat.repository.ChatSessionRepository;
import org.example.apichat.repository.ConsultationRepository;
import org.example.apichat.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ChatServiceImpl implements ChatService {
    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent";

    private final ChatSessionRepository chatSessionRepository;

    private final ConsultationRepository consultationRepository;

    @Autowired
    public ChatServiceImpl(ChatSessionRepository chatSessionRepository, ConsultationRepository consultationRepository) {
        this.chatSessionRepository = chatSessionRepository;
        this.consultationRepository = consultationRepository;
    }

    public Map<String, String> startSession(Animal animal) {
        ChatSession session = new ChatSession();
        session.setAnimalId(animal.getId());
        session.setFinished(false);

        String medicalContext = buildAnimalMedicalContext(animal);
        String opening = String.format(
                "Bine te-am regăsit! Ca să te pot ajuta cu %s, spune-mi mai întâi ce simptome ai observat.",
                animal.getAnimalName()
        );

        String fullPrompt = "Context veterinar:\n" + medicalContext + "\nAI: " + opening + "\n";

        session.setConversationHistory(fullPrompt);
        chatSessionRepository.save(session);

        return Map.of(
                "sessionId", session.getId().toString(),
                "message", "Consultația a fost inițiată cu succes.",
                "botResponse", opening
        );

    }

    private String buildAnimalMedicalContext(Animal animal) {
        StringBuilder sb = new StringBuilder();
        sb.append("Profil animal:\n");
        sb.append("- Nume: ").append(animal.getAnimalName()).append("\n");
        sb.append("- Sex: ").append(animal.getSex()).append("\n");
        sb.append("- Rasă: ").append(animal.getBreed()).append("\n");
        sb.append("- Vârstă: ").append(animal.getAge()).append(" ani\n");
        sb.append("- Greutate: ").append(animal.getWeight()).append("\n");
        sb.append("- Tip: ").append(animal.getType()).append("\n");
        sb.append("- Data nașterii: ").append(animal.getBirthdate()).append("\n");

        if (animal.getAnamnesis() != null && !animal.getAnamnesis().isBlank()) {
            sb.append("- Anamneză: ").append(animal.getAnamnesis()).append("\n");
        }

        if (animal.getVaccines() != null && !animal.getVaccines().isEmpty()) {
            sb.append("Vaccinuri administrate:\n");
            for (Vaccine vaccine : animal.getVaccines()) {
                sb.append("  - ID vaccin: ").append(vaccine.getVaccineId())
                        .append(", Data: ").append(vaccine.getDateAdministered())
                        .append("\n");
            }
        } else {
            sb.append("Fără vaccinuri înregistrate.\n");
        }

        return sb.toString();
    }

    public Map<String, Object> sendMessage(Long sessionId, String userMessage, String userEmail) {
        ChatSession session = chatSessionRepository.findById(sessionId).orElseThrow();
        String conversation = session.getConversationHistory() + "User: " + userMessage + "\n";

        int maxQuestions = 4;
        boolean shouldForceFinal = session.getAiQuestionsCount() >= maxQuestions;

        String prompt;
        if (shouldForceFinal) {
            prompt = "Ești un medic veterinar. Ai primit suficiente informații de la proprietar.\n"
                    + "Oferă un răspuns clar și concis, limitat la maxim 7 rânduri, structurat astfel:\n"
                    + "1. Diagnostic (scurt, 1-2 fraze)\n"
                    + "2. Tratament (esențial, fără detalii inutile)\n"
                    + "3. Recomandări (maxim 2-3 puncte scurte)\n\n"
                    + "Dacă situația necesită consult fizic la cabinet, menționează clar acest lucru în recomandări.\n"
                    + "Dacă este cazul, recomandă și un tip de hrană potrivită pentru animal.\n\n"
                    + "Nu adăuga explicații medicale complexe sau redundante.\n\n"
                    + "Context conversație:\n" + conversation;
        } else {
            prompt = "Ești un medic veterinar. Pacientul a descris următoarele simptome:\n" + conversation +
                    "\nPune o singură întrebare clară și relevantă pentru a aduna informații suplimentare. " +
                    "Nu oferi diagnostic sau tratament până nu ai suficiente informații. " +
                    "După cel mult " + maxQuestions + " întrebări, oferă un răspuns clar și structurat astfel:\n" +
                    "1. Diagnostic\n2. Tratament\n3. Recomandări\n" +
                    "Dacă situația necesită consult fizic la cabinet, menționează clar acest lucru la recomandări.\n" +
                    "Dacă este cazul, recomandă și un tip de hrană potrivită pentru animal.\n" +
                    "Limitează răspunsul final la maxim 7 rânduri.";
        }

        String aiReply = callGeminiApi(prompt);
        conversation +=  aiReply + "\n";
        session.setConversationHistory(conversation);

        boolean isFinal = aiReply.toLowerCase().contains("diagnostic") &&
                aiReply.toLowerCase().contains("tratament");

        if (isFinal || shouldForceFinal) {
            session.setFinished(true);
            saveFinalConsultation(aiReply, session.getAnimalId(), userEmail);
        }

        if (!session.getFinished()) {
            session.setAiQuestionsCount(session.getAiQuestionsCount() + 1);
        }

        chatSessionRepository.save(session);

        return Map.of("reply", aiReply, "finished", session.getFinished());
    }

    private String callGeminiApi(String prompt) {
        Map<String, Object> part = Map.of("text", prompt);
        Map<String, Object> content = Map.of("parts", List.of(part));
        Map<String, Object> payload = Map.of("contents", List.of(content));

        String requestBody = new Gson().toJson(payload);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    GEMINI_URL + "?key=" + apiKey,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );
            return extractAiResponse(response.getBody());
        } catch (Exception e) {
            throw new RuntimeException("Eroare la apelul AI: " + e.getMessage(), e);
        }
    }

    private void saveFinalConsultation(String aiReply, Long animalId, String userEmail) {
        Map<String, String> sections = parseSections(aiReply);

        Consultation consultation = new Consultation();
        consultation.setAnimalId(animalId);
        consultation.setDiagnosis(sections.getOrDefault("Diagnostic", "").replace("**", "").trim());
        consultation.setTreatment(sections.getOrDefault("Tratament", "").replace("**", "").trim());
        consultation.setAdvice(sections.getOrDefault("Recomandări", sections.getOrDefault("Sfaturi", "")).replace("**", "").trim());
        consultation.setCreatedAt(LocalDateTime.now());
        consultation.setUserEmail(userEmail);

        consultationRepository.save(consultation);
    }

    private Map<String, String> parseSections(String text) {
        Map<String, String> sections = new HashMap<>();
        Pattern pattern = Pattern.compile("(Diagnostic|Tratament|Sfaturi|Recomandări):\\s*([\\s\\S]*?)(?=Diagnostic:|Tratament:|Sfaturi:|Recomandări:|$)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        while (matcher.find()) {
            String key = matcher.group(1).trim();
            String value = matcher.group(2).trim();
            sections.put(key, value);
        }
        return sections;
    }

    private String extractAiResponse(Map<String, Object> responseBody) {
        if (responseBody == null || !responseBody.containsKey("candidates")) return "Nu am putut obține un răspuns.";
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
        if (candidates.isEmpty()) return "Fără răspuns.";
        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        return (String) parts.get(0).get("text");
    }

    private String extractSection(String text, String keyword) {
        Pattern pattern = Pattern.compile(keyword + "[:\\-\\s]*([^\\n]+(?:\\n[^\\n]+)*)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        return matcher.find() ? matcher.group(1).trim() : "";
    }
    public int consultationCount(){
        return (int) consultationRepository.count();
    }

    @Override
    public List<Consultation> getConsultationsByAnimalId(Long animalId) {
        return consultationRepository.findAllByAnimalId(animalId);
    }
}