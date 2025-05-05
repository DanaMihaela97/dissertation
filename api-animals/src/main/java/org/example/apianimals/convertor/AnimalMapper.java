package org.example.apianimals.convertor;

import org.example.apianimals.dto.AnimalCreateDto;
import org.example.apianimals.dto.AnimalInfoDto;
import org.example.apianimals.dto.AnimalVaccineInfoDto;
import org.example.apianimals.entity.Animal;

import java.time.LocalDate;
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
        return animal;
    }

    public static AnimalInfoDto toDto(Animal animal) {
        AnimalInfoDto dto = new AnimalInfoDto();
        dto.id=animal.getId();
        dto.animalName = animal.getAnimalName();
        dto.birthdate = String.valueOf(animal.getBirthdate());
        dto.sex = animal.getSex();
        dto.age = animal.getAge();
        dto.weight = animal.getWeight();
        dto.type = animal.getType();
        dto.breed = animal.getBreed();

        if (animal.getAnimalVaccines() != null) {
            dto.vaccines = animal.getAnimalVaccines().stream()
                    .map(animalVaccine -> {
                        AnimalVaccineInfoDto animalVaccineInfoDto = new AnimalVaccineInfoDto();
                        animalVaccineInfoDto.setVaccineId(animalVaccine.getVaccine().getId());
                        animalVaccineInfoDto.setAnimalId(animal.getId());
                        animalVaccineInfoDto.setDateAdministered(animalVaccine.getDateAdministered());

                        return animalVaccineInfoDto;
                    })
                    .collect(Collectors.toList());
        }
        return dto;
    }
}
