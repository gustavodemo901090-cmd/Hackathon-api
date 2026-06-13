import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateCandidaturasTable1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'candidaturas',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'alunoId',
            type: 'int',
          },
          {
            name: 'vagaId',
            type: 'int',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PENDENTE', 'EM_ANALISE', 'APROVADA', 'REPROVADA'],
            default: "'PENDENTE'",
          },
          {
            name: 'observacao',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'dataCandidatura',
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

    await queryRunner.createForeignKey(
      'candidaturas',
      new TableForeignKey({
        columnNames: ['alunoId'],
        referencedTableName: 'alunos',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('candidaturas');
  }
}
