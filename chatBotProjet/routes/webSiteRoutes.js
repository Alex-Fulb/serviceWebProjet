const express = require('express');
const router = express.Router();
const fs = require('fs');
var ps = require('ps-node');
// Include process module
const process = require('process');
const { spawn, exec } = require('child_process');
const mongoose = require('mongoose');
let Bot = require('../model/botModel')
let User = require('../model/userModel');



// ==================================== GET
// ============================================

// Home page
router.get('/', async function (req, res) {
  console.log(`Données de l'utilisateur`, req.cookies['dataUser'])
  if (req.cookies['dataUser'] === undefined) {
    res.redirect('/')
  }
  else {
    const newUser = await User.findOne({ email: req.cookies['dataUser'].email });
    const dataBots = newUser.bots
    console.log(`dataBots`, dataBots);
    var listsBots = [];
    for (var i = 0; i < dataBots.length; i++) {
      // Recup chaque bot :
      const bot = await Bot.findOne(
        { _id: dataBots[i].id_Bot },
        async (err, doc) => { console.log(`doc`, doc) })
      listsBots[i] = bot
    }
    console.log(`listBots`, listsBots);
    res.render('../views/pages/index.ejs', { bots: listsBots });
  }
});

// Page About -> Pas utile pour le moment ..
router.get('/about', function (req, res) {
  if (req.cookies['dataUser'] === undefined)
    res.redirect('/')
  else res.render('../views/pages/about.ejs');
});

// Deconnexion
router.get('/disconnect', function (req, res) {
  if (req.cookies['dataUser'] === undefined)
    res.redirect('/')
  else {
    res.clearCookie('dataUser')
    res.redirect('/')
  }
});

// FAQ
router.get('/faq', function (req, res) {
  if (req.cookies['dataUser'] === undefined)
    res.redirect('/')
  else res.render('../views/pages/faq.ejs');
});


// ==================================== POST
// ============================================


// CREATION DU BOT
router.post('/createBot', async function (req, res) {
  Bot.create(
    { name: req.body.nom, owner: req.cookies['dataUser'].id },

    async function (err, doc) {
      const idBot = doc._id;
      const filter = { _id: req.cookies['dataUser'].id };
      const update = {
        $push: { bots: { id_Bot: idBot, name: req.body.nom, port: doc.port } }
      };

      User.findOneAndUpdate(filter, update, { new: true }, async (err, doc) => {
        const newUser =
          await User.findOne({ email: req.cookies['dataUser'].email });
        const dataBots = newUser.bots;
        for (var i = 0; i < dataBots.length; i++) {
          if (i === dataBots.length - 1) {
            bot = dataBots[i];
          }
        }
        const newBot = await Bot.findOne({ _id: idBot });
        console.log(`NEW BOT ---->`, bot);
        res.send(newBot);
        if (err) {
          console.log('Something wrong when updating data!');
        }
      });
    })
});


// SUPRESSION D'UN BOT
router.post('/deleteBot', async function (req, res) {
  const idBotToDelete = req.body.idBot
  const filter = { _id: req.cookies['dataUser'].id };
  const update = {
    $pull: { bots: { id_Bot: mongoose.Types.ObjectId(idBotToDelete) } }
  };

  User.updateOne(filter, update, (err, user) => {
    console.log(`user après update`, user)
    if (err) {
      console.log(`err`, err)
    }
  })

  Bot.findByIdAndRemove({ _id: idBotToDelete }, async (err, doc) => {
    const botSupp = { idBot: doc._id, name: doc.name };
    res.send(botSupp);
    if (err) {
      console.log('Something wrong when updating data!');
    }
  })
});


// DEMARRER LE BOT SUR SON PORT
router.post('/bot', async (req, res) => {
  const { idBot, nameBot } = req.body;
  console.log(`req.body`, req.body);

  const bot = await Bot.findOne({ _id: idBot }, async (err, doc) => {
    const bot = doc;
    console.log(`bot`, bot);
    const portBot = doc.port;

    const child = spawn(
      'cp',
      [
        '-R', './templateBot/defaultBot', './bots/' + nameBot, ';', 'node',
        './bots/' + nameBot + '/template.js', portBot
      ],

      {
        shell: true,
        detached: true,
      });

    child.stdout.on('data', (data) => { console.log(`stdout: ${data}`) })
    child.stderr.on('data', (data) => { console.log(`stderr: ${data}`) })
    child.unref();

    // Update statut de connexion sur le port :
    Bot.updateOne({ _id: idBot }, { '$set': { 'inListening': true } }, async () => {
      const bot = await Bot.findOne({ _id: idBot });
      res.send(bot);
    });
  });

  // res.send(bot);
});


// DECONNECTER LE BOT DE SON PORT

router.post('/disconnectBotPort', async (req, res) => {
  console.log('j\'ai reçu:', req.body);
  const { idBot, nameBot, portBot } = req.body;
  console.log(`portBot coté serveur =>`, portBot);


  ps.lookup({ command: 'node', psargs: 'ux' }, function (err, resultList) {
    if (err) {
      throw new Error(err);
    }
    resultList.forEach(async function (process) {
      if (process) {
        console.log(
          'PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command,
          process.arguments);
        for (var i = 0; i < process.arguments.length; i++) {
          if (process.arguments[i] === portBot) {
            console.log('ALORS ?', process.arguments[i]);
            // Update statut de connexion sur le port:
            Bot.updateOne(
              { _id: idBot }, { '$set': { 'inListening': false } },
              async () => {
                const bot = await Bot.findOne({ _id: idBot });
                res.send(bot);
              }).catch(err => res.status(422).json(err));
            exec(`kill ${process.pid}`, async (error, stdout, stderr) => {
              if (error) {
                console.error(`execccccc error: ${error}`);
                return;
              } else {
                console.log('processus kill');
              }
            });
          }
        }
      }
    });
  });
})


// DEMARRER LE BOT SUR DISCORD
router.post('/coBotDiscord', async (req, res) => {
  const { idBot, nameBot } = req.body;

  console.log(`idBot`, idBot);
  // Update statut de connexion :
  Bot.updateOne({ _id: idBot }, { '$set': { 'discord': true } }, async () => {
    exec(
      `cd templateBot/discordConfigurationBot/ ; node index.js ${nameBot}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });
    const bot = await Bot.findOne({ _id: idBot });
    res.send(bot);
  });
});


// DECONNECTER LE BOT DE DISCORD
router.post('/disconnectBotDiscord', async (req, res) => {
  const { idBot, nameBot } = req.body;
  console.log(`req.body`, req.body);
  ps.lookup({ command: 'node', psargs: 'ux' }, function (err, resultList) {
    if (err) {
      throw new Error(err);
    }
    resultList.forEach(async function (process) {
      if (process) {
        // console.log(
        //     'PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid,
        //     process.command, process.arguments);
        for (var i = 0; i < process.arguments.length; i++) {
          if (process.arguments[i] === nameBot) {
            console.log('ALORS ?', process.arguments[i]);
            // Update statut de connexion :
            Bot.updateOne(
              { _id: idBot }, { '$set': { 'discord': false } },
              async () => {
                const bot = await Bot.findOne({ _id: idBot });
                res.send(bot);
              })
              .catch(err => res.status(422).json(err));
            exec(`kill ${process.pid}`, async (error, stdout, stderr) => {
              if (error) {
                console.error(`execccccc error: ${error}`);
                return;
              } else {
                console.log('processus kill');
              }
            });
          }
        }
      }
    });
  });
});



module.exports = router;
