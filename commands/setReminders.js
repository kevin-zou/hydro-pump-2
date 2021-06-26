const config = require('../config');
const Guild = require('../models/Guild');
const Helpers = require ('../helpers');

module.exports = {
  name: 'setReminders',
  description: 'User command to set channel for bot to regularly notify',
  async execute(msg, args) {
    // TODO: add validation for arguments
    const notificationChannelId = args[0].replace(/[^0-9]/g, '');
    var cronSchedule = '';

    switch(args[1]) {
      case 'hourly':
        cronSchedule = '0 0 * * * *';
        break;
      case 'daily':
        cronSchedule = '0 0 14 * * *';
        break;
      case 'dev':
        cronSchedule = '* * * * *';
    }

    // Update the database
    await Guild.findByIdAndUpdate(msg.guild.id, {
      cronSchedule: cronSchedule,
      notificationChannelId: notificationChannelId,
    }, async (err, guild) => {
      if (err) {
        console.error(err);
      }
      if (!guild) {
        await Guild.create({
          _id: msg.guild.id,
          cronSchedule: cronSchedule,
          notificationChannelId: notificationChannelId,
        });
      }
    });

    // Update local config
    config.guilds[msg.guild.id] = config.guilds[msg.guild.id] || {};
    config.guilds[msg.guild.id].notificationChannelId = notificationChannelId;
    config.guilds[msg.guild.id].cronSchedule = cronSchedule;

    Helpers.startCronJob(msg.client, msg.guild.id, notificationChannelId, cronSchedule);

    msg.channel.send(`Notification channel set to ${args[0]}, with ${args[1]} reminders!`);
  },
};
