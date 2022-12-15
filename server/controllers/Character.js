const models = require('../models');
const CharacterModel = require('../models/Character');

const { Character } = models;

const makerPage = (req, res) => {
  res.render('app');
};

const upgradedPage = (req, res) => {
  res.render('app2');
};

const makeCharacter = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.characteristic) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const characterData = {
    name: req.body.name,
    age: req.body.age,
    characteristic: req.body.characteristic,
    owner: req.session.account._id,
  };

  try {
    const newCharacter = new Character(characterData);
    await newCharacter.save();
    return res.status(201).json({
      name: newCharacter.name,
      age: newCharacter.age,
      characteristic: newCharacter.characteristic,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Character already exists!' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};

const getChars = (req, res) => CharacterModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred!' });
  }

  return res.json({ characters: docs });
});

const deleteCharacter = async (req, res) => {
  console.log('in deleteCharacter');
  // console.log(req.query);
  console.log(req.query._id);
  const id = req.body.characterId;
  console.log(`id: ${id}`);

  try {
    Character.findOneAndDelete({ name: 'a' });
    // const doc = await Character.findByIdAndDelete({ id });
    //   return res.status(202).json({
    //     name: newCharacter.name,
    // });
    return res.status(202);
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Character already exists!' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};
module.exports = {
  makerPage,
  upgradedPage,
  makeCharacter,
  getChars,
  deleteCharacter,
};
