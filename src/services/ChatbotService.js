import request from 'request'
require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
const IMAGE_GET_STARTED = 'https://www.schiavello.com/__data/assets/image/0014/8105/carousel-atlantic-restaurant-crown-dining-partition.jpg'
const IMAGE_MAIN_MENU_1 = 'https://media-cdn.tripadvisor.com/media/photo-s/1a/ee/95/9d/marmaris-grills-and-signatures.jpg'
const IMAGE_MAIN_MENU_2 = 'https://gosvietnam.vn/wp-content/themes/gosvn/images/thietkephanmem/img-video-4.jpg'
const IMAGE_MAIN_MENU_3 = 'https://media-cdn.tripadvisor.com/media/photo-s/17/75/3f/d1/restaurant-in-valkenswaard.jpg'
const IMAGE_GIF_WELCOME = 'https://media3.giphy.com/media/KztT2c4u8mYYUiMKdJ/giphy.gif?cid=ecf05e47q9mjkqttkw5zwzxrrm6o7c1jlw5jssvxedkvcz2d&rid=giphy.gif'

let callSendAPI = async (sender_psid, response) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Construct the message body
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "message": response
            }

            await sendMarkSeen(sender_psid)
            await sendTypingOn(sender_psid)

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
                    resolve('message sent!')
                } else {
                    console.error("Unable to send message:" + err);
                }
            });
        } catch (error) {
            reject(error)
        }
    })
}

let sendTypingOn = (sender_psid) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": "typing_on"
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v9.0/me/messages",
        "qs": {
            "access_token": PAGE_ACCESS_TOKEN
        },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('SendTypingOn sent!')
        } else {
            console.error("Unable to send SendTypingOn:" + err);
        }
    });
}

let sendMarkSeen = (sender_psid) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": "mark_seen"
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v9.0/me/messages",
        "qs": {
            "access_token": PAGE_ACCESS_TOKEN
        },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('SendTypingOn sent!')
        } else {
            console.error("Unable to send SendTypingOn:" + err);
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

// Handle Send
let handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userName = await getUserName(sender_psid)
            let response1 = {
                "text": `Chào mừng ${userName} đến với nhà hàng của chúng tôi.`
            }
            // Send text message

            // let response2 = getStartedTemplate(sender_psid)

            let response2 = getImageGetStartedTempalte()

            let response3 = getStartedQuickReplyTemplate()
            // Send text message
            callSendAPI(sender_psid, response1)
            callSendAPI(sender_psid, response2)
            callSendAPI(sender_psid, response3)

            console.log('Send Tempalte')
            resolve('done')
        } catch (e) {
            reject(e)
        }
    })
}


let handleMainMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response2 = getMainMenuTemplate(sender_psid)
            // Send generic template message
            callSendAPI(sender_psid, response2)

            resolve('done')
        } catch (e) {
            reject(e)
        }
    })
}

let handleLunchMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response2 = getLunchMenuTemplate()
            // Send generic template message
            callSendAPI(sender_psid, response2)

            resolve('done')
        } catch (e) {
            reject(e)
        }
    })
}

let handleDinnerMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response2 = getDinnerMenuTemplate()
            // Send generic template message
            callSendAPI(sender_psid, response2)

            resolve('done')
        } catch (e) {
            reject(e)
        }
    })
}

let handleViewDetail = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response2 = getViewDetailTemplate()
            // Send generic template message
            callSendAPI(sender_psid, response2)

            resolve('done')
        } catch (e) {
            reject(e)
        }
    })
}

let handleShowRooms = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response2 = getShowRoomsTemplate(sender_psid)
            // Send generic template message
            callSendAPI(sender_psid, response2)

            resolve('done')
        } catch (e) {
            reject(e)
        }
    })
}

// Data response

let getMainMenuTemplate = (sender_psid) => {
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
                                "title": "BỮA TRƯA",
                                "payload": "LUNCH_MENU",
                            },
                            {
                                "type": "postback",
                                "title": "BỮA TỐI",
                                "payload": "DINNER_MENU",
                            }
                        ],
                    },
                    {
                        "title": "Giờ mở cửa",
                        "subtitle": "T2 -> T6 : 10AM - 10PM || T7 + CN : 8AM - 11PM",
                        "image_url": IMAGE_MAIN_MENU_2,
                        "buttons": [{
                            "type": "web_url",
                            "url": `${process.env.URL_WEB_VIEW_ORDER}/${sender_psid}`,
                            "title": "ĐẶT BÀN",
                            "webview_height_ratio": "tall",
                            "messenger_extensions": true
                        }],
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

let getStartedTemplate = (sender_psid) => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Nhà hàng Pikalazada kính chào quý khách.",
                    "subtitle": "Dưới đây là các dịch vụ của nhà hàng.",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [{
                            "type": "postback",
                            "title": "MENU CHÍNH",
                            "payload": "MAIN_MENU",
                        },
                        {
                            "type": "web_url",
                            "url": `${process.env.URL_WEB_VIEW_ORDER}/${sender_psid}`,
                            "title": "ĐẶT BÀN",
                            "webview_height_ratio": "tall",
                            "messenger_extensions": true
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

let getStartedQuickReplyTemplate = () => {
    let response = {
        "text": "Dưới đây là các lựa chọn của nhà hàng:",
        "quick_replies": [{
            "content_type": "text",
            "title": "MENU CHÍNH",
            "payload": "MAIN_MENU",
        }, {
            "content_type": "text",
            "title": "ĐẶT BÀN",
            "payload": "<POSTBACK_PAYLOAD>",
        }, {
            "content_type": "text",
            "title": "HƯỚNG DẪN SỬ DỤNG BOT",
            "payload": "GUIDE",
        }]
    }

    return response
}

let getImageGetStartedTempalte = () => {
    let response = {
        "attachment": {
            "type": "image",
            "payload": {
                "url": IMAGE_GIF_WELCOME,
                "is_reusable": true
            }
        }
    }
    return response
}

let getLunchMenuTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "Món khai vị",
                        "subtitle": "",
                        "image_url": 'https://monngonmoingay.com/wp-content/uploads/2019/09/s%C3%BAp-ph%E1%BB%93ng-t%C3%B4m-h%E1%BA%A3i-s%E1%BA%A3n.jpg',
                        "buttons": [{
                            "type": "postback",
                            "title": "XEM CHI TIẾT",
                            "payload": "VIEW_DETAIL",
                        }],
                    },
                    {
                        "title": "Bún chả",
                        "subtitle": "",
                        "image_url": 'https://monngonbamien.org/wp-content/uploads/2019/10/cach-lam-bun-cha-ha-noi-tai-nha-ngon-nhat.jpg',
                        "buttons": [{
                            "type": "postback",
                            "title": "XEM CHI TIẾT",
                            "payload": "VIEW_DETAIL",
                        }],
                    },
                    {
                        "title": "Nem cuốn",
                        "subtitle": "",
                        "image_url": 'https://img-global.cpcdn.com/recipes/813de2eb5288e8f8/1200x630cq70/photo.jpg',
                        "buttons": [{
                            "type": "postback",
                            "title": "XEM CHI TIẾT",
                            "payload": "VIEW_DETAIL",
                        }],
                    },
                    {
                        "title": "Trở lại",
                        "image_url": 'https://leerit.com/media/blog/uploads/2015/04/08/tu-vung-tieng-anh-ve-nha-hang.jpeg',
                        "subtitle": "",
                        "buttons": [{
                            "type": "postback",
                            "title": "TRỞ LẠI MENU",
                            "payload": "MAIN_MENU",
                        }, {
                            "type": "postback",
                            "title": "BỮA TỐI",
                            "payload": "DINNER_MENU",
                        }],
                    },
                ]
            }
        }
    }
    return response
}
let getDinnerMenuTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "Cơm sườn nướng",
                        "subtitle": "",
                        "image_url": 'https://img-global.cpcdn.com/recipes/630a5b24ef3fdf90/1200x630cq70/photo.jpg',
                        "buttons": [{
                            "type": "postback",
                            "title": "XEM CHI TIẾT",
                            "payload": "VIEW_DETAIL",
                        }],
                    },
                    {
                        "title": "Tôm hùm bơ tỏi",
                        "subtitle": "",
                        "image_url": 'https://ngonaz.com/wp-content/uploads/2021/05/cach-lam-tom-hum-sot-bo-toi-1.jpg',
                        "buttons": [{
                            "type": "postback",
                            "title": "XEM CHI TIẾT",
                            "payload": "VIEW_DETAIL",
                        }],
                    },
                    {
                        "title": "Bò bít tết",
                        "subtitle": "",
                        "image_url": 'http://media.vietq.vn/files/thuc-pham-phong-benh-148.jpg',
                        "buttons": [{
                            "type": "postback",
                            "title": "XEM CHI TIẾT",
                            "payload": "VIEW_DETAIL",
                        }],
                    },
                    {
                        "title": "Bò Wellington",
                        "subtitle": "",
                        "image_url": 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5s1Yfe2VeekQxqLcRSmobOEdV5o6qEnZXbw&usqp=CAU',
                        "buttons": [{
                            "type": "postback",
                            "title": "XEM CHI TIẾT",
                            "payload": "VIEW_DETAIL",
                        }],
                    },
                    {
                        "title": "Cua hoàng đế sốt phô mai",
                        "subtitle": "",
                        "image_url": 'https://haisantrungnam.vn/wp-content/uploads/2020/04/cach-lam-cua-hoang-de-sot-pho-mai-1.jpg',
                        "buttons": [{
                            "type": "postback",
                            "title": "XEM CHI TIẾT",
                            "payload": "VIEW_DETAIL",
                        }],
                    },
                    {
                        "title": "Trở lại",
                        "image_url": 'https://leerit.com/media/blog/uploads/2015/04/08/tu-vung-tieng-anh-ve-nha-hang.jpeg',
                        "subtitle": "",
                        "buttons": [{
                            "type": "postback",
                            "title": "TRỞ LẠI MENU",
                            "payload": "MAIN_MENU",
                        }, {
                            "type": "postback",
                            "title": "BỮA TRƯA",
                            "payload": "LUNCH_MENU",
                        }],
                    },
                ]
            }
        }
    }
    return response
}
let getViewDetailTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Cơm sườn nướng",
                    "subtitle": "Giá 50.000đ - 100.000đ",
                    "image_url": 'https://img-global.cpcdn.com/recipes/630a5b24ef3fdf90/1200x630cq70/photo.jpg',
                }, {
                    "title": "Trở lại",
                    "image_url": 'https://leerit.com/media/blog/uploads/2015/04/08/tu-vung-tieng-anh-ve-nha-hang.jpeg',
                    "subtitle": "",
                    "buttons": [{
                        "type": "postback",
                        "title": "TRỞ LẠI MENU",
                        "payload": "MAIN_MENU",
                    }],
                }, ]
            }
        }
    }
    return response
}

let getShowRoomsTemplate = (sender_psid) => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Phòng ngoài trời",
                    "subtitle": "Nằm trên tầng 2 với không gian thoáng mát, view buổi tối cực đẹp",
                    "image_url": 'https://drhueclinic.vn/images/seoworld/nha-hang-co-khong-gian-dep-tphcm.png',
                    "buttons": [{
                        "type": "postback",
                        "title": "CHI TIẾT",
                        "payload": "DETAIL_ROOM",
                    }],
                }, {
                    "title": "Không gian trang trọng",
                    "subtitle": "Rất phù hợp với các buổi tiệc lớn, quan trọng và rất sang trọng",
                    "image_url": 'https://chupanhmonan.com/wp-content/uploads/2019/03/ma%CC%82%CC%83u-thie%CC%82%CC%81t-ke%CC%82%CC%81-nha%CC%80-ha%CC%80ng-%C4%91e%CC%A3p.jpg',
                    "buttons": [{
                        "type": "postback",
                        "title": "CHI TIẾT",
                        "payload": "DETAIL_ROOM",
                    }],
                }, {
                    "title": "Phòng riêng",
                    "subtitle": "Có một bàn ăn lớn với sức chứa dưới 10 người, đảm bảo không gian thân mật, yên tĩnh",
                    "image_url": 'https://noithatkendesign.vn/storage/app/media/uploaded-files/thiet-ke-nha-hang-tan-co-dien-sua-trang-01.jpg',
                    "buttons": [{
                        "type": "postback",
                        "title": "CHI TIẾT",
                        "payload": "DETAIL_ROOM",
                    }],
                }, {
                    "title": "Trở lại",
                    "image_url": 'https://leerit.com/media/blog/uploads/2015/04/08/tu-vung-tieng-anh-ve-nha-hang.jpeg',
                    "subtitle": "",
                    "buttons": [{
                        "type": "postback",
                        "title": "TRỞ LẠI MENU",
                        "payload": "MAIN_MENU",
                    }, {
                        "type": "web_url",
                        "url": `${process.env.URL_WEB_VIEW_ORDER}/${sender_psid}`,
                        "title": "ĐẶT BÀN",
                        "webview_height_ratio": "tall",
                        "messenger_extensions": true
                    }],
                }],

            }
        }
    }
    return response
}


module.exports = {
    handleGetStarted: handleGetStarted,
    handleMainMenu: handleMainMenu,
    handleLunchMenu: handleLunchMenu,
    handleDinnerMenu: handleDinnerMenu,
    handleViewDetail: handleViewDetail,
    handleShowRooms: handleShowRooms,
    callSendAPI: callSendAPI,
    getUserName: getUserName
}