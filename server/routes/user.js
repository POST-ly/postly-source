const userCtrl = require('./../controllers/user.ctrl')

module.exports = (router) => {

    /**
     * get a user
     */
    router
        .route('/user/:id')
        .get(userCtrl.getUser)
    /**
     * get a user by username
     */
    router
        .route('/user/get/:username')
        .get(userCtrl.getUserByUsername)

    /**
     * get user me
     */
    router
        .route('/user/me/get')
        .get(userCtrl.getUserMe)

    /**
     * verify a user
     */
    router
        .route('/user/login')
        .post(userCtrl.checkUser)

    /**
     * register a user
     */
    router
        .route('/user/register')
        .post(userCtrl.registerUser)

    /**
     * get all users
     */
    router
        .route('/users')
        .get(userCtrl.getAllUsers)

}