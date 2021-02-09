const enum STATUS {
    pending = 'PENDING',
    fulfilled = 'FULFILLED',
    rejected = 'REJECTED'
}
type PropsCallBackType = (resolve: ParameterValueType, reject: ParameterValueType) => void;
type ParameterValueType = (params?: any) => void

    // 核心逻辑，因为x可能是promise,解析x的类型，来判断走向
function resolvePromise(promise2: Promise, x: Promise | string | number | void, resolve: Function, reject: Function) {
    // 根据x的值判断其与promise的关系，因x可能是来自外界的Promise(存在不确定性)，要做容错机制
    if (x === promise2) {
        return reject(new TypeError('出错了'))  //我们是为了解析x的状态来决定promise2下一级链式走向，所以不可能相等。
    }
    if (typeof x === 'object' && x !== null || typeof x === 'function') {
        let called = false;                    //对其他不合规的promise进行处理
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, y => {            //这样写优点：就会只取一次then
                    if (called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, r => {
                    if (called) return;
                    called = true;
                    reject(r);
                })
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}

class Promise {
    status: STATUS;
    value: any;
    reason: any;
    onResolveCallbacks: Function[];
    onRejectCallbacks: Function[];
    constructor(executor: PropsCallBackType) {
        this.status = STATUS.pending;  //当前状态
        this.value = undefined;        //成功
        this.reason = undefined;       //失败原因
        this.onResolveCallbacks = [];
        this.onRejectCallbacks = [];
        const resolve = (value?: any) => {
            if (this.status === STATUS.pending) {
                this.status = STATUS.fulfilled;
                this.value = value;
                this.onResolveCallbacks.forEach(fn => fn());
            }
        }
        const reject = (reason?: any) => {
            if (this.status === STATUS.pending) {
                this.status = STATUS.rejected;
                this.reason = reason;
                this.onRejectCallbacks.forEach(fn => fn());
            }
        }

        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }

    then(onFulfilled: ParameterValueType, onRejected: ParameterValueType) {
        // 每次调用完then都返回一个全新的promise
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === STATUS.fulfilled) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);;
                        // resolve(x);  //用then的返回值作为下一次then的成功结果
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            if (this.status === STATUS.rejected) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        // resolve(x);
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            if (this.status === STATUS.pending) {
                this.onResolveCallbacks.push(() => {
                    // to do...
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            // resolve(x);
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                })

                this.onRejectCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            // resolve(x);
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);

                })
            }
        })
        return promise2;
    }
}

export default Promise;