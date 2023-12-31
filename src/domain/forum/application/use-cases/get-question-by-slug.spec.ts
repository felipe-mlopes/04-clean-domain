import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { QuestionsRepository } from "../repositories/questions-repository"
import { GetQuestionBySlugUseCase } from "./get-question-by-slug"
import { makeQuestions } from "test/factories/make-questions"
import { Slug } from "../../enterprise/entities/value-objetcs/slug"
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
        sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to get a question by slug', async () => {
        const newQuestion = makeQuestions({
            slug: Slug.create('example-question')
        })

        await inMemoryQuestionsRepository.create(newQuestion)

        const result = await sut.execute({
            slug: 'example-question'
        })

        expect(result.isRight()).toBe(true)
        if (result.isRight()) {
            expect(result.value?.question.title).toEqual(newQuestion.title)
        }
    })
})