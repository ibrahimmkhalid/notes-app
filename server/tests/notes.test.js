const Note = require("../models/note.models.js");
const NoteService = require("../service/notes.js");
const mockingoose = require('mockingoose');
const mongoose = require('mongoose');

describe('Get all notes', () => {
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
});
