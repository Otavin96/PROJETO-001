import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class StockMovements1735597641340 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'stockMovements',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },

          {
            name: 'user_id',
            type: 'uuid',
          },

          {
            name: 'tool_id',
            type: 'uuid',
          },

          {
            name: 'supplier_id',
            type: 'uuid',
          },

          {
            name: 'quantity',
            type: 'int',
          },

          {
            name: 'reason',
            type: 'varchar',
          },

          {
            name: 'movement_type',
            type: 'varchar',
          },

          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            name: 'fk_stockMovements_user',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
          },
          {
            name: 'fk_stockMovements_tool',
            columnNames: ['tool_id'],
            referencedTableName: 'tools',
            referencedColumnNames: ['id'],
          },

          {
            name: 'fk_stockMovements_supplier',
            columnNames: ['supplier_id'],
            referencedTableName: 'suppliers',
            referencedColumnNames: ['id'],
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('stockMovements')
  }
}
