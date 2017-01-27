var express = require('express'),
  app = express(),
  fetch = require('node-fetch'),
  dateFns = require('date-fns'),
  striptags = require('striptags');

app.post('/', function (request, response) {
  fetch('https://api.tjournal.ru/2.3/club?count=15&sortMode=recent')
  .then(res => res.json())
  .then(json => makeResponse(json, response));
});

app.listen(3000, function () {
  console.log('Server is running...');
});

function makeResponse(json, response) {
  var cards = {
    'elementName': 'Result',
    'children': [
      {
        'elementName': 'Cards',
        'children': []
      }
    ]
  }

  json.forEach(function(article, i, json) {
    cards.children[0].children.push(toCard(article));
  });
  response.json(cards);
}

function toCard(article) {
  var card = {
    'elementName': 'Card',
    'attributes': {},
    'children': []
  },
  cardHeader = {
    'elementName': 'CardHeader',
    'attributes': {}
  },
  cardBodyText = {
    'elementName': 'CardHeader',
    'attributes': {}
  },
  cardFooter = {
    'elementName': 'CardFooter',
    'attributes': {}
  }
  timestamp = new Date(article.date * 1000),
  title = article.title;

  card.attributes.id = article.id;
  card.attributes.uri = article.url;
  card.attributes.timestamp = timestamp;
  card.attributes.pushNotification.title = 'TJ';
  card.attributes.pushNotification.subtitle = title;

  cardHeader.attributes.title = title;
  if (dateFns.differenceInDays(Date.now(), timestamp) > 7) {
    cardHeader.attributes.subtitle = dateFns.format(timestamp, 'DD.MM.YYYY');
  } else {
    var locale = require('date-fns/locale/ru');
    cardHeader.attributes.subtitle = dateFns.distanceInWordsToNow(timestamp, locale);
  }
  card.children.push(cardHeader);

  cardBodyText.attributes.text = striptags(article.intro);
  card.children.push(cardBodyText);

  var cover = article.cover;
  if (cover !== null) {
    var cardImage = {
      'elementName': 'CardImage',
      'attributes': {
        'width': 12,
        'height': 12
      }
    };
    cardImage.uri = article.cover.url;
    card.children.push(cardImage);
  }

  return card;
}