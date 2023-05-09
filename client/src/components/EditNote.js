import { faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import { useContext, useState } from 'react'
import { endpointUrl } from '../helpers/urlHelpers'
import UserStore from '../stores/userStore'

const EditNote = ({ data, props }) => {
  const userStore = useContext(UserStore)
  const [editNote, setEditNote] = useState({
    title: null,
    text: null,
  })

  const handleChange = (e) => {
    let oldNewNote = editNote
    let updatedKey = e.target.id === 'new-note-title' ? 'title' : 'text'
    oldNewNote[updatedKey] = e.target.value
    setEditNote(oldNewNote)
  }

  const saveNote = () => {

    let requestOptions = {}
    if (userStore.isLoggedIn) {
      requestOptions = {
        headers: {
          'Authorization': `Bearer ${userStore.token}`
        }
      }
    }
    requestOptions = {
      ...requestOptions,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editNote),
    }
    let urlPart = `notes/update/${data.id}`
    fetch(endpointUrl(urlPart), requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data))
  }

  return (
    <>
      <div className='new-note-form'>
        <input
          id='new-note-title'
          className='new-note-title-area'
          defaultValue={data.title}
          onChange={(e) => handleChange(e)}
        >
          {editNote.title}
        </input>
        <textarea
          id='new-note-text'
          className='new-note-textarea'
          defaultValue={data.text}
          onChange={(e) => handleChange(e)}
        >
          {editNote.text}
        </textarea>
        <br></br>
        <div
          className='new-note-save-button'
          onClick={() => {
            saveNote()
            props.closeModal()
          }}
        >
          <FontAwesomeIcon icon={faSave} />
        </div>
      </div>
    </>
  )
}

export default observer(EditNote)
