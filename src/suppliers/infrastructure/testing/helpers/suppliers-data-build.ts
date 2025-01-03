import { SuppliersModel } from '@/suppliers/domain/models/suppliers.model'
import { faker } from '@faker-js/faker/.'
import { randomUUID } from 'node:crypto'

export function SuppliersDataBuilder(
  props: Partial<SuppliersModel>,
): SuppliersModel {
  return {
    id: props.id ?? randomUUID(),
    name: props.name ?? faker.company.name(),
    description: props.description ?? faker.company.catchPhraseDescriptor(),
    contact_email: props.contact_email ?? faker.internet.email(),
    phone: props.phone ?? faker.phone.number(),
    status: props.status ?? 'Ativo',
    created_at: props.created_at ?? new Date(),
    updated_at: props.updated_at ?? new Date(),
  }
}
