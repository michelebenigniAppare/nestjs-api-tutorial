import {Test} from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

describe('App e2e', ()=>{
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    //simulazione di una app
    app = moduleRef.createNestApplication();
    //le pipes, per la validazione dei pipes
    app.useGlobalPipes(
      new ValidationPipe({
      whitelist: true,
    }));
    await app.init();
    await app.listen(3334);

    prisma= app.get(PrismaService);

    await prisma.cleanDB();

    pactum.request.setBaseUrl('http://localhost:3334')
  });

  afterAll(()=> {
    app.close();
  });

  describe('Auth', ()=>{
    const dto: AuthDto ={
      email: 'vladt@gmail.com',
      password: '123'
    }
    describe('Signup', ()=>{
      it('should throw if email empty', ()=> {
        return pactum.spec().post('/auth/signup').withBody({password: dto.password}).expectStatus(400);
      })
      it('should throw if password empty', ()=> {
        return pactum.spec().post('/auth/signup').withBody({email: dto.email}).expectStatus(400);
      })
      it('should throw if no body provided', ()=> {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      })
      it('should signup', ()=> {
        return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201)
      })
    });
    
    describe('Signin', ()=>{
      it('should throw if email empty', ()=> {
        return pactum.spec().post('/auth/signin').withBody({password: dto.password}).expectStatus(400);
      })
      it('should throw if password empty', ()=> {
        return pactum.spec().post('/auth/signin').withBody({email: dto.email}).expectStatus(400);
      })
      it('should throw if no body provided', ()=> {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      }) 
      it('should signin', ()=> {
        return pactum.spec().post('/auth/signin').withBody(dto).expectStatus(200).stores('userAt', 'access_token')
      })
    })
    });


  describe('User', ()=>{
    describe('Get me', ()=>{
      it('should get current user', ()=>{
        return pactum.spec().get('/users/me').withHeaders({Authorization: 'Bearer $S{userAt}',}).expectStatus(200).inspect();
      })
    });

    describe('Edit user', ()=>{
      it('should edit user', ()=>{
        const dto: EditUserDto = {
          firstName: "Vladimir",
          email: "vlad@ppp.com"
        }
        return pactum
        .spec()
        .patch('/users')
        .withHeaders({Authorization: 'Bearer $S{userAt}',})
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.firstName)
        .expectBodyContains(dto.email)
        .inspect();
      })
    });
  });

  describe('Bookmarks', ()=>{
    //dovrebbe essere vuoto la table dei bookmarks, all'inizio
    describe('Get empty bookmarks', ()=>{ 
      it('should get bookmarks', ()=>{
        return pactum
        .spec()
        .get('/bookmarks')
        .withHeaders({Authorization: 'Bearer $S{userAt}',})
        .expectStatus(200)
        .expectBody([])
      })
    });
    describe('Create bookmark', ()=>{
      const dto: CreateBookmarkDto = {
        title: "First Bookmark",
        link: "https://example.com"
      }
      it('should create bookmark', ()=>{
        return pactum
        .spec()
        .post('/bookmarks')
        .withHeaders({Authorization: 'Bearer $S{userAt}',})
        .withBody(dto)
        .expectStatus(201)
        .stores("bookmarkId", "id")
      })
    });
    describe('Get bookmarks', ()=>{
      it('should get bookmarks', ()=>{
        return pactum
        .spec()
        .get('/bookmarks')
        .withHeaders({Authorization: 'Bearer $S{userAt}',})
        .expectStatus(200)
        .expectJsonLength(1);
      });
    });
    describe('Get bookmark by id', ()=>{
      it('should get bookmarks by id', ()=>{
        return pactum
        .spec()
        .get('/bookmarks/{id}')
        .withPathParams('id', '$S{bookmarkId}')
        .withHeaders({Authorization: 'Bearer $S{userAt}',})
        .expectStatus(200)
        .expectBodyContains('$S{bookmarkId}')
      });
    });
    describe('Edit bookmark by id', ()=>{
      const dto: EditBookmarkDto = {
        title: 'SuperTitolo QUI!!',
        description: 'Descrizione blablablablabla',
      }
      it('should edit bookmark', ()=>{
        return pactum
        .spec()
        .patch('/bookmarks/{id}')
        .withPathParams('id', '$S{bookmarkId}')
        .withHeaders({Authorization: 'Bearer $S{userAt}',})
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.title)
        .expectBodyContains(dto.description)
        .inspect()
      });
    });
    describe('Delete bookmark by id', ()=>{
      it('should delete bookmark', ()=>{
        return pactum
        .spec()
        .delete('/bookmarks/{id}')
        .withPathParams('id', '$S{bookmarkId}')
        .withHeaders({Authorization: 'Bearer $S{userAt}',})
        .expectStatus(204)
        .inspect()
      });

      it('should get empty bookmarks', ()=>{
        return pactum
        .spec()
        .get('/bookmarks')
        .withHeaders({Authorization: 'Bearer $S{userAt}',})
        .expectStatus(200)
        .expectJsonLength(0)
      })
    });
  });

});