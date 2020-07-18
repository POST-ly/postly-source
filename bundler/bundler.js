const fs = require("fs")
const log = console.log

function bundle(arrayOfFiles=[], writeToFile) {
    log("hi")
    var dist = ""
    arrayOfFiles.forEach(v => {
        log("Bundling " + v)
        try {
            dist += fs.readFileSync(v) + "\n"
        } catch (error) {
            console.warn(error)            
        }
    })

    // Write to dist folder
    var fExist = fs.existsSync(writeToFile)
    fs.appendFileSync(writeToFile, dist)
    console.log("Done")
}

module.exports = bundle