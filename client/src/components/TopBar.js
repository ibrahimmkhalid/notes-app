import { useState } from 'react'
import Modal from './Modal'
import UserPortal from './UserPortal'

function TopBar() {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)

  let userButton = (
      <button onClick={() => setIsUserModalOpen(true)}>Login/Signup</button>
    ) 
  if (true) {
    //user is logged in, change user button
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
