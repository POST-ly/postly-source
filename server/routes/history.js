const historyCtrl = require("./../controllers/history.ctrl.js")

module.exports = (router) => {

    router
        .route("/history/:teamId")
        .get(historyCtrl.getHistoryTeam)
    
    router
        .route("/history")
        .post(historyCtrl.createHistory)
    
    router
        .route("history")
        .put(historyCtrl.editHistory)
    
    router
        .route("/history")
        .delete(historyCtrl.deleteHistory)
}