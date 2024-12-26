import { UsersModel } from '@/users/domain/models/users.model'
import { faker } from '@faker-js/faker/.'
import { randomUUID } from 'node:crypto'

export function UsersDataBuilder(props: Partial<UsersModel>): UsersModel {
  return {
    id: props.id ?? randomUUID(),
    name: props.name ?? faker.person.fullName(),
    email: props.email ?? faker.internet.email(),
    password: props.password ?? faker.internet.password(),
    avatar: props.avatar ?? faker.lorem.sentence(),
    created_at: props.created_at ?? new Date(),
    updated_at: props.updated_at ?? new Date(),
  }
}
