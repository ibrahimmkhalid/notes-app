export const isLoggedIn = () => {
  let key = localStorage.getItem('user_data')
  if (key) {
    return true
  }
  return false
}

export const getAuthKey = () => {
  let user_data = JSON.parse(localStorage.getItem('user_data'))
  return user_data.token
}

export const getUserName = () => {
  let user_data = JSON.parse(localStorage.getItem('user_data'))
  return user_data.username
}

export const getAdmin = () => {
  let user_data = JSON.parse(localStorage.getItem('user_data'))
  return user_data.admin
}
