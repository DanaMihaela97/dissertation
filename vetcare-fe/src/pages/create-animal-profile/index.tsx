import React, { useState, useEffect, useRef } from "react";
import {
    getDogBreeds,
    getCatBreeds,
    getVaccines,
    createAnimal,
    createAnimalVaccines,
} from "@/services/animalService";
import { CreateAnimalProfile } from "@/components/entities/createAnimalProfile";
import { Vaccine } from "@/components/entities/vaccines";
import styles from "./animal.profile.module.css";
import {
    Calendar,
    CalendarIcon,
    ClockIcon,
    HeartIcon,
    PawPrint,
    SyringeIcon,
    WeightIcon,
} from "lucide-react";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MoonLoader } from "react-spinners";
import Authentication from "@/components/Authentication";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

const CreateAnimalProfileComponent = () => {
    const { status } = useSession();
    const isAuthenticated = status === "authenticated";

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
        vaccineDates: {},
        vaccines: [],
    });

    const [breeds, setBreeds] = useState<string[]>([]);
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [loadingBreeds, setLoadingBreeds] = useState(false);
    const datePickerRef = useRef<any>(null);

    const calculateAge = (birthDate: string) => {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        if (
            today.getMonth() < birth.getMonth() ||
            (today.getMonth() === birth.getMonth() &&
                today.getDate() < birth.getDate())
        ) {
            age--;
        }
        return age;
    };

    // ✅ Load breeds only if authenticated and type changes
    useEffect(() => {
        if (!isAuthenticated) return;

        const loadBreeds = async () => {
            setLoadingBreeds(true);
            try {
                if (formData.type === "Câine") {
                    const breeds = await getDogBreeds();
                    setBreeds(breeds);
                } else if (formData.type === "Pisică") {
                    const breeds = await getCatBreeds();
                    setBreeds(breeds);
                } else {
                    setBreeds([]);
                }
            } catch (error) {
                console.error("Eroare la încărcarea raselor:", error);
            } finally {
                setLoadingBreeds(false);
            }
        };

        loadBreeds();
    }, [formData.type, isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) return;

        getVaccines()
            .then((vaccinesData) => setVaccines(vaccinesData))
            .catch((error) => {
                console.error("Failed to load vaccines:", error);
            });
    }, [isAuthenticated]);

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

    const handleVaccineCheck = (vaccineName: string, checked: boolean) => {
        setFormData((prev) => {
            const updatedDates = { ...prev.vaccineDates };
            if (!checked) {
                delete updatedDates[vaccineName];
            } else {
                updatedDates[vaccineName] = "";
            }
            return { ...prev, vaccineDates: updatedDates };
        });
    };

    const stringToDate = (str: string | null | undefined) =>
        str ? new Date(str) : null;
    const dateToString = (date: Date | null) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const handleVaccineDateChange = (vaccineName: string, date: string) => {
        setFormData((prev) => ({
            ...prev,
            vaccineDates: {
                ...prev.vaccineDates,
                [vaccineName]: date,
            },
        }));
    };

    const isStep1Valid = () => {
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
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            if (!isAuthenticated) return;

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
                        dateAdministered: date,
                    };
                });

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
                            <div className="bg-white shadow-lg rounded-xl p-6">
                                <div className="bg-white shadow-lg rounded-xl p-6 ">

                                    {step === 1 && (
                                        <>
                                            <div className={styles.headerContainer}>
                                                <div className={styles.headerTitle}>
                                                    <PawPrint
                                                        style={{
                                                            width: '48px',
                                                            height: '48px',
                                                            color: '#3640d1',
                                                            backgroundColor: '#ceddfa',
                                                            borderRadius: '50%',
                                                            padding: '10px',
                                                            marginRight: '12px',
                                                        }}
                                                    />
                                                    <h2 className="text-3xl font-bold text-gray-900">Informații despre animal</h2>
                                                </div>
                                            </div>

                                            <div className={styles.formGrid}>
                                                <div className={styles.inputGroup}>

                                                    <label htmlFor="animalName">
                                                        <PawPrint className={styles.icons} />
                                                        Nume animal<span className={styles.requiredIcon}> *</span>
                                                    </label>
                                                    <input
                                                        id="animalName"
                                                        name="animalName"
                                                        value={formData.animalName}
                                                        placeholder="Nume animal"
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                <div className={styles.inputGroup} style={{ position: 'relative' }}>
                                                    <label htmlFor="birthdate">
                                                        <Calendar className={styles.icons} />
                                                        Data nașterii
                                                        <span className={styles.requiredIcon}> *</span></label>
                                                    <DatePicker
                                                        id="birthdate"
                                                        ref={datePickerRef}
                                                        selected={stringToDate(formData.birthdate)}
                                                        onChange={(date: Date) => {
                                                            if (date) {
                                                                setFieldValue("birthdate", dateToString(date));
                                                            }
                                                        }}
                                                        onChangeRaw={(e) => {
                                                            if (!e) return;
                                                            const input = e.target as HTMLInputElement;
                                                            const rawValue = input.value;

                                                            const parsed = new Date(rawValue);
                                                            if (!isNaN(parsed.getTime())) {
                                                                setFieldValue("birthdate", dateToString(parsed));
                                                            }
                                                        }}
                                                        dateFormat="yyyy-MM-dd"
                                                        placeholderText="yyyy-MM-dd (ex: 2020-12-25)"
                                                        className="w-full border rounded-xl px-3 py-2 cursor-pointer pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                    />
                                                    <Calendar
                                                        onClick={() => datePickerRef.current.setOpen(true)}
                                                        size={20}
                                                        style={{ position: 'absolute', right: 10, top: '57%', cursor: 'pointer', color: '#666' }}
                                                    />
                                                </div>

                                                <div className={styles.inputGroup}>
                                                    <label htmlFor="sex">
                                                        <HeartIcon className={styles.icons} />Sex
                                                        <span className={styles.requiredIcon}> *</span></label>
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
                                                    <label htmlFor="weight">
                                                        <WeightIcon className={styles.icons} />Greutate (kg)
                                                        <span className={styles.requiredIcon}> *</span></label>
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
                                                    <label htmlFor="type">
                                                        <PawPrint className={styles.icons} />Tip animal
                                                        <span className={styles.requiredIcon}> *</span></label>
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
                                                    <label htmlFor="breed">
                                                        <PawPrint className={styles.icons} />Rasă
                                                        <span className={styles.requiredIcon}> *</span></label>
                                                    {loadingBreeds ? (
                                                        <div className="flex justify-center items-center h-[40px]">
                                                            {
                                                                //https://github.com/davidhu2000/react-spinners
                                                            }
                                                            <MoonLoader
                                                                color="#2563eb"
                                                                size={24}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <select
                                                            value={formData.breed}
                                                            onChange={(e) => handleSelectChange("breed", e.target.value)}
                                                            disabled={!formData.type}
                                                            className="w-full rounded-md border px-3 py-2 focus:outline-none"
                                                            style={{
                                                                backgroundColor: !formData.type ? '#e5e7eb' : '#fff',
                                                                color: !formData.type ? '#9ca3af' : '#111827',
                                                                cursor: !formData.type ? 'not-allowed' : 'pointer',
                                                            }}
                                                        >
                                                            <option value="">Selectează rasa</option>
                                                            {breeds.map((breed) => (
                                                                <option key={breed} value={breed}>
                                                                    {breed}
                                                                </option>
                                                            ))}
                                                        </select>

                                                    )}
                                                </div>


                                                <div className={styles.buttonWrapper}>
                                                    <button
                                                        onClick={() => setStep(2)}
                                                        disabled={!isStep1Valid()}
                                                        className={styles.continueButton}
                                                    >
                                                        Continuă către vaccinuri
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {step === 2 && (
                                        <div>
                                            <div className={styles.headerContainer}>
                                                <div className={styles.headerTitle}>
                                                    <SyringeIcon style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        color: '#3640d1',
                                                        backgroundColor: '#ceddfa',
                                                        borderRadius: '50%',
                                                        padding: '10px',
                                                    }} />
                                                    <h3>Vaccinuri efectuate</h3>
                                                </div>
                                                <p className={styles.headerSubtitle}>
                                                    Selectează vaccinurile efectuate și introdu datele administrării
                                                </p>
                                            </div>

                                            <div className={styles.vaccineGrid}>
                                                {vaccines.length > 0 ? (
                                                    vaccines
                                                        .filter(vaccine => vaccine.animalType === formData.type)
                                                        .map(vaccine => {
                                                            const isChecked = vaccine.name in formData.vaccineDates;

                                                            return (
                                                                <div
                                                                    key={vaccine.id}
                                                                    className={`${styles.vaccineCard} ${isChecked ? styles.checked : ''}`}
                                                                >
                                                                    <div className="flex items-start mb-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isChecked}
                                                                            onChange={e => handleVaccineCheck(vaccine.name, e.target.checked)}
                                                                            id={`vaccine-${vaccine.id}`}
                                                                            className="mt-1"
                                                                        />
                                                                        <label
                                                                            htmlFor={`vaccine-${vaccine.id}`}
                                                                            className="font-semibold cursor-pointer select-none"
                                                                        >
                                                                            {vaccine.name}
                                                                        </label>
                                                                    </div>

                                                                    {isChecked && (
                                                                        <input
                                                                            type="date"
                                                                            className={styles.dateInput}
                                                                            value={formData.vaccineDates[vaccine.name] || ""}
                                                                            onChange={e => handleVaccineDateChange(vaccine.name, e.target.value)}
                                                                        />
                                                                    )}

                                                                    <div className="flex justify-between mt-2">
                                                                        <div className={styles.infoRow}>
                                                                            <ClockIcon />
                                                                            <span>Vârsta minimă: {vaccine.ageWeeks} săptămâni</span>
                                                                        </div>
                                                                        <div className={styles.infoRow}>
                                                                            <CalendarIcon />
                                                                            <span>Rapel: {vaccine.rapel_days} zile</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                ) : (
                                                    <p className="col-span-full text-center text-gray-500">Nu sunt vaccinuri disponibile</p>
                                                )}
                                            </div>

                                            <div className={styles.buttonsContainer} >
                                                <button onClick={() => setStep(1)} className={styles.btnBack} >
                                                    Înapoi
                                                </button>

                                                <button onClick={handleSubmit} className={styles.btnSubmit}>
                                                    Trimite
                                                </button>
                                            </div>


                                        </div>
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

