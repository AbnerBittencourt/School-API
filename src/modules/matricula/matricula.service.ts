import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AlunoService } from '../aluno/aluno.service';
import { CursoService } from '../curso/curso.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { Matricula } from './entities/matricula.entity';

@Injectable()
export class MatriculaService {
  
  constructor(
    @InjectRepository(Matricula)
    private readonly matriculaRepository: Repository<Matricula>,
    private readonly alunoService: AlunoService,
    private readonly cursoService: CursoService,
    private readonly dataSource: DataSource
  ) {}

  async create(createMatriculaDTO: CreateMatriculaDto) {
    createMatriculaDTO = await this.preloadData(createMatriculaDTO);
    const createdMatricula = this.matriculaRepository.create({
      ...createMatriculaDTO
    });
    
    return await this.matriculaRepository.save(createdMatricula);
  }

  async update(id: number, updateMatriculaDTO: UpdateMatriculaDto) {
    const matricula = await this.matriculaRepository.preload({
      id,
      ...updateMatriculaDTO,
    });

    if (!matricula)
      throw new NotFoundException(`A matricula ${id} não foi encontrada.`);

    return this.matriculaRepository.save(matricula);
  }

  findAll() {
    return this.matriculaRepository.find({
      relations: {
        aluno: true,
        curso: true
      },
      order: { id: 'ASC'}
    });
  }

  async findOne(id: number) {
    const matricula = await this.matriculaRepository.findOne({
      where: { id },
      relations: {
        aluno: true,
        curso: true
      }
    });

    if (!matricula)
      throw new NotFoundException(`A matricula ${id} não foi encontrada.`);
      
    return matricula;
  }
  
  async findMatriculaByCurso(cursoId: number) {

    const matricula = await this.dataSource.query(`SELECT * FROM CURSO_ALUNO WHERE curso.id = 1`, [cursoId])
    if (!matricula)
      throw new NotFoundException(`Não há matrículas deste curso.`);
    
    //   await this.dataSource.createQueryBuilder()
    // .select()
    // .from(Curso, "curso")
    // .where("curso.id = :id", { id: cursoId })
    // .getOne()
    return matricula;
  }

  async remove(id: number) {
    const matricula = await this.matriculaRepository.findOne({
      where: { id },
    });

    if (!matricula)
      throw new NotFoundException(`A matricula ${id} não foi encontrada.`);

    return this.matriculaRepository.remove(matricula);
  }

  private async preloadData(createMatriculaDTO: CreateMatriculaDto): Promise<CreateMatriculaDto> {

    const alunoExists = await this.alunoService.findOne(createMatriculaDTO.aluno.id);
    const cursoExists = await this.cursoService.findOne(createMatriculaDTO.curso.id);

    if (alunoExists && cursoExists)
      return createMatriculaDTO;

    throw new NotFoundException(`Dados incorretos.`);;
  }
}
