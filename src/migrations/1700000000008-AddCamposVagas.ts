import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCamposVagas1700000000008 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('vagas', [
      new TableColumn({
        name: 'area',
        type: 'varchar',
        length: '120',
        isNullable: true,
      }),
      new TableColumn({
        name: 'local',
        type: 'varchar',
        length: '160',
        isNullable: true,
      }),
      new TableColumn({
        name: 'cargaHoraria',
        type: 'varchar',
        length: '60',
        isNullable: true,
      }),
      new TableColumn({
        name: 'atividades',
        type: 'text',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('vagas', ['area', 'local', 'cargaHoraria', 'atividades']);
  }
}
