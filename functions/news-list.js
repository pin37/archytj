const fetch = require('node-fetch'),
  buildUrl = require('build-url'),
  utils = require('./utils'),
  limit = 25;

function sendRequest(request, response) {
  const requestUrl = request.url;
  let type = 0;
  if (requestUrl.includes('news')) {
    type = 1;
  } else if (requestUrl.includes('offtop')) {
    type = 2;
  } else if (requestUrl.includes('videos')) {
    type = 3;
  } else if (requestUrl.includes('offtop')) {
    type = 4;
  }
  let sortMode = 'recent';
  if (requestUrl.includes('editorial')) {
    sortMode = 'editorial';
  } else if (requestUrl.includes('week')) {
    sortMode = 'week';
  }
  if (!request.body.payload) {
    request.body.payload = {};
  }
  const page = request.body.payload.nextResultCursor || { after: 0, limit: limit };
  const responseUrl = buildUrl('https://api.tjournal.ru', {
    path: '2.3/club',
    queryParams: {
      count: page.limit,
      offset: page.after,
      sortMode,
      type
    }
  });
  if (sortMode !== 'recent') {
    type = 5;
  }
  fetch(responseUrl).then(res => res.json())
    .then(news => makeResponse(news, response, page, type));
}

function makeResponse(news, response, page, type) {
  page.after += limit;
  const cards = utils.createElement('Cards', null, []);
  const resultAttributes = {
    links: utils.filters,
    nextResultCursor: page
  };
  if (type === 0) {
    resultAttributes.meta = { title: 'TJ' };
  }
  const result = utils.createElement('Result', resultAttributes, [cards]);

  for (let article of news) {
    if (type !== 0 && type !== 5) {
      article.type = 0;
    }
    cards.children.push(toCard(article));
  }
  response.json(result);
}

function toCard(article) {
  // card
  const articleId = article.id;
  const timestamp = new Date(article.date * 1000);
  const cardAttributes = {
    id: articleId,
    linkTo: {
      address: "@pin37/tj/story",
      args: {
        id: articleId
      }
    },
    timestamp
  };
  if (article.isReadMore) {
    cardAttributes.pushNotification = { title: 'TJ', subtitle: article.title };
  }
  const card = utils.createElement('Card', cardAttributes, []);

  // header
  const header = utils.getCardHeader(article);

  // author
  const userDevice = article.userDevice;
  let device = 'desktop';
  if (userDevice === 2) {
    device = 'apple';
  } else if (userDevice === 3) {
    device = 'android';
  }
  const authorAttributes = {
    imageUrl: article.publicAuthor.profile_image_url,
    // iconName: device,
    color: 'bdbdbd',
    created: {
      by: article.publicAuthor.name,
      at: timestamp
    }
  };
  const author = utils.createElement('Media', authorAttributes);

  // text
  const text = utils.getTextElement(article.intro);
  card.children.push(header, author, text);

  // image
  const cover = article.cover;
  if (cover && cover.size) {
    const imageAttributes = {
      width: cover.size.width,
      height: cover.size.height,
      uri: cover.thumbnailUrl
    }
    const image = utils.createElement('CardImage', imageAttributes);
    card.children.push(image);
  }

  // footer
  const footer = utils.getCardFooter(article);
  card.children.push(footer);
  return card;
}

module.exports = sendRequest;