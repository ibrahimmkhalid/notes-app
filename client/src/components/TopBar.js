import { useContext, useState } from 'react'
import UserStore from '../stores/userStore'
import Modal from './Modal'
import UserPortal from './UserPortal'

function TopBar() {
  const userStore = useContext(UserStore)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)

  let userButton = (
      <button onClick={() => setIsUserModalOpen(true)}>Login/Signup</button>
    ) 
  if (userStore.isLoggedIn()) {
    //user is logged in, change user button
    userButton = (
      <button onClick={() => userStore.logout()}>{userStore.username}</button>
    )
  }

  return (
    <div className='top-bar'>
      <span>
        <h1>Notes App by @ibrahimmkhalid</h1>
      </span>
      <span>{userButton}</span>
      <Modal open={isUserModalOpen} onClose={() => setIsUserModalOpen(false)}>
        <UserPortal props={{setIsUserModalOpen: setIsUserModalOpen}}></UserPortal>
      </Modal>
    </div>
  )
}

export default TopBar
