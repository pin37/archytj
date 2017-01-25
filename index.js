var express = require('express');
var request = require('request');
var app = express();
request('https://api.tjournal.ru/2.3/club?count=30&sortMode=recent', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body) // Print the google web page.
     }
});

/*app.post('/', function (req, res) {
	var options = {
	  host: 'https://api.tjournal.ru',
	  port: 80,
	  path: '/2.3/club?count=30&sortMode=recent',
	  method: 'GET'
	};

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
*/
//app.listen(3000, function () {
//  console.log('Example app listening on port 3000');
//});

