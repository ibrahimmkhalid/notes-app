import Note from './Note'
import EditNote from './EditNote'
import NewNote from './NewNote'
import Modal from './Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { endpointUrl } from '../helpers/urlHelpers'

const NotesList = () => {
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false)

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(null)
  const handleIsNoteModalOpen = (id) => {
    if (isNoteModalOpen === null) {
      return null
    }
    if (isNoteModalOpen === id) {
      return 1
    }
    return null
  }

  const [notes, setNotes] = useState([])

  useEffect(() => {
    console.log(111)
    fetch(endpointUrl('notes/all')).then((response) => {
      response.json().then((data) => {
        setNotes(data.data.notes)
      })
    })
  }, [isNoteModalOpen, isNewNoteModalOpen])

  return (
    <div className='notes-list'>
      {notes.map((note) => (
        <>
          <div onClick={() => setIsNoteModalOpen(note.id)}>
            <Note key={note.id} data={note} />
          </div>
          <Modal
            open={handleIsNoteModalOpen(note.id)}
            onClose={() => setIsNoteModalOpen(null)}
          >
            <EditNote
              data={note}
              props={{ closeModal: () => setIsNoteModalOpen(null) }}
            />
          </Modal>
        </>
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
        <NewNote props={{ closeModal: () => setIsNewNoteModalOpen(false) }} />
      </Modal>
    </div>
  )
}

export default NotesList
