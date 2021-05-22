const express = require('express');
const app = express();

let port;

if (process.env.PORT !== undefined) {
    port = process.env.PORT;
} else {
    port = 3001;
}

app.use(express.static('public'));

app.listen(port, (err, data) => {
    console.log(`bot is listening on port ${port}! ${err}`);
});