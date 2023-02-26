export const isLoggedIn = () => {
  let key = localStorage.getItem('user_token')
  if (key) {
    return true
  }
  return false
}

export const getAuthKey = () => {
  return localStorage.getItem('user_token')
}
