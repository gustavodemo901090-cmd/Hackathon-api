import 'reflect-metadata';
import { AppDataSource } from '../config/data-source';
import { Empresa, EmpresaStatus } from '../entities/Empresa';
import { Aluno } from '../entities/Aluno';
import { Vaga, VagaModalidade, VagaStatus } from '../entities/Vaga';
import { Candidatura, CandidaturaStatus } from '../entities/Candidatura';
import { Notificacao } from '../entities/Notificacao';

async function seed(): Promise<void> {
  await AppDataSource.initialize();
  console.log('Banco conectado. Executando seeds...');

  const candidaturaRepo = AppDataSource.getRepository(Candidatura);
  const notificacaoRepo = AppDataSource.getRepository(Notificacao);
  const vagaRepo = AppDataSource.getRepository(Vaga);
  const alunoRepo = AppDataSource.getRepository(Aluno);
  const empresaRepo = AppDataSource.getRepository(Empresa);

  // TRUNCATE não funciona em tabelas referenciadas por FK; desativamos a
  // checagem temporariamente para limpar tudo na ordem correta.
  await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0');
  await notificacaoRepo.clear();
  await candidaturaRepo.clear();
  await vagaRepo.clear();
  await alunoRepo.clear();
  await empresaRepo.clear();
  await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1');

  // Empresas
  const empresas = await empresaRepo.save([
    empresaRepo.create({
      razaoSocial: 'Tech Solutions LTDA',
      nomeFantasia: 'TechSol',
      cnpj: '12.345.678/0001-90',
      email: 'contato@techsol.com',
      telefone: '(41) 99999-0001',
      status: EmpresaStatus.APROVADA,
    }),
    empresaRepo.create({
      razaoSocial: 'Inovação Digital S.A.',
      nomeFantasia: 'InovaDigital',
      cnpj: '98.765.432/0001-10',
      email: 'contato@inovadigital.com',
      telefone: '(41) 99999-0002',
      status: EmpresaStatus.APROVADA,
    }),
    empresaRepo.create({
      razaoSocial: 'StartUp Nova LTDA',
      nomeFantasia: 'StartUpNova',
      cnpj: '11.222.333/0001-44',
      email: 'contato@startupnova.com',
      telefone: '(41) 99999-0003',
      status: EmpresaStatus.PENDENTE,
    }),
  ]);

  // Alunos
  const alunos = await alunoRepo.save([
    alunoRepo.create({
      nome: 'João Silva',
      email: 'joao@aluno.unialfa.br',
      curso: 'Ciência da Computação',
      periodo: 8,
      aptoEstagio: true,
    }),
    alunoRepo.create({
      nome: 'Maria Oliveira',
      email: 'maria@aluno.unialfa.br',
      curso: 'Sistemas de Informação',
      periodo: 6,
      aptoEstagio: true,
    }),
    alunoRepo.create({
      nome: 'Carlos Santos',
      email: 'carlos@aluno.unialfa.br',
      curso: 'Engenharia de Software',
      periodo: 3,
      aptoEstagio: false,
    }),
  ]);

  // Vagas
  const vagas = await vagaRepo.save([
    vagaRepo.create({
      titulo: 'Desenvolvedor Node.js Júnior',
      descricao: 'Desenvolvimento de APIs RESTful com Node.js e TypeScript.',
      requisitos: 'Node.js, TypeScript, MySQL, Git',
      bolsa: 1500,
      modalidade: VagaModalidade.REMOTO,
      status: VagaStatus.ATIVA,
      empresaId: empresas[0].id,
    }),
    vagaRepo.create({
      titulo: 'Desenvolvedor React',
      descricao: 'Desenvolvimento de interfaces modernas com React e TypeScript.',
      requisitos: 'React, JavaScript, CSS, Git',
      bolsa: 1200,
      modalidade: VagaModalidade.HIBRIDO,
      status: VagaStatus.ATIVA,
      empresaId: empresas[1].id,
    }),
    vagaRepo.create({
      titulo: 'Analista de Dados',
      descricao: 'Análise e processamento de dados para Business Intelligence.',
      requisitos: 'Python, SQL, Excel, Power BI',
      bolsa: 1800,
      modalidade: VagaModalidade.PRESENCIAL,
      status: VagaStatus.ENCERRADA,
      empresaId: empresas[0].id,
    }),
  ]);

  // Candidaturas
  await candidaturaRepo.save([
    candidaturaRepo.create({
      alunoId: alunos[0].id,
      vagaId: vagas[0].id,
      status: CandidaturaStatus.EM_ANALISE,
      observacao: 'Tenho experiência com as tecnologias requisitadas.',
    }),
    candidaturaRepo.create({
      alunoId: alunos[1].id,
      vagaId: vagas[0].id,
      status: CandidaturaStatus.PENDENTE,
    }),
    candidaturaRepo.create({
      alunoId: alunos[1].id,
      vagaId: vagas[1].id,
      status: CandidaturaStatus.APROVADA,
      observacao: 'Aprovada após entrevista técnica.',
    }),
  ]);

  console.log('Seeds executados com sucesso!');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Erro ao executar seeds:', err);
  process.exit(1);
});
