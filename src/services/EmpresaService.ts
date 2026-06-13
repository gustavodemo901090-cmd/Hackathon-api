import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Empresa, EmpresaStatus } from '../entities/Empresa';
import { AppError } from '../errors/AppError';
import { CreateEmpresaInput, UpdateEmpresaInput } from '../schemas/empresaSchema';

export class EmpresaService {
  private get repo(): Repository<Empresa> {
    return AppDataSource.getRepository(Empresa);
  }

  async create(data: CreateEmpresaInput): Promise<Empresa> {
    if (await this.repo.findOneBy({ cnpj: data.cnpj })) {
      throw new AppError('CNPJ já cadastrado', 409);
    }
    if (await this.repo.findOneBy({ email: data.email })) {
      throw new AppError('Email já cadastrado', 409);
    }

    const empresa = this.repo.create(data);
    return this.repo.save(empresa);
  }

  async findAll(): Promise<Empresa[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: number): Promise<Empresa> {
    const empresa = await this.repo.findOneBy({ id });
    if (!empresa) throw new AppError('Empresa não encontrada', 404);
    return empresa;
  }

  async update(id: number, data: UpdateEmpresaInput): Promise<Empresa> {
    const empresa = await this.findById(id);

    if (data.email && data.email !== empresa.email) {
      if (await this.repo.findOneBy({ email: data.email })) {
        throw new AppError('Email já cadastrado', 409);
      }
    }

    Object.assign(empresa, data);
    return this.repo.save(empresa);
  }

  async delete(id: number): Promise<void> {
    const empresa = await this.findById(id);
    await this.repo.remove(empresa);
  }

  async aprovar(id: number): Promise<Empresa> {
    const empresa = await this.findById(id);
    empresa.status = EmpresaStatus.APROVADA;
    return this.repo.save(empresa);
  }

  async bloquear(id: number): Promise<Empresa> {
    const empresa = await this.findById(id);
    empresa.status = EmpresaStatus.BLOQUEADA;
    return this.repo.save(empresa);
  }
}
