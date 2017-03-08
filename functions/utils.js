const striptags = require('striptags');

const filters = [
    {
      address: '/',
      meta: {
        title: 'Все',
        subscribe: true
      }
    }, {
      address: '/editorial',
      meta: {
        title: 'Редакционные статьи'
      }
    }, {
      address: '/week',
      meta: {
        title: 'Лучшее за неделю'
      }
    }, {
      address: '/articles',
      meta: {
        title: 'Статьи'
      }
    }, {
      address: '/videos',
      meta: {
        title: 'Видео'
      }
    }, {
      address: '/offtop',
      meta: {
        title: 'Офтоп'
      }
    }, {
      address: '/news',
      meta: {
        title: 'Новости'
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

function textNormalize(text) {
  return striptags(text, '<p>')
    .replace(new RegExp('</p><p>', 'g'), '\n')
    .replace(new RegExp('<p>', 'g'), '')
    .replace(new RegExp('</p>', 'g'), '')
    .trim();
}

exports.filters = filters;
exports.createElement = createElement;
exports.textNormalize = textNormalize;