import { observer } from 'mobx-react'
import { useContext, useState } from 'react'
import UserStore from '../stores/userStore'
import Modal from './Modal'
import UserPortal from './UserPortal'

function TopBar() {
  const userStore = useContext(UserStore)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [reloadToggle, setReloadToggle] = useState(false)

  const handleLogout = () => {
    userStore.logout()
    setReloadToggle(!reloadToggle)
  }

  return (
    <div className='top-bar'>
      <span>
        <h1>Notes App by @ibrahimmkhalid</h1>
      </span>
      <span>{
        userStore.isLoggedIn ? (
          <button className='logout' onClick={() => handleLogout()}>{userStore.username}</button>
        ) : (
          <button onClick={() => setIsUserModalOpen(true)}>Login/Signup</button>
        )
      }</span>
      <Modal open={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} width="200px">
        <UserPortal props={{ setIsUserModalOpen: setIsUserModalOpen }}></UserPortal>
      </Modal>
    </div>
  )
}

export default observer(TopBar)
