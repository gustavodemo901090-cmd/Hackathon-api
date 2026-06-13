import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAlunosTable1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'alunos',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'nome', type: 'varchar', length: '255' },
          { name: 'email', type: 'varchar', length: '255', isUnique: true },
          { name: 'usuarioId', type: 'int' },
          { name: 'telefone', type: 'varchar', length: '20', isNullable: true },
          { name: 'curso', type: 'varchar', length: '100' },
          { name: 'periodo', type: 'int' },
          { name: 'aptoEstagio', type: 'tinyint', default: 0 },
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
        foreignKeys: [
          {
            columnNames: ['usuarioId'],
            referencedTableName: 'usuarios',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('alunos');
  }
}
