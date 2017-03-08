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
        id: 41793//41661
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
    meta: { title: json.title },
    links: utils.filters
  };
  const result = utils.createElement('Result', resultAttributes, [cards]);
  result.children[0].children.push(toCard(json));
  response.json(result);
}

function toCard(story) {
  // card
  const timestamp = new Date(story.date * 1000);
  const cardAttributes = {
    id: story.id,
    fullWidth: false,
    timestamp
  };
  const card = utils.createElement('Card', cardAttributes, []);
  const title = story.title;
  const header = utils.createElement('CardHeader', { title });
  const type = story.type;
  if (type === 4) {
    header.attributes.subtitle = 'Статья';
  } else if (type === 3) {
    header.attributes.subtitle = 'Видео';
  } else if (type === 2) {
    header.attributes.subtitle = 'Офтоп';
  } else if (type === 1) {
    header.attributes.subtitle = 'Новость';
  }

  // author
  const userDevice = story.userDevice;
  let device = 'desktop';
  if (userDevice === 2) {
    device = 'apple';
  } else if (userDevice === 3) {
    device = 'android';
  }
  const authorAttributes = {
    imageUrl: story.publicAuthor.profile_image_url,
    created: {
      by: story.publicAuthor.name,
      at: timestamp
    }
  };
  const author = utils.createElement('Media', authorAttributes);
  card.children.push(header, author);


  // text
  const textObject = JSON.parse(story.entryJSON);
  for (let div of textObject.data) {
    const divType = div.type;
    const divData = div.data;
    switch (divType) {
      case 'text':
        // paragraph
        const paragraph = utils.createElement('CardBodyText', { text: utils.textNormalize(divData.text) });
        card.children.push(paragraph);
        break;
      case 'image_extended':
        // image
        const file = divData.file,
          imageAttributes = {
            width: file.width,
            height: file.height,
            uri: file.url
          };
        const image = utils.createElement('CardImage', imageAttributes);
        card.children.push(image);
        const imageCaption = utils.createElement('CardBodyText', { text: divData.caption });
        card.children.push(imageCaption);
        break;
      case 'video_extended':
        // video
        const videoAttributes = {
          width: divData.width,
          height: divData.height,
          uri: divData.thumbnailUrl
        };
        const video = utils.createElement('CardImage', videoAttributes);
        card.children.push(video);
        break;
      case 'quote_styled':
        // quote
        const quoteAttributes = {
          iconName: 'quote-left',
          color: 'bdbdbd',
          title: utils.textNormalize(divData.text),
          labels: [
            {
              name: divData.cite,
              color: 'eeeeee'
            }
          ]
        };
        const quote = utils.createElement('Media', quoteAttributes);
        card.children.push(quote);
        break;
      default:
        const another = utils.createElement('CardBodyText', { text: 'Another div type: ' + divType });
        card.children.push(another);
    }
  }


  // footer
  const likesCount = story.likes.summ;
  const like = {
    name: '—',
    color: 'ffffff'
  };
  if (likesCount > 0) {
    like.name = '👍+' + likesCount;
    like.color = 'dcedc8';
  } else if (likesCount < 0) {
    like.name = '👎' + likesCount;
    like.color = 'ffcdd2';
  }
  const footerAttributes = {
    labels: [
      like,
      {
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
        color: 'ffffff'
      });
  }
  const footer = utils.createElement('CardFooter', footerAttributes);
  card.children.push(footer);
  return card;
}

module.exports = sendRequest;