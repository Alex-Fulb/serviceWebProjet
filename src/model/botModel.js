const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

const Schema = mongoose.Schema;

const botSchema = new Schema({
  name: { type: String, required: true },
  port: { type: String, required: true, default: 3000, unique: true },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user"
  }
});

autoIncrement.initialize(mongoose.connection);

botSchema.plugin(autoIncrement.plugin, {
  model: 'botSchema',
  field: 'port',
  startAt: 3000,
  incrementBy: 1
})

module.exports = mongoose.model('bot', botSchema);

