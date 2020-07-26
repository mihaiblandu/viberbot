const { request } = require('express');

const ViberBot = require('viber-bot').Bot,
  BotEvents = require('viber-bot').Events,
  TextMessage = require('viber-bot').Message.Text,
  express = require('express');
const app = express();
require("dotenv").config();




if (!process.env.BOT_ACCOUNT_TOKEN) {
  console.log('Could not find bot account token key.');
  return;
}

if (!process.env.EXPOSE_URL) {
  console.log('Could not find exposing url');
  return;
}

const bot = new ViberBot({
  authToken: process.env.BOT_ACCOUNT_TOKEN,
  name: "Mihai Robot",
  avatar: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Katze_weiss.png"
});


bot.on(BotEvents.SUBSCRIBED, request=>{
    console.log(request)
},response => {
  response.send(new TextMessage(`Salut ${response.userProfile.name}. Eu sunt robot ${bot.name}! Poti sa intrebi.`));
});
bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
  response.send(new TextMessage(`Salut.`));
});
// A simple regular expression to answer messages in the form of 'hi' and 'hello'.
bot.onTextMessage(/^buna| salut$/i, (message, response) =>{

  console.log(response.userProfile)
  return response.send(new TextMessage(`Salut ${response.userProfile.name}.`));
});

app.get('/',(req, res, next)=>{
       bot.sendMessage({"id" : "BwdKeDsQ7M204y7IKY21lw=="}, new TextMessage("Message"));

       return res.send("OK")
      }); 
app.post('/',(req, res, next)=>{

  console.log("Fire")
  var body = []
  req.on("data", (data) => {
    console.log(data)
    body.push(data)
  });

  req.on("end", () => {
    parsedBody = Buffer.concat(body).toString();
     message = JSON.parse(parsedBody);
     console.log(message)
     bot.sendMessage({"id" : "Xaq35nnmKhkPmQKp62KO6g=="}, new TextMessage(message.text));

     return res.send(parsedBody)
});
/* 
  req.on("data", (data) => {
    body.push(data);});
  req.on("end", () => {
      parsedBody = Buffer.concat(body).toString();
       message = JSON.parse(parsedBody);
       console.log(message)
       bot.sendMessage({"id" : "BwdKeDsQ7M204y7IKY21lw=="}, new TextMessage(message.text));
       return res.send(parsedBody)
  }); */
}); 

const port = process.env.PORT || 3001;
const eurekaHelper = require('./eureka-helper');
eurekaHelper.registerWithEureka('user-service', port);

app.use("/viber/webhook", bot.middleware());
app.listen(port, () => {
  console.log(`Application running on port: ${port}`);
  bot.setWebhook(`${process.env.EXPOSE_URL}/viber/webhook`).catch(error => {
    console.log('Can not set webhook on following server. Is it running?');
    console.error(error);
    process.exit(1);
  });
});