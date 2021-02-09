/*
链式回调是promise很重要的特定； 无论成功还是失败then都可以返回结果（
1.then出错了走下一个then的错误 
2.返回一个普通值(包含then的错误回调返回普通值)也就是不是promise值，那么就会作为下一次then的成功结果
3.是promise的情况: 采用Promise执行的状态，作为解析的结果

因此： 本级中的then中的回调函数式走成功还是失败，就看上一级的then有没有抛出错误或者返回一个Promise(内部抛错reject)
）
*/ 
const Promise = require('./bundle');
let promise = new Promise((resolve, reject) => {
  reject('ok')
  // resolve();
}).then(data => {
  // return new Promise((resolve, reject) => {
  //   resolve(100);
  // })
  return 100;
}, err => {
  return 3;
})

promise.then(data => {
  console.log(data, '**');
},err => {
  console.log(err, '----');
})