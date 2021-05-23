const express = require('express');
const router = express.Router();

// --------- GET -----------

// Home page
router.get('/', function(req, res) {
  if (req.cookies['dataUser'] === undefined)
    res.redirect('/')
    else res.render(
        '../../views/pages/index.ejs', {name: req.cookies['dataUser']
      });
});

// Page About
router.get('/about', function(req, res) {
  // if (req.cookies['dataUser']=== undefined) res.redirect('/')
  // else
  res.render('../../views/pages/about.ejs');
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

// Page About
router.post('/createBot', function(req, res) {
  console.log('ah j\'ai reçu', req.body.nom)
  // res.cookie('', newUser.name)
  //res.render('../../views/pages/index.ejs', {mot: req.cookies['dataUser'], bot :"ok"});
  res.send(req.body.nom);
});



module.exports = router;
