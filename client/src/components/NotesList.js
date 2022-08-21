import { useEffect, useState } from 'react'
import Note from './Note'
const NotesList = ({ notes }) => {
  const [openNewNote, setOpenNewNote] = useState(false)
  useEffect(() => {
    console.log(notes)
  }, [notes])


  return (
    <div className='notes-list'>
      {notes.map((note) => (
        <Note key={note.id} data={note} />
      ))}

    </div>
  )
}

export default NotesList
