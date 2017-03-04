const striptags = require('striptags'),
  limit = 25,
  filters = [
    {
      address: '/',
      meta: {
        title: 'All',
        subscribe: true
      }
    }, {
      address: '/editorial',
      meta: {
        title: 'Editorial articles'
      }
    }, {
      address: '/week',
      meta: {
        title: 'Best of the week'
      }
    }, {
      address: '/articles',
      meta: {
        title: 'Articles'
      }
    }, {
      address: '/videos',
      meta: {
        title: 'Videos'
      }
    }, {
      address: '/offtop',
      meta: {
        title: 'Off topic'
      }
    }, {
      address: '/news',
      meta: {
        title: 'News'
      }
    }
  ];

function createElement(elementName, attributes, children) { 
  return {
    elementName,
    attributes,
    children
  };
}

function makeResponse(json, response, page, type) {
  page.after += limit;
  const cards = createElement('Cards', null, []);
  const resultAttributes = {
    links: filters,
    nextResultCursor: page
  };
  if (type === 0) {
    resultAttributes.meta = { title: 'TJ' };
  }
  const result = createElement('Result', resultAttributes, [cards]);

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
  const header = createElement('CardHeader', { title });
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
  const footer = createElement('CardFooter', footerAttributes);

  // card
  const cardAttributes = {
    id: article.id,
    uri: article.url,
    timestamp
  };
  if (isPopular) {
    cardAttributes.pushNotification = { title: 'TJ', subtitle: title };
  }
  const card = createElement('Card', cardAttributes, [header, author, text, footer]);
  if (image) {
    card.children.splice(3, 0, image);
  } 
  return card;
}

exports.limit = limit;
exports.makeResponse = makeResponse;