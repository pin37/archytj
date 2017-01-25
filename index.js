var express = require('express');
var app = express();

app.post('/', function (req, res) {
  var card = {
    "view": { "type": "CARDS" },
    "result": [
	{
	  "elementName": "Card",
	  "attributes": {
	    "linkTo": "https://google.com/",
	    "fullWidth": false
	  },
	  "children": [
	    {
	      "elementName": "CardHeader",
	      "attributes": {
	        "title": "card title"
	      }
	    }
	  ]
	}
      ]
  };
  res.json(card);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000');
});

