import express from "express";
import homeController from "../controller/HomeController"

let router = express.Router()


let initWebRoutes = app => {
    router.get("/", homeController.getHomePage)
    //set up Get Started Button, whitelisted domain
    router.post("/setup-profile", homeController.setupProfile)
    // set up Persistent Menu
    router.post("/setup-persistent-menu", homeController.setupPersistent)

    router.post('/webhook', homeController.postWebhook);
    router.get('/webhook', homeController.getWebhook)

    router.get('/reserve-table/:senderID', homeController.getReserveTable)
    router.post('/reserve-table-ajax', homeController.postReserveTable)

    return app.use('/', router)
}

module.exports = initWebRoutes