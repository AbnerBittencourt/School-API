import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlunoModule } from './modules/aluno/aluno.module';
import { CursoModule } from './modules/curso/curso.module';
import { MatriculaModule } from './modules/matricula/matricula.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'db',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'School',
    autoLoadEntities: true,
    synchronize: false
  }), CursoModule, MatriculaModule, AlunoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
