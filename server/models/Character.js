const mongoose = require('mongoose');
const _ = require('underscore');

let CharacterModel = {};

const setName = (name) => _.escape(name).trim();

const CharacterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  characteristic: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

CharacterSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  characteristic: doc.characteristic,
});

CharacterSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    // convert the string ownerId to an object id
    owner: mongoose.Types.ObjectId(ownerId),
  };

  return CharacterModel.find(search).select('name age characteristic').lean().exec(callback);
};

CharacterModel = mongoose.model('Character', CharacterSchema);

module.exports = CharacterModel;
