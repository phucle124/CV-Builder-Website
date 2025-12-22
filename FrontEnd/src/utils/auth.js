export const isAuthenticated = () => {
  return localStorage.getItem('isLoggedIn') === 'true' && !!localStorage.getItem('userEmail')
}

export const ensureAuth = () => {
  const ok = isAuthenticated()
  if (!ok) {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
  }
  return ok
}
