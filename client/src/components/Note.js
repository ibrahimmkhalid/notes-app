import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
const Note = () => {
  return (
    <div className='note'>
      <div>
        <div className='note-header'>
          <span className='note-title'>Title</span>
          <span className='note-owner'>ibrahim</span>
        </div>
        <span>Text of the note</span>
      </div>
      <div className='note-footer'>
        <FontAwesomeIcon icon={faPenToSquare} />
        <FontAwesomeIcon icon={faTrash} />
      </div>
    </div>
  )
}

export default Note
