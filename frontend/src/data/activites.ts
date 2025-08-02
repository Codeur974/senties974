interface Activite {
  id: string;
  nom: string;
  icon: string;
  disponible: boolean;
}

export const activites: Activite[] = [
  {
    id: "marche",
    nom: "Marche",
    icon: "🚶‍♂️",
    disponible: true,
  },
  {
    id: "course",
    nom: "Course",
    icon: "🏃‍♂️",
    disponible: false,
  },
  {
    id: "velo",
    nom: "Vélo",
    icon: "🚴‍♂️",
    disponible: false,
  },
  {
    id: "randonnee",
    nom: "Randonnée",
    icon: "️",
    disponible: false,
  },
  {
    id: "natation",
    nom: "Natation",
    icon: "🏊‍♂️",
    disponible: false,
  },
];
export const getActiviteById = (id: string): Activite | undefined => {
  return activites.find((activite) => activite.id === id);
};
export const getActivitesDisponibles = (): Activite[] => {
  return activites.filter((activite) => activite.disponible);
};
