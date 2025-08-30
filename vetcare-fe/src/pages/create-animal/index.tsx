import React, { useState, useEffect, useRef } from "react";
import {
    createAnimal,
    createAnimalVaccines,
} from "@/services/animalService";
import { CreateAnimalProfile } from "@/components/entities/createAnimalProfile";
import { Vaccine } from "@/components/entities/vaccines";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import { MoonLoader } from "react-spinners";
import Authentication from "@/components/Authentication";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import {
    calculateAge,
    dateToString, fetchBreeds, fetchVaccines,
    isStep1Valid,
    stringToDate,
} from "@/utils/animalData";
import {Step1} from "@/components/Steps/Step1";
import Step2 from "@/components/Steps/Step2";
import DatePicker from "react-datepicker";

const CreateAnimalProfileComponent = () => {
    const { status } = useSession();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<CreateAnimalProfile>({
        id: 0,
        animalName: "",
        birthdate: "",
        sex: "",
        age: 0,
        weight: "",
        type: "",
        breed: "",
        vaccines: [],
        vaccineDates: {
            firstDoseDates: {},
            secondDoseDates: {},
        },
    });


    const [breeds, setBreeds] = useState<string[]>([]);
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [loadingBreeds, setLoadingBreeds] = useState(false);
    const datePickerRef = useRef<DatePicker>(null);

    const router = useRouter();

    useEffect(() => {
        setLoadingBreeds(true);
        fetchBreeds(formData.type)
        .then(setBreeds)
        .catch(console.error)
        .finally(() => setLoadingBreeds(false));
    }, [formData.type]);

    useEffect(() => {
        fetchVaccines()
        .then(setVaccines)
        .catch(console.error);
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "birthdate") {
                updated.age = calculateAge(value);
            }
            return updated;
        });
    };

    const setFieldValue = (name: string, value: string) => {
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "birthdate") {
                updated.age = calculateAge(value);
            }
            return updated;
        });
    };

    const handleVaccineCheck = (
       vaccineId: number,
       dose: "first" | "second",
       checked: boolean
    ) => {
        setFormData((prev) => {
            const firstDoseDates = { ...prev.vaccineDates.firstDoseDates };
            const secondDoseDates = { ...prev.vaccineDates.secondDoseDates };

            if (dose === "first") {
                if (checked) firstDoseDates[vaccineId] = firstDoseDates[vaccineId] || "pending";
                else delete firstDoseDates[vaccineId];
            } else {
                if (checked) secondDoseDates[vaccineId] = secondDoseDates[vaccineId] || "pending";
                else delete secondDoseDates[vaccineId];
            }

            return {
                ...prev,
                vaccineDates: {
                    firstDoseDates,
                    secondDoseDates,
                },
            };
        });
    };


    const handleVaccineDateChange = (vaccineId: number, dose: "first" | "second", date: string) => {
        setFormData(prev => {
            const updated = { ...prev, vaccineDates: { ...prev.vaccineDates } };

            if (dose === "first") {
                updated.vaccineDates.firstDoseDates[vaccineId] = date;
            } else {
                updated.vaccineDates.secondDoseDates[vaccineId] = date;
            }

            return updated;
        });
    };


    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {

            const createdAnimal = await createAnimal(formData);
            const animalId = createdAnimal.id;

            const selectedVaccines = vaccines
            .map((vaccine) => {
                const firstDate = formData.vaccineDates.firstDoseDates[vaccine.id];
                const secondDate = formData.vaccineDates.secondDoseDates[vaccine.id];
                if (!firstDate && !secondDate) return null;

                return {
                    animalId,
                    vaccineId: vaccine.id,
                    firstDoseDate: firstDate || null,
                    secondDoseDate: secondDate || null,
                };
            })
            .filter((v) => v !== null);


            if (selectedVaccines.length > 0) {
                await createAnimalVaccines(animalId, selectedVaccines);
            }

            Swal.fire({
                title: "Profil creat!",
                text: `Profilul lui ${formData.animalName} a fost creat!`,
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#3085d6",
            });
            router.push("/animals")
        } catch (error) {
            console.error("Eroare la trimiterea formularului:", error);
            Swal.fire({
                title: "Eroare!",
                text: "A apărut o eroare la salvarea datelor.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <Layout>
            <Authentication>
                {status === "loading" ? (
                    <div className="flex justify-center items-center h-64">
                        <MoonLoader color="#2563eb" size={40} />
                    </div>
                ) : (
                    <div style={{ marginTop: "30px" }}>
                        <div className="container mx-auto px-4 py-8 max-w-5xl">
                            <div className="bg-whiterounded-xl p-6">
                                <div className="bg-white rounded-xl p-6 ">

                                    {step === 1 && (
                                       <Step1
                                          formData={formData}
                                          handleChange={handleChange}
                                          handleSelectChange={handleSelectChange}
                                          setFieldValue={setFieldValue}
                                          stringToDate={stringToDate}
                                          dateToString={dateToString}
                                          datePickerRef={datePickerRef}
                                          breeds={breeds}
                                          loadingBreeds={loadingBreeds}
                                          setStep={setStep}
                                          isStep1Valid={isStep1Valid}
                                       />
                                    )}

                                    {step === 2 && (
                                       <Step2
                                          vaccines={vaccines}
                                          formData={formData}
                                          handleVaccineCheck={handleVaccineCheck}
                                          handleVaccineDateChange={handleVaccineDateChange}
                                          setStep={setStep}
                                          handleSubmit={handleSubmit}
                                       />
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Authentication>
        </Layout>
    );
};

export default CreateAnimalProfileComponent;

