import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { endpointUrl } from '../helpers/urlHelpers'
import { getAuthKey, isLoggedIn } from '../helpers/authHelpers'

const Note = ({ data, props }) => {
  const deleteNote = (event) => {
    let requestOptions = {}
    if (isLoggedIn()) {
      requestOptions = {
        headers: {
          'Authorization': `Bearer ${getAuthKey()}`
        }
      }
    }
    requestOptions = {
      ...requestOptions,
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }
    let urlPart = `notes/${data.id}`
    fetch(endpointUrl(urlPart), requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data))
    props.reloadNotesList()
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
        <FontAwesomeIcon onClick={deleteNote} icon={faTrash} />
      </div>
    </div>
  )
}

export default Note
