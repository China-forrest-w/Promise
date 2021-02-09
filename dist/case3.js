// 1.普通值  调用then方法会返回一个全新的Promise (不能返回this);
const Promise  = require('./bundle');
let promise = new Promise((resolve, reject) => {
  resolve('ok');
}).then(data => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(100);
        }, 100);
      }))
    }, 1000);
  })
}, err => {

})

let promise2 = promise.then(data => {
  console.log('success', data);
}, err => {
  console.log('err------', err)
});