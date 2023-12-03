import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Create Question', () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
    })

    it('create an answer', async () => {
        const result = await sut.execute({
          questionId: '1',
          instructorId: '1',
          content: 'Nova resposta',
      })
    
      expect(result.isRight()).toBe(true)
      expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer)
    })
})
