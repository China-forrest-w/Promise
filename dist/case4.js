// 实现穿透
const Promise = require('./bundle');
let promise = new Promise((resolve, reject) => {
    // resolve(100);
    reject('errMessage')
})

// promise.then().then().then(data => {
//     console.log('data', data);
// }, err => {
//     console.log('err', err);
// })

promise.catch(err => {
    console.log('err', err);
})