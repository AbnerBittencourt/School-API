import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Aluno } from '../aluno/entities/aluno.entity';
import { Curso } from '../curso/entities/curso.entity';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { Matricula } from './entities/matricula.entity';

@Injectable()
export class MatriculaService {
  
  constructor(
    @InjectRepository(Matricula)
    private readonly matriculaRepository: Repository<Matricula>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Matricula>,
    @InjectRepository(Aluno)
    private readonly alunoRepository: Repository<Matricula>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createMatriculaDTO: CreateMatriculaDto) {
    createMatriculaDTO = await this.preloadData(createMatriculaDTO);
    const createdMatricula = this.matriculaRepository.create({
      ...createMatriculaDTO,
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
        curso: true,
      },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const matricula = await this.matriculaRepository.findOne({
      where: { id },
      relations: {
        aluno: true,
        curso: true,
      },
    });

    if (!matricula)
      throw new NotFoundException(`A matricula ${id} não foi encontrada.`);

    return matricula;
  }

  async findMatriculaByCurso(cursoId: number) {
    const matricula = await this.dataSource
      .getRepository(Matricula)
      .createQueryBuilder('curso_aluno')
      .where('curso_aluno.cursoId = :cursoId', { cursoId: cursoId })
      .getOne();
    
    return matricula;
  }

  async findMatriculaByAluno(alunoId: number) {
    const matricula = await this.dataSource
      .getRepository(Matricula)
      .createQueryBuilder('curso_aluno')
      .where('curso_aluno.alunoId = :alunoId', { alunoId: alunoId })
      .getOne();
    
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
    const alunoExists = await this.alunoRepository.findOne({
      where: { id:  createMatriculaDTO.aluno.id}
    });

    const cursoExists = await this.cursoRepository.findOne({
      where: { id:  createMatriculaDTO.curso.id}
    });

    if (alunoExists && cursoExists) return createMatriculaDTO;

    throw new NotFoundException(`Dados incorretos.`);
  }
}
