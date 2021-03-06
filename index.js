'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
	res.send('1159034079')
})


app.post('/webhook/', function (req, res) {
   console.log('Recieved Message'); 
   let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++) {
	    let event = req.body.entry[0].messaging[i];
	    let sender = event.sender.id;

	    if (event.message && event.message.text && sender) {
	    	let text = event.message.text;
			request({
			    url: 'https://frasier-chat.herokuapp.com/prediction',
			    method: 'POST',
			    body: {message: text.substring(0, 200)},
			    headers: {'User-Agent': 'request'},
				json: true 
			}, function(error, response, body) {
				sendTextMessage(sender, response.body)
			});
	    }
    }
    res.sendStatus(200)
})

// const token = "EAACFpvanSsMBABLt04GDsjbV91vFqNi10WdkfN0oYw3QrowTvX9QRaIrpwpqGPH1iDl8w9on8iacJ7ZBHGwmeGew90SDCEg0yTYwAdtmE1xzeBoqGiFca2G7P3PGoNUfDZAMfdKZAuIrZBIdUg3Y8Nvo5j3Wv3BJgJ0NN8lAJQZDZD"
const frasierToken = 'EAAUSlV2jwCMBAO3p530EUDffbEUsGSG6z5zztRrBESUCT9ZBCMVdrPZAjQJFDRpdVjjDEKhnCaEvJmtWGpmPIOsVal9EIKdhO0ZCpDz4SW0feHXkvtHCSyhTtSS4acv5LrmBrmZAg5xRozcbzyvY1V1WBfi5cDM9I0G62ZBACNQZDZD';

// for Facebook verification
/* app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
}) */

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:frasierToken},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}
