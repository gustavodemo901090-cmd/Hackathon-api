import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsuariosTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'usuarios',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'nome', type: 'varchar', length: '100' },
          { name: 'login', type: 'varchar', length: '50', isUnique: true },
          { name: 'senha', type: 'varchar', length: '100' },
          { name: 'perfil', type: 'varchar', length: '20', default: "'OPERADOR'" },
          { name: 'ativo', type: 'tinyint', default: 1 },
          {
            name: 'createdAt',
            type: 'datetime',
            precision: 6,
            default: 'CURRENT_TIMESTAMP(6)',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            precision: 6,
            default: 'CURRENT_TIMESTAMP(6)',
            onUpdate: 'CURRENT_TIMESTAMP(6)',
          },
        ],
      }),
      true,
    );

    await queryRunner.query(`
      INSERT INTO usuarios (nome, login, senha, perfil, ativo)
      VALUES
        (
          'Administrador',
          'admin',
          '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
          'ADMIN',
          1
        ),
        (
          'Coordenador',
          'coord',
          '8c63a2fc2b14d8ae6f9d0bf2e2c4227ac2dc4bd84768e1259226b0c3d84f1c65',
          'COORDENADOR',
          1
        ),
        (
          'Operador',
          'operador',
          '6a3ef924cb19135103c1e5697a04a926209911a8cd45734773fac25454e691a0',
          'OPERADOR',
          1
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('usuarios');
  }
}
