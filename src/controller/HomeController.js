require('dotenv').config();
import request from 'request'
import chatborService from "../services/ChatbotService"

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN

let getHomePage = (req, res) => {
  return res.render('homepage.ejs')
}

let getReserveTable = (req, res) => {
  return res.render('reserve-table.ejs')
}

let postReserveTable = (req, res) => {
  res.send(req.body)
}

let postWebhook = (req, res) => {
  let body = req.body;
  console.log(body)
  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
}

let getWebhook = (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.VERIFY_TOKEN

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
}

// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response;
  // Checks if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
    }
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [{
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  }

  // Send the response message
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
  let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  switch (payload) {
    case 'yes':
      response = {
        "text": "Thanks!"
      }
      break;

    case 'no':
      response = {
        "text": "Oops, try sending another image."
      }
      break;

    case 'RESTART_BOT':
    case 'GET_STARTED':
      await chatborService.handleGetStarted(sender_psid)
      break;

    case 'MAIN_MENU':
      await chatborService.handleMainMenu(sender_psid)
      break;

    case 'LUNCH_MENU':
      await chatborService.handleLunchMenu(sender_psid)
      break;

    case 'DINNER_MENU':
      await chatborService.handleDinnerMenu(sender_psid)
      break;

    case 'VIEW_DETAIL':
      await chatborService.handleViewDetail(sender_psid)
      break;

    case 'SHOW_ROOMS':
      await chatborService.handleShowRooms(sender_psid)
      break;

    default:
      response = {
        "text": `Opp! I don't know response with postback ${payload}!`
      }
  }
  // Send the message to acknowledge the postback
  // callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": {
      "access_token": process.env.PAGE_ACCESS_TOKEN
    },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

let setupProfile = async (req, res) => {
  // Construct the message body
  let request_body = {
    "get_started": {
      "payload": "GET_STARTED"
    },
    "whitelisted_domains": ["https://restaurant-chatbot-app-manh.herokuapp.com/"]
  }

  // Send the HTTP request to the Messenger Platform
  await request({
    "uri": `https://graph.facebook.com/v9.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
    "qs": {
      "access_token": PAGE_ACCESS_TOKEN
    },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('Setup profile success!')
    } else {
      console.error("Unable to setup profile:" + err);
    }
  });
  return res.send('<h2>Setup profile success!</h2>')
}
// 
let setupPersistent = async (req, res) => {
  // Construct the message body
  let request_body = {
    "persistent_menu": [{
      "locale": "default",
      "composer_input_disabled": false,
      "call_to_actions": [{
          "type": "web_url",
          "title": "GitHub",
          "url": "https://github.com/ongimkshp",
          "webview_height_ratio": "full"
        },
        {
          "type": "web_url",
          "title": "Facebook",
          "url": "https://www.facebook.com/profile.php?id=100012640711946",
          "webview_height_ratio": "full"
        },
        {
          "type": "postback",
          "title": "Bắt đầu lại...",
          "payload": "RESTART_BOT"
        }
      ]
    }]
  }

  // Send the HTTP request to the Messenger Platform
  await request({
    "uri": `https://graph.facebook.com/v9.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
    "qs": {
      "access_token": PAGE_ACCESS_TOKEN
    },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('Setup persistent menu success!')
    } else {
      console.error("Unable to setup persistent menu:" + err);
    }
  });
  return res.send('<h2>Setup persistent menu success!</h2>')
}

module.exports = {
  getHomePage: getHomePage,
  getReserveTable: getReserveTable,
  postReserveTable: postReserveTable,
  postWebhook: postWebhook,
  getWebhook: getWebhook,
  setupProfile: setupProfile,
  setupPersistent: setupPersistent
}