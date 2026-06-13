import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Aluno } from './Aluno';

@Entity('notificacoes')
export class Notificacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  alunoId: number;

  @Column({ length: 255 })
  titulo: string;

  @Column({ type: 'text' })
  mensagem: string;

  @Column({ default: false })
  lida: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Aluno, (aluno) => aluno.notificacoes)
  @JoinColumn({ name: 'alunoId' })
  aluno: Aluno;
}
