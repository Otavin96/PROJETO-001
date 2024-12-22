import { inject, injectable } from 'tsyringe'
import { ToolOutput } from '../dtos/tool-output.dto'
import { ToolsRepository } from '@/tools/repositories/tools.repository'
export namespace UpdateToolUseCase {
  export type Input = {
    id: string
    description?: string
    type?: string
    quantity?: number
    stockMin?: number
    stockMax?: number
  }

  export type Output = ToolOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('ToolRepository')
      private toolsRepository: ToolsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const tool = await this.toolsRepository.findById(input.id)

      if (input.description) {
        tool.description = input.description
      }

      if (input.type) {
        tool.type = input.type
      }

      if (input.quantity) {
        tool.quantity = input.quantity
      }

      if (input.stockMin) {
        tool.stockMin = input.stockMin
      }

      if (input.stockMax) {
        tool.stockMax = input.stockMax
      }

      const UpdateOutput: ToolOutput = await this.toolsRepository.update(tool)

      return UpdateOutput
    }
  }
}
