import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { DeleteQuestionUseCase } from "./delete-question"
import { makeQuestions } from "test/factories/make-questions"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotAllowedError } from "./errors/not-allowed-error"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to delete a question', async () => {
        const newQuestion = makeQuestions({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-1'))

        await inMemoryQuestionsRepository.create(newQuestion)

        await sut.execute({
            authorId: 'author-1',
            questionId: 'question-1'
        })

        expect(inMemoryQuestionsRepository.items).toHaveLength(0)
    })

     it('should be not able to delete a question from another user', async () => {
        const newQuestion = makeQuestions({}, new UniqueEntityID('question-1'))

        await inMemoryQuestionsRepository.create(newQuestion)

        const result = await sut.execute({
            authorId: 'author-1',
            questionId: 'question-1'
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})