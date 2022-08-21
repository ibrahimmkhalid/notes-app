import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'

const Note = ({ data }) => {
  return (
    <div className='note'>
      <div>
        <div className='note-header'>
          <span className='note-title'>{data.title}</span>
          <span className='note-owner'>
            {!data.owner ? 'public' : data.owner}
          </span>
        </div>
        <span>{data.text}</span>
      </div>
      <div className='note-footer'>
        <FontAwesomeIcon icon={faPenToSquare} />
        <FontAwesomeIcon icon={faTrash} />
      </div>
    </div>
  )
}

export default Note
