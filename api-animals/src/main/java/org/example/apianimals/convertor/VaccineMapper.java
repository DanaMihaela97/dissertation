package org.example.apianimals.convertor;

import org.example.apianimals.dto.VaccineDto;
import org.example.apianimals.entity.Vaccine;

public class VaccineMapper {
   public static VaccineDto toDto(Vaccine entity) {
      VaccineDto dto = new VaccineDto();
      dto.setId(entity.getId());
      dto.setName(entity.getName());
      dto.setAgeWeeks(entity.getAgeWeeks());
      dto.setAnimalType(entity.getAnimalType().toString());
      dto.setRapel_days(entity.getRapel_days());
      dto.setRevaccinationInterval(entity.getRevaccinationInterval());
      return dto;
   }
}
