import Note from './Note'
import NewNote from './NewNote'
import Modal from './Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { endpointUrl } from '../helpers/urlHelpers'

const NotesList = () => {
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false)

  const [notes, setNotes] = useState([])

  useEffect(() => {
    fetch(endpointUrl('notes/all')).then((response) => {
      response.json().then((data) => {
        setNotes(data.data.notes)
      })
    })
  }, [])

  return (
    <div className='notes-list'>
      {notes.map((note) => (
        <Note key={note.id} data={note} />
      ))}

      <div
        className='note note-add'
        onClick={() => setIsNewNoteModalOpen(true)}
      >
        <div className='note-add-button'>
          <FontAwesomeIcon icon={faAdd} />
        </div>
      </div>
      <Modal
        open={isNewNoteModalOpen}
        onClose={() => setIsNewNoteModalOpen(false)}
      >
        <NewNote />
      </Modal>
    </div>
  )
}

export default NotesList
