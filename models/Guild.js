const mongoose = require('mongoose')

const GuildSchema = new mongoose.Schema({
  _id: String,
  prefix: String,
  notificationChannelId: String,
  cronSchedule: String,
});

const Guild = mongoose.model('Guild', GuildSchema)

module.exports = Guild;
