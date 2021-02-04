let promise2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject();
  }, 1000)
}).then((data) => {
  return 1;
}, err => {
  return 100;
})

promise2.then(res => {
  console.log(res)
}, err => {
  console.log(err);
})