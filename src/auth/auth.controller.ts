import { Body, Controller, HttpCode, HttpStatus, Post, Req} from "@nestjs/common";
import { Request } from 'express'; // Importa l'interfaccia Request da 'express'
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}
 
    @Post('signup')
    signup(@Body() dto: AuthDto){
        //il return dei controller è ciò che viene rinviato al client
        return this.authService.signup(dto); 
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: AuthDto, @Req() req: Request){
        req.user;
        return this.authService.signin(dto);
    }
}