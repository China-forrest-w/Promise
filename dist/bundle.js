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
        if (this.status === "FULFILLED" /* fulfilled */) {
            onFulfilled(this.value);
        }
        if (this.status === "REJECTED" /* rejected */) {
            onRejected(this.reason);
        }
        if (this.status === "PENDING" /* pending */) {
            this.onResolveCallbacks.push(function () {
                // to do
                onFulfilled(_this.value);
            });
            this.onRejectCallbacks.push(function () {
                onRejected(_this.reason);
            });
        }
    };
    return Promise;
}());

module.exports = Promise;
