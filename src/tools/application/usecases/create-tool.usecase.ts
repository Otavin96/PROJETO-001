import { inject, injectable } from 'tsyringe'
import { ToolOutput } from '../dtos/tool-output.dto'
import { ToolsRepository } from '@/tools/repositories/tools.repository'
import { BadRequestError } from '@/common/domain/erros/bad-request-error'

export namespace CreateToolUseCase {
  export type Input = {
    description: string
    type: string
    quantity: number
    stockMin: number
    stockMax: number
    status: string
  }

  export type Output = ToolOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('ToolRepository')
      private toolsRepository: ToolsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      if (
        !input.description ||
        !input.type ||
        input.quantity <= 0 ||
        input.stockMin <= 0 ||
        input.stockMax <= 0 ||
        !input.status
      ) {
        throw new BadRequestError('Input data not provided or invalid')
      }

      await this.toolsRepository.confinctingDescription(input.description)

      const tool = this.toolsRepository.create(input)
      const createdTool: ToolOutput = await this.toolsRepository.insert(tool)

      return createdTool
    }
  }
}
