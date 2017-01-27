const express = require('express'),
  app = express(),
  fetch = require('node-fetch'),
  striptags = require('striptags');

let requestsCount = 0;
app.post('/', function (request, response) {
  console.log('Request from Archy.ai (' + ++requestsCount + ')');
  fetch('https://api.tjournal.ru/2.3/club?count=50&sortMode=recent')
  .then(res => res.json())
  .then(json => makeResponse(json, response));
});

app.listen(3000, function () {
  console.log('Server is running...');
});

function makeResponse(json, response) {
  let cards = {
    elementName: 'Result',
    children: [
      {
        elementName: 'Cards',
        children: []
      }
    ]
  };

  json.forEach(function(article, i, json) {
    cards.children[0].children.push(toCard(article));
  });
  response.json(cards);
}

function toCard(article) {
  const timestamp = new Date(article.date * 1000),
  title = article.title;

  let card = {
    elementName: 'Card',
    attributes: {
      id: article.id,
      uri: article.url,
      timestamp: timestamp,
      pushNotification: {
        title: 'TJ',
        subtitle: title
      } 
    },
    children: [
      {
        elementName: 'CardHeader',
        attributes: {
          title: title
        }
      },
      {
        elementName: 'Media',
        attributes: {
          imageUrl: article.publicAuthor.profile_image_url,
          iconName: "clock-o",
          created: {
            by: article.publicAuthor.name,
            at: timestamp
          },
          color: "#bdbdbd"
        }
      },
      {
        elementName: 'CardBodyText',
        attributes: {
          text: striptags(article.intro)
        }
      }
    ]
  };

  const cover = article.cover;
  if (cover && cover.size) {
    const cardImage = {
      elementName: 'CardImage',
      attributes: {
        width: cover.size.width,
        height: cover.size.height,
        uri: cover.thumbnailUrl
      }
    };
    card.children.push(cardImage);
  }

  const likesCount = article.likes.summ;
  let like = '—';
  if (likesCount > 0) {
    like = '👍' + likesCount;
  } else if (likesCount < 0) {
    like = '👎' + likesCount;
  }
  const footer = {
    elementName: 'CardFooter',
    attributes: {
      labels: [
        {
          name: like,
          color: 'ffffff'
        },
        {
          name: '👁' + article.hits,
          color: 'ffffff'
        },
        {
          name: '💬' + article.commentsCount,
          color: 'ffffff'
        }
      ]
    }
  }
  card.children.push(footer);
  return card;
}