import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Candidatura } from './Candidatura';
import { Notificacao } from './Notificacao';
import { Usuario } from './Usuario';

@Entity('alunos')
export class Aluno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nome: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column()
  usuarioId: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone: string | null;

  @Column({ length: 100 })
  curso: string;

  @Column({ type: 'int' })
  periodo: number;

  @Column({ default: false })
  aptoEstagio: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Candidatura, (candidatura) => candidatura.aluno)
  candidaturas: Candidatura[];

  @OneToMany(() => Notificacao, (notificacao) => notificacao.aluno)
  notificacoes: Notificacao[];

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;
}
