const Note = require("../models/note.models.js");
const NoteService = require("../service/notes.js");

describe('Get all notes', () => {
  Note.find = jest.fn().mockReturnValue([
    {
      title: 'Note 1',
      text: 'text for note 1',
      owner: 1
    },{
      title: 'Note 2',
      text: 'text for note 2',
      owner: 2
    },{
      title: 'Note 3',
      text: 'text for note 3',
      owner: null
    }
  ]);

  it.only('Should show list of all notes if user is admin', async () => {
    user = {};
    user.id = 1;
    user.username = "user"
    user.admin = true;

    const data = await NoteService.getAllNotes(user);
    await expect(data).toStrictEqual([
      {
        title: 'Note 1',
        text: 'text for note 1',
        owner: 1
      },{
        title: 'Note 2',
        text: 'text for note 2',
        owner: 2
      },{
        title: 'Note 3',
        text: 'text for note 3',
        owner: null
      }
    ]);
  });

  it.only('Should show list of all notes available to a user', async () => {
    user = {};
    user.id = 1;
    user.username = "user"
    user.admin = false;

    const data = await NoteService.getAllNotes(user);
    await expect(data).toStrictEqual([
      {
        title: 'Note 1',
        text: 'text for note 1',
        owner: 1
      },{
        title: 'Note 3',
        text: 'text for note 3',
        owner: null
      }
    ]);
  });
})
