import { Aluno } from "src/modules/aluno/entities/aluno.entity";
import { Curso } from "src/modules/curso/entities/curso.entity";

export class CreateMatriculaDto {
    curso: Curso;
    aluno: Aluno;
}
