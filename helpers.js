const fs = require('fs')

exports.writeJson = function(res, next, filePath, db) {
    const jsonDb = JSON.stringify(db, null, 4)
    fs.writeFile(filePath, jsonDb, err => {
       if (err) {
           next(err)
       } else {
        res.end()
       }
    })
}


