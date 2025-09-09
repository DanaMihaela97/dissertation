import type { AnimalProfile } from "./animalProfile";
import {ChatSession} from "@/components/entities/chatSession";


export interface Consultation {
  id: number;
  createdAt: string;
  diagnosis: string;
  treatment: string;
  advice: string;

  validated?: boolean;
  validatedBy?: string;
  adminComment?: string;
  userEmail?: string;

  animal: AnimalProfile;
  chatSession: ChatSession;
}
