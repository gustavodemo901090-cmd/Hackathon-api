import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Empresa } from './Empresa';
import { Candidatura } from './Candidatura';

export enum VagaStatus {
  ATIVA = 'ATIVA',
  ENCERRADA = 'ENCERRADA',
}

export enum VagaModalidade {
  PRESENCIAL = 'PRESENCIAL',
  REMOTO = 'REMOTO',
  HIBRIDO = 'HIBRIDO',
}

@Entity('vagas')
export class Vaga {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  titulo: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ type: 'text' })
  requisitos: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      from: (val: string) => parseFloat(val),
      to: (val: number) => val,
    },
  })
  bolsa: number;

  @Column({ type: 'enum', enum: VagaModalidade })
  modalidade: VagaModalidade;

  @Column({ type: 'enum', enum: VagaStatus, default: VagaStatus.ATIVA })
  status: VagaStatus;

  @Column()
  empresaId: number;

  @ManyToOne(() => Empresa, (empresa) => empresa.vagas)
  @JoinColumn({ name: 'empresaId' })
  empresa: Empresa;

  @OneToMany(() => Candidatura, (candidatura) => candidatura.vaga)
  candidaturas: Candidatura[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
