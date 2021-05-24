const express = require('express');
const router = express.Router();
let Bot = require('../model/botModel')
let User = require('../model/userModel');
const jwt = require('jsonwebtoken')

// --------- GET -----------

// Home page
router.get('/', function(req, res) {

  console.log(`Le cookie`, req.cookies['dataUser'])
  if (req.cookies['dataUser'] === undefined)
  res.redirect('/')
  else res.render(
      '../../views/pages/index.ejs', {name: req.cookies['dataUser']});
});

// Page About
router.get('/about', function(req, res) {
  if (req.cookies['dataUser']=== undefined) res.redirect('/')
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

// ===========================================================================================




// ------- POST --------


// CREATION DU BOT
router.post('/createBot', async function(req, res) {
  
   // Creation du bot dans mongoDB
  Bot.create(
      {name: req.body.nom, port: 3000, owner: req.cookies['dataUser'].id},
      function(err, doc) {
        const idBot = doc._id;

        const filter = {_id: req.cookies['dataUser'].id};
        const update = {$push: {bots: idBot}}
        
        // JE METS A JOURS DIRECTEMENT LES BOTS DE LUTILISATEUR (j'insère un nouveau bot dans sa collection de bot , cf userModel.js)
        User.findOneAndUpdate(filter, update, {new: true}, (err, doc) => {
              console.log(`---> DOC`, doc)
              if (err) {
                console.log('Something wrong when updating data!');
              }
              console.log(doc);
        });
      })

  res.send(req.body.nom);
});



module.exports = router;
