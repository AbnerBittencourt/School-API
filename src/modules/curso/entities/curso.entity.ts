import { Matricula } from "src/modules/matricula/entities/matricula.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Curso {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    descricao: string;

    @Column()
    ementa: string;

    @OneToMany(() => Matricula, (matricula) => matricula.curso)
    matriculas: Matricula[];
}
