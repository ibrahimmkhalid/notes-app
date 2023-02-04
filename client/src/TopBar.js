import { useState } from 'react'
import Modal from './components/Modal'
import UserPortal from './components/UserPortal'

function TopBar() {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)

  return (
    <div className='top-bar'>
      <span>
        <h1>Notes App by @ibrahimmkhalid</h1>
      </span>
      <span>
        <button onClick={() => setIsUserModalOpen(true)}>Login/Signup</button>
      </span>
      <Modal open={isUserModalOpen} onClose={() => setIsUserModalOpen(false)}>
        <UserPortal></UserPortal>
      </Modal>
    </div>
  )
}

export default TopBar
