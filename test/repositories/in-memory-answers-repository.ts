import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public item: Answer[] = []

  async findById(id: string) {
    const answer = this.item.find((item) => item.id.toString() === id)

    if (!answer) {
      return null
    }

    return answer
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.item
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async create(answer: Answer) {
    this.item.push(answer)
  }

  async save(answer: Answer) {
    const itemIndex = this.item.findIndex((item) => item.id === answer.id)

    this.item[itemIndex] = answer
  }

  async delete(answer: Answer) {
    const itemIndex = this.item.findIndex((item) => item.id === answer.id)

    this.item.splice(itemIndex, 1)
  }
}
