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
        id: 1234
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
    .then(story => makeResponse(story, response));
}

function makeResponse(story, response) {
  const cards = utils.createElement('Cards', null, []);
  const resultAttributes = {
    meta: { title: story.title },
    links: utils.filters
  };
  const result = utils.createElement('Result', resultAttributes, [cards]);


  // card
  const card = utils.createElement('Card', { fullWidth: true }, []);

  // header
  const header = utils.getCardHeader(story);

  // author
  const timestamp = new Date(story.date * 1000);
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
      case 'text_limited':
        // paragraph
        const paragraph = utils.getTextElement(divData.text);
        card.children.push(paragraph);
        break;
      case 'heading_styled':
        // volume
        const volume = utils.createElement('CardHeader', { title: divData.text });
        card.children.push(volume);
        break;
      case 'image_extended':
        // image
        const file = divData.file;
        const imageAttributes = {
          width: file.width,
          height: file.height,
          uri: file.url
        };
        const image = utils.createElement('CardImage', imageAttributes);
        card.children.push(image);
        // image caption
        const imageCaptionText = divData.caption;
        if (imageCaptionText) {
          const imageCaption = utils.createElement('CardHeader', { subtitle: imageCaptionText });
          card.children.push(imageCaption);
        }
        break;
      case 'gallery':
        // gallery
        const files = divData.files;
        for (let img of files) {
          const galleryAttributes = {
            width: img.width,
            height: img.height,
            uri: img.bigUrl
          };
          const gallery = utils.createElement('CardImage', galleryAttributes);
          card.children.push(gallery);
        }
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
          color: '#bdbdbd',
          title: utils.textNormalize(divData.text)
        };
        const quote = utils.createElement('Media', quoteAttributes);
        card.children.push(quote);
        // cite
        const cite = divData.cite;
        if (cite) {
          quoteAttributes.labels = [
            {
              name: cite,
              color: '#ffffff'
            }
          ];
        } else {
          // separator
          card.children.push(utils.createElement('Separator'));
        }
        break;
      case 'tweet':
        // tweet
        const user = divData.user;
        const tweetAttributes = {
          imageUrl: user.profile_image_url_https,
          title: user.name,
          created: {
            by: '@' + user.screen_name,
            at: new Date(divData.created_at)
          }
        };
        const tweet = utils.createElement('Media', tweetAttributes);
        card.children.push(tweet);

        // tweet text
        const tweetTextAttributes = {
          iconName: 'twitter',
          title: utils.textNormalize(divData.text)
        };
        const tweetText = utils.createElement('Media', tweetTextAttributes);
        card.children.push(tweetText);
        
        // tweet caption
        const tweetCaptionText = divData.caption;
        if (tweetCaptionText) {
          const imageCaption = utils.createElement('CardHeader', { subtitle: tweetCaptionText });
          card.children.push(imageCaption);
        }
        break;
      // known divs
      case 'link_embed_undeletable':
      case 'link_embed':
      case 'instagram':
      case 'rawhtml':
        break;
      default:
        // unknown div
        const another = utils.createElement('CardBodyText', { text: 'Another div type: ' + divType });
        card.children.push(another);
    }
  }


  // footer
  const footer = utils.getCardFooter(story);
  card.children.push(footer);
  cards.children.push(card);

  // source
  const storyExternalLink = story.externalLink;
  if (storyExternalLink) {
    const sourceData = storyExternalLink.data;
    let sourceAttributes = { uri: sourceData.url };
    if (sourceData.description.trim()) {
      sourceAttributes = {
        linkTo: {
          address: "@pin37/tj/source",
          args: {
            id: story.id
          }
        }
      };
    }
    const sourceCard = utils.createElement('Card', sourceAttributes, []);
    
    const sourceLabelAttributes = {
      iconName: 'link',
      color: '#2196f3',
      title: 'ИСТОЧНИК',
      subtitle: storyExternalLink.domain
    };
    const sourceLabel = utils.createElement('Media', sourceLabelAttributes);
    sourceCard.children.push(sourceLabel);
    cards.children.push(sourceCard);
  }
  
  // external link
  const externalLink = utils.getExternalLink(story.url);
  cards.children.push(externalLink);

  // comments card
  const commentsPreview = story.commentsPreview;
  if (commentsPreview.length) {
    for (let commentPreview of commentsPreview) {
      const commentsCard = utils.createElement('Card', { fullWidth: true }, []);
      // user
      const commentTime = new Date(commentPreview.date * 1000);
      const user = commentPreview.user;
      const userAttributes = {
        imageUrl: user.profile_big_image_url,
        created: {
          by: user.name,
          at: commentTime
        }
      };
      const userElement = utils.createElement('Media', userAttributes);
      commentsCard.children.push(userElement);

      // comment text
      const commentText = utils.createElement('CardBodyText', { text: commentPreview.text });
      commentsCard.children.push(commentText);

      // comment image
      const commentMediaArray = commentPreview.media;
      if (commentMediaArray) {
        for (let commentMedia of commentMediaArray) {
          const commentImageAttributes = {
            width: commentMedia.thumbnail_width,
            height: commentMedia.thumbnail_height,
            uri: commentMedia.thumbnail_url
          };
          const commentImage = utils.createElement('CardImage', commentImageAttributes);
          commentsCard.children.push(commentImage);
        }
      }

      // comment likes
      const commentLikesAttributes = {
        labels: [
          {
            name: '👍+' + commentPreview.likes.summ,
            color: '#dcedc8'
          }
        ]
      };
      const commentLikes = utils.createElement('CardFooter', commentLikesAttributes);
      commentsCard.children.push(commentLikes);
      cards.children.push(commentsCard);
    }
  }
  
  response.json(result);
}

module.exports = sendRequest;