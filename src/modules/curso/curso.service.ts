import { Injectable } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatriculaService } from '../matricula/matricula.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso } from './entities/curso.entity';

@Injectable()
export class CursoService {
  
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    private readonly matriculaService: MatriculaService
  ) {}

  async create(createCursoDTO: CreateCursoDto) {
    const createdCurso = this.cursoRepository.create({
      ...createCursoDTO,
    });

    return await this.cursoRepository.save(createdCurso);
  }

  async update(id: number, updateCursoDTO: UpdateCursoDto) {
    const curso = await this.cursoRepository.preload({
      id,
      ...updateCursoDTO,
    });

    if (!curso)
      throw new NotFoundException(`O curso ${id} não foi encontrado.`);

    return this.cursoRepository.save(curso);
  }

  findAll() {
    return this.cursoRepository.find({
      relations: {
        matriculas: true,
      },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const curso = await this.cursoRepository.findOne({
      where: { id },
      relations: {
        matriculas: true,
      },
    });

    if (!curso)
      throw new NotFoundException(`O curso ${id} não foi encontrado.`);

    return curso;
  }

  async remove(id: number) {
    const curso = await this.cursoRepository.findOne({
      where: { id },
    });
    
    const matricula = this.matriculaService.findMatriculaByCurso(id);

    if(matricula)
      throw new BadRequestException("Este curso não pode ser removido pois há matrículas vinculadas.")
      
    if (!curso)
      throw new NotFoundException(`O curso ${id} não foi encontrado.`);

    return this.cursoRepository.remove(curso);
  }
}
