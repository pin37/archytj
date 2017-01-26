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
                  "uri": "https://tjournal.ru/40280-v-omske-iz-myortvogo-kota-sdelali-pamyatnik-zime-simvoliziruushii-ubiistvennii-holod",
                  "timestamp": 1485403283,
                  "pushNotification": {
                    "title": "TJ",
                    "subtitle": "В Омске из мёртвого кота сделали «памятник зиме», символизирующий убийственный холод"
                  },
                  "id": 40280,
                  "children": [
                    {
                      "elementName": "CardHeader",
                      "attributes": {
                        "title": "В Омске из мёртвого кота сделали «памятник зиме», символизирующий убийственный холод"
                      }
                    }
                  ]
                }
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
