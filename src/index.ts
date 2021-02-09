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
    if(this.status === STATUS.fulfilled) {
      onFulfilled(this.value);
    }
    if(this.status === STATUS.rejected) {
      onRejected(this.reason);
    }
    if(this.status === STATUS.pending) {
      this.onResolveCallbacks.push(() => {
        // to do
        onFulfilled(this.value);
      })

      this.onRejectCallbacks.push(() =>  {
        onRejected(this.reason);
      })
    }
  }
}

export default Promise;