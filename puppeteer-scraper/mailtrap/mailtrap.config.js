const { MailtrapClient } = require("mailtrap");
const dotenv = require("dotenv");

dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;

const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});


const sender = {
	email: "hello@demomailtrap.com",
	name: "Tuan test",
};
module.exports = {mailtrapClient, sender}
// const recipients = [
//   {
//     email: "chubetudo@gmail.com",
//   }
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