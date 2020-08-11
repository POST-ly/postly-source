const teamCtrl = require('./../controllers/team.ctrl')

module.exports = (router) => {

    /**
     * get all teams
     */
    router
        .route('/teams')
        .get(teamCtrl.getTeams)
    
    /**
     * edit a team
     */
    router
        .route("/teams/edit/:teamId")
        .post(teamCtrl.editTeam)


    /**
     * Delete a team
     */
    router
        .route("/teams/:teamId")
        .delete(teamCtrl.deleteTeam)


    // API v1

    /**
     * load teams belonged by a user
     */
    router
        .route('/teams/user')
        .get(teamCtrl.getTeamsByUserId)

    /**
     * load a team and populate with its 
     * collections, requests, history, envs, mockservers belonged by a user
     */
    router
        .route('/team/user/:teamId')
        .get(teamCtrl.getTeamsColsReqsByUserId)

    /**
     * create a team
     */
    router
        .route('/team/create')
        .post(teamCtrl.createTeam)

    /**
     * Add a user to a team
     */
    router
        .route('/team/add/user')
        .post(teamCtrl.addUserToTeam)

    /**
     * change a user role on a team
     */
    router
        .route('/team/user/change/role')
        .post(teamCtrl.changeUserRoleOnTeam)

    /**
     * remove user from a team
     */
    router
        .route('/team/remove/user')
        .post(teamCtrl.removeUserFromTeam)

    /**
     * add a collection to a team
     */
    router
        .route('/team/add/collection')
        .post(teamCtrl.addCollectionToTeam)

    /**
     * remove a collection from a team
     */
    router
        .route('/team/remove/collection')
        .post(teamCtrl.removeCollectionFromTeam)

    /**
     * Import a collection
     */
    router
        .route("/team/collection/import")
        .post(teamCtrl.importCollection)
}