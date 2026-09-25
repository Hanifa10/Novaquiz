import api from './axios'

export function normalizeUser(user) {
  if (!user) return null

  return {
    ...user,
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  }
}

export async function login(email, password) {
  const { data } = await api.post('/auth/login', {
    email,
    password: password,
  })
  return { token: data.jwt, user: normalizeUser(data.user) }
}

export async function register(lastName, firstName, email, password) {
  const { data } = await api.post('/auth/register', {
    lastName: lastName,
    firstName: firstName,
    email,
    password: password,
  })
  return { token: data.jwt, user: normalizeUser(data.user) }
}
