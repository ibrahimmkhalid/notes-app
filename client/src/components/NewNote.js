import { faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import { useContext, useState } from 'react'
import { endpointUrl } from '../helpers/urlHelpers'
import UserStore from '../stores/userStore'

const NewNote = ({ props }) => {
  const userStore = useContext(UserStore)
  const [newNote, setNewNote] = useState({
    title: null,
    text: null,
  })

  const handleChange = (e) => {
    let oldNewNote = newNote
    let updatedKey = e.target.id === 'new-note-title' ? 'title' : 'text'
    oldNewNote[updatedKey] = e.target.value
    setNewNote(oldNewNote)
  }

  const saveNote = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote),
    }
    if (userStore.isLoggedIn) {
      requestOptions.headers = {
        ...requestOptions.headers,
        'Authorization': `Bearer ${userStore.token}`
      } 
      console.log(requestOptions)
      fetch(endpointUrl('notes/add/private'), requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data))
    } else {
      fetch(endpointUrl('notes/add/public'), requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data))
    }
  }

  return (
    <>
      <div className='new-note-form'>
        <input
          id='new-note-title'
          className='new-note-title-area'
          placeholder='title...'
          onChange={(e) => handleChange(e)}
        >
          {newNote.title}
        </input>
        <textarea
          id='new-note-text'
          className='new-note-textarea'
          placeholder='note text here...'
          onChange={(e) => handleChange(e)}
        >
          {newNote.text}
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

export default observer(NewNote)
