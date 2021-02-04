/*
promise 可以解决多个异步并行执行，最终得到所有的结果
异步嵌套问题

每个promise都有三个状态  pending resolve reject
每个promise需要有一个then方法， promise的then方法有两个参数 一个是成功回调，一个是失败回调
new Promise会立即执行
一旦成功就不能失败，一旦失败就不会成功，也就是状态是不可逆的
当promise抛出异常后也会走向失败态
*/
const promise = new Promise((resolve, reject) => {
  // resolve(333);
  reject(new Promise((resolve, reject) => {
    resolve(897879);
  }));
})
promise.then(data => {
  console.log('data', data);
}, (err) => {
  console.log('err', err);
})

promise.then(data => {
  console.log('data', data);
}, (err) => {
  console.log('err', err);
})