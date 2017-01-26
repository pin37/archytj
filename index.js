var express = require('express');
var request = require('request');
var app = express();

function toFormatDate(timestamp) {
   var date = new Date(timestamp);
   var difference = new Date() - date;
   console.log();
}

function toCard(article) {
  var card = {
    'elementName': 'Card',
    'attributes': {},
    'children': []
  };
  card.attributes.id = article.id;
  card.attributes.uri = article.url;
  var timestamp = article.date;
  card.attributes.timestamp = timestamp;
  card.attributes.pushNotification.title = 'TJ';
  var title = article.title;
  card.attributes.pushNotification.subtitle = title;
  var cardHeader = {
    'elementName': 'CardHeader',
    'attributes': {}
  };
  cardHeader.title = title;

}

request('https://api.tjournal.ru/2.3/club?count=50&sortMode=recent', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var articles = JSON.parse(body);
    var cards = {
      'elementName': 'Result',
      'children': [
        {
          'elementName': 'Cards',
          'children': []
        }
      ]
    }

    
    app.post('/', function (req, res) {
      var card = {
        'elementName': 'Result',
        'children': [
          {
            'elementName': 'Cards',
            'children': [
              {
                'elementName': 'Card',
                'attributes': {
                  'uri': 'https://tjournal.ru/40276-francuzskii-videohosting-dailymotion-soobshil-o-planah-izbezhat-blokirovki-v-rossii',
                  'timestamp': 1485373987,
                  'pushNotification': {
                    'title': 'TJ',
                    'subtitle': 'Французский видеохостинг Dailymotion сообщил о планах избежать блокировки в России'
                  },
                  'id': 40276
                },
                'children': [
                  {
                    'elementName': 'CardHeader',
                    'attributes': {
                      'title': 'Французский видеохостинг Dailymotion сообщил о планах избежать блокировки в России',
                      'subtitle': 'Wed, 25 Jan 2017'
                    }
                  },
                  {
                    'elementName': 'CardBodyText',
                    'attributes': {
                      'text': 'Представители Dailymotion заявили, что компания не знает о блокировке в России и планирует её избежать. Ранее Мосгорсуд постановил «навечно» заблокировать сервис в России за нелегальное распространение нескольких шоу телеканала «Пятница!». Об этом сообщают «Ведомости».'
                    }
                  },
                  {
                    'elementName': 'CardImage',
                    'attributes': {
                      'width': 12,
                      'uri': 'https://static30.cmtt.ru/club/1b/26/35/580d7b5ef08d4e.png',
                      //'hidpiUri': '…',
                      'height': 12
                    }
                  },
                  {
                    'elementName': 'CardFooter',
                    'attributes': {
                      'labels': [
                        {
                          'name': '13',
                          'color': '#42a5f5'
                        }
                      ],
                      'footnote': 'Roman Persianinov'
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
