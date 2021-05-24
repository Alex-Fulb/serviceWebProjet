const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const botSchema = new Schema({
    name: { type: String, required: true },
    port: { type: String, required: true },
    owner: { 
        type: Schema.Types.ObjectId ,
        ref: "user"
    }
});

module.exports = mongoose.model('bot', botSchema);