import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Notificacao } from '../entities/Notificacao';
import { AppError } from '../errors/AppError';

export class NotificacaoService {
  private get repo(): Repository<Notificacao> {
    return AppDataSource.getRepository(Notificacao);
  }

  async findAll(alunoId?: number): Promise<Notificacao[]> {
    const where = alunoId ? { alunoId } : {};
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async marcarComoLida(id: number): Promise<Notificacao> {
    const notificacao = await this.repo.findOneBy({ id });
    if (!notificacao) throw new AppError('Notificação não encontrada', 404);

    notificacao.lida = true;
    return this.repo.save(notificacao);
  }
}
