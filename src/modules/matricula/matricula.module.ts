import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlunoService } from '../aluno/aluno.service';
import { Aluno } from '../aluno/entities/aluno.entity';
import { CursoService } from '../curso/curso.service';
import { Curso } from '../curso/entities/curso.entity';
import { Matricula } from './entities/matricula.entity';
import { MatriculaController } from './matricula.controller';
import { MatriculaService } from './matricula.service';

@Module({
  imports: [TypeOrmModule.forFeature([Matricula, Aluno, Curso])], 
  controllers: [MatriculaController],
  providers: [MatriculaService, AlunoService, CursoService]
})
export class MatriculaModule {}
