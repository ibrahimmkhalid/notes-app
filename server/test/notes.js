process.env.NODE_ENV = 'test'

let User = require('../models/user.models.js')
let Note = require('../models/note.models.js')

let chai = require('chai')
let request = require('supertest')
let api = require('../api.js')
const { after, before, describe, it, beforeEach, afterEach } = require('mocha')

const expect = chai.expect

//hash for 'password'
const hashedPassword =
  '$2b$10$HsQ0cHHufbLisYbEQxoPkOCwzTomz.E7mLYVTEM34lj3VTNexTtsu'

let mockUsersData = [
  {
    username: 'user1',
    password: hashedPassword,
    admin: true,
  },
  {
    username: 'user2',
    password: hashedPassword,
    admin: false,
  },
]

describe('Notes', () => {
  before(async () => {
    await User.create(mockUsersData)
  })

  describe('Getting all notes', () => {
    before(async () => {
      let user = await User.findOne({ username: 'user1' })
      await Note.create([
        { title: 'u1n1', text: 'u1n1', owner: user.id },
        { title: 'u1n2', text: 'u1n2', owner: user.id },
      ])
      user = await User.findOne({ username: 'user2' })
      await Note.create([
        { title: 'u2n1', text: 'u2n1', owner: user.id },
        { title: 'u2n2', text: 'u2n2', owner: user.id },
      ])
      await Note.create([
        { title: 'uxn1', text: 'uxn1', owner: null },
        { title: 'uxn2', text: 'uxn2', owner: null },
      ])
    })

    it('gets all notes if user is an admin', async () => {
      let token = await login(mockUsersData[0])
      request(api)
        .get('/notes/all')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.eq(200)
          expect(res.body.data.notes).to.be.an('array')
          expect(res.body.data.notes).to.have.lengthOf(6)
        })
    })

    it('gets only the notes for that user', async () => {
      let token = await login(mockUsersData[1])
      request(api)
        .get('/notes/all')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.eq(200)
          expect(res.body.data.notes).to.be.an('array')
          expect(res.body.data.notes).to.have.lengthOf(4)
        })
    })

    it('gets only public notes for logged out users', async () => {
      request(api)
        .get('/notes/all')
        .end((err, res) => {
          expect(res.status).to.eq(200)
          expect(res.body.data.notes).to.be.an('array')
          expect(res.body.data.notes).to.have.lengthOf(2)
        })
    })

    after(async () => {
      await Note.deleteMany({})
    })
  })

  describe('Get a specific note', () => {
    before(async () => {
      let user = await User.findOne({ username: 'user1' })
      await Note.create([
        { title: 'u1n1', text: 'u1n1', owner: user.id },
        { title: 'u1n2', text: 'u1n2', owner: user.id },
      ])
      user = await User.findOne({ username: 'user2' })
      await Note.create([
        { title: 'u2n1', text: 'u2n1', owner: user.id },
        { title: 'u2n2', text: 'u2n2', owner: user.id },
      ])
      await Note.create([
        { title: 'uxn1', text: 'uxn1', owner: null },
        { title: 'uxn2', text: 'uxn2', owner: null },
      ])
    })

    it('gets any note if user is an admin', async () => {
      let token = await login(mockUsersData[0])
      let note = await Note.findOne({ title: 'u1n1' })
      let id = note.id
      let res = await request(api)
        .get(`/notes/${id}`)
        .set('Authorization', token)
      expect(res.status).to.eq(200)
      expect(res.body.data.note.id).to.eq(note.id)

      note = await Note.findOne({ title: 'u2n1' })
      id = note.id
      res = await request(api).get(`/notes/${id}`).set('Authorization', token)
      expect(res.status).to.eq(200)
      expect(res.body.data.note.id).to.eq(note.id)

      note = await Note.findOne({ title: 'uxn1' })
      id = note.id
      res = await request(api).get(`/notes/${id}`).set('Authorization', token)
      expect(res.status).to.eq(200)
      expect(res.body.data.note.id).to.eq(note.id)
    })

    it('gets only those notes by id which the user has access to', async () => {
      let token = await login(mockUsersData[1])
      let note = await Note.findOne({ title: 'u1n1' })
      let id = note.id
      let res = await request(api)
        .get(`/notes/${id}`)
        .set('Authorization', token)
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
      expect(res.body.error).to.have.property('authentication')
      expect(res.body.error.authentication).to.include(
        'User does not have permission to access this note'
      )

      note = await Note.findOne({ title: 'u2n1' })
      id = note.id
      res = await request(api).get(`/notes/${id}`).set('Authorization', token)
      expect(res.status).to.eq(200)
      expect(res.body.data.note.id).to.eq(note.id)

      note = await Note.findOne({ title: 'uxn1' })
      id = note.id
      res = await request(api).get(`/notes/${id}`).set('Authorization', token)
      expect(res.status).to.eq(200)
      expect(res.body.data.note.id).to.eq(note.id)
    })

    it('gets only public notes by id if user is logged out', async () => {
      let note = await Note.findOne({ title: 'u1n1' })
      let id = note.id
      let res = await request(api).get(`/notes/${id}`)
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
      expect(res.body.error).to.have.property('authentication')
      expect(res.body.error.authentication).to.include(
        'User does not have permission to access this note'
      )

      note = await Note.findOne({ title: 'u2n1' })
      id = note.id
      res = await request(api).get(`/notes/${id}`)
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
      expect(res.body.error).to.have.property('authentication')
      expect(res.body.error.authentication).to.include(
        'User does not have permission to access this note'
      )

      note = await Note.findOne({ title: 'uxn1' })
      id = note.id
      res = await request(api).get(`/notes/${id}`)
      expect(res.status).to.eq(200)
      expect(res.body.data.note.id).to.eq(note.id)
    })

    it('fails if bad id is given', async () => {
      let note = await Note.findOne({ title: 'uxn1' })
      let id = note.id
      let res = await request(api).get(`/notes/${id}`)
      expect(res.status).to.eq(200)
      expect(res.body.data.note.id).to.eq(note.id)

      //id of deleted note
      await Note.deleteOne({ title: 'uxn1' })
      res = await request(api).get(`/notes/${id}`)
      expect(res.status).to.eq(404)
      expect(res.body).to.have.property('error')
      expect(res.body.error).to.have.property('database')
      expect(res.body.error.database).to.include(
        'This resource could not be found'
      )

      //bad id
      id = 'fails-validation'
      res = await request(api).get(`/notes/${id}`)
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
      expect(res.body.error).to.have.property('validation')
      expect(res.body.error.validation).to.include('invalid ObjectId')

      // no id
      res = await request(api).get(`/notes/`)
      expect(res.status).to.eq(404)
    })

    after(async () => {
      await Note.deleteMany({})
    })
  })

  describe('Add a note', () => {
    it('adds a public note from logged out user with good data', async () => {
      let post_data = {
        title: 'title',
        text: 'text',
      }

      let res = await request(api).post('/notes/add/public').send(post_data)
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('note')
      expect(res.body.data.note).to.have.property('title')
      expect(res.body.data.note).to.have.property('text')
      expect(res.body.data.note).to.have.property('owner')
      expect(res.body.data.note.title).to.eq('title')
      expect(res.body.data.note.text).to.eq('text')
      expect(res.body.data.note.owner).to.eq(null)
    })

    it('adds a public note from logged in user with good data', async () => {
      let post_data = {
        title: 'title',
        text: 'text',
      }
      let token = await login(mockUsersData[0])
      let res = await request(api)
        .post('/notes/add/public')
        .set('Authorization', token)
        .send(post_data)
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('note')
      expect(res.body.data.note).to.have.property('title')
      expect(res.body.data.note).to.have.property('text')
      expect(res.body.data.note).to.have.property('owner')
      expect(res.body.data.note.title).to.eq('title')
      expect(res.body.data.note.text).to.eq('text')
      expect(res.body.data.note.owner).to.eq(null)
    })

    it('adds a private note from logged in user with good data', async () => {
      let post_data = {
        title: 'title',
        text: 'text',
      }
      let token = await login(mockUsersData[0])
      let res = await request(api)
        .post('/notes/add/private')
        .set('Authorization', token)
        .send(post_data)
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('note')
      expect(res.body.data.note).to.have.property('title')
      expect(res.body.data.note).to.have.property('text')
      expect(res.body.data.note).to.have.property('owner')
      expect(res.body.data.note.title).to.eq('title')
      expect(res.body.data.note.text).to.eq('text')
      expect(res.body.data.note.owner).to.not.eq(null)
    })

    it('tries to add a private note from logged out user', async () => {
      let post_data = {
        title: 'title',
        text: 'text',
      }
      let res = await request(api)
        .post('/notes/add/private')
        .send(post_data)
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property("error")
      expect(res.body.error).to.have.property("authentication")
      expect(res.body.error.authentication).to.include(
        'Incorrect Token'
      )
    })

    it('tries to add a note with bad data', async () => {
      let post_data = {
        text: 'text',
      }
      let res = await request(api)
        .post('/notes/add/public')
        .send(post_data)
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property("error")
      expect(res.body.error).to.have.property("validation")
      expect(res.body.error.validation).to.include(
        "'title' is a required field"
      )

      post_data = {
        title: 'title',
      }
      res = await request(api)
        .post('/notes/add/public')
        .send(post_data)
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property("error")
      expect(res.body.error).to.have.property("validation")
      expect(res.body.error.validation).to.include(
        "'text' is a required field"
      )

      post_data = {}
      res = await request(api)
        .post('/notes/add/public')
        .send(post_data)
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property("error")
      expect(res.body.error).to.have.property("validation")
      expect(res.body.error.validation).to.include(
        "'text' is a required field",
        "'title' is a required field"
      )
    })

    after(async () => {
      await Note.deleteMany({})
    })
  })

  describe('Edit a note', () => {
    beforeEach(async () => {
      let user = await User.findOne({ username: 'user1' })
      await Note.create([
        { title: 'u1n1', text: 'u1n1', owner: user.id },
        { title: 'u1n2', text: 'u1n2', owner: user.id },
      ])
      user = await User.findOne({ username: 'user2' })
      await Note.create([
        { title: 'u2n1', text: 'u2n1', owner: user.id },
        { title: 'u2n2', text: 'u2n2', owner: user.id },
      ])
      await Note.create([
        { title: 'uxn1', text: 'uxn1', owner: null },
        { title: 'uxn2', text: 'uxn2', owner: null },
      ])
    })

    it('allows a user to edit a public note with partial data', async () => {
      let note = await Note.findOne({ title: 'uxn1' })
      let id = note.id
      let post_data = {
        text: 'text',
      }

      let res = await request(api)
        .post(`/notes/update/${id}`)
        .send(post_data)
      expect(res.status).to.eq(200)
      note = await Note.findById(id)
      expect(note.title).to.eq('uxn1')
      expect(note.text).to.eq('text')

      note = await Note.findOne({ title: 'uxn2' })
      id = note.id
      post_data = {
        title: 'title',
      }

      res = await request(api)
        .post(`/notes/update/${id}`)
        .send(post_data)
      expect(res.status).to.eq(200)
      note = await Note.findById(id)
      expect(note.title).to.eq('title')
      expect(note.text).to.eq('uxn2')
    })

    it('allows a logged out user to edit a public note', async () => {
      let note = await Note.findOne({ title: 'uxn1' })
      let id = note.id
      let post_data = {
        title: 'title',
        text: 'text',
      }

      let res = await request(api)
        .post(`/notes/update/${id}`)
        .send(post_data)
      expect(res.status).to.eq(200)
      note = await Note.findById(id)
      expect(note.title).to.eq('title')
      expect(note.text).to.eq('text')
    })

    it('allows logged in user to edit a public note', async () => {
      let note = await Note.findOne({ title: 'uxn1' })
      let id = note.id
      let post_data = {
        title: 'title',
        text: 'text',
      }

      let token = await login(mockUsersData[1])
      let res = await request(api)
        .post(`/notes/update/${id}`)
        .set('Authorization', token)
        .send(post_data)
      expect(res.status).to.eq(200)
      note = await Note.findById(id)
      expect(note.title).to.eq('title')
      expect(note.text).to.eq('text')
    })

    it('does not allow a logged out user to edit a private note', async () => {
      let note = await Note.findOne({ title: 'u1n1' })
      let id = note.id
      let post_data = {
        title: 'title',
        text: 'text',
      }

      let res = await request(api)
        .post(`/notes/update/${id}`)
        .send(post_data)
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property("error")
      expect(res.body.error).to.have.property("authentication")
      expect(res.body.error.authentication).to.include(
        'User does not have permission to access this note'
      )
    })

    it('allows a logged in user to edit a private note they do own', async () => {
      let note = await Note.findOne({ title: 'u2n1' })
      let id = note.id
      let post_data = {
        title: 'title',
        text: 'text',
      }

      let token = await login(mockUsersData[1])
      let res = await request(api)
        .post(`/notes/update/${id}`)
        .set('Authorization', token)
        .send(post_data)
      expect(res.status).to.eq(200)
      note = await Note.findById(id)
      expect(note.title).to.eq('title')
      expect(note.text).to.eq('text')
    })

    it('does not allow a logged in user to edit a private note they do not own', async () => {
      let note = await Note.findOne({ title: 'u1n1' })
      let id = note.id
      let post_data = {
        title: 'title',
        text: 'text',
      }

      let token = await login(mockUsersData[1])
      let res = await request(api)
        .post(`/notes/update/${id}`)
        .set('Authorization', token)
        .send(post_data)
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property("error")
      expect(res.body.error).to.have.property("authentication")
      expect(res.body.error.authentication).to.include(
        'User does not have permission to access this note'
      )
    })

    it('allows a logged in admin user to edit a private note they do not own', async () => {
      let note = await Note.findOne({ title: 'u2n1' })
      let id = note.id
      let post_data = {
        title: 'title',
        text: 'text',
      }

      let token = await login(mockUsersData[0])
      let res = await request(api)
        .post(`/notes/update/${id}`)
        .set('Authorization', token)
        .send(post_data)
      expect(res.status).to.eq(200)
      note = await Note.findById(id)
      expect(note.title).to.eq('title')
      expect(note.text).to.eq('text')
    })

    afterEach(async () => {
      await Note.deleteMany({})
    })

    after(async () => {
      await Note.deleteMany({})
    })
  })

  describe('Delete a note', () => {
    beforeEach(async () => {
      let user = await User.findOne({ username: 'user1' })
      await Note.create([
        { title: 'u1n1', text: 'u1n1', owner: user.id },
        { title: 'u1n2', text: 'u1n2', owner: user.id },
      ])
      user = await User.findOne({ username: 'user2' })
      await Note.create([
        { title: 'u2n1', text: 'u2n1', owner: user.id },
        { title: 'u2n2', text: 'u2n2', owner: user.id },
      ])
      await Note.create([
        { title: 'uxn1', text: 'uxn1', owner: null },
        { title: 'uxn2', text: 'uxn2', owner: null },
      ])
    })

    it('allows alogged out user to delete a public note', async () => {
      let note = await Note.findOne({ title: 'uxn1' })
      let id = note.id

      let res = await request(api)
        .delete(`/notes/${id}`)
      expect(res.status).to.eq(200)
      note = await Note.findById(id)
      expect(note).to.eq(null)
    })

    it('allows logged in user to delete a public note', async () => {
      let note = await Note.findOne({ title: 'uxn1' })
      let id = note.id

      let res = await request(api)
        .delete(`/notes/${id}`)
      expect(res.status).to.eq(200)
      note = await Note.findById(id)
      expect(note).to.eq(null)
    })

    it('does not allow a logged out user to delete a private note', async () => {
      let note = await Note.findOne({ title: 'u1n1' })
      let id = note.id
      let post_data = {
        title: 'title',
        text: 'text',
      }

      let res = await request(api)
        .delete(`/notes/${id}`)
        .send(post_data)
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property("error")
      expect(res.body.error).to.have.property("authentication")
      expect(res.body.error.authentication).to.include(
        'User does not have permission to access this note'
      )
    })

    it('allows a logged in user to delete a private note they do own', async () => {
      let note = await Note.findOne({ title: 'u2n1' })
      let id = note.id

      let token = await login(mockUsersData[1])
      let res = await request(api)
        .delete(`/notes/${id}`)
        .set('Authorization', token)
      expect(res.status).to.eq(200)
      note = await Note.findById(id)
      expect(note).to.eq(null)
    })

    it('does not allow a logged in user to delete a private note they do not own', async () => {
      let note = await Note.findOne({ title: 'u1n1' })
      let id = note.id
      let post_data = {
        title: 'title',
        text: 'text',
      }

      let token = await login(mockUsersData[1])
      let res = await request(api)
        .delete(`/notes/${id}`)
        .set('Authorization', token)
        .send(post_data)
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property("error")
      expect(res.body.error).to.have.property("authentication")
      expect(res.body.error.authentication).to.include(
        'User does not have permission to access this note'
      )
    })

    it('allows a logged in admin user to delete a private note they do not own', async () => {
      let note = await Note.findOne({ title: 'u2n1' })
      let id = note.id

      let token = await login(mockUsersData[0])
      let res = await request(api)
        .delete(`/notes/${id}`)
        .set('Authorization', token)
      expect(res.status).to.eq(200)
      note = await Note.findById(id)
      expect(note).to.eq(null)
    })

    afterEach(async () => {
      await Note.deleteMany({})
    })

    after(async () => {
      await Note.deleteMany({})
    })
  })
  after(async () => {
    await User.deleteMany({})
    await Note.deleteMany({})
  })
})

async function login(user) {
  if (user) {
    let _data = {
      username: user.username,
      password: 'password',
    }

    let res = await request(api).post('/login').send(_data)
    return 'Bearer ' + res.body.data.token
  } else {
    return null
  }
}
