import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Aluno } from '../entities/Aluno';
import { AppError } from '../errors/AppError';
import { CreateAlunoInput, UpdateAlunoInput } from '../schemas/alunoSchema';

export class AlunoService {
  private get repo(): Repository<Aluno> {
    return AppDataSource.getRepository(Aluno);
  }

  async create(data: CreateAlunoInput): Promise<Aluno> {
    const existing = await this.repo.findOneBy({ email: data.email });
    if (existing) throw new AppError('Email já cadastrado', 409);

    const aluno = this.repo.create(data);
    return this.repo.save(aluno);
  }

  async findAll(): Promise<Aluno[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: number): Promise<Aluno> {
    const aluno = await this.repo.findOneBy({ id });
    if (!aluno) throw new AppError('Aluno não encontrado', 404);
    return aluno;
  }

  async update(id: number, data: UpdateAlunoInput): Promise<Aluno> {
    const aluno = await this.findById(id);

    if (data.email && data.email !== aluno.email) {
      const existing = await this.repo.findOneBy({ email: data.email });
      if (existing) throw new AppError('Email já cadastrado', 409);
    }

    Object.assign(aluno, data);
    return this.repo.save(aluno);
  }

  async delete(id: number): Promise<void> {
    const aluno = await this.findById(id);
    await this.repo.remove(aluno);
  }
}
