var argv = require('optimist').argv
const express = require('express');
const app = express();

let port;

if (process.env.PORT !== undefined) {
    port = process.env.PORT;
} else {
    port = argv._[0];
}

app.use(express.static('public'));

app.listen(port, (err, data) => {
    console.log('->',argv._[0]);
    console.log(`bot is listening on port ${port}! ${err}`);
});