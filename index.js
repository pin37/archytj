var express = require('express');
var request = require('request');
var app = express();
request('https://api.tjournal.ru/2.3/club?count=30&sortMode=recent', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var news = JSON.parse(body);
    app.post('/', function (req, res) {
      var card = {
        "elementName": "Result",
        "children": [
          {
            "elementName": "Cards",
            "children": [
              {
                "elementName": "Card",
                "attributes": {
                  "uri": "https://tjournal.ru/40276-francuzskii-videohosting-dailymotion-soobshil-o-planah-izbezhat-blokirovki-v-rossii",
                  "timestamp": 1485373987,
                  "pushNotification": {
                    "title": "TJ",
                    "subtitle": "Французский видеохостинг Dailymotion сообщил о планах избежать блокировки в России"
                  },
                  "id": 40276,
                  "fullWidth": false
                }
                "children": [
                  {
                    "elementName": "CardHeader",
                    "attributes": {
                      "title": "Французский видеохостинг Dailymotion сообщил о планах избежать блокировки в России",
                      "subtitle": "Wed, 25 Jan 2017"
                    }
                  },
                  {
                    "elementName": "CardBodyText",
                    "attributes": {
                      "text": "Представители Dailymotion заявили, что компания не знает о блокировке в России и планирует её избежать. Ранее Мосгорсуд постановил «навечно» заблокировать сервис в России за нелегальное распространение нескольких шоу телеканала «Пятница!». Об этом сообщают «Ведомости»."
                    }
                  },
                  {
                    "elementName": "CardImage",
                    "attributes": {
                      "width": 12,
                      "uri": "https://static30.cmtt.ru/club/1b/26/35/580d7b5ef08d4e.png",
                      //"hidpiUri": "…",
                      "height": 12
                    }
                  },
                  {
                    "elementName": "CardFooter",
                    "attributes": {
                      "labels": [
                        {
                          "name": "13",
                          "color": "#42a5f5"
                        }
                      ],
                      "footnote": "Roman Persianinov"
                    }
                  }
                ]
              }
            ]
          }
        ]
      };
      res.json(card);
    });
  }
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000');
});
