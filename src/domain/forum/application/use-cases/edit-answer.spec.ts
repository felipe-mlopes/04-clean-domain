import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { EditAnswerUseCase } from "./edit-answer";
import { makeAnswers } from "test/factories/make-answers";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryAnswerRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
    beforeEach(() => {
        inMemoryAnswerRepository = new InMemoryAnswersRepository()
        sut = new EditAnswerUseCase(inMemoryAnswerRepository)
    })

    it('should be able to edit a answer', async () => {
        const newAnswer = makeAnswers({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))

        await inMemoryAnswerRepository.create(newAnswer)

        await sut.execute({
            authorId: 'author-1',
            answerId: newAnswer.id.toValue(),
            content: 'Conteúdo teste',
        })

        expect(inMemoryAnswerRepository.items[0]).toMatchObject({
            content: 'Conteúdo teste',
        })
    }) 

    it('should be not able to edit a answer from another user', async () => {
        const newAnswer = makeAnswers(
            {
              authorId: new UniqueEntityID('author-1'),
            }, new UniqueEntityID('answer-1'),
          )
      
          await inMemoryAnswerRepository.create(newAnswer)
      
          const result = await sut.execute({
            answerId: newAnswer.id.toValue(),
            authorId: 'author-2',
            content: 'Conteúdo teste',
          })

          expect(result.isLeft()).toBe(true)
          expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})