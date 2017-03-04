const express = require('express'),
  bodyParser = require('body-parser'),
  fetch = require('node-fetch'),
  buildUrl = require('build-url'),
  utils = require('./utils'),
  app = express();
let requestsCount = 0;
app.use(bodyParser.json());

app.post('/archytj', (request, response) => sendRequest(request, response));
app.post('/archytj/news', (request, response) => sendRequest(request, response));
app.post('/archytj/offtop', (request, response) => sendRequest(request, response));
app.post('/archytj/videos', (request, response) => sendRequest(request, response));
app.post('/archytj/articles', (request, response) => sendRequest(request, response));
app.post('/archytj/editorial', (request, response) => sendRequest(request, response));
app.post('/archytj/week', (request, response) => sendRequest(request, response));

app.listen(3000, function () {
  console.log('Server is running...');
});

function sendRequest(request, response) {
  if (!request.body.payload) {
    request.body.payload = { user: { id: null} };
  }
  console.log('Request #' + ++requestsCount + ' from user with id: ' + request.body.payload.user.id);
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
  const page = request.body.payload.nextResultCursor || { after: 0, limit: utils.limit };
  const responseUrl = buildUrl('https://api.tjournal.ru', {
    path: '2.3/club',
    queryParams: {
      count: page.limit,
      offset: page.after,
      sortMode,
      type
    }
  });
  switch (sortMode) {
    case 'editorial':
      type = 5;
      break;
    case 'week':
      type = 6;
  }
  fetch(responseUrl).then(res => res.json())
    .then(json => utils.makeResponse(json, response, page, type));
}