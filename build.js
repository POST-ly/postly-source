const bundle = require("./bundler/bundler")
var filesToBundle = [
    "./src/js/polyfills/core.min.js",
    "./src/js/polyfills/library.min.js",
    "./src/js/polyfills/shim.min.js",
    
    "./src/js/libs/codemirror/codemirror.min.js",
    "./src/js/libs/codemirror/mode/javascript/javascript.js",
    "./src/js/libs/codemirror/mode/shell/shell.js",
    "./src/js/libs/codemirror/addon/display/autorefresh.js",

    "./src/js/libs/axios/axios.min.js",
    "./src/js/libs/mustachejs/mustache.min.js",
    "./src/js/libs/dexie/dexie.js",

    "./src/js/utils.js",

    "./src/js/db/historyDb.js",
    "./src/js/db/collectionsDb.js",
    "./src/js/db/requestsDb.js",
    "./src/js/db/EnvDb.js",
    "./src/js/db/MockServerDb.js",

    "./src/js/auth/authTabs.js",
    "./src/js/codegens/codegens.js",

    "./src/js/body/binary/binary.js",
    "./src/js/body/graphql/graphQL.js",
    "./src/js/body/raw/raw.js",
    "./src/js/body/form/form.js",
    "./src/js/body/body.js",
    "./src/js/body/params.js",

    "./src/js/settings/settings.js",
    "./src/js/newTab.js",
    "./src/js/script.js",
    "./src/js/history.js",
    "./src/js/request.js",
    "./src/js/requester/request.js",

    "./src/js/env/Env.js",
    "./src/js/env/parseEnvVars.js",

    "./src/js/visualizer/Visualizer.js",
    "./src/js/mockServer/MockServer.js",
    "./src/js/mockServer/MockServerMgmt.js",
    "./src/js/prerequestscript/preRequestScript.js",
    "./src/js/saveModal.js",

    "./src/js/collections/editCollection.js",
    "./src/js/collections/viewCollection.js",
    "./src/js/collections/shareCollection.js", 
    "./src/js/collections/exportCollection.js",
    "./src/js/collections/addRequestToCollection.js",
    "./src/js/collections/importCollection.js",
    "./src/js/collections/collectionRunner.js",
    "./src/js/collections/collections.js",

    "./src/js/teams.js",
    "./src/js/testing/testFunc.js",
    "./src/js/about/about.js",
    "./src/js/auth/auth.js",
    "./src/js/Data.js",
    "./src/js/startup.js"
]

var writeToFile = "./build/js/build.js"

bundle(filesToBundle, writeToFile)