import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Vaga, VagaStatus } from '../entities/Vaga';
import { Empresa, EmpresaStatus } from '../entities/Empresa';
import { AppError } from '../errors/AppError';
import { CreateVagaInput, UpdateVagaInput } from '../schemas/vagaSchema';

export class VagaService {
  private get repo(): Repository<Vaga> {
    return AppDataSource.getRepository(Vaga);
  }

  private get empresaRepo(): Repository<Empresa> {
    return AppDataSource.getRepository(Empresa);
  }

  async create(data: CreateVagaInput): Promise<Vaga> {
    const empresa = await this.empresaRepo.findOneBy({ id: data.empresaId });
    if (!empresa) throw new AppError('Empresa não encontrada', 404);
    if (empresa.status === EmpresaStatus.PENDENTE) {
      throw new AppError('Empresa pendente não pode criar vagas', 403);
    }
    if (empresa.status === EmpresaStatus.BLOQUEADA) {
      throw new AppError('Empresa bloqueada não pode criar vagas', 403);
    }

    const vaga = this.repo.create(data);
    return this.repo.save(vaga);
  }

  async findAll(): Promise<Vaga[]> {
    return this.repo.find({ relations: ['empresa'], order: { createdAt: 'DESC' } });
  }

  async findAllByEmpresa(empresaId: number): Promise<Vaga[]> {
    return this.findByEmpresa(empresaId);
  }

  async findById(id: number): Promise<Vaga> {
    const vaga = await this.repo.findOne({ where: { id }, relations: ['empresa'] });
    if (!vaga) throw new AppError('Vaga não encontrada', 404);
    return vaga;
  }

  async findByEmpresa(empresaId: number): Promise<Vaga[]> {
    await this.empresaRepo.findOneByOrFail({ id: empresaId }).catch(() => {
      throw new AppError('Empresa não encontrada', 404);
    });
    return this.repo.find({
      where: { empresaId },
      relations: ['empresa'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAtivas(): Promise<Vaga[]> {
    return this.repo.find({
      where: {
        status: VagaStatus.ATIVA,
        empresa: { status: EmpresaStatus.APROVADA },
      },
      relations: ['empresa'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, data: UpdateVagaInput): Promise<Vaga> {
    const vaga = await this.findById(id);
    Object.assign(vaga, data);
    return this.repo.save(vaga);
  }

  async delete(id: number): Promise<void> {
    const vaga = await this.findById(id);
    await this.repo.remove(vaga);
  }
}
