import { useEffect, useState } from 'react'
import NotesList from './components/NotesList'
import TopBar from './TopBar'
import { endpointUrl } from './helpers/urlHelpers'

function App() {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    fetch(endpointUrl('notes/all')).then((response) => {
      response.json().then((data) => {
        setNotes(data.data.notes)
      })
    })
  }, [])

  return (
    <div className='main-app'>
      <div className='top'>
        <TopBar />
      </div>
      <div className='main-area'>
        <NotesList notes={notes} />
      </div>
    </div>
  )
}

export default App
