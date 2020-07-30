const collectionCtrl = require('./../controllers/collection.ctrl')

module.exports = (router) => {

    // API v1
    /**
     * get collections belonging to a team
     */
    router
        .route('/collections/:teamId')
        .get(collectionCtrl.getCollectionsByTeamId)

    /**
     * Edit a collection name
     */
    router
        .route('/collections/rename')
        .post(collectionCtrl.renameCollection)

    /** 
     * Update collection
    */
    router
        .route('/collection/update')
        .post(collectionCtrl.updateCollection)
    

     /**
     * add new request to collection
     */
    router
        .route('/collection/add/request/:collectionId')
        .post(collectionCtrl.addNewRequest)
    
    /**
     * Update a request
     */
    router
        .route('/collection/update/request')
        .post(collectionCtrl.updateRequest)
    
    /**
     * Delete a request from a collection
     */
    router
        .route('/collection/delete/request')
        .post(collectionCtrl.deleteRequest)
}