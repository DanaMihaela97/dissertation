package com.example.apilocation.dto;

import java.util.*;

public class ScheduleFormatter {

    private static final Map<String, String> dayMap = Map.of(
            "Monday", "L",
            "Tuesday", "Ma",
            "Wednesday", "Mi",
            "Thursday", "J",
            "Friday", "V",
            "Saturday", "S",
            "Sunday", "D"
    );

    public static String formatSchedule(List<String> weekdayText) {
        if (weekdayText == null || weekdayText.isEmpty()) return "Program indisponibil";

        Map<String, List<String>> programToDays = new LinkedHashMap<>();
        for (String line : weekdayText) {
            String[] parts = line.split(": ", 2);
            if (parts.length < 2) continue;
            String day = parts[0].trim();
            String hours = parts[1].trim();
            programToDays.computeIfAbsent(hours, k -> new ArrayList<>()).add(day);
        }

        List<String> formattedParts = new ArrayList<>();
        for (Map.Entry<String, List<String>> entry : programToDays.entrySet()) {
            String hours = entry.getKey();
            List<String> days = entry.getValue();

            List<String> shortDays = new ArrayList<>();
            for (String day : days) {
                String shortDay = dayMap.getOrDefault(day, day.substring(0, 2));
                shortDays.add(shortDay);
            }

            shortDays.sort(Comparator.comparingInt(ScheduleFormatter::dayOrder));

            String dayRange = groupDays(shortDays);

            String formattedHours = convertTo24h(hours);

            formattedParts.add(dayRange + ": " + formattedHours);
        }

        return String.join(", ", formattedParts);
    }

    private static int dayOrder(String day) {
        switch (day) {
            case "L": return 1;
            case "Ma": return 2;
            case "Mi": return 3;
            case "J": return 4;
            case "V": return 5;
            case "S": return 6;
            case "D": return 7;
            default: return 100;
        }
    }

    private static String groupDays(List<String> days) {
        if (days.size() == 1) return days.get(0);

        List<String> result = new ArrayList<>();
        int start = 0;
        for (int i = 1; i <= days.size(); i++) {
            if (i == days.size() || dayOrder(days.get(i)) != dayOrder(days.get(i - 1)) + 1) {
                if (start == i - 1) {
                    result.add(days.get(start));
                } else {
                    result.add(days.get(start) + "-" + days.get(i - 1));
                }
                start = i;
            }
        }
        return String.join(", ", result);
    }

    private static String convertTo24h(String hours) {

        String[] parts = hours.split("–");
        if (parts.length != 2) return hours;

        String start = convertHour(parts[0].trim());
        String end = convertHour(parts[1].trim());

        return start + "-" + end;
    }

    private static String convertHour(String time12h) {
        try {
            java.text.SimpleDateFormat sdf12 = new java.text.SimpleDateFormat("h:mm a", Locale.ENGLISH);
            java.text.SimpleDateFormat sdf24 = new java.text.SimpleDateFormat("HH:mm");
            Date date = sdf12.parse(time12h);
            return sdf24.format(date);
        } catch (Exception e) {
            return time12h;
        }
    }
}