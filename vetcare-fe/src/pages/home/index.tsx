import Login from "@/components/login-btn";
import Navbar from "@/components/Navbar";
import { getVaccines } from "@/services/animalService";

export default function Home() {

    return (
        <div >
        <Navbar /> 
        <div>Welcome</div>
        <Login />
        <button onClick={getVaccines}>butonas</button>
        </div>
    ) }