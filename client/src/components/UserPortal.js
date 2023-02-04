import { useState } from "react"
import { endpointUrl } from '../helpers/urlHelpers'

const UserPortal = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: ''
  })

  const handleChange = (event) => {
    setUserData({...userData, [event.target.name]: event.target.value})
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }
    fetch(endpointUrl("login"), requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data))
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          id='username-input'
          className='login-input-field'
          placeholder='username'
          name='username'
          value={userData.username}
          onChange={handleChange}
        ></input>
        <input
          id='password-input'
          type='password'
          className='login-input-field'
          placeholder='password'
          name='password'
          value={userData.password}
          onChange={handleChange}
        ></input>
        <button>login</button>
      </form>
    </div>
  )
}

export default UserPortal
