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
const {prefix, token} = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => {
  // Bot Rivescript
  console.log(`${argv._[0]} a bien ete transféré sur discord !`);
  bot.loadFile(brains).then(botReady).catch(botNotReady);
  // Le Username correspondra au nom du bot selectionné
  console.log(`argv._[0]`, argv._[0])
});



client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  try {
    bot.reply('local - user', command).then(function(reply) {
      console.log(`reply`, reply)
      message.reply(`**${argv._[0]}** : ${reply}`);
      if (command === 'disconnect') {
        message.channel.send('Good bye !').then(m => {
          client.destroy();
        })
      }
    });
  } catch (error) {
    console.error(error);
  }
})

client.login(token);