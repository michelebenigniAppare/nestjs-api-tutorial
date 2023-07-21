import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

//utilizzato per poter trasportare l'accesso su altri router
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService, private prisma: PrismaService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        })
    }

    //ciò che viene inserito ritorna all'utente dopo il suo riconoscimento, in questo caso il payload sono le info dell'utente
    async validate(payload: {sub: number, email: string}){
        const user= await this.prisma.user.findUnique({
            where:{
                id: payload.sub,
            }
        })
        delete user.hash;
        return user;
    }
}