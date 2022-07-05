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

describe('Add notes', () => {
  let _data = {
    title: 'Note 1',
    text: 'text for note 1',
    owner: new mongoose.Types.ObjectId()
  };

  it.only('Should add note and return that object with owner', async () => {
    mockingoose(Note).toReturn(_data, 'save');

    const data = await NoteService.addNewNote(_data);
    await expect(data).toMatchObject(_data);
  });

  _data = {
    title: 'Note 1',
    text: 'text for note 1',
    owner: null
  };

  it.only('Should add note and return that object without owner', async () => {
    mockingoose(Note).toReturn(_data, 'save');

    const data = await NoteService.addNewNote(_data);
    await expect(data).toMatchObject(_data);
  });

});

describe('Get note by id', () => {
  let _user1_id = new mongoose.Types.ObjectId();
  let _user2_id = new mongoose.Types.ObjectId();
  let _note0_id = new mongoose.Types.ObjectId();
  let _note1_id = new mongoose.Types.ObjectId();
  let _note2_id = new mongoose.Types.ObjectId();

  let _data = [
    {
      _id: _note0_id,
      title: 'Note 1',
      text: 'text for note 1',
      owner: _user1_id
    },{
      _id: _note1_id,
      title: 'Note 2',
      text: 'text for note 2',
      owner: _user2_id
    },{
      _id: _note2_id,
      title: 'Note 3',
      text: 'text for note 3',
      owner: null
    }
  ];


  it.only('Should get any note if user is admin', async () => {
    user = {};
    user.id = _user1_id;
    user.username = "user"
    user.admin = true;

    mockingoose(Note).toReturn(_data[0], 'findById');
    m_data = {
      id: _note0_id
    }
    let data = await NoteService.getNoteByID(m_data, user);
    await expect(data).toMatchObject(_data[0]);
  //
  //   mockingoose(Note).toReturn(_data[1], 'find');
  //   m_data = {
  //     id: _note1_id
  //   }
  //   data = await NoteService.getNoteByID(m_data, user);
  //   await expect(data).toMatchObject(_data[1]);
  //
  //
  //   mockingoose(Note).toReturn(_data[2], 'find');
  //   m_data = {
  //     id: _note2_id
  //   }
  //   data = await NoteService.getNoteByID(m_data, user);
  //   await expect(data).toMatchObject(_data[2]);
  });
});


