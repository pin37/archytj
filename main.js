const express = require('express'),
  bodyParser = require('body-parser'),
  list = require('./functions/news-list'),
  story = require('./functions/story'),
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

app.listen(3000, function () {
  console.log('Server is running...');
});