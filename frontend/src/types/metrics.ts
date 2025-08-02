// Métriques de base communes à toutes les activités
export interface BaseMetrics {
  distance: number; // en mètres
  time: number; // en secondes
  averageSpeed: number; // km/h
  maxSpeed: number; // km/h
  calories: number; // calories brûlées
  elevation: number; // dénivelé en mètres
  activeTime: number; // temps actif en secondes
  pauseTime: number; // temps de pause en secondes
}

// Métriques spécifiques à la course
export interface RunningMetrics extends BaseMetrics {
  cadence: number; // pas par minute
  heartRate: number; // bpm
  currentPace: number; // min/km
  heartRateZone: string;
  splits: Array<{ km: number; time: number }>;
}

// Métriques spécifiques au vélo
export interface CyclingMetrics extends BaseMetrics {
  cadence: number; // tours par minute
  power: number; // watts
  maxPower: number; // watts max
  averagePower: number; // watts moyen
  gradient: number; // pente en %
  gearRatio: string; // rapport de vitesse
}

// Métriques spécifiques à la natation
export interface SwimmingMetrics extends BaseMetrics {
  laps: number; // nombre de longueurs
  lapTime: number; // temps par longueur
  stroke: string; // style de nage
  strokeRate: number; // coups par minute
  restTime: number; // temps de repos
  poolLength: number; // longueur du bassin
}

// Métriques spécifiques à la marche/randonnée
export interface WalkingMetrics extends BaseMetrics {
  stepsPerMinute: number; // pas par minute
  currentAltitude: number; // altitude actuelle
  totalAscent: number; // dénivelé positif
  totalDescent: number; // dénivelé négatif
  weather: {
    temperature: number;
    conditions: string;
  };
}

// Métriques communes supplémentaires
export interface CommonMetrics {
  mood: number; // 1-5
  notes: string;
  photos: Array<{
    url: string;
    timestamp: number;
    location: { lat: number; lng: number };
  }>;
  weather: {
    temperature: number;
    humidity: number;
    conditions: string;
  };
}
