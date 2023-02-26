import { useEffect, useState } from 'react'
import NotesList from './components/NotesList'
import TopBar from './TopBar'

function App() {
  const [userKey, setUserKey] = useState(null)

  useEffect(() => {
    const storedUserKey = localStorage.getItem('user_token')
    if (storedUserKey) {
      setUserKey(storedUserKey)
    }
  }, [])
  return (
    <div className='main-app'>
      <div className='top'>
        <TopBar />
      </div>
      <div className='main-area'>
        <NotesList />
      </div>
    </div>
  )
}

export default App
