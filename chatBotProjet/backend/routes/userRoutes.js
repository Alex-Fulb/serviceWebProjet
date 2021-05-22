const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
let User = require('../model/userModel');
const {exec} = require('child_process');
require('dotenv').config();


// --------- GET  ----------

router.get('/', function(req, res) {
  res.render('../../views/pages/login.ejs');
});

router.get('/register', function(req, res) {
  res.render('../../views/pages/signup.ejs');
});



// // -------- GET -----------

// // Home page
// router.get('/', function(req, res) {
//     res.render('../../views/pages/index.ejs');
//   });

// // Page About
// router.get('/about', function(req, res) {
//     res.render('../../views/pages/about.ejs');
//   });


// ------- POST -------


router.post('/register', async (req, res) => {
  const userData = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
  }

  // Pour check l'email dans la BDD
  const {email} = req.body;

  try {
    // const mailCheck = req.body.email
    // console.log(`mailCheck`, mailCheck)
    const rep = await User.findOne({email});
    console.log(`rep ----------->`, rep)

    if (rep) {
      res.render('../../views/pages/signup.ejs', {error: 'email déjà utilisé'})
    }
    else {
      const newUser = new User(userData)
      const response = await newUser.save();
      res.cookie('dataUser', newUser.name)
      res.redirect('/home');
      // let token =
      //     jwt.sign(response.toJSON(), process.env.CONFIG, {expiresIn: 1440});

    }
    // res.send(token)

  } catch (error) {
    console.error(error)
    res.send(false)
  }
});

router.post('/login', async (req, res) => {
  const {email, password} = req.body;

  console.log(`------> req.body`, req.body)
  try {
    const newUser = await User.findOne({email});
    console.log(`newUser ----->`, newUser)
    if (!newUser) {
      res.render(
          '../../views/pages/login.ejs', {error: 'Combinaison incorrecte'})
      return;
    }
    const rep = await newUser.validatePassword(password)

    if (rep) {
      res.cookie('dataUser', newUser.name)
      res.redirect('/home');
    }
    else {

        res.render(
            '../../views/pages/login.ejs', {error: 'Combinaison incorrecte'})}

    // let token =
    //     jwt.sign(newUser.toJSON(), process.env.CONFIG, {expiresIn: 1440});

    // res.send(token)
  } catch (error) {
    console.error(error)
    res.send(false)
  }
});

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
