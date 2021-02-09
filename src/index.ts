const enum STATUS {
    pending = 'PENDING',
    fulfilled = 'FULFILLED',
    rejected = 'REJECTED'
  }
  type PropsCallBackType = (resolve: ParameterValueType, reject: ParameterValueType) => void;
  type ParameterValueType = (params?: any) => void
  
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
            if(this.status === STATUS.fulfilled) {
                let x = onFulfilled(this.value);;
                resolve(x);  //用then的返回值作为下一次then的成功结果
              }
              if(this.status === STATUS.rejected) {
                let x = onRejected(this.reason);
                resolve(x);
              }
              if(this.status === STATUS.pending) {
                this.onResolveCallbacks.push(() => {
                  // to do
                  let x = onFulfilled(this.value);
                  resolve(x);
                })
          
                this.onRejectCallbacks.push(() =>  {
                  let x = onRejected(this.reason);
                  resolve(x);
                })
              }
        })
        return promise2;
    }
  }
  
  export default Promise;