const helpers = jest.createMockFromModule('../helpers')
 const url = './mockDb.json'
// const db =  { posts : [
//     {
//         firstName: "first",
//         middleName: "",
//         lastName: "SEYFGUYG",
//         email: "`SG@kzufhku",
//         category: "nature",
//         title: "changed2",
//         content: "zfzdfh",
//         creationDate: "2022-03-25T14:16:32.528Z",
//         id: "xoxo"
//     },
//     {
//         firstName: "zdfh",
//         middleName: "",
//         lastName: "zdr",
//         email: "zdr@zfgj",
//         category: "nature",
//         title: "changed",
//         content: "xfgjxfgj",
//         creationDate: "2022-03-30T15:46:32.519Z",
//         id: "xxx"
//     }
// ]}

helpers.writeJson = jest.fn((res, next, url, db) => {
    console.log(databaseUrl)
    console.log(db)
    res.end()
})

// helpers.writeJson = jest.fn((res, next, './mockDb.json', dbCopy.posts) => {
//     res.end()
// })

module.exports = helpers