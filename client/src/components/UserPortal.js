import { faSignIn } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { observer } from "mobx-react"
import { useContext } from "react"
import { useState } from "react"
import { endpointUrl } from '../helpers/urlHelpers'
import UserStore from "../stores/userStore"

const UserPortal = ({ props }) => {
  const userStore = useContext(UserStore)
  const [userData, setUserData] = useState({
    username: '',
    password: ''
  })

  const handleChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value })
  }

  const doLogin = (data) => {
    userStore.loadUser(data)
    props.setIsUserModalOpen(false)
    setUserData({
      username: "",
      password: "",
    });
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
          doLogin(data.data)
        } else {
          if (data.error.hasOwnProperty("authentication")) {
            if (data.error.authentication.includes("Password does not match!")) {
              alert("Wrong password, try again")
            } else if (data.error.authentication.includes("User does not exist!")) {
              // Login failed, try to register the user instead
              fetch(endpointUrl("register"), requestOptions)
                .then((response) => response.json())
                .then((data) => {
                  if (data.status === "success") {
                    doLogin(data.data)
                  } else {
                    alert("Something went wrong")
                  }
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
            } else {
              alert("Something went wrong")
            }
          } else {
            alert("Something went wrong")
          }
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <div className="user-portal-div">
      <form onSubmit={handleSubmit} className="user-portal-form">
        <input
          id='username-input'
          className='login-input-field'
          placeholder='username'
          name='username'
          value={userData.username}
          onChange={handleChange}
        ></input>
        <br></br>
        <input
          id='password-input'
          type='password'
          className='login-input-field'
          placeholder='password'
          name='password'
          value={userData.password}
          onChange={handleChange}
        ></input>
        <br></br>
        <button className="login-button">
          <FontAwesomeIcon icon={faSignIn} />
        </button>
      </form>
    </div>
  )
}

export default observer(UserPortal)
