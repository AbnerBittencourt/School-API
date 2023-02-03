import { Injectable } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatriculaService } from '../matricula/matricula.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { Aluno } from './entities/aluno.entity';

@Injectable()
export class AlunoService {

  constructor(
    @InjectRepository(Aluno)
    private readonly alunoRepository: Repository<Aluno>,
    private readonly matriculaService: MatriculaService
  ) {}

  async create(createAlunoDTO: CreateAlunoDto) {
    const createdAluno = this.alunoRepository.create({
      ...createAlunoDTO
    });
    
    return await this.alunoRepository.save(createdAluno);
  }

  async update(id: number, updateAlunoDTO: UpdateAlunoDto) {
    const aluno = await this.alunoRepository.preload({
      id,
      ...updateAlunoDTO,
    });

    if (!aluno)
      throw new NotFoundException(`O aluno ${id} não foi encontrado.`);

    return this.alunoRepository.save(aluno);
  }

  findAll() {
    return this.alunoRepository.find({
      relations: {
        matriculas: true
      },
      order: { id: 'ASC'}
    });
  }

  async findOne(id: number) {
    const aluno = await this.alunoRepository.findOne({
      where: { id },
      relations: {
        matriculas: true
      }
    });

    if (!aluno)
      throw new NotFoundException(`O aluno ${id} não foi encontrado.`);
      
    return aluno;
  }
  
  async remove(id: number) {
    const aluno = await this.alunoRepository.findOne({
      where: { id },
    });

    const matriculas = await this.matriculaService.findMatriculaByAluno(id);

    if(matriculas.length > 0)
      throw new BadRequestException("Este aluno não pode ser removido pois ele está matriculado em um curso.")

    if (!aluno)
      throw new NotFoundException(`O aluno ${id} não foi encontrado.`);

    return this.alunoRepository.remove(aluno);
  }
}
