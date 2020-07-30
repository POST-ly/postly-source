axios.interceptors.request.use(function (config) {
    log(config)
    try {
        var token = localStorage.getItem("token")
        if (token) {
            config.headers.authorization = "Bearer " + token
        }
    } catch (error) {
        
    }
    return config;
}, function (err) {
    return Promise.reject(err);
});
