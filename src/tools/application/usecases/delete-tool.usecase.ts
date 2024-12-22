import { ToolsRepository } from '@/tools/repositories/tools.repository'
import { inject, injectable } from 'tsyringe'

export namespace DeleteToolUseCase {
  export type Input = {
    id: string
  }

  export type Output = void

  @injectable()
  export class UseCase {
    constructor(
      @inject('ToolRepository')
      private toolsRepository: ToolsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      await this.toolsRepository.delete(input.id)
    }
  }
}
