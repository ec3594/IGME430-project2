const models = require('../models');
const DomoModel = require('../models/Domo');

const { Domo } = models;

const makerPage = (req, res) => {
    res.render('app');
};

const upgradedPage = (req, res) => {
    res.render('app2');
};

const makeDomo = async(req, res) => {
    if (!req.body.name || !req.body.age || !req.body.characteristic) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    const domoData = {
        name: req.body.name,
        age: req.body.age,
        characteristic: req.body.characteristic,
        owner: req.session.account._id,
    };

    try {
        const newDomo = new Domo(domoData);
        await newDomo.save();
        return res.status(201).json({
            name: newDomo.name,
            age: newDomo.age,
            characteristic: newDomo.characteristic,
        });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Domo already exists!' });
        }
        return res.status(400).json({ error: 'An error occured' });
    }
};

const getDomos = (req, res) => DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred!' });
    }

    return res.json({ domos: docs });
});

const deleteDomo = async(req, res) => {
    console.log('in deleteDomo');
    // console.log(req.query);
    console.log(req.query._id);
    const id = req.body.domoId;
    console.log(`id: ${id}`);

    try {
        Domo.findOneAndDelete({ name: 'a' });
        // const doc = await Domo.findByIdAndDelete({ id });
        //   return res.status(202).json({
        //     name: newDomo.name,
        // });
        return res.status(202);
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Domo already exists!' });
        }
        return res.status(400).json({ error: 'An error occured' });
    }
};
module.exports = {
    makerPage,
    upgradedPage,
    makeDomo,
    getDomos,
    deleteDomo,
};