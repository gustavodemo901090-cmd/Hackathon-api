import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateVagasTable1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'vagas',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'titulo',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'descricao',
            type: 'text',
          },
          {
            name: 'requisitos',
            type: 'text',
          },
          {
            name: 'bolsa',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'modalidade',
            type: 'enum',
            enum: ['PRESENCIAL', 'REMOTO', 'HIBRIDO'],
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['ATIVA', 'ENCERRADA'],
            default: "'ATIVA'",
          },
          {
            name: 'empresaId',
            type: 'int',
          },
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

    await queryRunner.createForeignKey(
      'vagas',
      new TableForeignKey({
        columnNames: ['empresaId'],
        referencedTableName: 'empresas',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('vagas');
  }
}
