# 📋 FICHE TECHNIQUE - SENTIES974

## Application Sportive La Réunion (Type Strava/Komoot)

---

## 🎯 **VISION DU PROJET**

Application sportive complète dédiée à l'île de La Réunion, combinant les fonctionnalités de Strava, Komoot et Garmin avec des spécificités locales.

### **Stratégie de développement :**

1. **Phase 1** : Application Web Next.js (PWA) pour tests utilisateurs
2. **Phase 2** : Applications natives (iOS/Android) après validation

---

## 🏝️ **FONCTIONNALITÉS 100% LOCALES LA RÉUNION**

### **1. SENTIERS ET PARCOURS LOCAUX**

- **Base de données** des sentiers officiels de La Réunion
- **Sentiers de randonnée** : GR R1, GR R2, sentiers du Piton de la Fournaise
- **Parcours VTT** : circuits du Maïdo, Cilaos, Salazie
- **Trails** : Grand Raid, Diagonale des Fous, Mascarin
- **Parcours urbains** : Saint-Denis, Saint-Paul, Saint-Pierre
- **Sentiers côtiers** : littoral, plages, spots de surf

### **2. MÉTÉO ET CONDITIONS LOCALES**

- **Météo Réunion** : données Météo France locales
- **Alertes cycloniques** et météo marine
- **Conditions de pratique** par zone (vent, pluie, température)
- **Horaires soleil** et marées
- **Qualité de l'air** (brumes de sable, pollution)

### **3. ÉVÉNEMENTS SPORTIFS LOCAUX**

- **Calendrier événements** : Grand Raid, Trail de Bourbon, etc.
- **Inscriptions** aux événements locaux
- **Communauté** par événement
- **Historique** des participations
- **Badges** événements spécifiques

### **4. SEGMENTS ET RECORDS LOCAUX**

- **Segments officiels** : ascensions du Maïdo, Piton des Neiges
- **Records par zone** : Nord, Sud, Est, Ouest, Centre
- **Classements locaux** par commune
- **Challenges** spécifiques à La Réunion
- **Badges** : "Grimpeur du Maïdo", "Traileur de Cilaos"

### **5. COMMUNAUTÉ ET SOCIAL LOCAL**

- **Groupes par zone** : Saint-Denis, Saint-Paul, etc.
- **Clubs sportifs** locaux intégrés
- **Événements communautaires** organisés
- **Partage** d'expériences locales
- **Conseils** entre pratiquants locaux

### **6. DONNÉES TERRAIN SPÉCIFIQUES**

- **Topographie** précise de La Réunion
- **Types de sols** : basalte, sable, terre
- **Dénivelés** réels par sentier
- **Difficultés** adaptées au terrain local
- **Points d'eau** et refuges

### **7. SÉCURITÉ ET ALERTES LOCALES**

- **Alertes** : éboulements, fermetures sentiers
- **Points d'urgence** : gendarmerie, pompiers locaux
- **Couvrage réseau** par zone
- **Conseils sécurité** spécifiques au terrain
- **Contacts** d'urgence locaux

### **8. CULTURE ET HISTOIRE LOCALE**

- **Points d'intérêt** : sites historiques, culturels
- **Flore et faune** : espèces endémiques
- **Gastronomie** : restaurants, produits locaux
- **Hébergement** : gîtes, refuges, hôtels
- **Transports** : bus, navettes, covoiturage

### **9. FONCTIONNALITÉS SPÉCIALISÉES**

- **Langues** : Français + Créole réunionnais
- **Devise locale** : Euro
- **Fuseau horaire** : UTC+4
- **Réglementation** locale (parcs nationaux, réserves)
- **Permis** et autorisations nécessaires

### **10. INTÉGRATION SERVICES LOCAUX**

- **Partenariats** : clubs sportifs, magasins
- **Promotions** locales et événements
- **Services** : réparation vélo, location matériel
- **Assurances** sportives locales
- **Médecins** et kinésithérapeutes sportifs

---

## 📱 **FONCTIONNALITÉS PRINCIPALES**

### **1. TRACKING GPS TEMPS RÉEL**

- **GPS haute précision** pour activités sportives
- **Tracking continu** en arrière-plan
- **Optimisation batterie** intelligente
- **Fonctionnement offline** avec synchronisation
- **Données GPS** : lat/lng, altitude, vitesse, timestamp

### **2. DONNÉES BIOMÉTRIQUES**

- **Fréquence cardiaque** (Web Bluetooth API)
- **Cadence** (pas pour course, pédalage pour vélo)
- **Vitesse** en temps réel
- **Accéléromètre** et gyroscope
- **Capteurs ANT+** via Web Bluetooth

### **3. SYNCHRONISATION DE GROUPE**

- **Sessions de groupe** en temps réel
- **Distance entre utilisateurs** calculée
- **Gestion des écarts** (temps et distance)
- **Notifications** d'écart en temps réel
- **WebSocket** pour communication instantanée

### **4. PLANIFICATION INTELLIGENTE (Komoot-like)**

- **Données terrain complètes** La Réunion
- **D+ (dénivelé positif)** calculé automatiquement
- **Météo intégrée** avec prévisions locales
- **Estimation temps** basée sur profil utilisateur
- **Vitesse delta** selon conditions et terrain
- **Itinéraires optimisés** selon préférences

### **5. FONCTIONNALITÉS SOCIALES**

- **Segments** avec records personnels
- **Portions de parcours** avec classements
- **Système de badges** spécifiques La Réunion
- **Challenges** locaux
- **Feed social** avec partage d'activités
- **Classements** par zone géographique

### **6. CARTES ET VISUALISATION**

- **Cartes interactives** avec relief
- **Visualisation 3D** des parcours
- **Cartes topographiques** La Réunion
- **Segments visuels** sur carte
- **Mode offline** pour cartes

---

## 🏗️ **ARCHITECTURE TECHNIQUE**

### **FRONTEND (Next.js PWA)**

```
Technologies :
- Next.js 15.4.4
- TypeScript
- Tailwind CSS
- PWA (Progressive Web App)
- Service Workers
- IndexedDB (stockage local)
- WebSocket (temps réel)
- Geolocation API
- Web Bluetooth API
- Device Motion API
- Notification API
- Web Workers (calculs lourds)
```

### **BACKEND (Node.js)**

```
Technologies :
- Express.js
- MongoDB (Mongoose)
- Socket.io (temps réel)
- JWT (authentification)
- bcryptjs (hashage)
- CORS
- dotenv
```

### **MODÈLES DE DONNÉES**

#### **User Model**

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  profile: {
    weight: Number,
    height: Number,
    fitnessLevel: String,
    preferences: Object,
    localZone: String, // Zone La Réunion
    localClub: String, // Club local
    localEvents: [String] // Événements locaux
  },
  stats: {
    totalDistance: Number,
    totalActivities: Number,
    totalElevation: Number,
    localSegments: [String], // Segments locaux complétés
    localBadges: [String] // Badges locaux obtenus
  },
  friends: [ObjectId],
  localCommunity: {
    zone: String, // Nord, Sud, Est, Ouest, Centre
    commune: String,
    clubs: [String]
  },
  createdAt: Date
}
```

#### **Activity Model**

```javascript
{
  user: ObjectId (ref: User),
  title: String,
  activityType: String (enum),
  gpsData: [{
    lat: Number,
    lng: Number,
    timestamp: Number,
    elevation: Number,
    speed: Number
  }],
  distance: Number,
  duration: Number,
  elevation: {
    gain: Number,
    loss: Number,
    max: Number,
    min: Number
  },
  location: {
    region: String, // Zone La Réunion
    commune: String, // Commune spécifique
    trail: String, // Sentier local
    difficulty: String,
    localLandmarks: [String] // Points d'intérêt locaux
  },
  weather: {
    temperature: Number,
    humidity: Number,
    conditions: String,
    localAlerts: [String] // Alertes locales
  },
  biometrics: {
    heartRate: [Number],
    cadence: [Number],
    calories: Number
  },
  localData: {
    localSegment: String, // Segment local traversé
    localEvent: String, // Événement local lié
    localBadge: String, // Badge local obtenu
    localCommunity: String // Communauté locale
  },
  notes: String,
  photos: [{
    url: String,
    caption: String
  }],
  isPublic: Boolean,
  date: Date
}
```

#### **Local Trail Model**

```javascript
{
  name: String,
  description: String,
  type: String, // "hiking", "trail", "cycling", "surfing"
  region: String, // Zone La Réunion
  commune: String,
  difficulty: String,
  coordinates: [{
    lat: Number,
    lng: Number,
    elevation: Number
  }],
  localData: {
    officialTrail: Boolean, // Sentier officiel
    localAuthority: String, // Autorité locale
    permits: [String], // Permis nécessaires
    restrictions: [String], // Restrictions locales
    localHistory: String, // Histoire locale
    localFlora: [String], // Flore locale
    localFauna: [String] // Faune locale
  },
  facilities: {
    waterPoints: [{
      lat: Number,
      lng: Number,
      description: String
    }],
    shelters: [{
      lat: Number,
      lng: Number,
      description: String
    }],
    emergencyContacts: [{
      name: String,
      phone: String,
      type: String
    }]
  },
  weather: {
    bestSeason: String,
    weatherConditions: [String],
    localAlerts: [String]
  },
  localEvents: [{
    eventName: String,
    eventDate: Date,
    eventType: String
  }],
  localCommunity: {
    clubs: [String],
    guides: [String],
    localGroups: [String]
  }
}
```

#### **Local Event Model**

```javascript
{
  name: String,
  description: String,
  type: String, // "trail", "cycling", "surfing", "hiking"
  region: String,
  commune: String,
  date: {
    start: Date,
    end: Date,
    registrationDeadline: Date
  },
  localData: {
    organizer: String,
    localAuthority: String,
    permits: [String],
    localSponsors: [String],
    localPartners: [String]
  },
  route: {
    distance: Number,
    elevation: Number,
    difficulty: String,
    waypoints: [{
      lat: Number,
      lng: Number,
      name: String,
      description: String
    }]
  },
  participants: [{
    user: ObjectId (ref: User),
    registrationDate: Date,
    category: String,
    localZone: String
  }],
  localBadges: [{
    name: String,
    description: String,
    criteria: String
  }],
  localCommunity: {
    maxParticipants: Number,
    currentParticipants: Number,
    localGroups: [String],
    localClubs: [String]
  },
  status: String // "upcoming", "active", "finished"
}
```

#### **Group Session Model**

```javascript
{
  name: String,
  creator: ObjectId (ref: User),
  participants: [{
    user: ObjectId (ref: User),
    position: {
      lat: Number,
      lng: Number,
      timestamp: Number
    },
    status: String // "active", "left", "lagging"
  }],
  route: {
    waypoints: [{
      lat: Number,
      lng: Number,
      name: String
    }],
    estimatedDuration: Number,
    difficulty: String
  },
  status: String, // "waiting", "active", "finished"
  startTime: Date,
  endTime: Date
}
```

#### **Segment Model**

```javascript
{
  name: String,
  description: String,
  coordinates: [{
    lat: Number,
    lng: Number
  }],
  region: String,
  difficulty: String,
  elevation: {
    gain: Number,
    loss: Number
  },
  distance: Number,
  records: [{
    user: ObjectId (ref: User),
    time: Number,
    date: Date
  }],
  activityType: String
}
```

---

## 🔧 **FONCTIONNALITÉS AVANCÉES**

### **PWA (Progressive Web App)**

- **Installation** comme app native
- **Icônes** et splash screen
- **Fonctionnement offline** complet
- **Notifications push**
- **Background sync**

### **Performance et Optimisation**

- **Web Workers** pour calculs lourds
- **Service Workers** pour cache
- **IndexedDB** pour stockage local
- **Optimisation batterie** GPS
- **Compression** données

### **Sécurité**

- **HTTPS** obligatoire (capteurs)
- **JWT** pour authentification
- **Validation** données côté serveur
- **Permissions** utilisateur explicites

---

## 📊 **APIS EXTERNES NÉCESSAIRES**

### **Cartes et Géolocalisation**

- **OpenStreetMap** (gratuit)
- **Google Maps** (payant)
- **Cartes topographiques** La Réunion

### **Météo**

- **OpenWeatherMap API**
- **Météo France API**
- **Données locales** La Réunion

### **Notifications**

- **Firebase Cloud Messaging** (FCM)
- **Service Workers** push notifications

---

## 🎯 **ROADMAP DE DÉVELOPPEMENT**

### **Phase 1 : MVP (2-3 mois)**

- [ ] Authentification utilisateur
- [ ] Tracking GPS basique
- [ ] Interface utilisateur
- [ ] Sauvegarde activités
- [ ] PWA installable

### **Phase 2 : Fonctionnalités avancées (3-4 mois)**

- [ ] Synchronisation groupe
- [ ] Données biométriques
- [ ] Cartes interactives
- [ ] Planification itinéraires
- [ ] Météo intégrée

### **Phase 3 : Social et gamification (2-3 mois)**

- [ ] Segments et records
- [ ] Feed social
- [ ] Badges et challenges
- [ ] Classements
- [ ] Partage d'activités

### **Phase 4 : Optimisations (1-2 mois)**

- [ ] Performance
- [ ] Offline complet
- [ ] Notifications avancées
- [ ] Tests utilisateurs

---

## 🚀 **DÉPLOIEMENT**

### **Environnements**

- **Développement** : local
- **Staging** : Vercel/Netlify
- **Production** : Vercel + MongoDB Atlas

### **Monitoring**

- **Analytics** utilisateurs
- **Performance** monitoring
- **Error tracking**
- **Uptime** monitoring

---

## 📝 **NOTES IMPORTANTES**

### **Contraintes techniques**

- **HTTPS obligatoire** pour capteurs
- **Permissions** utilisateur nécessaires
- **Compatibilité** navigateur variable
- **Optimisation** batterie critique

### **Spécificités La Réunion**

- **Données terrain** locales
- **Météo** spécifique
- **Communauté** locale
- **Événements** sportifs île

---

## 📞 **CONTACT ET SUPPORT**

**Développeur** : Assistant IA
**Projet** : SENTIES974
**Type** : Application sportive La Réunion
**Version** : MVP en développement

---

_Document créé le : [Date actuelle]_
_Dernière mise à jour : [Date actuelle]_
