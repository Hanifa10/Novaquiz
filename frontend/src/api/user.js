import api from './axios'

function normalizeResult(result) {
  if (!result) return result

  const score = Number(result.score ?? result.results ?? 0)
  const total = Number(result.total ?? 0)
  const correctAnswers = Number(result.correctAnswers ?? score)
  const wrongAnswers = Number(result.wrongAnswers ?? Math.max(total - correctAnswers, 0))

  return {
    ...result,
    id: result.id,
    quizId: result.quizId ?? result.quiz_id,
    lessonId: result.lessonId ?? result.lesson_id ?? null,
    quizName: result.quizName ?? result.quiz?.name ?? 'Quiz',
    score,
    total,
    correctAnswers,
    wrongAnswers,
    datePassage: result.datePassage ?? result.createdAt,
  }
}

export async function getProgression() {
  const { data } = await api.get('/result')
  return { results: Array.isArray(data) ? data.map(normalizeResult) : [] }
}

export async function getResults() {
  const { data } = await api.get('/result')
  return Array.isArray(data) ? data.map(normalizeResult) : []
}

export async function saveResult(userId, quizId, answers) {
  const { data } = await api.post('/result', {
    quizId,
    results: answers
  })
  return data
}
