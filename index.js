/**
 * Created by alp on 02.08.2016.
 */
var express = require('express');
var Promise = require("bluebird");
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// handler receiving messages
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];

        if (event.message && event.message.text) {
            var msg = event.message.text;
            findTrack(msg)
                .then(function(result){
                    if(result.length == 0){
                        sendMessage(event.sender.id, {text: "No song found with " + msg});
                    }else{
                        sendMessage(event.sender.id, {text: "Song found with " + msg});
                    }
                })


        }
    }
    res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

function findTrack(track){
    return new Promise(function(resolve,reject) {
        var spotify = require('spotify');

        spotify.search({ type: 'track', query: track }, function(err, data) {
            if ( err ) {
                console.log('Error occurred: ' + err);
                reject(err);
            }

            var result = [];
            var items =data.tracks.items;
            items.forEach(function (row) {
                var album    = row.album.name;
                var image    = row.album.images[0].url;
                var artist   = row.artists[0].name;
                var duration = row.duration_ms;
                var url      = row.external_urls.spotify
                var element = {'album' : album,'image' :image , 'artist' : artist, 'duration' : duration, 'url' : url};
                result.push(element);
            })
            resolve (result);
        });
    });
};
