const express = require("express");
const bodyParser = require('body-parser');
const VoiceText = require('voicetext');
const voice = new VoiceText("qcvytqvt6k1q9w9w");
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get("/", function(req, res){
  res.render("talklin", {
    title: 'カワウソちゃんと話そう',
  });
});

app.post('/audio-response', function(req, res) {
  const message = req.body.text;
  const user = req.body.user;
  const speaker = req.body.speaker;
  voice.speaker(voice.SPEAKER[speaker]).speak(message, function(error, buf) {
    if (error) {
      console.error(error);
    }
    fs.writeFile(`./public/assets/${user}.wav`, buf, 'binary', function(error) {
      if (error) {
        console.error(error);
      }
      res.send();
    });
  })
});

const server = app.listen(8080, function(){
  console.log("Node.js is listening to PORT:" + server.address().port);
});