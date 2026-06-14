import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNotificacoesTable1700000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notificacoes',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'alunoId', type: 'int' },
          { name: 'titulo', type: 'varchar', length: '255' },
          { name: 'mensagem', type: 'text' },
          { name: 'lida', type: 'tinyint', default: 0 },
          {
            name: 'createdAt',
            type: 'datetime',
            precision: 6,
            default: 'CURRENT_TIMESTAMP(6)',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['alunoId'],
            referencedTableName: 'alunos',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notificacoes');
  }
}
