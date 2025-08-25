export interface AnimalVaccine {
    vaccineId: number;
    vaccineName?: string; // opțional
    animalId: number;
    firstDoseDate: string | null;
    secondDoseDate: string | null;
    nextDose?: string | null;
}
