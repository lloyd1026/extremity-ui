class CustomError extends Error {
  code: string;
    constructor(message: string, code: string) {
      super(message);  // 设置错误消息
      this.code = code;
      this.name = this.constructor.name;  // 设置错误的名称为类名
    }
}

class UnAuthenticatedError extends CustomError{
  constructor(message:string){
    super(message,"Unauthencated");
  }
}

export { CustomError, UnAuthenticatedError };
