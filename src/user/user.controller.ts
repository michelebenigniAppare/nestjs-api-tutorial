import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';


//UseGuards serve per verificare l'autenticazione con il metodo dei token nell'header, 
//inoltre avendo utilizzato una guardia presonalizzata avremo i dati dell'utente nella request di GetUser
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}
    @Get('me') //visualizza utente
    getMe(@GetUser() user: User){
        return user;  
    }

    @Patch()//modifica utente email e pw
    editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto){
         return this.userService.editUser(userId, dto);
    }
}
