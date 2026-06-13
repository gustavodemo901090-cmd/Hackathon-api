import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Aluno } from '../entities/Aluno';
import { Usuario, UsuarioPerfil } from '../entities/Usuario';
import { Empresa } from '../entities/Empresa';
import { AppError } from '../errors/AppError';
import { CreateUsuarioInput, UpdateUsuarioInput } from '../schemas/usuarioSchema';
import { hashPassword, signToken, verifyPassword } from '../utils/auth';

function cleanUsuario(usuario: Usuario) {
  const { senha, ...rest } = usuario as Usuario & { senha?: string };
  return rest;
}

export class UsuarioService {
  private get repo(): Repository<Usuario> {
    return AppDataSource.getRepository(Usuario);
  }

  private get alunoRepo(): Repository<Aluno> {
    return AppDataSource.getRepository(Aluno);
  }

  private get empresaRepo(): Repository<Empresa> {
    return AppDataSource.getRepository(Empresa);
  }

  async create(data: CreateUsuarioInput): Promise<Usuario> {
    const existing = await this.repo.findOneBy({ login: data.login });
    if (existing) throw new AppError('Login já cadastrado', 409);

    const usuario = this.repo.create({
      ...data,
      senha: hashPassword(data.senha),
      ativo: data.ativo ?? true,
      perfil: data.perfil ?? UsuarioPerfil.OPERADOR,
    });

    return this.repo.save(usuario);
  }

  async findAll(): Promise<Usuario[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: number): Promise<Usuario> {
    const usuario = await this.repo.findOneBy({ id });
    if (!usuario) throw new AppError('Usuário não encontrado', 404);
    return usuario;
  }

  async update(id: number, data: UpdateUsuarioInput): Promise<Usuario> {
    const usuario = await this.findById(id);

    if (data.login && data.login !== usuario.login) {
      const existing = await this.repo.findOneBy({ login: data.login });
      if (existing) throw new AppError('Login já cadastrado', 409);
    }

    Object.assign(usuario, data);
    if (data.senha) {
      usuario.senha = hashPassword(data.senha);
    }

    return this.repo.save(usuario);
  }

  async delete(id: number): Promise<void> {
    const usuario = await this.findById(id);
    await this.repo.remove(usuario);
  }

  async login(login: string, senha: string): Promise<{
    token: string;
    usuario: ReturnType<typeof cleanUsuario>;
    entityId?: number;
    entityType?: string;
    entityStatus?: string;
  }> {
    let usuario = await this.repo.findOneBy({ login });

    if (!usuario) {
      const aluno = await this.alunoRepo.findOne({ where: { email: login }, relations: ['usuario'] });
      if (aluno?.usuario) {
        usuario = aluno.usuario;
      }
    }

    if (!usuario) {
      const empresa = await this.empresaRepo.findOne({ where: { email: login }, relations: ['usuario'] });
      if (empresa?.usuario) {
        usuario = empresa.usuario;
      }
    }

    if (!usuario) throw new AppError('Login ou senha inválidos', 401);
    if (!usuario.ativo) throw new AppError('Usuário inativo', 403);
    if (!verifyPassword(senha, usuario.senha)) throw new AppError('Login ou senha inválidos', 401);

    let entityId: number | undefined;
    let entityType: string | undefined;
    let entityStatus: string | undefined;

    if (usuario.perfil === UsuarioPerfil.ALUNO) {
      const aluno = await this.alunoRepo.findOneBy({ usuarioId: usuario.id });
      if (aluno) {
        entityId = aluno.id;
        entityType = 'aluno';
      }
    } else if (usuario.perfil === UsuarioPerfil.EMPRESA) {
      const empresa = await this.empresaRepo.findOneBy({ usuarioId: usuario.id });
      if (empresa) {
        entityId = empresa.id;
        entityType = 'empresa';
        entityStatus = empresa.status;
      }
    }

    return {
      token: signToken({
        id: usuario.id,
        login: usuario.login,
        nome: usuario.nome,
        perfil: usuario.perfil,
        entityId,
        entityType,
      }),
      usuario: cleanUsuario(usuario),
      entityId,
      entityType,
      entityStatus,
    };
  }
}
