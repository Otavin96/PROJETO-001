import {
  MovementType,
  StockMovementModel,
} from '@/stockMovements/domain/models/stockMovements.model'
import { faker } from '@faker-js/faker/.'
import { randomUUID } from 'node:crypto'

export function StockMovementDataBuilder(
  props: Partial<StockMovementModel>,
): StockMovementModel {
  return {
    id: props.id ?? randomUUID(),
    tool_id: props.tool_id ?? {
      id: randomUUID(),
      description: faker.commerce.productName(),
      type: faker.commerce.department(),
      quantity: faker.number.int({ min: 10, max: 100 }),
      stockMax: faker.number.int({ min: 10, max: 100 }),
      stockMin: faker.number.int({ min: 10, max: 100 }),
      status: 'ativo',
      created_at: new Date(),
      updated_at: new Date(),
      stockMovements: [],
    },
    supplier_id: props.supplier_id ?? {
      id: randomUUID(),
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      contact_email: faker.internet.email(),
      phone: faker.phone.number(),
      status: 'ativo',
      created_at: new Date(),
      updated_at: new Date(),
      stockMovements: [],
    },
    user_id: props.user_id ?? {
      id: randomUUID(),
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      avatar: faker.image.avatar(),
      created_at: new Date(),
      updated_at: new Date(),
      stockMovements: [],
    },
    quantity: props.quantity ?? faker.number.int({ min: 10, max: 100 }),
    reason: props.reason ?? faker.lorem.sentence(),
    movement_type: props.movement_type ?? MovementType.ENTRADA,
    created_at: props.created_at ?? new Date(),
    updated_at: props.updated_at ?? new Date(),
  }
}
