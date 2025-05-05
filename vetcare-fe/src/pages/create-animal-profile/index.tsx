import React, { useState, useEffect } from 'react';
import { getDogBreeds, getCatBreeds, getVaccines, createAnimal, createAnimalVaccines } from '@/services/animalService';
import { useRouter } from 'next/router';
import { CreateAnimalProfile } from '@/components/entities/createAnimalProfile';
import { Vaccine } from '@/components/entities/vaccines';
import Navbar from '@/components/Navbar/Navbar';
import styles from './animal.profile.module.css'; // Importă stilurile
import { PawPrint, Syringe } from 'lucide-react';
import Swal from 'sweetalert2';

const CreateAnimalProfileComponent = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CreateAnimalProfile>({
    animalName: '',
    birthdate: '',
    sex: '',
    age: 0,
    weight: '',
    type: '',
    breed: '',
    vaccineDates: {}
  });

  const [breeds, setBreeds] = useState<string[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const router = useRouter();

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    if (formData.type === 'Câine') {
      getDogBreeds().then(setBreeds);
    } else if (formData.type === 'Pisică') {
      getCatBreeds().then(setBreeds);
    } else {
      setBreeds([]);
    }
  }, [formData.type]);

  useEffect(() => {
    getVaccines()
      .then((vaccinesData) => {
        setVaccines(vaccinesData);
      })
      .catch((error) => {
        console.error("Failed to load vaccines:", error);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'birthdate') {
        updated.age = calculateAge(value);
      }
      return updated;
    });
  };

  const handleVaccineCheck = (vaccineName: string, checked: boolean) => {
    setFormData(prev => {
      const updatedDates = { ...prev.vaccineDates };
      if (!checked) {
        delete updatedDates[vaccineName];
      } else {
        updatedDates[vaccineName] = '';
      }
      return { ...prev, vaccineDates: updatedDates };
    });
  };

  const handleVaccineDateChange = (vaccineName: string, date: string) => {
    setFormData(prev => ({
      ...prev,
      vaccineDates: {
        ...prev.vaccineDates,
        [vaccineName]: date
      }
    }));
  };

  const isStep1Valid = () => {
    console.log(formData);
    return (
      formData.animalName &&
      formData.birthdate &&
      formData.sex &&
      formData.weight &&
      formData.type &&
      formData.breed
    );
  };
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async () => {
    try {
      const animalPayload = {
        animalName: formData.animalName,
        birthdate: formData.birthdate,
        sex: formData.sex,
        age: formData.age,
        weight: formData.weight,
        type: formData.type,
        breed: formData.breed,
      };
  
      const createdAnimal = await createAnimal(animalPayload);
      const animalId = createdAnimal.id;
  
      const selectedVaccines = Object.entries(formData.vaccineDates)
        .filter(([_, date]) => date !== "")
        .map(([vaccineName, date]) => {
          const vaccine = vaccines.find((v) => v.name === vaccineName);
          return {
            animalId,
            vaccineId: vaccine?.id,
            dateAdministered: date
          };
        });
  
      if (selectedVaccines.length > 0) {
        await createAnimalVaccines(animalId, selectedVaccines);
      }
  
      Swal.fire({
        title: 'Profil creat!',
        text: `Profilul lui ${formData.animalName} a fost creat!`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      }) 
    } catch (error) {
      console.error('Eroare la trimiterea formularului:', error);
      Swal.fire({
        title: 'Eroare!',
        text: 'A apărut o eroare la salvarea datelor.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex flex-col md:flex-row mb-8 border-b pb-4 steps">
            <div
              className={`flex-1 text-center py-2 cursor-pointer transition-all  ${step === 1
                ? "border-b-2 md:border-b-0 md:border-r-2 border-primary font-medium text-primary"
                : "text-muted-foreground"
                }`}
              onClick={() => step === 2 && isStep1Valid() && setStep(1)}
            >
              <div className="flex items-center justify-center gap-2">
                <PawPrint className="h-5 w-5" />
                <span>1. Datele animalului</span>
              </div>
            </div>
            <div
              className={`flex-1 text-center py-2 cursor-pointer transition-all ${step === 2
                ? "border-b-2 md:border-b-0 md:border-l-2 border-primary font-medium text-primary"
                : "text-muted-foreground"
                }`}
              onClick={() => step === 1 && isStep1Valid() && setStep(2)}
            >
              <div className="flex items-center justify-center gap-2">
                <Syringe className="h-5 w-5" />
                <span>2. Vaccinuri efectuate</span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="animalName">Nume animal</label>
                <input
                  id="animalName"
                  name="animalName"
                  value={formData.animalName}
                  placeholder="Nume animal"
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="birthdate">Data nașterii</label>
                <input
                  id="birthdate"
                  name="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="sex">Sex</label>
                <select
                  value={formData.sex}
                  onChange={(e) => handleSelectChange("sex", e.target.value)}
                >
                  <option value="">Alege</option>
                  <option value="Mascul">Mascul</option>
                  <option value="Femelă">Femelă</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="weight">Greutate (kg)</label>
                <input
                  id="weight"
                  name="weight"
                  type="text"
                  value={formData.weight}
                  placeholder="Greutate"
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="type">Tip animal</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleSelectChange("type", e.target.value)}
                >
                  <option value="">Alege</option> 
                  <option value="Câine">Câine</option>
                  <option value="Pisică">Pisică</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="breed">Rasă</label>
                <select
                  value={formData.breed}
                  onChange={(e) => handleSelectChange("breed", e.target.value)}
                  disabled={!formData.type}
                >
                  <option value="">Selectează rasa</option>
                  {breeds.map((breed) => (
                    <option key={breed} value={breed}>
                      {breed}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.buttonWrapper}>
                <button
                  onClick={() => setStep(2)}
                  disabled={!isStep1Valid()}
                  className={styles.continueButton}
                >
                  Continuă
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Vaccinuri efectuate</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vaccines.length > 0 ? (
                  vaccines.map((vaccine, index) => {
                    const isChecked = vaccine.name in formData.vaccineDates;
                    return (
                      <div
                        key={vaccine.id}
                        className="bg-gray-100 rounded-lg p-4 border"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              handleVaccineCheck(vaccine.name, e.target.checked)
                            }
                          />
                          <label className="font-semibold">{vaccine.name}</label>
                        </div>
                        {isChecked && (
                          <input
                            type="date"
                            className="mb-2 w-full border rounded px-2 py-1"
                            value={formData.vaccineDates[vaccine.name] || ""}
                            onChange={(e) =>
                              handleVaccineDateChange(vaccine.name, e.target.value)
                            }
                          />
                        )}
                        <p className="text-sm">
                          <strong>Vârsta minimă:</strong> {vaccine.ageWeeks} săptămâni
                        </p>
                        <p className="text-sm">
                          <strong>Rapel:</strong> {vaccine.rapel}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="col-span-2 text-center">
                    Nu sunt vaccinuri disponibile
                  </p>
                )}
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border rounded"
                >
                  Înapoi
                </button>
                <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded">
                  Trimite
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </>
  );
}
export default CreateAnimalProfileComponent;