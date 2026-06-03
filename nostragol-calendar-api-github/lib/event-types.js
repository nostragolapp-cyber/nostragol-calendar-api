const EVENT_TYPES = [
  {
    id: "prediction-open",
    label: "Apertura de pronosticos",
    title: "Abrir pronosticos Nostragol",
    durationMinutes: 20,
    reminderMinutes: [1440, 120, 30],
    description: "Habilitar pronosticos, revisar partidos activos y confirmar que las ligas puedan participar.",
  },
  {
    id: "prediction-close",
    label: "Cierre de pronosticos",
    title: "Cierre pronosticos Nostragol",
    durationMinutes: 30,
    reminderMinutes: [1440, 60, 10],
    description: "Cerrar pronosticos antes del inicio del partido y revisar que no queden picks pendientes.",
  },
  {
    id: "match-preview",
    label: "Publicacion previa",
    title: "Publicar previa Nostragol",
    durationMinutes: 30,
    reminderMinutes: [1440, 180, 30],
    description: "Publicar previa del partido, llamado a pronosticar y recordatorio para ligas privadas.",
  },
  {
    id: "match-kickoff",
    label: "Inicio de partido",
    title: "Inicio partido Nostragol",
    durationMinutes: 120,
    reminderMinutes: [60, 15],
    description: "Monitorear inicio del partido, estado de pronosticos y actividad de usuarios.",
  },
  {
    id: "live-coverage",
    label: "Cobertura live",
    title: "Cobertura live Nostragol",
    durationMinutes: 90,
    reminderMinutes: [30, 10],
    description: "Acompanhar partido, publicar hitos relevantes y preparar cierre de puntajes.",
  },
  {
    id: "results-ranking",
    label: "Resultados y ranking",
    title: "Actualizar resultados y ranking Nostragol",
    durationMinutes: 45,
    reminderMinutes: [60, 15],
    description: "Cargar resultado final, validar puntajes, actualizar rankings y revisar ganadores.",
  },
  {
    id: "social-post",
    label: "Post redes sociales",
    title: "Publicar contenido Nostragol",
    durationMinutes: 30,
    reminderMinutes: [1440, 120, 30],
    description: "Publicar contenido programado en redes sociales y revisar interacciones.",
  },
  {
    id: "trivia-challenge",
    label: "Trivia o desafio",
    title: "Activar trivia Nostragol",
    durationMinutes: 30,
    reminderMinutes: [1440, 60, 15],
    description: "Activar trivia, reto o dinamica de comunidad asociada a partidos y rankings.",
  },
  {
    id: "sponsor-activation",
    label: "Activacion sponsor",
    title: "Activacion sponsor Nostragol",
    durationMinutes: 45,
    reminderMinutes: [2880, 1440, 120],
    description: "Coordinar pieza, premio no monetario, publicaciones y medicion de activacion de marca.",
  },
  {
    id: "internal-task",
    label: "Tarea interna",
    title: "Tarea operativa Nostragol",
    durationMinutes: 30,
    reminderMinutes: [1440, 60],
    description: "Tarea interna del equipo Nostragol.",
  },
];

function getEventTypes() {
  return EVENT_TYPES;
}

function getEventTypeById(id) {
  return EVENT_TYPES.find((eventType) => eventType.id === id) || null;
}

module.exports = {
  getEventTypeById,
  getEventTypes,
};
