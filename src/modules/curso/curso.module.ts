import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlunoService } from '../aluno/aluno.service';
import { Aluno } from '../aluno/entities/aluno.entity';
import { Matricula } from '../matricula/entities/matricula.entity';
import { MatriculaService } from '../matricula/matricula.service';
import { CursoController } from './curso.controller';
import { CursoService } from './curso.service';
import { Curso } from './entities/curso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Curso, Matricula, Aluno])], 
  controllers: [CursoController],
  providers: [CursoService, MatriculaService, AlunoService]
})
export class CursoModule {}
