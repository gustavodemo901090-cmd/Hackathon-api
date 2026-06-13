import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UsuarioPerfil {
  ADMIN = 'ADMIN',
  COORDENADOR = 'COORDENADOR',
  OPERADOR = 'OPERADOR',
  ALUNO = 'ALUNO',
  EMPRESA = 'EMPRESA',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ unique: true, length: 50 })
  login: string;

  @Column({ length: 100 })
  senha: string;

  @Column({ type: 'varchar', length: 20, default: UsuarioPerfil.OPERADOR })
  perfil: UsuarioPerfil | string;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
