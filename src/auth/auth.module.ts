import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";

@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy], //qui vengono configurati i controllers e i providers
})
export class AuthModule {}