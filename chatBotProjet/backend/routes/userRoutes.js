const express = require('express');
const router = express.Router();
let User = require('../model/userModel');
require('dotenv').config();


// ==================================== GET ============================================

router.get('/', function(req, res) {
  res.render('../../views/pages/login.ejs');
});

router.get('/register', function(req, res) {
  res.render('../../views/pages/signup.ejs');
});

// ==================================== POST ============================================


// INSCRIPTION
router.post('/register', async (req, res) => {
  const userData = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
  }
  // Pour check l'email dans la BDD
  const {email} = req.body;

  try {
    const rep = await User.findOne({email});
    if (rep) {
      res.render('../../views/pages/signup.ejs', {error: 'email déjà utilisé'})
    }
    else {
      const newUser = new User(userData)
      const response = await newUser.save();
      // Cookie utilisateur
      res.cookie('dataUser', {id: newUser._id, name: newUser.name, email: email,bots: []})
      res.redirect('/home');
      // let token =
      //     jwt.sign(response.toJSON(), process.env.CONFIG, {expiresIn: 1440});
    }
  } catch (error) {
    console.error(error)
    res.send(false)
  }
});

// CONNEXION
router.post('/login', async (req, res) => {
  const {email, password} = req.body;
  try {
    const newUser = await User.findOne({email});
    if (!newUser) {
      res.render(
          '../../views/pages/login.ejs', {error: 'Combinaison incorrecte'})
      return;
    }
    const rep = await newUser.validatePassword(password)
    if (rep) {
      res.cookie('dataUser', {id: newUser._id, name: newUser.name, email: email,bots: []})
      res.redirect('/home');
    }
    else {
      res.render(
          '../../views/pages/login.ejs', {error: 'Combinaison incorrecte'})
    }
  } catch (error) {
    console.error(error)
    res.send(false)
  }
});


// CONCERNANT LE BOT ICI 

// router.post('/bot', async (req, res) => {
//     try {
//         console.log(req.body.directoryName)
//         exec('cp -R ../botLambda ../bots/'+req.body.directoryName+ '; node
//         ../bots/'+req.body.directoryName+'/template.js', (error, stdout,
//         stderr) => {
//             if (error) {
//               console.error(`exec error: ${error}`);
//               return;
//             }
//             console.log(`stdout: ${stdout}`);
//             console.error(`stderr: ${stderr}`);
//           });
//         //res.send(req.body.directoryName)

//     } catch (error) {
//         console.error(error)
//         res.send(false)
//     }
// });


module.exports = router;
