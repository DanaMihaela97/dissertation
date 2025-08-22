import { PawPrint, Syringe, Stethoscope, Pill, Lightbulb } from "lucide-react";
import React from "react";

export type Tab = 'Profil' | 'Vaccinuri' | 'Diagnostic' | 'Tratament' | 'Recomandări';

export const TABS: Tab[] = ['Profil', 'Vaccinuri', 'Diagnostic', 'Tratament', 'Recomandări'];

export const TAB_DETAILS: Record<Tab, { title: string; subtitle: string; icon: React.ReactElement }> = {
   Profil: {
      title: 'Profilul Animalului',
      subtitle: 'Informații despre pacientul veterinar',
      icon: <PawPrint size={24}/>,
},
Vaccinuri: {
   title: 'Istoric Vaccinuri',
      subtitle: 'Programul de vaccinare și istoricul vaccinurilor',
      icon: <Syringe size={24}/>,
},
Diagnostic: {
   title: 'Diagnostic',
      subtitle: 'Istoricul diagnosticelor veterinare',
      icon: <Stethoscope size={24}/>,
},
Tratament: {
   title: 'Tratament',
      subtitle: 'Planurile de tratament recomandate',
      icon: <Pill size={24}/>,
},
Recomandări: {
   title: 'Recomandări',
      subtitle: 'Recomandări și sfaturi pentru îngrijire',
      icon: <Lightbulb size={24}/>,
},
};
