import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { DeleteAnswerUseCase } from "./delete-answer"
import { makeAnswers } from "test/factories/make-answers"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotAllowedError } from "./errors/not-allowed-error"

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
    })

    it('should be able to delete a answer', async () => {
        const newAnswer = makeAnswers({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))

        await inMemoryAnswersRepository.create(newAnswer)

        await sut.execute({
            answerId: 'answer-1',
            authorId: 'author-1'
        })

        expect(inMemoryAnswersRepository.items).toHaveLength(0)
    })

    it('should be not able to delete a answer from another user', async () => {
        const newAnswer = makeAnswers({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))

        await inMemoryAnswersRepository.create(newAnswer)

        const result = await sut.execute({
            answerId: 'answer-1',
            authorId: 'author-2'
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})