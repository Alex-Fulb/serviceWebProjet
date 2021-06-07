//====================================================
// Import
//====================================================

//====================================================
// Imported In
//====================================================

//====================================================
// Define
//====================================================

let bot = new RiveScript();

//TODO brains doit récupérer la valeur dans la bdd
const brains =
    [
        './brains/brain.rive'
    ];
bot.loadFile(brains).then(botReady).catch(botNotReady);

const message_container = document.querySelector('.messages');
const form = document.querySelector('form');
const input_box = document.querySelector('input');

//====================================================
// Functions
//====================================================

form.addEventListener('submit', (e) => {
    e.preventDefault();
    selfReply(input_box.value);
    input_box.value = '';
});

function botReply(message) {
    message_container.innerHTML += `<div class=bot>${message}</div>`;
    location.href = '#edge';
}

function selfReply(message) {
    message_container.innerHTML += `<div class=self>${message}</div>`;
    location.href = '#edge';

    bot.reply("local - user", message).then(function (reply) {
        botReply(reply);
    });
}

function loadBrains(pathToRive) {
    bot.loadFile(pathToRive).then(botReady).catch(botNotReady);
}

function botReady() {
    bot.sortReplies();
    botReply('Hello');
}

function botNotReady(err) {
    console.log("An error has occurred.", err);
}

//====================================================
// Routes
//====================================================

//====================================================
// Export
//====================================================

//====================================================
// End
//====================================================