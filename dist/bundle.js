'use strict';

// 核心逻辑，因为x可能是promise,解析x的类型，来判断走向
function resolvePromise(promise2, x, resolve, reject) {
    // 根据x的值判断其与promise的关系，因x可能是来自外界的Promise(存在不确定性)，要做容错机制
    if (x === promise2) {
        return reject(new TypeError('出错了')); //我们是为了解析x的状态来决定promise2下一级链式走向，所以不可能相等。
    }
    if (typeof x === 'object' && x !== null || typeof x === 'function') {
        var called_1 = false; //对其他不合规的promise进行处理
        try {
            var then = x.then;
            if (typeof then === 'function') {
                then.call(x, function (y) {
                    if (called_1)
                        return;
                    called_1 = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, function (r) {
                    if (called_1)
                        return;
                    called_1 = true;
                    reject(r);
                });
            }
            else {
                resolve(x); //普通对象
            }
        }
        catch (e) {
            if (called_1)
                return;
            called_1 = true;
            reject(e);
        }
    }
    else {
        resolve(x);
    }
}
var Promise = /** @class */ (function () {
    function Promise(executor) {
        var _this = this;
        this.status = "PENDING" /* pending */; //当前状态
        this.value = undefined; //成功
        this.reason = undefined; //失败原因
        this.onResolveCallbacks = [];
        this.onRejectCallbacks = [];
        var resolve = function (value) {
            if (_this.status === "PENDING" /* pending */) {
                _this.status = "FULFILLED" /* fulfilled */;
                _this.value = value;
                _this.onResolveCallbacks.forEach(function (fn) { return fn(); });
            }
        };
        var reject = function (reason) {
            if (_this.status === "PENDING" /* pending */) {
                _this.status = "REJECTED" /* rejected */;
                _this.reason = reason;
                _this.onRejectCallbacks.forEach(function (fn) { return fn(); });
            }
        };
        try {
            executor(resolve, reject);
        }
        catch (e) {
            reject(e);
        }
    }
    Promise.prototype.then = function (onFulfilled, onRejected) {
        var _this = this;
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (val) { return val; };
        onRejected = typeof onRejected === 'function' ? onRejected : function (err) { throw err; };
        // 每次调用完then都返回一个全新的promise
        var promise2 = new Promise(function (resolve, reject) {
            if (_this.status === "FULFILLED" /* fulfilled */) {
                setTimeout(function () {
                    try {
                        var x = onFulfilled(_this.value);
                        ;
                        // resolve(x);  //用then的返回值作为下一次then的成功结果
                        resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            if (_this.status === "REJECTED" /* rejected */) {
                setTimeout(function () {
                    try {
                        var x = onRejected(_this.reason);
                        // resolve(x);
                        resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            if (_this.status === "PENDING" /* pending */) {
                _this.onResolveCallbacks.push(function () {
                    // to do...
                    setTimeout(function () {
                        try {
                            var x = onFulfilled(_this.value);
                            // resolve(x);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                        catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
                _this.onRejectCallbacks.push(function () {
                    setTimeout(function () {
                        try {
                            var x = onRejected(_this.reason);
                            // resolve(x);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                        catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
            }
        });
        return promise2;
    };
    return Promise;
}());
Promise.deferred = function () {
    var dfd = {};
    dfd.promise = new Promise(function (resolve, reject) {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
};

module.exports = Promise;
