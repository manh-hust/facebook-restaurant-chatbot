import express from "express";
import homeController from "../controller/HomeController"

let router = express.Router()


let initWebRoutes = app => {
    router.get("/", homeController.getHomePage)
    router.post("/setup-profile", homeController.setupProfile)
    router.post('/webhook', homeController.postWebhook);
    router.get('/webhook', homeController.getWebhook)

    return app.use('/', router)
}

module.exports = initWebRoutes