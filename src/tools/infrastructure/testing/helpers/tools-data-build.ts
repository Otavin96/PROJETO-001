import { ToolsModel } from '@/tools/domain/models/tools.model'
import { faker } from '@faker-js/faker'
import { randomUUID } from 'node:crypto'

export function ToolsDataBuilder(props: Partial<ToolsModel>): ToolsModel {
  return {
    id: props.id ?? randomUUID(),
    description: props.description ?? faker.lorem.text(),
    type: props.type ?? faker.lorem.lines(),
    quantity: props.quantity ?? 10,
    stockMax: props.stockMax ?? 20,
    stockMin: props.stockMin ?? 5,
    created_at: props.created_at ?? new Date(),
    updated_at: props.updated_at ?? new Date(),
  }
}
