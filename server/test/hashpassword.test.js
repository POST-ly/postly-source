const log= console.log
const { hashPassword } = require("./../utils")

var p = await hashPassword("234")

log(p)
