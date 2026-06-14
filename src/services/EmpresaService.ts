import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Empresa, EmpresaStatus } from '../entities/Empresa';
import { Usuario, UsuarioPerfil } from '../entities/Usuario';
import { AppError } from '../errors/AppError';
import { CreateEmpresaInput, UpdateEmpresaInput } from '../schemas/empresaSchema';
import { buildLoginFromEmail, hashPassword } from '../utils/auth';

export class EmpresaService {
  private get repo(): Repository<Empresa> {
    return AppDataSource.getRepository(Empresa);
  }

  private get usuarioRepo(): Repository<Usuario> {
    return AppDataSource.getRepository(Usuario);
  }

  async create(data: CreateEmpresaInput): Promise<Empresa> {
    const login = buildLoginFromEmail(data.email);

    if (await this.repo.findOneBy({ cnpj: data.cnpj })) {
      throw new AppError('CNPJ já cadastrado', 409);
    }
    if (await this.repo.findOneBy({ email: data.email })) {
      throw new AppError('E-mail já cadastrado como empresa', 409);
    }

    const usuarioExistente = await this.usuarioRepo.findOneBy({ login });
    if (usuarioExistente) {
      const tipo = usuarioExistente.perfil === UsuarioPerfil.ALUNO ? 'aluno' : 'outro usuário';
      throw new AppError(`E-mail já cadastrado como ${tipo}`, 409);
    }

    return AppDataSource.transaction(async (manager) => {
      const usuarioRepo = manager.getRepository(Usuario);
      const empresaRepo = manager.getRepository(Empresa);

      const usuario = usuarioRepo.create({
        nome: data.nomeFantasia,
        login,
        senha: hashPassword(data.senha),
        perfil: UsuarioPerfil.EMPRESA,
        ativo: true,
      });
      const usuarioSalvo = await usuarioRepo.save(usuario);

      const empresa = empresaRepo.create({
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia,
        cnpj: data.cnpj,
        email: data.email,
        telefone: data.telefone,
        usuarioId: usuarioSalvo.id,
        status: EmpresaStatus.PENDENTE,
      });
      return empresaRepo.save(empresa);
    });
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
