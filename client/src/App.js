import NotesList from './components/NotesList'
import TopBar from './components/TopBar'

function App() {
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
