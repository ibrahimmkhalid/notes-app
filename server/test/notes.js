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

  });

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
