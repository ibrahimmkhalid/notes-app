import Note from './Note'
import Modal from './Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

const NotesList = ({ notes }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='notes-list'>
      {notes.map((note) => (
        <Note key={note.id} data={note} />
      ))}

      <div className='note note-add' onClick={() => setIsOpen(true)}>
        <div className='note-add-button'>
          <FontAwesomeIcon icon={faAdd} />
        </div>
      </div>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      </Modal>
    </div>
  )
}

export default NotesList
