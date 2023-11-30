import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { DeleteQuestionUseCase } from "./delete-question"
import { makeQuestions } from "test/factories/make-questions"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

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

        expect(() => {
            return sut.execute({
                authorId: 'author-1',
                questionId: 'question-1'
            })
        }).rejects.toBeInstanceOf(Error)
    })
})