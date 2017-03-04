const striptags = require('striptags'),
  fetch = require('node-fetch'),
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
    .then(json => makeResponse(json, response, page, type));
}

function makeResponse(json, response, page, type) {
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

  for (let article of json) {
    if (type !== 0 && type !== 5) {
      article.type = 0;
    }
    result.children[0].children.push(toCard(article));
  }
  response.json(result);
}

function toCard(article) {
  // header
  const title = article.title,
    type = article.type;
  const header = utils.createElement('CardHeader', { title });
  if (type === 4) {
    header.attributes.subtitle = 'Article';
  } else if (type === 3) {
    header.attributes.subtitle = 'Video';
  } else if (type === 2) {
    header.attributes.subtitle = 'Off topic';
  } else if (type === 1) {
    header.attributes.subtitle = 'News';
  }

  // author
  const userDevice = article.userDevice;
  let device = 'desktop';
  if (userDevice === 2) {
    device = 'apple';
  } else if (userDevice === 3) {
    device = 'android';
  }
  const timestamp = new Date(article.date * 1000);
  const authorAttributes = {
    imageUrl: article.publicAuthor.profile_image_url,
    // iconName: device,
    color: '#bdbdbd',
    created: {
      by: article.publicAuthor.name,
      at: timestamp
    }
  };
  const author = utils.createElement('Media', authorAttributes);

  // text
  const text = utils.createElement('CardBodyText', { text: striptags(article.intro) });

  // image
  let image = null;
  const cover = article.cover;
  if (cover && cover.size) {
    const imageAttributes = {
      width: cover.size.width,
      height: cover.size.height,
      uri: cover.thumbnailUrl
    }
    image = utils.createElement('CardImage', imageAttributes);
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
      }, {
        name: '👁' + article.hits,
        color: 'ffffff'
      }, {
        name: '💬' + article.commentsCount,
        color: 'ffffff'
      }
    ]
  };
  const isPopular = article.isReadMore;
  if (isPopular) {
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
  const footer = utils.createElement('CardFooter', footerAttributes);

  // card
  const articleId = article.id;
  const cardAttributes = {
    id: articleId,
    // uri: article.url,
    linkTo: {
      address: "@pin37/tj/story",
      args: {
        id: articleId
      }
    },
    timestamp
  };
  if (isPopular) {
    cardAttributes.pushNotification = { title: 'TJ', subtitle: title };
  }
  const card = utils.createElement('Card', cardAttributes, [header, author, text, footer]);
  if (image) {
    card.children.splice(3, 0, image);
  } 
  return card;
}

exports.sendRequest = sendRequest;