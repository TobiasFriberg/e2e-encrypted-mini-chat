import cron from 'node-cron';
import { purgeMessages } from './service/messageService';
import { purgeUsers } from './service/userService';

export default () => {
  const runJobs = async () => {
    setTimeout(async () => {
      allJobs();
    }, Math.floor(Math.random() * (60000 - 6000 + 1) + 6000));
  };

  const allJobs = async () => {
    try {
      await purgeMessages();
      await purgeUsers();
    } catch (e) {
      console.log(e);
    }
  };

  runJobs(); //Run cron job when server starts.

  cron.schedule(`*/5 * * * *`, async () => {
    await runJobs();
  });
};
