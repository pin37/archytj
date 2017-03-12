const express = require('express'),
  bodyParser = require('body-parser'),
  list = require('./functions/news-list'),
  story = require('./functions/story'),
  source = require('./functions/source'),
  app = express();
app.use(bodyParser.json());

app.post('/archytj', (request, response) => list(request, response));
app.post('/archytj/news', (request, response) => list(request, response));
app.post('/archytj/offtop', (request, response) => list(request, response));
app.post('/archytj/videos', (request, response) => list(request, response));
app.post('/archytj/articles', (request, response) => list(request, response));
app.post('/archytj/editorial', (request, response) => list(request, response));
app.post('/archytj/week', (request, response) => list(request, response));
app.post('/archytj/story', (request, response) => story(request, response));
app.post('/archytj/source', (request, response) => source(request, response));

app.use(function(req, res, next) {
  res.status(404).send('Endpoint ' + req.url + ' not found');
});

app.listen(3000, function () {
  console.log('Server is running...');
});