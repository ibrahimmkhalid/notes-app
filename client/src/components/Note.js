import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { endpointUrl } from '../helpers/urlHelpers'

const Note = ({ data }) => {
  const deleteNote = (event) => {
    console.log(event)
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }
    let urlPart = `notes/${data.id}`
    fetch(endpointUrl(urlPart), requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data))
  }

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
        <FontAwesomeIcon onClick={deleteNote} icon={faTrash} />
      </div>
    </div>
  )
}

export default Note
