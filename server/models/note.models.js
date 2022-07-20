const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  owner: {type: Schema.Types.ObjectId, ref: "User"}
}, {
  timestamps: true,
});

noteSchema.set('toJSON', {
  virtuals: true
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
