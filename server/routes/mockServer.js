const mockServerCtrl = require("./../controllers/mockServer.ctrl.js")
module.exports = (router) => {

    /**
     * get all mockservers
     */
    router
        .route('/mockServers')
        .get(mockServerCtrl.getMockServers)

    /**
     * Get mockServers attached to a team
     */
    router
        .route('/mockServers/team/:teamId')
        .get(mockServerCtrl.getTeamMockServers)

    /**
    * get a particular mockServer
    */
    router
        .route('/mockServers/:mockServerId')
        .get(mockServerCtrl.getMockServer)

    /**
     * create a new mockServer
     */
    router
        .route('/mockServers')
        .post(mockServerCtrl.createMockServer)

    /**
     * edit a particular mockServer
     */
    router
        .route('/mockServers/:mockServerId')
        .put(mockServerCtrl.editMockServer)

    /**
     * delete a particular mockServer
     */
    router
        .route('/mockServers/:mockServerId')
        .delete(mockServerCtrl.deleteMockServer)
}