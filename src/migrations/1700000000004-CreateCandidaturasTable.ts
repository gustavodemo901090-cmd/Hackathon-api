import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCandidaturasTable1700000000004 implements MigrationInterface {
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
          { name: 'alunoId', type: 'int' },
          { name: 'vagaId', type: 'int' },
          {
            name: 'status',
            type: 'enum',
            enum: ['PENDENTE', 'EM_ANALISE', 'APROVADA', 'REPROVADA'],
            default: "'PENDENTE'",
          },
          { name: 'observacao', type: 'text', isNullable: true },
          {
            name: 'dataCandidatura',
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
          {
            columnNames: ['vagaId'],
            referencedTableName: 'vagas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('candidaturas');
  }
}
