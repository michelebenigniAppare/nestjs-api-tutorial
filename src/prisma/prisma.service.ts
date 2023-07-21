import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

//la classe con cui andrò a gestire il db dai service delle altre cartelle con service.ts
@Injectable()
export class PrismaService extends PrismaClient{
    constructor(config: ConfigService){
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL')
                }
            }
        });
    }

    cleanDB(){
        return this.$transaction([
            this.bookmark.deleteMany(),
            this.user.deleteMany()
        ])
    }
}
