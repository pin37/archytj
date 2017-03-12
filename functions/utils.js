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
    .replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
    .replace(new RegExp('</p><p>', 'g'), '\n\n')
    .replace(new RegExp('<p>', 'g'), '')
    .replace(new RegExp('</p>', 'g'), '')
    .trim();
}

function getCardHeader(article) {
  const header = createElement('CardHeader', { title: article.title });
  const type = article.type;
  if (type === 4) {
    header.attributes.subtitle = 'Статья';
  } else if (type === 3) {
    header.attributes.subtitle = 'Видео';
  } else if (type === 2) {
    header.attributes.subtitle = 'Офтоп';
  } else if (type === 1) {
    header.attributes.subtitle = 'Новость';
  }
  return header;
}

function getCardFooter(article) {
  const likesCount = article.likes.summ;
  const like = {
    name: '—',
    color: '#ffffff'
  };
  if (likesCount > 0) {
    like.name = '👍+' + likesCount;
    like.color = '#dcedc8';
  } else if (likesCount < 0) {
    like.name = '👎' + likesCount;
    like.color = '#ffcdd2';
  }
  const footerAttributes = {
    labels: [
      like,
      {
        name: '👁' + article.hits,
        color: '#ffffff'
      }, {
        name: '💬' + article.commentsCount,
        color: '#ffffff'
      }
    ]
  };
  if (article.isReadMore) {
    footerAttributes.labels.push(
      {
        name: '🔥hot',
        color: '#ffffff'
      });
  }
  if (article.isAdvertising) {
    footerAttributes.labels.push(
      {
        name: '💵ad',
        color: '#ffffff'
      });
  }
  return createElement('CardFooter', footerAttributes);
}

function getExternalLink(url) {
  const hyperlinkCardAttributes = {
    //fullWidth: true,
    uri: url
  };
  const hyperlinkCard = createElement('Card', hyperlinkCardAttributes, []);
  
  const openButtonAttributes = {
    iconName: 'external-link-square',
    color: '#2196f3',
    title: 'ОТКРЫТЬ НА САЙТЕ',
    subtitle: url
  };
  const openButton = createElement('Media', openButtonAttributes);
  hyperlinkCard.children.push(openButton);
  return hyperlinkCard;
}

function getTextElement(text) {
  return createElement('CardBodyText', { text: textNormalize(text) });
}

exports.filters = filters;
exports.createElement = createElement;
exports.textNormalize = textNormalize;
exports.getCardHeader = getCardHeader;
exports.getCardFooter = getCardFooter;
exports.getTextElement = getTextElement;
exports.getExternalLink = getExternalLink;