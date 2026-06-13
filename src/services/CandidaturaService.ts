import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Candidatura, CandidaturaStatus } from '../entities/Candidatura';
import { Aluno } from '../entities/Aluno';
import { Vaga, VagaStatus } from '../entities/Vaga';
import { Notificacao } from '../entities/Notificacao';
import { AppError } from '../errors/AppError';
import { CreateCandidaturaInput, UpdateCandidaturaInput } from '../schemas/candidaturaSchema';

export class CandidaturaService {
  private get repo(): Repository<Candidatura> {
    return AppDataSource.getRepository(Candidatura);
  }

  private get alunoRepo(): Repository<Aluno> {
    return AppDataSource.getRepository(Aluno);
  }

  private get vagaRepo(): Repository<Vaga> {
    return AppDataSource.getRepository(Vaga);
  }

  private get notificacaoRepo(): Repository<Notificacao> {
    return AppDataSource.getRepository(Notificacao);
  }

  async create(data: CreateCandidaturaInput): Promise<Candidatura> {
    const aluno = await this.alunoRepo.findOneBy({ id: data.alunoId });
    if (!aluno) throw new AppError('Aluno não encontrado', 404);
    if (!aluno.aptoEstagio) throw new AppError('Aluno não está apto para estágio', 403);

    const vaga = await this.vagaRepo.findOne({ where: { id: data.vagaId }, relations: ['empresa'] });
    if (!vaga) throw new AppError('Vaga não encontrada', 404);
    if (vaga.status === VagaStatus.ENCERRADA) {
      throw new AppError('Vaga encerrada não aceita candidaturas', 400);
    }

    const jaExiste = await this.repo.findOneBy({ alunoId: data.alunoId, vagaId: data.vagaId });
    if (jaExiste) throw new AppError('Aluno já se candidatou a esta vaga', 409);

    const candidatura = this.repo.create(data);
    const saved = await this.repo.save(candidatura);

    const notificacao = this.notificacaoRepo.create({
      alunoId: data.alunoId,
      titulo: 'Candidatura realizada',
      mensagem: `Sua candidatura para a vaga "${vaga.titulo}" foi enviada com sucesso.`,
    });
    await this.notificacaoRepo.save(notificacao);

    return saved;
  }

  async findAll(): Promise<Candidatura[]> {
    return this.repo.find({
      relations: ['aluno', 'vaga'],
      order: { dataCandidatura: 'DESC' },
    });
  }

  async findById(id: number): Promise<Candidatura> {
    const candidatura = await this.repo.findOne({
      where: { id },
      relations: ['aluno', 'vaga'],
    });
    if (!candidatura) throw new AppError('Candidatura não encontrada', 404);
    return candidatura;
  }

  async update(id: number, data: UpdateCandidaturaInput): Promise<Candidatura> {
    const candidatura = await this.findById(id);
    const oldStatus = candidatura.status;

    Object.assign(candidatura, data);
    const saved = await this.repo.save(candidatura);

    if (data.status && data.status !== oldStatus) {
      const notificacao = this.notificacaoRepo.create({
        alunoId: candidatura.alunoId,
        titulo: 'Status da candidatura atualizado',
        mensagem: `Sua candidatura teve o status atualizado para: ${data.status}.`,
      });
      await this.notificacaoRepo.save(notificacao);
    }

    return saved;
  }

  async delete(id: number): Promise<void> {
    const candidatura = await this.findById(id);
    await this.repo.remove(candidatura);
  }
}
