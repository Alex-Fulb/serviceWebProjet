//====================================================
// Imported In
//====================================================

// faqbot.ejs

//====================================================
// Define
//====================================================


let bot = new RiveScript();

const message_container = document.querySelector('.messages');
const form = document.querySelector('form');
const input_box = document.getElementById("inputChat");

var lang = "eng";

//====================================================
// Functions
//====================================================

window.onload = function () {
  bot.loadFile("/brains/faqbrain_eng.rive").then(botReady).catch(botNotReady);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  selfReply(input_box.value);
  input_box.value = '';
});

function loadBrains(pathToRive) {
  bot.loadFile(pathToRive).then(botReady).catch(botNotReady);
}

function changeBrain(choice) {
  bot = new RiveScript;
  lang = choice;
  switch (lang) {

    case "eng":
      bot.loadFile("/brains/faqbrain_eng.rive").then(botReady).catch(botNotReady);
      break;
    case "fr":
      bot.loadFile("/brains/faqbrain_fr.rive").then(botReady).catch(botNotReady);
      break;
    case "spa":
      bot.loadFile("/brains/faqbrain_spa.rive").then(botReady).catch(botNotReady);
      break;
  }
}
//
function botReply(message) {
  message_container.innerHTML += `<div class="bot">${message}</div>`;
  location.href = '#edge';
}

function selfReply(message) {
  message_container.innerHTML += `<div class="self">${message}</div>`;
  location.href = '#edge';

  bot.reply("local-user", message).then(function (reply) {
    botReply(reply);
  });
}

function botReady() {

  bot.sortReplies();

  switch (lang) {

    case "eng":
      botReply('Hello');
      break;
    case "fr":
      botReply('Bonjour');
      break;
    case "spa":
      botReply('Hola');
      break;
    default:
      botReply("An error has occurred. Please refresh the page. If the error persist contact an administrator.")
      break;
  }
}

function botNotReady(err) {
  console.log("An error has occurred.", err);
}

//====================================================
// End
//====================================================