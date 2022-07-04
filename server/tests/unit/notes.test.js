const Note = require("../../models/note.models.js");
const NoteService = require("../../service/notes.js");
const mockingoose = require('mockingoose');
const mongoose = require('mongoose');

describe('Get all notes directly from server', () => {
  let _user1_id = new mongoose.Types.ObjectId();
  let _user2_id = new mongoose.Types.ObjectId();

  let _data = [
    {
      title: 'Note 1',
      text: 'text for note 1',
      owner: _user1_id
    },{
      title: 'Note 2',
      text: 'text for note 2',
      owner: _user2_id
    },{
      title: 'Note 3',
      text: 'text for note 3',
      owner: null
    }
  ];


  it.only('Should show list of all notes if user is admin', async () => {
    mockingoose(Note).toReturn(_data, 'find');
    user = {};
    user.id = _user1_id;
    user.username = "user"
    user.admin = true;

    const data = await NoteService.getAllNotes(user);
    await expect(data).toMatchObject(_data);
  });

  it.only('Should show list of all notes available to a non admin user', async () => {
    mockingoose(Note).toReturn([
      _data[0],
      _data[2]
    ], 'find');
    user = {};
    user.id = _user1_id;
    user.username = "user"
    user.admin = false;

    const data = await NoteService.getAllNotes(user);
    await expect(data).toMatchObject([
      _data[0],
      _data[2]
    ]);
  });

  it.only('Should show list of all notes avaialable to a logged out user', async () => {
    mockingoose(Note).toReturn([
      _data[2]
    ], 'find');
    user = null;

    const data = await NoteService.getAllNotes(user);
    await expect(data).toMatchObject([
      _data[2]
    ]);
  })
});
