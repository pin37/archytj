const express = require('express'),
  bodyParser = require('body-parser'),
  fetch = require('node-fetch'),
  buildUrl = require('build-url'),
  utils = require('./utils'),
  app = express()
let requestsCount = 0;
app.use(bodyParser.json());

app.post('/archytj/', (request, response) => sendRequest(request, response, 0));
app.post('/archytj/news', (request, response) => sendRequest(request, response, 1));
app.post('/archytj/offtop', (request, response) => sendRequest(request, response, 2));
app.post('/archytj/videos', (request, response) => sendRequest(request, response, 3));
app.post('/archytj/articles', (request, response) => sendRequest(request, response, 4));

app.listen(3000, function () {
  console.log('Server is running...');
});

function sendRequest(request, response, type) {
  if (!request.body.payload) {
    request.body.payload = { user: { id: null} };
  }
  console.log('Request #' + ++requestsCount + ' from user with id: ' + request.body.payload.user.id);
  const page = request.body.payload.nextResultCursor || { after: 0, limit: utils.limit };
  const url = buildUrl('https://api.tjournal.ru', {
    path: '2.3/club',
    queryParams: {
        sortMode: 'recent',
        count: page.limit,
        offset: page.after,
        type: type
      }
  });
  fetch(url).then(res => res.json())
    .then(json => utils.makeResponse(json, response, page, type));
}