const striptags = require('striptags'),
  fetch = require('node-fetch'),
  buildUrl = require('build-url'),
  utils = require('./utils');

function sendRequest(request, response) {
  if (!request.body.payload) {
    request.body.payload = {
      user: {
        id: null
      },
      args : {
        id: 41661
      }
    };
  }
  const entryId = request.body.payload.args.id;
  console.log('Open story #' + entryId + ' by user with id: ' + request.body.payload.user.id);
  const responseUrl = buildUrl('https://api.tjournal.ru', {
    path: '2.3/club/item',
    queryParams: {
      entryId
    }
  });
  fetch(responseUrl).then(res => res.json())
    .then(json => makeResponse(json, response));
}

function makeResponse(json, response) {
  const cards = utils.createElement('Cards', null, []);
  const resultAttributes = {
    meta: { title: 'TJ' },
    links: utils.filters
  };
  const result = utils.createElement('Result', resultAttributes, [cards]);
  result.children[0].children.push(toCard(json));
  response.json(result);
}

function toCard(story) {
  // header
  const title = story.title,
    type = story.type;
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
  const userDevice = story.userDevice;
  let device = 'desktop';
  if (userDevice === 2) {
    device = 'apple';
  } else if (userDevice === 3) {
    device = 'android';
  }
  const timestamp = new Date(story.date * 1000);
  const authorAttributes = {
    imageUrl: story.publicAuthor.profile_image_url,
    // iconName: device,
    color: '#bdbdbd',
    created: {
      by: story.publicAuthor.name,
      at: timestamp
    }
  };
  const author = utils.createElement('Media', authorAttributes);

  // intro
  const intro = utils.createElement('CardBodyText', { text: striptags(story.intro) });

  // image
  let image = null;
  const cover = story.cover;
  if (cover && cover.size) {
    const imageAttributes = {
      width: cover.size.width,
      height: cover.size.height,
      uri: cover.thumbnailUrl
    }
    image = utils.createElement('CardImage', imageAttributes);
  }

  // text
  const text = JSON.parse(story.entryJSON);

  // footer
  const likesCount = story.likes.summ;
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
        name: '👁' + story.hits,
        color: 'ffffff'
      }, {
        name: '💬' + story.commentsCount,
        color: 'ffffff'
      }
    ]
  };
  const isPopular = story.isReadMore;
  if (isPopular) {
    footerAttributes.labels.push(
      {
        name: '🔥hot',
        color: 'ffffff'
      });
  }
  if (story.isAdvertising) {
    footerAttributes.labels.push(
      {
        name: '💵ad',
        color: '#ffffff'
      });
  }
  const footer = utils.createElement('CardFooter', footerAttributes);

  // card
  const cardAttributes = {
    id: story.id,
    fullWidth: true,
    timestamp
  };
  if (isPopular) {
    cardAttributes.pushNotification = { title: 'TJ', subtitle: title };
  }
  const card = utils.createElement('Card', cardAttributes, [header, author, intro, footer]);
  if (image) {
    card.children.splice(3, 0, image);
  } 
  return card;
}

exports.sendRequest = sendRequest;