'use strict';

var Promise = /** @class */ (function () {
    function Promise(executor) {
        var _this = this;
        this.status = "PENDING" /* pending */; //当前状态
        this.value = undefined; //成功
        this.reason = undefined; //失败原因
        var resolve = function (value) {
            if (_this.status === "PENDING" /* pending */) {
                _this.status = "FULFILLED" /* fulfilled */;
                _this.value = value;
            }
        };
        var reject = function (reason) {
            if (_this.status === "PENDING" /* pending */) {
                _this.status = "REJECTED" /* rejected */;
                _this.reason = reason;
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
        if (this.status === "FULFILLED" /* fulfilled */) {
            onFulfilled(this.value);
        }
        if (this.status === "REJECTED" /* rejected */) {
            onRejected(this.reason);
        }
    };
    return Promise;
}());

module.exports = Promise;
