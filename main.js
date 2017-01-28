const express = require('express'),
  bodyParser = require('body-parser'),
  fetch = require('node-fetch'),
  striptags = require('striptags'),
  app = express();
app.use(bodyParser.json());

const limit = 20;
let requestsCount = 0;
app.post('/archytj/', function (request, response) {
  console.log('Request #' + ++requestsCount + ' from user with id: ' + request.body.payload.user.id);
  let page = request.body.payload.nextResultCursor || { after: 0, limit: limit };
  fetch('https://api.tjournal.ru/2.3/club?count=' + page.limit + '&offset=' +
    page.after + '&sortMode=recent')
    .then(res => res.json())
    .then(json => makeResponse(json, response, page));
});

app.listen(3000, function () {
  console.log('Server is running...');
});

function makeResponse(json, response, page) {
  page.after += limit;
  let cards = createElement('Cards', null, []);
  let result = createElement('Result', { nextResultCursor: page }, [cards]);

  json.forEach(function(article, i, json) {
    result.children[0].children.push(toCard(article));
  });
  response.json(result);
}

function createElement(elementName, attributes, children) { 
  return {
    elementName: elementName,
    attributes: attributes,
    children: children
  };
};

function toCard(article) {
  // header
  const title = article.title,
    type = article.type;
  let category = 'News';
  if (type === 4) {
    category = 'Article';
  } else if (type === 3) {
    category = 'Video';
  } else if (type === 2) {
    category = 'Off topic';
  }
  const header = createElement('CardHeader', { title: title, subtitle: category });

  // author
  const userDevice = article.userDevice;
  let device = 'desktop';
  if (userDevice === 2) {
    device = 'apple';
  } else if (userDevice === 1) {
    device = 'android';
  }
  const timestamp = new Date(article.date * 1000);
  const authorAttributes = {
    imageUrl: article.publicAuthor.profile_image_url,
    iconName: device,
    created: {
      by: article.publicAuthor.name,
      at: timestamp
    },
    color: "#bdbdbd"
  };
  const author = createElement('Media', authorAttributes);

  // text
  const text = createElement('CardBodyText', { text: striptags(article.intro) });

  // image
  let image = null;
  const cover = article.cover;
  if (cover && cover.size) {
    const imageAttributes = {
      width: cover.size.width,
      height: cover.size.height,
      uri: cover.thumbnailUrl
    }
    image = createElement('CardImage', imageAttributes);
  }

  // footer
  const likesCount = article.likes.summ;
  let like = '—';
  if (likesCount > 0) {
    like = '👍+' + likesCount;
  } else if (likesCount < 0) {
    like = '👎' + likesCount;
  }
  const footerAttributes = {
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
  };
  if (article.isReadMore) {
    footerAttributes.labels.push(
      {
        name: '🔥hot',
        color: 'ffffff'
      });
  }
  if (article.isAdvertising) {
    footerAttributes.labels.push(
      {
        name: '💵ad',
        color: '#ffffff'
      });
  }
  let footer = createElement('CardFooter', footerAttributes);

  // card
  const cardAttributes = {
    id: article.id,
    uri: article.url,
    timestamp: timestamp,
    pushNotification: {
      title: 'TJ',
      subtitle: title
    } 
  };
  let card = createElement('Card', cardAttributes, [header, author, text, image, footer]);
  return card;
}