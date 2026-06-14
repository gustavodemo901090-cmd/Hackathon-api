import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTimestampsToUsuarios1700000000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const has = await queryRunner.hasTable('usuarios');
    if (!has) return;

    const table = await queryRunner.getTable('usuarios');
    if (!table) return;

    if (!table.findColumnByName('createdAt')) {
      await queryRunner.addColumn(
        'usuarios',
        new TableColumn({
          name: 'createdAt',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
        }),
      );
    }

    if (!table.findColumnByName('updatedAt')) {
      await queryRunner.addColumn(
        'usuarios',
        new TableColumn({
          name: 'updatedAt',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
          onUpdate: 'CURRENT_TIMESTAMP',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('usuarios');
    if (!table) return;

    if (table.findColumnByName('updatedAt')) {
      await queryRunner.dropColumn('usuarios', 'updatedAt');
    }
    if (table.findColumnByName('createdAt')) {
      await queryRunner.dropColumn('usuarios', 'createdAt');
    }
  }
}
