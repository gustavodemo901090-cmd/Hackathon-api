import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableColumn } from 'typeorm';

export class CreateUsuariosAndLinkEntities1700000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasUsuariosTable = await queryRunner.hasTable('usuarios');

    if (!hasUsuariosTable) {
      await queryRunner.createTable(
        new Table({
          name: 'usuarios',
          columns: [
            { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
            { name: 'nome', type: 'varchar', length: '100' },
            { name: 'login', type: 'varchar', length: '50', isUnique: true },
            { name: 'senha', type: 'varchar', length: '100' },
            { name: 'perfil', type: 'varchar', length: '20', default: "'OPERADOR'" },
            { name: 'ativo', type: 'tinyint', default: 1 },
            { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
            { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
          ],
        }),
        true,
      );
    }

    const alunosTable = await queryRunner.getTable('alunos');
    if (alunosTable && !alunosTable.findColumnByName('usuarioId')) {
      await queryRunner.addColumn(
        'alunos',
        new TableColumn({
          name: 'usuarioId',
          type: 'int',
          isNullable: true,
        }),
      );
      await queryRunner.createForeignKey(
        'alunos',
        new TableForeignKey({
          columnNames: ['usuarioId'],
          referencedTableName: 'usuarios',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }

    const empresasTable = await queryRunner.getTable('empresas');
    if (empresasTable && !empresasTable.findColumnByName('usuarioId')) {
      await queryRunner.addColumn(
        'empresas',
        new TableColumn({
          name: 'usuarioId',
          type: 'int',
          isNullable: true,
        }),
      );
      await queryRunner.createForeignKey(
        'empresas',
        new TableForeignKey({
          columnNames: ['usuarioId'],
          referencedTableName: 'usuarios',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }

    // Senhas em SHA-256 puro para compatibilidade com o back office Java.
    // admin123  => 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
    // coord123  => 8c63a2fc2b14d8ae6f9d0bf2e2c4227ac2dc4bd84768e1259226b0c3d84f1c65
    // op123     => 6a3ef924cb19135103c1e5697a04a926209911a8cd45734773fac25454e691a0
    await queryRunner.query(`
      INSERT INTO usuarios (nome, login, senha, perfil, ativo)
      SELECT 'Administrador', 'admin',
             '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
             'ADMIN', 1
      WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE login = 'admin')
    `);

    await queryRunner.query(`
      INSERT INTO usuarios (nome, login, senha, perfil, ativo)
      SELECT 'Coordenador', 'coord',
             '8c63a2fc2b14d8ae6f9d0bf2e2c4227ac2dc4bd84768e1259226b0c3d84f1c65',
             'COORDENADOR', 1
      WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE login = 'coord')
    `);

    await queryRunner.query(`
      INSERT INTO usuarios (nome, login, senha, perfil, ativo)
      SELECT 'Operador', 'operador',
             '6a3ef924cb19135103c1e5697a04a926209911a8cd45734773fac25454e691a0',
             'OPERADOR', 1
      WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE login = 'operador')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const alunosTable = await queryRunner.getTable('alunos');
    if (alunosTable) {
      const fk = alunosTable.foreignKeys.find((item) => item.columnNames.includes('usuarioId'));
      if (fk) await queryRunner.dropForeignKey('alunos', fk);
      if (alunosTable.findColumnByName('usuarioId')) await queryRunner.dropColumn('alunos', 'usuarioId');
    }

    const empresasTable = await queryRunner.getTable('empresas');
    if (empresasTable) {
      const fk = empresasTable.foreignKeys.find((item) => item.columnNames.includes('usuarioId'));
      if (fk) await queryRunner.dropForeignKey('empresas', fk);
      if (empresasTable.findColumnByName('usuarioId')) await queryRunner.dropColumn('empresas', 'usuarioId');
    }

    if (await queryRunner.hasTable('usuarios')) {
      await queryRunner.dropTable('usuarios');
    }
  }
}
