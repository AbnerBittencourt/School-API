import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    private readonly cursoService: CursoService
  ) {}

  async create(createMatriculaDTO: CreateMatriculaDto) {
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
      throw new NotFoundException(`O matricula ${id} não foi encontrado.`);

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
      throw new NotFoundException(`O matricula ${id} não foi encontrado.`);
      
    return matricula;
  }
  
  async remove(id: number) {
    const matricula = await this.matriculaRepository.findOne({
      where: { id },
    });

    if (!matricula)
      throw new NotFoundException(`O matricula ${id} não foi encontrado.`);

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
