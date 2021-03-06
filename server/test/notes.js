process.env.NODE_ENV = 'test';

let mongoose = require("mongoose")
let User = require("../models/user.models.js");
let Note = require("../models/note.models.js");

let chai = require("chai");
let request = require("supertest");
let api = require("../api.js");

const expect = chai.expect;

//hash for 'password'
const hashedPassword = '$2b$10$HsQ0cHHufbLisYbEQxoPkOCwzTomz.E7mLYVTEM34lj3VTNexTtsu';

let mockUsersData = [
  {
    username: 'user1',
    password: hashedPassword,
    admin: true,
  },
  {
    username: 'user2',
    password: hashedPassword,
    admin: false
  },
]

describe('Notes', () => {
  before(async () => {
    await User.create(mockUsersData);
  });

  describe('Getting all notes', () => {
    before(async () => {
      let user = await User.findOne({username: 'user1'});
      await Note.create([
        { title:'u1n1', text:'u1n1', owner: user.id },
        { title:'u1n2', text:'u1n2', owner: user.id }
      ]);
      user = await User.findOne({username: 'user2'});
      await Note.create([
        { title:'u2n1', text:'u2n1', owner: user.id },
        { title:'u2n2', text:'u2n2', owner: user.id }
      ]);
      await Note.create([
        { title:'uxn1', text:'uxn1', owner: null },
        { title:'uxn2', text:'uxn2', owner: null }
      ]);
    });

    it('gets all notes if user is an admin', async () => {
      let token = await login(mockUsersData[0]);
      request(api)
        .get('/notes/all')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.data.notes).to.be.an('array');
          expect(res.body.data.notes).to.have.lengthOf(6);
        })
    });

    it('gets only the notes for that user', async () => {
      let token = await login(mockUsersData[1]);
      request(api)
        .get('/notes/all')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.data.notes).to.be.an('array');
          expect(res.body.data.notes).to.have.lengthOf(4);
        })
    });

    it('gets only public notes for logged out users', async () => {
      request(api)
        .get('/notes/all')
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.data.notes).to.be.an('array');
          expect(res.body.data.notes).to.have.lengthOf(2);
        })
    });

    after(async () => {
      await Note.deleteMany({});
    })
  });

  describe('Get a specific note', () => {
    before(async () => {
      let user = await User.findOne({username: 'user1'});
      await Note.create([
        { title:'u1n1', text:'u1n1', owner: user.id },
        { title:'u1n2', text:'u1n2', owner: user.id }
      ]);
      user = await User.findOne({username: 'user2'});
      await Note.create([
        { title:'u2n1', text:'u2n1', owner: user.id },
        { title:'u2n2', text:'u2n2', owner: user.id }
      ]);
      await Note.create([
        { title:'uxn1', text:'uxn1', owner: null },
        { title:'uxn2', text:'uxn2', owner: null }
      ]);
    });

    it('gets any note if user is an admin', async () => {
      let token = await login(mockUsersData[0]);
      let note = await Note.findOne({title: 'u1n1'});
      let id = note.id;
      res = await request(api)
        .get(`/notes/${id}`)
        .set('Authorization', token)
      expect(res.status).to.eq(200);
      expect(res.body.data.note.id).to.eq(note.id);

      note = await Note.findOne({title: 'u2n1'});
      id = note.id;
      res = await request(api)
        .get(`/notes/${id}`)
        .set('Authorization', token)
      expect(res.status).to.eq(200);
      expect(res.body.data.note.id).to.eq(note.id);

      note = await Note.findOne({title: 'uxn1'});
      id = note.id;
      res = await request(api)
        .get(`/notes/${id}`)
        .set('Authorization', token)
      expect(res.status).to.eq(200);
      expect(res.body.data.note.id).to.eq(note.id);
    });

    it('gets only those notes by id which the user has access to', async () => {
      let token = await login(mockUsersData[1]);
      let note = await Note.findOne({title: 'u1n1'});
      let id = note.id;
      res = await request(api)
        .get(`/notes/${id}`)
        .set('Authorization', token)
      expect(res.status).to.eq(401);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.have.property('authentication');
      expect(res.body.error.authentication).to.include("User does not have permission to access this note");

      note = await Note.findOne({title: 'u2n1'});
      id = note.id;
      res = await request(api)
        .get(`/notes/${id}`)
        .set('Authorization', token)
      expect(res.status).to.eq(200);
      expect(res.body.data.note.id).to.eq(note.id);

      note = await Note.findOne({title: 'uxn1'});
      id = note.id;
      res = await request(api)
        .get(`/notes/${id}`)
        .set('Authorization', token)
      expect(res.status).to.eq(200);
      expect(res.body.data.note.id).to.eq(note.id);
    });

    it('gets only public notes by id if user is logged out', async () => {
      let note = await Note.findOne({title: 'u1n1'});
      let id = note.id;
      res = await request(api)
        .get(`/notes/${id}`)
      expect(res.status).to.eq(401);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.have.property('authentication');
      expect(res.body.error.authentication).to.include("User does not have permission to access this note");

      note = await Note.findOne({title: 'u2n1'});
      id = note.id;
      res = await request(api)
        .get(`/notes/${id}`)
      expect(res.status).to.eq(401);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.have.property('authentication');
      expect(res.body.error.authentication).to.include("User does not have permission to access this note");

      note = await Note.findOne({title: 'uxn1'});
      id = note.id;
      res = await request(api)
        .get(`/notes/${id}`)
      expect(res.status).to.eq(200);
      expect(res.body.data.note.id).to.eq(note.id);
    });

    it('fails if bad id is given', async () => {
      let note = await Note.findOne({title: 'uxn1'});
      let id = note.id;
      res = await request(api)
        .get(`/notes/${id}`)
      expect(res.status).to.eq(200);
      expect(res.body.data.note.id).to.eq(note.id);

      //id of deleted note
      await Note.deleteOne({title: 'uxn1'});
      res = await request(api)
        .get(`/notes/${id}`)
      expect(res.status).to.eq(404);
      expect(res.body).to.have.property('error')
      expect(res.body.error).to.have.property('database')
      expect(res.body.error.database).to.include('This resource could not be found')

      //bad id
      id = 'fails-validation';
      res = await request(api)
        .get(`/notes/${id}`)
      expect(res.status).to.eq(400);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.have.property('validation');
      expect(res.body.error.validation).to.include("invalid ObjectId");

      // no id
      res = await request(api)
        .get(`/notes/`)
      expect(res.status).to.eq(404);
    })

    after(async () => {
      await Note.deleteMany({});
    })
  })

  after(async () => {
    await User.deleteMany({});
    await Note.deleteMany({});
  });
});


async function login(user) {
  if (user) {
    let _data = {
      username: user.username,
      password: 'password'
    };

    let res = await request(api)
      .post('/login')
      .send(_data);
    return 'Bearer ' + res.body.data.token;
  } else {
    return null;
  }
}
