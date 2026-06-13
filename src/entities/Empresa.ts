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
import { Vaga } from './Vaga';
import { Usuario } from './Usuario';

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

  @Column()
  usuarioId: number;

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

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;
}
