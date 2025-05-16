package org.example.apichat.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class ChatSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long animalId;
    private Boolean finished;

    @Lob
    private String conversationHistory;
    private Integer currentQuestionIndex;

    @Lob
    private String answersJson;
    @Column(name = "ai_questions_count")
    private int aiQuestionsCount = 0;

}