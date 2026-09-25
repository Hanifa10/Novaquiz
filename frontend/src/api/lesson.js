import api from './axios'

function normalizeLesson(lesson) {
  if (!lesson) return lesson

  return {
    ...lesson,
    id: lesson.id,
    name: lesson.name,
    content: lesson.content,
  }
}

// Récupère tous les cours
export async function getLessonsByUser() {
  const { data } = await api.get('/lesson')
  return Array.isArray(data) ? data.map(normalizeLesson) : []
}

// Récupère un cours par son id
export async function getLessonById(id) {
  const { data } = await api.get(`/lesson/${id}`)
  return normalizeLesson(data)
}

// Récupère le quiz associé à un cours (1 seul par cours)
export async function getQuizByLesson(lessonId) {
  const { data } = await api.get(`/quiz/lesson/${lessonId}`)
  return data
}

// Crée un nouveau cours
export async function addLesson(payload) {
  console.log('[LESSON API] addLesson called with:', payload);
  try {
    const { data } = await api.post('/lesson', {
      name: payload.name,
      content: payload.content,
    })
    console.log('[LESSON API] addLesson response:', data);
    return normalizeLesson(data)
  } catch (err) {
    console.error('[LESSON API] addLesson error:', err);
    throw err;
  }
}

// Modifie un cours existant
export async function editLesson(id, payload) {
  const { data } = await api.patch(`/lesson/${id}`, {
    name: payload.name,
    content: payload.content,
  })
  return normalizeLesson(data)
}

// Supprime un cours
export async function deleteLesson(id) {
  await api.delete(`/lesson/${id}`)
}
