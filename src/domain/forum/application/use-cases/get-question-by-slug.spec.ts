import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { QuestionsRepository } from "../repositories/questions-repository"
import { GetQuestionBySlugUseCase } from "./get-question-by-slug"
import { makeQuestions } from "test/factories/make-questions"
import { Slug } from "../../enterprise/entities/value-objetcs/slug"

let inMemoryQuestionsRepository: QuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
    beforeAll(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to get a question by slug', async () => {
        const newQuestion = makeQuestions({
            slug: Slug.create('example-question')
        })

        await inMemoryQuestionsRepository.create(newQuestion)

        const { question } = await sut.execute({
            slug: 'example-question'
        })

        expect(question.id).toBeTruthy()
        expect(question.slug).toEqual(newQuestion.slug)
    })
})