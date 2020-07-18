const envCtrl = require("./../controllers/env.ctrl.js")
module.exports = (router) => {

    /**
     * get all envs
     */
    router
        .route('/envs')
        .get(envCtrl.getEnvs)


    /**
     * get a particular env
     */
    router
        .route('/envs/:envId')
        .get(envCtrl.getEnv)

    /**
     * create a new env
     */
    router
        .route('/envs')
        .post(envCtrl.createEnv)

    /**
     * edit a particular env
     */
    router
        .route('/envs/:envId')
        .put(envCtrl.editEnv)

    /**
     * delete a particular env
     */
    router
        .route('/envs/:envId')
        .delete(envCtrl.deleteEnv)

}