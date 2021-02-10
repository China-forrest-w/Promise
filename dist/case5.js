const fs = require('fs');
const path = require('path');

function promisify(fn) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            fn(...args, function (err, data) {
                if (err) reject(err);
                resolve(data);
            })
        })
    }
}
let read = promisify(fs.readFile);

function isPromise(val) {
    if ((typeof val === 'object' && val !== null) || typeof val === 'function') {
        if (typeof val.then === 'function') {
            return true;
        }
    }
    return false;
}

Promise.all = function (values) {
    return new Promise((resolve, reject) => {
        let arr = [];
        let times = 0;

        function collectResult(val, key) {
            arr[key] = val;
            if (++times === values.length) {
                resolve(arr);
            }
        }

        for (let i = 0; i < values.length; i++) {
            let value = values[i];
            if (value && isPromise(value)) {
                value.then((y) => {
                    collectResult(y, i)
                }, reject)
            } else {
                collectResult(value, i);
            }
        }
    })
}

// jest 
Promise.all([read(path.resolve(__dirname, 'name.txt'), 'utf8'), read(path.resolve(__dirname, 'age.txt'), 'utf8'), 0]).then(data => {
    console.log(data);
}).catch(err => {  //
    console.log(err);
})
