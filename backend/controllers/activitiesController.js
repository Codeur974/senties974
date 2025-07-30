const Activity = require("../models/activity");
const User = require("../models/user");

// Créer une nouvelle activité
const createActivity = async (req, res) => {
  try {
    const { title, gpsData, activityType, distance, duration, elevation } =
      req.body;
    const userId = req.user.id;

    const activity = new Activity({
      user: userId,
      title,
      gpsData,
      activityType: activityType || "course", // course, randonnee, velo, natation
      distance: distance || 0,
      duration: duration || 0,
      elevation: elevation || 0,
      date: new Date(),
    });

    await activity.save();

    res.status(201).json({
      message: "Activité créée avec succès",
      activity,
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'activité:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Obtenir toutes les activités d'un utilisateur
const getUserActivities = async (req, res) => {
  try {
    const userId = req.user.id;
    const activities = await Activity.find({ user: userId })
      .sort({ date: -1 })
      .populate("user", "name");

    res.json(activities);
  } catch (error) {
    console.error("Erreur lors de la récupération des activités:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Obtenir une activité spécifique
const getActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const activity = await Activity.findOne({ _id: id, user: userId }).populate(
      "user",
      "name"
    );

    if (!activity) {
      return res.status(404).json({ message: "Activité non trouvée" });
    }

    res.json(activity);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'activité:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer une activité
const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const activity = await Activity.findOneAndDelete({ _id: id, user: userId });

    if (!activity) {
      return res.status(404).json({ message: "Activité non trouvée" });
    }

    res.json({ message: "Activité supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'activité:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Obtenir les statistiques d'un utilisateur
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const activities = await Activity.find({ user: userId });

    const stats = {
      totalActivities: activities.length,
      totalDistance: activities.reduce(
        (sum, activity) => sum + (activity.distance || 0),
        0
      ),
      totalDuration: activities.reduce(
        (sum, activity) => sum + (activity.duration || 0),
        0
      ),
      totalElevation: activities.reduce(
        (sum, activity) => sum + (activity.elevation || 0),
        0
      ),
      activitiesByType: {},
    };

    // Compter les activités par type
    activities.forEach((activity) => {
      const type = activity.activityType || "inconnu";
      stats.activitiesByType[type] = (stats.activitiesByType[type] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    console.error("Erreur lors du calcul des statistiques:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  createActivity,
  getUserActivities,
  getActivity,
  deleteActivity,
  getUserStats,
};
