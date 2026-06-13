import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Vaga } from './Vaga';

export enum EmpresaStatus {
  PENDENTE = 'PENDENTE',
  APROVADA = 'APROVADA',
  BLOQUEADA = 'BLOQUEADA',
}

@Entity('empresas')
export class Empresa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  razaoSocial: string;

  @Column({ length: 255 })
  nomeFantasia: string;

  @Column({ unique: true, length: 18 })
  cnpj: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 20 })
  telefone: string;

  @Column({ type: 'enum', enum: EmpresaStatus, default: EmpresaStatus.PENDENTE })
  status: EmpresaStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Vaga, (vaga) => vaga.empresa)
  vagas: Vaga[];
}
