import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from './Modal'
import EditNote from './EditNote'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { endpointUrl } from '../helpers/urlHelpers'
import { useState } from 'react'

const Note = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

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
        <FontAwesomeIcon
          onClick={() => setIsModalOpen(true)}
          icon={faPenToSquare}
        />
        <FontAwesomeIcon onClick={deleteNote} icon={faTrash} />
      </div>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <EditNote data={data} />
      </Modal>
    </div>
  )
}

export default Note
