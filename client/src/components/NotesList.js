import Note from './Note'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'

const NotesList = ({ notes }) => {
  return (
    <div className='notes-list'>
      {notes.map((note) => (
        <Note key={note.id} data={note} />
      ))}

      <div className='note note-add'>
        <div className='note-add-button'>
          <FontAwesomeIcon icon={faAdd} className='note-add-button-icon' />
        </div>
      </div>
    </div>
  )
}

export default NotesList
