const config = require('../config');
const cron = require('node-cron');

module.exports = {
  name: 'setReminders',
  description: 'User command to set channel for bot to regularly notify',
  async execute(msg, args) {
    // TODO: add validation for arguments
    config.notificationChannelId = args[0].replace(/[^0-9]/g, '');
    switch(args[1]) {
      case 'hourly':
        config.cronSchedule = '0 0 * * * *';
        break;
      case 'daily':
        config.cronSchedule = '0 0 14 * * *';
    }
    msg.channel.send(`Notification channel set to ${args[0]}, with ${args[1]} reminders!`);

    // Schedule reminders to the channel
    let notificationChannel = await msg.client.channels.fetch(config.notificationChannelId);
    cron.schedule(config.cronSchedule, () => {
      notificationChannel.send('Remember to stay hydrated!');
    });
  },
};
