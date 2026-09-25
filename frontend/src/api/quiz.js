import api from './axios'

function normalizeQuiz(quiz) {
  if (!quiz) return quiz

  const lessonName = quiz.lesson?.name ?? quiz.lessonAssocie ?? ''

  return {
    ...quiz,
    id: quiz.id,
    titre: quiz.name,
    lessonAssocie: quiz.lessonAssocie ?? lessonName,
    lessonId: quiz.lessonId,
    nbQuestions: quiz.nbQuestions,
  }
}

function normalizeQuestion(question = {}) {
  const answers = [
    { id: 'A', text: question.answer_a ?? '', isCorrect: String(question.correct_answer ?? '').toUpperCase() === 'A' },
    { id: 'B', text: question.answer_b ?? '', isCorrect: String(question.correct_answer ?? '').toUpperCase() === 'B' },
    { id: 'C', text: question.answer_c ?? '', isCorrect: String(question.correct_answer ?? '').toUpperCase() === 'C' },
    { id: 'D', text: question.answer_d ?? '', isCorrect: String(question.correct_answer ?? '').toUpperCase() === 'D' },
  ].filter(answer => answer.text !== null && answer.text !== undefined && answer.text !== '')

  return {
    id: question.id,
    question: question.question,
    text: question.question,
    answers,
    reponses: answers,
    correct_answer: question.correct_answer,
  }
}

function normalizeQuestionPayload(payload = {}) {
  const answers = Array.isArray(payload.answers) ? payload.answers : []
  const normalized = {
    question: payload.question ?? payload.text ?? '',
    answer_a: payload.answer_a ?? answers[0]?.text ?? '',
    answer_b: payload.answer_b ?? answers[1]?.text ?? '',
    answer_c: payload.answer_c ?? answers[2]?.text ?? '',
    answer_d: payload.answer_d ?? answers[3]?.text ?? '',
    correct_answer: payload.correct_answer ?? payload.correctAnswer ?? '',
  }

  if (!normalized.correct_answer) {
    const indexRight = answers.findIndex(r => r?.isCorrect === true)
    if (indexRight >= 0) {
      normalized.correct_answer = ['A', 'B', 'C', 'D'][indexRight] ?? ''
    }
  }

  if (normalized.correct_answer && typeof normalized.correct_answer === 'string') {
    normalized.correct_answer = normalized.correct_answer.toUpperCase()
  }

  return normalized
}

function getRightAnswer(payload) {
  const answers = payload?.answers ?? []
  const indexRight = answers.findIndex(r => r?.isCorrect === true)
  if (indexRight >= 0) {
    return ['A', 'B', 'C', 'D'][indexRight] ?? undefined
  }

  const fallback = payload?.correctAnswer ?? payload?.correct_answer
  return fallback ? String(fallback).toUpperCase() : undefined
}

// ── Quiz ────────────────────────────────────────────────────────────────────

export async function getQuizzesByUser() {
  const { data } = await api.get('/quiz')
  return Array.isArray(data) ? data.map(normalizeQuiz) : []
}

export async function getQuizById(id) {
  const { data } = await api.get(`/quiz/${id}`)
  return normalizeQuiz(data)
}

export async function addQuiz(payload) {
  const { data } = await api.post('/quiz', {
    name: payload.name,
    lessonId: payload.lessonId,
  })
  return normalizeQuiz(data)
}

export async function editQuiz(id, payload) {
  const { data } = await api.patch(`/quiz/${id}`, {
    name: payload.name,
    lessonId: payload.lessonId,
  })
  return normalizeQuiz(data)
}

export async function deleteQuiz(id) {
  await api.delete(`/quiz/${id}`)
}

// ── Questions ────────────────────────────────────────────────────────────────

export async function getQuestions(quizId) {
  const { data } = await api.get(`/quiz/${quizId}/questions`)

  return (Array.isArray(data) ? data : []).map(normalizeQuestion)
}

export async function addQuestion(quizId, payload) {
  const normalized = normalizeQuestionPayload(payload)
  const { data } = await api.post(`/quiz/${quizId}/questions`, {
    quiz_id: quizId,
    question: normalized.question,
    answer_a: normalized.answer_a,
    answer_b: normalized.answer_b,
    answer_c: normalized.answer_c,
    answer_d: normalized.answer_d,
    correct_answer: normalized.correct_answer,
  })
  return normalizeQuestion(data)
}

export async function editQuestion(quizId, questionId, payload) {
  const normalized = normalizeQuestionPayload(payload)
  const { data } = await api.patch(`/question/${questionId}`, {
    question: normalized.question,
    answer_a: normalized.answer_a,
    answer_b: normalized.answer_b,
    answer_c: normalized.answer_c,
    answer_d: normalized.answer_d,
    correct_answer: normalized.correct_answer,
  })
  return normalizeQuestion(data)
}

export async function deleteQuestion(quizId, questionId) {
  await api.delete(`/question/${questionId}`)
}

// ── Répondre à une question (pendant un quiz) ────────────────────────────────
export async function answeringQuestion(quizId, questionId, answerId) {
  const { data } = await api.post(`/quiz/${quizId}/answer`, {
    questionId,
    answerId: answerId,
  })
  return data
}
