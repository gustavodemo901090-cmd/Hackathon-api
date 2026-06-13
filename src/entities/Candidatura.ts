import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Aluno } from './Aluno';
import { Vaga } from './Vaga';

export enum CandidaturaStatus {
  PENDENTE = 'PENDENTE',
  EM_ANALISE = 'EM_ANALISE',
  APROVADA = 'APROVADA',
  REPROVADA = 'REPROVADA',
}

@Entity('candidaturas')
export class Candidatura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  alunoId: number;

  @Column()
  vagaId: number;

  @Column({ type: 'enum', enum: CandidaturaStatus, default: CandidaturaStatus.PENDENTE })
  status: CandidaturaStatus;

  @Column({ type: 'text', nullable: true })
  observacao: string | null;

  @CreateDateColumn()
  dataCandidatura: Date;

  @ManyToOne(() => Aluno, (aluno) => aluno.candidaturas)
  @JoinColumn({ name: 'alunoId' })
  aluno: Aluno;

  @ManyToOne(() => Vaga, (vaga) => vaga.candidaturas)
  @JoinColumn({ name: 'vagaId' })
  vaga: Vaga;
}
