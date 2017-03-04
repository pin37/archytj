const filters = [
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

exports.filters = filters;
exports.createElement = createElement;