import Note from './Note'
import EditNote from './EditNote'
import NewNote from './NewNote'
import Modal from './Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { endpointUrl } from '../helpers/urlHelpers'
import { getAuthKey, isLoggedIn } from '../helpers/authHelpers'

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

  const reloadNotesList = () => {
    let requestOptions = {}
    if (isLoggedIn()) {
      requestOptions = {
        headers: {
          'Authorization': `Bearer ${getAuthKey()}`
        }
      }
    }
    fetch(endpointUrl('notes/all'), requestOptions).then((response) => {
      response.json().then((data) => {
        setNotes(data.data.notes)
      })
    })
  }

  useEffect(() => {
    reloadNotesList()
  }, [isNoteModalOpen, isNewNoteModalOpen])

  return (
    <div className='notes-list'>
      {notes.map((note) => (
        <>
          <div onClick={() => setIsNoteModalOpen(note.id)}>
            <Note
              key={note.id}
              data={note}
              props={{
                reloadNotesList: () => {
                  reloadNotesList()
                  setIsNoteModalOpen(null)
                },
              }}
            />
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
