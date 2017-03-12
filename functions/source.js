const fetch = require('node-fetch'),
  buildUrl = require('build-url'),
  utils = require('./utils');

function sendRequest(request, response) {
  if (!request.body.payload) {
    request.body.payload = {
      args : {
        id: 1234
      }
    };
  }
  const entryId = request.body.payload.args.id;
  const responseUrl = buildUrl('https://api.tjournal.ru', {
    path: '2.3/club/item',
    queryParams: {
      entryId
    }
  });
  fetch(responseUrl).then(res => res.json())
    .then(source => makeResponse(source, response));
}

function makeResponse(source, response) {
  source = source.externalLink;
  const data = source.data;
  const cards = utils.createElement('Cards', null, []);
  const resultAttributes = {
    meta: { title: data.title },
    links: utils.filters
  };
  const result = utils.createElement('Result', resultAttributes, [cards]);


  // card
  const card = utils.createElement('Card', { fullWidth: true }, []);

  // header
  const headerAttributes = {
    title: data.title,
    subtitle: source.domain
  };
  const header = utils.createElement('CardHeader', headerAttributes);

  // text
  const text = utils.getTextElement(data.description);
  card.children.push(header, text);

  // image
  const image = data.image;
  if (image) {
    const imageElementAttributes = {
      width: 12,
      height: 12,
      uri: image
    }
    const imageElement = utils.createElement('CardImage', imageElementAttributes);
    card.children.push(imageElement);
  }
  cards.children.push(card);

  // external link
  const externalLink = utils.getExternalLink(data.url);
  cards.children.push(externalLink);
  
  response.json(result);
}

module.exports = sendRequest;