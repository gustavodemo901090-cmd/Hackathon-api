import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTelefoneToAlunos1700000000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('alunos');
    if (!table) return;

    if (!table.findColumnByName('telefone')) {
      await queryRunner.addColumn(
        'alunos',
        new TableColumn({
          name: 'telefone',
          type: 'varchar',
          length: '20',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('alunos');
    if (!table) return;

    if (table.findColumnByName('telefone')) {
      await queryRunner.dropColumn('alunos', 'telefone');
    }
  }
}
