import { observer } from "mobx-react"
import { useContext } from "react"
import { useState } from "react"
import { endpointUrl } from '../helpers/urlHelpers'
import UserStore from "../stores/userStore"

const UserPortal = ({ props }) => {
  const userStore = useContext(UserStore)
  const [userData, setUserData] = useState({
    username: 'ibrahim',
    password: 'ibrahim'
  })

  const handleChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value })
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
      .then((data) => {
        if (data.status === "success") {
          // Login successful, do something here like redirect to the user's dashboard
          console.log(data)
          userStore.loadUser(data.data)
          props.setIsUserModalOpen(false)
          setUserData({
            username: "",
            password: "",
          });

        } else {
          // Login failed, try to register the user instead
          const registerOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          }
          fetch(endpointUrl("register"), registerOptions)
            .then((response) => response.json())
            .then((data) => {
              if (data.status === "success") {
                // Registration successful, do something here like redirect to the user's dashboard
              } else {
                // Registration failed, show error message to the user
                alert("Registration failed: " + data.error.message);
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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

export default observer(UserPortal)
