import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursoService } from '../curso/curso.service';
import { Curso } from '../curso/entities/curso.entity';
import { Matricula } from '../matricula/entities/matricula.entity';
import { MatriculaService } from '../matricula/matricula.service';
import { AlunoController } from './aluno.controller';
import { AlunoService } from './aluno.service';
import { Aluno } from './entities/aluno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aluno, Curso, Matricula])], 
  controllers: [AlunoController],
  providers: [AlunoService, CursoService, MatriculaService]
})
export class AlunoModule {}
