'use strict';

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
        // 每次调用完then都返回一个全新的promise
        var promise2 = new Promise(function (resolve, reject) {
            if (_this.status === "FULFILLED" /* fulfilled */) {
                var x = onFulfilled(_this.value);
                resolve(x); //用then的返回值作为下一次then的成功结果
            }
            if (_this.status === "REJECTED" /* rejected */) {
                var x = onRejected(_this.reason);
                resolve(x);
            }
            if (_this.status === "PENDING" /* pending */) {
                _this.onResolveCallbacks.push(function () {
                    // to do
                    var x = onFulfilled(_this.value);
                    resolve(x);
                });
                _this.onRejectCallbacks.push(function () {
                    var x = onRejected(_this.reason);
                    resolve(x);
                });
            }
        });
        return promise2;
    };
    return Promise;
}());

module.exports = Promise;
