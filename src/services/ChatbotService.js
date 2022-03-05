import e from 'express';
import request from 'request'
require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
<<<<<<< HEAD
const IMAGE_GET_STARTED = 'https://www.schiavello.com/__data/assets/image/0014/8105/carousel-atlantic-restaurant-crown-dining-partition.jpg'
const IMAGE_MAIN_MENU_1 = 'https://media-cdn.tripadvisor.com/media/photo-s/17/75/3f/d1/restaurant-in-valkenswaard.jpghttps://media.gettyimages.com/photos/pan-fried-duck-picture-id1081422898?s=612x612'
const IMAGE_MAIN_MENU_2 = 'https://gosvietnam.vn/wp-content/themes/gosvn/images/thietkephanmem/img-video-4.jpg'
const IMAGE_MAIN_MENU_3 = 'https://media-cdn.tripadvisor.com/media/photo-s/17/75/3f/d1/restaurant-in-valkenswaard.jpg'

=======
const linkImage = 'https://www.schiavello.com/__data/assets/image/0014/8105/carousel-atlantic-restaurant-crown-dining-partition.jpg'
>>>>>>> 7b0c5f53f7264036ee7c6066fad3ff177b5113be

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
                "text": `Chào mừng ${userName} đến với nhà hàng của chúng tôi.`
            }
<<<<<<< HEAD
            let response2 = getStartedTemplate()

            // Send text message
            callSendAPI(sender_psid, response1)
            // Send generic template message
            callSendAPI(sender_psid, response2)

            resolve('done')
        } catch (e) {
            reject(e)
        }
    })
}

let handleMainMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response2 = getMainMenuTemplate()
            // Send generic template message
            callSendAPI(sender_psid, response2)

=======
            let response2 = sendGetStartedTemplate()
            callSendAPI(sender_psid, response1)
            callSendAPI(sender_psid, response2)
>>>>>>> 7b0c5f53f7264036ee7c6066fad3ff177b5113be
            resolve('done')
        } catch (e) {
            reject(e)
        }
    })
}

<<<<<<< HEAD
let getMainMenuTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "Menu của nhà hàng",
                        "subtitle": "Chúng tôi hân hạnh mang đến cho bạn thực đơn phong phú của bữa trưa và bữa tối.",
                        "image_url": IMAGE_MAIN_MENU_1,
                        "buttons": [{
                                "type": "postback",
                                "title": "Bữa trưa",
                                "payload": "LUNCH_MENU",
                            },
                            {
                                "type": "postback",
                                "title": "Bữa tối",
                                "payload": "DINNER_MENU",
                            }
                        ],
                    },
                    {
                        "title": "Giờ mở cửa",
                        "subtitle": "T2 -> T6 : 10AM - 10PM || T7 + CN : 8AM - 11PM",
                        "image_url": IMAGE_MAIN_MENU_2,
                        "buttons": [{
                            "type": "postback",
                            "title": "ĐẶT BÀN",
                            "payload": "RESERVE_TABLE",
                        }, ],
                    },
                    {
                        "title": "Không gian nhà hàng",
                        "subtitle": "Nhà hàng có sức chứa lên đến 300 khách và phục vụ các bữa tiệc lớn.",
                        "image_url": IMAGE_MAIN_MENU_3,
                        "buttons": [{
                            "type": "postback",
                            "title": "CHI TIẾT",
                            "payload": "SHOW_ROOMS",
                        }, ],
                    }
                ]
            }
        }
    }
    return response
}

let getStartedTemplate = () => {
=======
let sendGetStartedTemplate = () => {
>>>>>>> 7b0c5f53f7264036ee7c6066fad3ff177b5113be
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Nhà hàng Pikalazada kính chào quý khách.",
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
    handleGetStarted: handleGetStarted,
    handleMainMenu: handleMainMenu
}