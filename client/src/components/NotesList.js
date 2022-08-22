import Note from './Note'
import Modal from './Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

const NotesList = ({ notes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className='notes-list'>
      {notes.map((note) => (
        <Note key={note.id} data={note} />
      ))}

      <div className='note note-add' onClick={() => setIsModalOpen(true)}>
        <div className='note-add-button'>
          <FontAwesomeIcon icon={faAdd} />
        </div>
      </div>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      </Modal>
    </div>
  )
}

export default NotesList
