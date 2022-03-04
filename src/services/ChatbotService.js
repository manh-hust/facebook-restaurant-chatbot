import e from 'express';
import request from 'request'
require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN

let callSendAPI = (sender_psid, response) => {
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
            "access_token": PAGE_ACCESS_TOKEN
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

let getUserName = async (sender_psid) => {
    // Send the HTTP request to the Messenger Platform
    let userName = ''
    await request({
        "uri": `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": {
            "access_token": PAGE_ACCESS_TOKEN
        },
        "method": "GET",
    }, (err, res, body) => {
        console.log('Body: ' + body)
        if (!err) {
            let response = JSON.parse(body);
            userName = `${response.first_name} ${response.last_name}`
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
    return userName
}

let handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userName = await getUserName(sender_psid)
            let response = {
                "text": `OK! Chào mừng ${userName} đến với nhà hàng của chúng tôi.`
            }
            await callSendAPI(sender_psid, response)
            resolve('done')
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleGetStarted: handleGetStarted
}