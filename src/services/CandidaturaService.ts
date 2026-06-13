import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Candidatura } from '../entities/Candidatura';
import { Aluno } from '../entities/Aluno';
import { AppError } from '../errors/AppError';
import { CreateCandidaturaInput, UpdateCandidaturaInput } from '../schemas/candidaturaSchema';

export class CandidaturaService {
  private get repo(): Repository<Candidatura> {
    return AppDataSource.getRepository(Candidatura);
  }

  private get alunoRepo(): Repository<Aluno> {
    return AppDataSource.getRepository(Aluno);
  }

  async create(data: CreateCandidaturaInput): Promise<Candidatura> {
    const aluno = await this.alunoRepo.findOneBy({ id: data.alunoId });
    if (!aluno) throw new AppError('Aluno não encontrado', 404);

    const jaExiste = await this.repo.findOneBy({
      alunoId: data.alunoId,
      vagaId: data.vagaId,
    });
    if (jaExiste) throw new AppError('Aluno já se candidatou a esta vaga', 409);

    const candidatura = this.repo.create(data);
    return this.repo.save(candidatura);
  }

  async findAll(): Promise<Candidatura[]> {
    return this.repo.find({
      relations: ['aluno'],
      order: { dataCandidatura: 'DESC' },
    });
  }

  async findById(id: number): Promise<Candidatura> {
    const candidatura = await this.repo.findOne({
      where: { id },
      relations: ['aluno'],
    });
    if (!candidatura) throw new AppError('Candidatura não encontrada', 404);
    return candidatura;
  }

  async update(id: number, data: UpdateCandidaturaInput): Promise<Candidatura> {
    const candidatura = await this.findById(id);
    Object.assign(candidatura, data);
    return this.repo.save(candidatura);
  }

  async delete(id: number): Promise<void> {
    const candidatura = await this.findById(id);
    await this.repo.remove(candidatura);
  }
}
