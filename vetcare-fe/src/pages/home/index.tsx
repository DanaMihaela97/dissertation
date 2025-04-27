import LoginIIIIn from "@/components/login-btn";
import Navbar from "@/components/Navbar/Navbar";
import { getVaccines } from "@/services/animalService";

export default function Home() {

    return (
        <div >
        <Navbar /> 
        <div>Welcome</div>
        <LoginIIIIn />
        <button onClick={getVaccines}>butonas</button>
        </div>
    ) }