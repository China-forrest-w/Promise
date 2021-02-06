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
  constructor(executor: PropsCallBackType) {
    this.status = STATUS.pending;  //当前状态
    this.value = undefined;        //成功
    this.reason = undefined;       //失败原因
    const resolve = (value?: any) => {
      if (this.status === STATUS.pending) {
        this.status = STATUS.fulfilled;
        this.value = value;
      }
    }
    const reject = (reason?: any) => {
      if (this.status === STATUS.pending) {
        this.status = STATUS.rejected;
        this.reason = reason;
      }
    }

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }

  }
}

export default Promise;