import { dataSource } from '@/common/infrastructure/typeorm'
import { container } from 'tsyringe'
import { Tool } from '../typeorm/entities/tools.entities'
import { ToolsTypeormRepository } from '../typeorm/repositories/tools-typeorm.repository'
import { CreateToolUseCase } from '@/tools/application/usecases/create-tool.usecase'
import { GetToolUseCase } from '@/tools/application/usecases/get-tool.usecase'
import { DeleteToolUseCase } from '@/tools/application/usecases/delete-tool.usecase'
import { UpdateToolUseCase } from '@/tools/application/usecases/update-tool.usercase'
import { SearchToolUseCase } from '@/tools/application/usecases/search-tool.usecase'

// Registro do repositório Tool
container.registerSingleton('ToolRepository', ToolsTypeormRepository)

// Registro do caso de uso CreateToolUseCase
container.registerSingleton('CreateToolUseCase', CreateToolUseCase.UseCase)

// Registro do caso de uso GetToolUseCase
container.registerSingleton('GetToolUseCase', GetToolUseCase.UseCase)

// Registro do caso de uso DeleteToolUseCase
container.registerSingleton('DeleteToolUseCase', DeleteToolUseCase.UseCase)

// Registro do caso de uso UpdateToolUseCase
container.registerSingleton('UpdateToolUseCase', UpdateToolUseCase.UseCase)

// Registro do caso de uso SearchToolUseCase
container.registerSingleton('SearchToolUseCase', SearchToolUseCase.UseCase)

// Registro do repositório padrão TypeORM (se necessário em outro lugar)
container.registerInstance(
  'ToolsDefaultTypeormRepository',
  dataSource.getRepository(Tool),
)
