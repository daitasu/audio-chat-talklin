const accessToken = "<your api access token>";
const baseUrl = "https://api.api.ai/v1/";
let i = 0;

$(document).ready(function() {
  $("#input").keypress(function(event) {
    if (event.which === 13) {
      event.preventDefault();
      send();
    }
  });
  $("#rec").click(function(event) {
    switchRecognition();
  });
});
let recognition;
function startRecognition() {
  recognition = new webkitSpeechRecognition();
  recognition.onstart = function(event) {
    updateRec();
  };
  recognition.onresult = function(event) {
    let text = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      text += event.results[i][0].transcript;
    }
    setInput(text);
    stopRecognition();
  };
  recognition.onend = function() {
    stopRecognition();
  };
  recognition.lang = "en-US";
  recognition.start();
}

function stopRecognition() {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
  updateRec();
}
function switchRecognition() {
  if (recognition) {
    stopRecognition();
  } else {
    startRecognition();
  }
}
function setInput(text) {
  $("#input").val(text);
  send();
}
function updateRec() {
  $("#rec").text(recognition ? "とめる" : "はなす");
}
function send() {
  let text = $("#input").val();
  $("#input").val('');
  var response = $('#response');
  response.append('' +
    '<div class="kaiwa" id="question">' +
    '<figure class="kaiwa-img-right">' +
    '<img src="/assets/Q_icon.png" alt="no-img2">' +
    '<figcaption class="kaiwa-img-description">' +
    'しつもん' +
    '</figcaption>' +
    '</figure>' +
    '<div class="kaiwa-text-left">' +
    '<p class="kaiwa-text">' +
    text +
    '</p>' +
    '</div>' +
    '</div>');

  $.ajax({
    type: "POST",
    url: baseUrl + "query?v=20150910",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      "Authorization": "Bearer " + accessToken
    },
    data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
    success: function(data) {
      let responseMessage = data.result.fulfillment.speech;
      setResponse(responseMessage);
    },
    error: function() {
      setResponse("Internal Server Error");
    }
  });
}
function setResponse(val) {
  $.ajax({
    type: "POST",
    url: "/audio-response",
    data: {"text": val, "speaker": "HIKARI", "user": "kawauso"}
  }).then(function (result){
    i++;
    audio = new Audio(`//localhost:8080/assets/kawauso.wav?ver=${i}`);
    audio.play();
    delete audio;
  });

  let response = $('#response');
  response.append('' +
    '<div class="kaiwa" id="answer">' +
    '<figure class="kaiwa-img-left">' +
    '<img src="/assets/kawauso.jpg" alt="no-img2">' +
    '<figcaption class="kaiwa-img-description">' +
    'カワウソちゃん' +
    '</figcaption>' +
    '</figure>' +
    '<div class="kaiwa-text-right">' +
    '<p class="kaiwa-text">' +
    val +
    '</p>' +
    '</div>' +
    '</div>');
  response = document.getElementById('response');
  if(!response) return;
  response.scrollTop = response.scrollHeight;
}