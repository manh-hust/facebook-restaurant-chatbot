import e from 'express';
import request from 'request'
require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
const linkImage = 'https://www.schiavello.com/__data/assets/image/0014/8105/carousel-atlantic-restaurant-crown-dining-partition.jpg'

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

let getUserName = (sender_psid) => {
    // Send the HTTP request to the Messenger Platform
    return new Promise((resolve, reject) => {
        request({
            "uri": `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
            "method": "GET",
        }, (err, res, body) => {
            console.log('Body: ' + body)
            if (!err) {
                body = JSON.parse(body);
                let userName = `${body.last_name} ${body.first_name}`
                console.log('message sent!')
                resolve(userName)
            } else {
                console.error("Unable to send message:" + err);
                reject(err)
            }
        });
    })
}

let handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userName = await getUserName(sender_psid)
            console.log(userName)
            let response1 = {
                "text": `OK! Chào mừng ${userName} đến với nhà hàng của chúng tôi.`
            }
            let response2 = sendGetStartedTemplate()
            await callSendAPI(sender_psid, response1)
            await callSendAPI(sender_psid, response2)


            resolve('done')
        } catch (e) {
            reject(e)
        }
    })
}

let sendGetStartedTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Xin chào bạn đến với nhà hàng của chúng tôi",
                    "subtitle": "Dưới đây là các dịch vụ của nhà hàng.",
                    "image_url": linkImage,
                    "buttons": [{
                            "type": "postback",
                            "title": "MENU CHÍNH",
                            "payload": "MAIN_MENU",
                        },
                        {
                            "type": "postback",
                            "title": "ĐẶT BÀN",
                            "payload": "RESERVE_TABLE",
                        },
                        {
                            "type": "postback",
                            "title": "HƯỚNG DẪN SỬ DỤNG",
                            "payload": "GUIDE",
                        }
                    ],
                }]
            }
        }
    }
    return response
}

module.exports = {
    handleGetStarted: handleGetStarted
}