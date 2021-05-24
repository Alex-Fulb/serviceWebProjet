const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
let Bot = require('../model/botModel')
let User = require('../model/userModel');



// ==================================== GET ============================================

// Home page
router.get('/', async function(req, res) {
  console.log(`Données de l'utilisateur`, req.cookies['dataUser'])
  if (req.cookies['dataUser'] === undefined) {
    res.redirect('/')
  }
  else {
    const newUser = await User.findOne({email: req.cookies['dataUser'].email});
    const dataBots = newUser.bots
    var listsBots = [];
    for (var i = 0; i < dataBots.length; i++) {
      listsBots[i] = dataBots[i]
    }
    res.render('../../views/pages/index.ejs', {bots: listsBots});
  }
});

// Page About -> Pas utile pour le moment ..
router.get('/about', function(req, res) {
  if (req.cookies['dataUser'] === undefined)
    res.redirect('/')
    else res.render('../../views/pages/about.ejs');
});

// Deconnexion
router.get('/disconnect', function(req, res) {
  if (req.cookies['dataUser'] === undefined)
    res.redirect('/')
    else {
      res.clearCookie('dataUser')
      res.redirect('/')
    }
});

// FAQ
router.get('/faq', function(req, res) {
  if (req.cookies['dataUser']=== undefined) res.redirect('/')
  else res.render('../../views/pages/faq.ejs');
});

// ===========================================================================================


// ==================================== POST ============================================


// CREATION DU BOT
router.post('/createBot', async function(req, res) {
  Bot.create(
      {name: req.body.nom, owner: req.cookies['dataUser'].id},

      async function(err, doc) {

        const idBot = doc._id;
        const filter = {_id: req.cookies['dataUser'].id};
        const update = {$push: {bots: {id_Bot: idBot, name: req.body.nom}}};

        User.findOneAndUpdate(filter, update, {new: true}, async (err, doc) => {
          const newUser =
              await User.findOne({email: req.cookies['dataUser'].email});
          const dataBots = newUser.bots;
          for (var i = 0; i < dataBots.length; i++) {
            if (i === dataBots.length - 1) {
              bot = dataBots[i];
            }
          }
          res.send(bot)
          if (err) {
            console.log('Something wrong when updating data!');
          }

        });
      })
});


// SUPRESSION D'UN BOT
router.post('/deleteBot', async function(req, res) {

  const idBotToDelete = req.body.idBot
  const filter = {_id: req.cookies['dataUser'].id};
  const update = {
    $pull: {bots: {id_Bot: mongoose.Types.ObjectId(idBotToDelete)}}
  };

  User.updateOne(filter, update, (err, user) => {
    console.log(`user après update`, user)
    if (err) {
      console.log(`err`, err)
    }
  })

  Bot.findByIdAndRemove({_id: idBotToDelete}, async (err, doc) => {
    const botSupp = {idBot: doc._id, name: doc.name};
    res.send(botSupp);
    if (err) {
      console.log('Something wrong when updating data!');
    }
  })
});



module.exports = router;
