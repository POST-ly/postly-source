const bundle = require("./bundler/bundler")
var filesToBundle = [

        "./src/css/simple-line-icons.css",

        "./src/js/libs/OverlayScrollbars.min.css",

        "./src/css/codemirror.min.css",
        "./src/css/style.css",
        "./src/css/anim.css",
        "./src/css/media.css",
        "./src/css/modal.css",
        "./src/css/atoms.css",
        "./src/css/teams.css",
        "./src/css/Env.css",
        "./src/css/notif.css"
]


var writeToFile = "./build/css/build.css"

bundle(filesToBundle, writeToFile)