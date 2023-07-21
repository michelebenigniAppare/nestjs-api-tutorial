import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
    //data: per indicare il tipo di dato da user che vogli, altrimenti di base li prende tutti
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();

    if(data){
        return request.user[data];
    }
    return request.user;
  },
);