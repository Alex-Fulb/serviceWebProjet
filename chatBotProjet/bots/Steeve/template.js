var argv = require('optimist').argv
const express = require('express');
const app = express();

let port;

port = argv._[0]

app.use(express.static(__dirname + '/public'));


app.listen(argv._[0], (err, data) => {
    console.log('->',argv._[0]);
    console.log(`bot is listening on port ${port}!`);
});