import { Matricula } from "src/modules/matricula/entities/matricula.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Aluno {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @OneToMany(() => Matricula, (matricula) => matricula.aluno)
    matriculas: Matricula[];
}
