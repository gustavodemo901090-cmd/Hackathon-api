import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Aluno } from '../entities/Aluno';
import { Usuario, UsuarioPerfil } from '../entities/Usuario';
import { AppError } from '../errors/AppError';
import { CreateAlunoInput, UpdateAlunoInput } from '../schemas/alunoSchema';
import { buildLoginFromEmail, hashPassword } from '../utils/auth';

export class AlunoService {
  private get repo(): Repository<Aluno> {
    return AppDataSource.getRepository(Aluno);
  }

  private get usuarioRepo(): Repository<Usuario> {
    return AppDataSource.getRepository(Usuario);
  }

  async create(data: CreateAlunoInput): Promise<Aluno> {
    const existing = await this.repo.findOneBy({ email: data.email });
    if (existing) throw new AppError('Email já cadastrado', 409);

    const login = buildLoginFromEmail(data.email);
    const usuarioExistente = await this.usuarioRepo.findOneBy({ login });
    if (usuarioExistente) {
      const tipo = usuarioExistente.perfil === UsuarioPerfil.EMPRESA ? 'empresa' : 'outro usuário';
      throw new AppError(`E-mail já cadastrado como ${tipo}`, 409);
    }

    return AppDataSource.transaction(async (manager) => {
      const usuarioRepo = manager.getRepository(Usuario);
      const alunoRepo = manager.getRepository(Aluno);

      const usuario = usuarioRepo.create({
        nome: data.nome,
        login,
        senha: hashPassword(data.senha),
        perfil: UsuarioPerfil.ALUNO,
        ativo: true,
      });
      const usuarioSalvo = await usuarioRepo.save(usuario);

      const aluno = alunoRepo.create({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone ?? null,
        curso: data.curso,
        periodo: data.periodo,
        aptoEstagio: data.aptoEstagio,
        usuarioId: usuarioSalvo.id,
      });
      return alunoRepo.save(aluno);
    });
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
