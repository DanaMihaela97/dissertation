import React, { useState, useEffect } from 'react';
import { getDogBreeds, getCatBreeds, getVaccines } from '@/services/animalService';
import { useRouter } from 'next/router';
import { CreateAnimalProfile } from '@/components/entities/createAnimalProfile';
import { Vaccine } from '@/components/entities/vaccines';
import Navbar from '@/components/Navbar';

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
    }
  }, [formData.type]);

  useEffect(() => {
    getVaccines().then(setVaccines);
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

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // API call here...
    // router.push('/profil-animal');
  };

  return (
    <>
    <Navbar />
    <div className="max-w-xl mx-auto p-6">
      {step === 1 && (
        <div className="space-y-4">
          <input type="text" name="animalName" placeholder="Nume animal" className="input" onChange={handleChange} />
          <input type="date" name="birthdate" className="input" onChange={handleChange} />
          <input type="text" name="sex" placeholder="Sex" className="input" onChange={handleChange} />
          <input type="text" name="weight" placeholder="Greutate" className="input" onChange={handleChange} />

          <select name="type" className="input" value={formData.type} onChange={handleChange}>
            <option value="">Selectează tipul animalului</option>
            <option value="Câine">Câine</option>
            <option value="Pisică">Pisică</option>
          </select>

          {formData.type && (
            <select name="breed" className="input" onChange={handleChange} value={formData.breed}>
              <option value="">Selectează rasa</option>
              {breeds.map((breed) => (
                <option key={breed} value={breed}>{breed}</option>
              ))}
            </select>
          )}

          <button onClick={() => setStep(2)} className="btn">Continuă</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Vaccinuri efectuate</h3>
          {vaccines.map((vaccine) => {
            const isChecked = vaccine.name in formData.vaccineDates;
            return (
              <div key={vaccine.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => handleVaccineCheck(vaccine.name, e.target.checked)}
                />
                <label>{vaccine.name}</label>
                {isChecked && (
                  <input
                    type="date"
                    value={formData.vaccineDates[vaccine.name] || ''}
                    onChange={(e) => handleVaccineDateChange(vaccine.name, e.target.value)}
                  />
                )}
              </div>
            );
          })}
          <button onClick={handleSubmit} className="btn">Trimite</button>
        </div>
      )}
    </div>
    </>
  );
};

export default CreateAnimalProfileComponent;
