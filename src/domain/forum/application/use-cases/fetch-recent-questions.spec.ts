import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";
import { makeQuestions } from "test/factories/make-questions";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
        sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to fetch recent questions', async () => {
        await inMemoryQuestionsRepository.create(
            makeQuestions({ createdAt: new Date(2023, 11, 1) })
        )

        await inMemoryQuestionsRepository.create(
            makeQuestions({ createdAt: new Date(2023, 10, 30) })
        )

        await inMemoryQuestionsRepository.create(
            makeQuestions({ createdAt: new Date(2023, 11, 2) })
        )

        const result = await sut.execute({
            page: 1
        })

        expect(result.value?.questions).toEqual([
            expect.objectContaining({ createdAt: new Date(2023, 11, 2) }),
            expect.objectContaining({ createdAt: new Date(2023, 11, 1) }),
            expect.objectContaining({ createdAt: new Date(2023, 10, 30) }),
        ])
    })

    it('should be able to paginated recent questions', async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryQuestionsRepository.create(makeQuestions())
        }

        const result = await sut.execute({
            page: 2
        })

        expect(result.value?.questions).toHaveLength(2)
    })
})