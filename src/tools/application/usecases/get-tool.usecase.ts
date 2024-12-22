import { ToolsRepository } from '@/tools/repositories/tools.repository'
import { inject, injectable } from 'tsyringe'
import { ToolOutput } from '../dtos/tool-output.dto'

export namespace GetToolUseCase {
  export type Input = {
    id: string
  }

  export type Output = ToolOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('ToolRepository')
      private toolsRepository: ToolsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const tool: ToolOutput = await this.toolsRepository.findById(input.id)
      return tool
    }
  }
}
