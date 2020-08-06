axios.interceptors.request.use(function (config) {
    log(config)
    try {
        var token = localStorage.getItem("token")
        if (token) {
            config.headers.authorization = "Bearer " + token
        }
        // A user must be signed to perform any network request

    } catch (error) {
        
    }
    return config;
}, function (err) {
    return Promise.reject(err);
});
