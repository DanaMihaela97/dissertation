package org.example.apianimals.convertor;



import org.example.apianimals.dto.AnimalCreateDto;
import org.example.apianimals.dto.AnimalInfoDto;
import org.example.apianimals.dto.VaccineInfoDto;
import org.example.apianimals.entity.Animal;
import org.example.apianimals.entity.Vaccine;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class AnimalMapper {
    public static Animal toEntity(AnimalCreateDto dto) {
        Animal animal = new Animal();
        animal.setAnimalName(dto.animalName);
        animal.setBirthdate(LocalDate.parse(dto.birthdate));
        animal.setSex(dto.sex);
        animal.setAge(dto.age);
        animal.setWeight(dto.weight);
        animal.setType(dto.type);
        animal.setBreed(dto.breed);
        animal.setAnamnesis(dto.anamnesis);

        if (dto.vaccines != null) {
            List<Vaccine> vacc = dto.vaccines.stream()
                    .map(v -> {
                        Vaccine vaccine = new Vaccine();
                        vaccine.setId(v.id);
                        return vaccine;
                    })
                    .collect(Collectors.toList());

            animal.setVaccines(vacc);
        }

        return animal;
    }
    public static AnimalInfoDto toDto(Animal animal) {
        AnimalInfoDto dto = new AnimalInfoDto();
        dto.animalName = animal.getAnimalName();
        dto.birthdate = String.valueOf(animal.getBirthdate());
        dto.sex = animal.getSex();
        dto.age = animal.getAge();
        dto.weight = animal.getWeight();
        dto.type = animal.getType();
        dto.breed = animal.getBreed();
        dto.anamnesis = animal.getAnamnesis();

        if (animal.getVaccines() != null) {
            dto.vaccines = animal.getVaccines().stream()
                    .map(v -> {
                        VaccineInfoDto vaccineDto = new VaccineInfoDto();
                        vaccineDto.id = v.getId();
                        return vaccineDto;
                    })
                    .collect(Collectors.toList());
        }

        return dto;
    }

}
