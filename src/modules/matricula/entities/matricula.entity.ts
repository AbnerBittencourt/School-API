import { Aluno } from "src/modules/aluno/entities/aluno.entity";
import { Curso } from "src/modules/curso/entities/curso.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("curso_aluno")
export class Matricula {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Curso, (curso) => curso.matriculas)
    curso: Curso;

    @ManyToOne(() => Aluno, (aluno) => aluno.matriculas)
    aluno: Aluno;
}
