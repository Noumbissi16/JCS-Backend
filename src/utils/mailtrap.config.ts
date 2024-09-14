// const { MailtrapClient } = require("mailtrap");
import { MailtrapClient } from "mailtrap";

import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.MAILTRAP_API_KEY;
if (!TOKEN) {
  throw new Error(
    "Mailtrap token not found, please provide one in your environment variables as MAILTRAP_API_KEY"
  );
}

const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Noumbissi Stael",
};
// const recipients = [
//   {
//     email: "noumbissistael@gmail.com",
//   },
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);

export { mailtrapClient, sender };
