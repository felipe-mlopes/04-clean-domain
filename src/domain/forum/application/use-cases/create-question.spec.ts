import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
    })

    it('create an question', async () => {
        const result = await sut.execute({
          authorId: '1',
          title: 'Nova pergunta',
          content: 'Conteúdo da pergunta',
        })
      
        expect(result.isRight()).toBe(true)
        expect(inMemoryQuestionsRepository.items[0]).toEqual(result.value?.question)
      })
})
