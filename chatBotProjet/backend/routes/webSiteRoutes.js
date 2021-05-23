const express = require('express');
const router = express.Router();


// --------- GET -----------

// Home page
router.get('/', function(req, res) {
  if (req.cookies['dataUser']=== undefined) res.redirect('/') 
  else res.render('../../views/pages/index.ejs', {name: req.cookies['dataUser']});
});

// Page About
router.get('/about', function(req, res) {
  // if (req.cookies['dataUser']=== undefined) res.redirect('/')
  // else 
  res.render('../../views/pages/about.ejs');
});

// Deconnexion
router.get('/disconnect', function(req, res) {
  if (req.cookies['dataUser']=== undefined) res.redirect('/')
  else {
    res.clearCookie('dataUser')
    res.redirect('/')
  }
});




module.exports = router;
