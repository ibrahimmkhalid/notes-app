import { useState } from 'react'
import Modal from './components/Modal'
import UserPortal from './components/UserPortal'
import { getAdmin, getUserName, isLoggedIn } from './helpers/authHelpers'

function TopBar() {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)

  let userButton
  if (isLoggedIn()) {
    userButton = (
      <button
        onClick={() => {
          localStorage.removeItem('user_data')
          window.location.reload()
        }}
      >
        {getUserName() + (getAdmin() ? ' (admin)' : '')}
      </button>
    )
  } else {
    userButton = (
      <button onClick={() => setIsUserModalOpen(true)}>Login/Signup</button>
    )
  }

  return (
    <div className='top-bar'>
      <span>
        <h1>Notes App by @ibrahimmkhalid</h1>
      </span>
      <span>{userButton}</span>
      <Modal open={isUserModalOpen} onClose={() => setIsUserModalOpen(false)}>
        <UserPortal></UserPortal>
      </Modal>
    </div>
  )
}

export default TopBar
