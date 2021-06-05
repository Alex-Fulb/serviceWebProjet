var RiveScript = require('rivescript');
var argv = require('optimist').argv
let bot = new RiveScript();

const brains = ['./brain.rive'];



function botReady() {
  bot.sortReplies();
  // botReply('Hello');
}
function botNotReady(err) {
  console.log('An error has occurred.', err);
}
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => {
  // Bot Rivescript
  console.log(`${argv._[0]} a bien ete transféré sur discord !`);
  bot.loadFile(brains).then(botReady).catch(botNotReady);
  // Le Username correspondra au nom du bot selectionné
  console.log(`argv._[0]`, argv._[0])
});

function loadBrains() {
  bot.loadFile('./brain2.rive').then(botReady).catch(botNotReady);
}


client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  //for dialogue
  const command = message.content.slice(prefix.length)
  //for special command
  const args = message.content.slice(prefix.length).trim().split(' ');
  const specialCommandToken = args.shift().toLowerCase();
  const specialCommand =  args.shift();
  try {
    //si commande spéciale
    if (specialCommandToken === 'sc') {
      message.channel.send(`**Special command** called:\n**Command**: ${specialCommand}\n**Arguments**: ${args}`);
      switch (specialCommand)
      {
        case 'load' :
          loadBrains()
          break;
        default :
          message.channel.send('Special command not recognize')
      }

    }

    //sinon dialogue
    else {
      bot.reply('local - user', command).then(function (reply) {
        console.log(`reply`, reply)
        message.reply(`**${argv._[0]}** : ${reply}`);
        if (command === 'disconnect') {
          client.destroy();
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
})

client.login(token);