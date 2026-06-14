import 'reflect-metadata';
import { AppDataSource } from '../config/data-source';
import { Empresa, EmpresaStatus } from '../entities/Empresa';
import { Aluno } from '../entities/Aluno';
import { Vaga, VagaModalidade, VagaStatus } from '../entities/Vaga';
import { Candidatura, CandidaturaStatus } from '../entities/Candidatura';
import { Notificacao } from '../entities/Notificacao';
import { Usuario, UsuarioPerfil } from '../entities/Usuario';
import { hashPassword } from '../utils/auth';

async function seed(): Promise<void> {
  await AppDataSource.initialize();
  console.log('Banco conectado. Executando seeds...');

  const candidaturaRepo = AppDataSource.getRepository(Candidatura);
  const notificacaoRepo = AppDataSource.getRepository(Notificacao);
  const vagaRepo = AppDataSource.getRepository(Vaga);
  const alunoRepo = AppDataSource.getRepository(Aluno);
  const empresaRepo = AppDataSource.getRepository(Empresa);

  await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0');
  await notificacaoRepo.clear();
  await candidaturaRepo.clear();
  await vagaRepo.clear();
  await alunoRepo.clear();
  await empresaRepo.clear();
  await AppDataSource.query("DELETE FROM usuarios WHERE perfil IN ('ALUNO', 'EMPRESA')");
  await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1');

  // Empresas — cada empresa precisa de um usuario vinculado para fazer login
  const dadosEmpresas = [
    {
      razaoSocial: 'Tech Solutions LTDA',
      nomeFantasia: 'TechSol',
      cnpj: '12.345.678/0001-90',
      email: 'contato@techsol.com',
      telefone: '41999990001',
      status: EmpresaStatus.APROVADA,
    },
    {
      razaoSocial: 'Inovação Digital S.A.',
      nomeFantasia: 'InovaDigital',
      cnpj: '98.765.432/0001-10',
      email: 'contato@inovadigital.com',
      telefone: '41999990002',
      status: EmpresaStatus.APROVADA,
    },
    {
      razaoSocial: 'StartUp Nova LTDA',
      nomeFantasia: 'StartUpNova',
      cnpj: '11.222.333/0001-44',
      email: 'contato@startupnova.com',
      telefone: '41999990003',
      status: EmpresaStatus.PENDENTE,
    },
  ];

  const empresas: Empresa[] = [];
  for (const dados of dadosEmpresas) {
    await AppDataSource.transaction(async (manager) => {
      const usuario = manager.create(Usuario, {
        nome: dados.razaoSocial,
        login: dados.email.length <= 50 ? dados.email : dados.email.substring(0, 50),
        senha: hashPassword('senha123'),
        perfil: UsuarioPerfil.EMPRESA,
        ativo: true,
      });
      const usuarioSalvo = await manager.save(usuario);

      const empresa = manager.create(Empresa, {
        ...dados,
        usuarioId: usuarioSalvo.id,
      });
      empresas.push(await manager.save(empresa));
    });
  }

  // Alunos — cada aluno precisa de um usuario vinculado para fazer login
  const dadosAlunos = [
    { nome: 'João Silva',     email: 'joao@aluno.unialfa.br',   telefone: '44991010001', curso: 'Ciência da Computação',  periodo: 8, aptoEstagio: true  },
    { nome: 'Maria Oliveira', email: 'maria@aluno.unialfa.br',  telefone: '44991010002', curso: 'Sistemas de Informação', periodo: 6, aptoEstagio: true  },
    { nome: 'Carlos Santos',  email: 'carlos@aluno.unialfa.br', telefone: '44991010003', curso: 'Engenharia de Software', periodo: 3, aptoEstagio: false },
  ];

  const alunos: Aluno[] = [];
  for (const dados of dadosAlunos) {
    await AppDataSource.transaction(async (manager) => {
      const usuario = manager.create(Usuario, {
        nome: dados.nome,
        login: dados.email,
        senha: hashPassword('senha123'),
        perfil: UsuarioPerfil.ALUNO,
        ativo: true,
      });
      const usuarioSalvo = await manager.save(usuario);

      const aluno = manager.create(Aluno, {
        ...dados,
        usuarioId: usuarioSalvo.id,
      });
      alunos.push(await manager.save(aluno));
    });
  }

  // Vagas
  const vagas = await vagaRepo.save([
    vagaRepo.create({
      titulo: 'Desenvolvedor Node.js Júnior',
      descricao: 'Desenvolvimento de APIs RESTful com Node.js e TypeScript.',
      requisitos: 'Node.js, TypeScript, MySQL, Git',
      bolsa: 1500,
      modalidade: VagaModalidade.REMOTO,
      area: 'Tecnologia da Informação',
      local: 'Douradina, PR',
      cargaHoraria: '6h/dia',
      atividades: 'Desenvolver e manter APIs REST.\nEscrever testes automatizados.\nParticipar de revisões de código.',
      status: VagaStatus.ATIVA,
      empresaId: empresas[0].id,
    }),
    vagaRepo.create({
      titulo: 'Desenvolvedor React',
      descricao: 'Desenvolvimento de interfaces modernas com React e TypeScript.',
      requisitos: 'React, JavaScript, CSS, Git',
      bolsa: 1200,
      modalidade: VagaModalidade.HIBRIDO,
      area: 'Tecnologia da Informação',
      local: 'Maringá, PR',
      cargaHoraria: '5h/dia',
      atividades: 'Construir telas com React.\nIntegrar o front-end com a API.\nGarantir responsividade e acessibilidade.',
      status: VagaStatus.ATIVA,
      empresaId: empresas[1].id,
    }),
    vagaRepo.create({
      titulo: 'Analista de Dados',
      descricao: 'Análise e processamento de dados para Business Intelligence.',
      requisitos: 'Python, SQL, Excel, Power BI',
      bolsa: 1800,
      modalidade: VagaModalidade.PRESENCIAL,
      area: 'Dados & BI',
      local: 'Douradina, PR',
      cargaHoraria: '6h/dia',
      atividades: 'Coletar e tratar dados.\nCriar dashboards no Power BI.\nApoiar a tomada de decisão com relatórios.',
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

  console.log('\nSeeds executados com sucesso!');
  console.log('Credenciais de demonstração (senha: senha123):');
  console.log('  [EMPRESA] contato@techsol.com     — TechSol (APROVADA)');
  console.log('  [EMPRESA] contato@inovadigital.com — InovaDigital (APROVADA)');
  console.log('  [EMPRESA] contato@startupnova.com  — StartUpNova (PENDENTE)');
  console.log('  [ALUNO]   joao@aluno.unialfa.br    — João Silva (apto)');
  console.log('  [ALUNO]   maria@aluno.unialfa.br   — Maria Oliveira (apta)');
  console.log('  [ALUNO]   carlos@aluno.unialfa.br  — Carlos Santos (não apto)');

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Erro ao executar seeds:', err);
  process.exit(1);
});
