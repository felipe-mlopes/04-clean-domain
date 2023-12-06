import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { makeQuestions } from "test/factories/make-questions";
import { makeAnswers } from "test/factories/make-answers";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answrer', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
        inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
        sut = new ChooseQuestionBestAnswerUseCase(inMemoryQuestionsRepository, inMemoryAnswersRepository)
    })

    it('should be able to choose the question best answer', async () => {
        const question = makeQuestions()

        const answer = makeAnswers({
            questionId: question.id
        })

        await inMemoryQuestionsRepository.create(question)
        await inMemoryAnswersRepository.create(answer)

        await sut.execute({
            authorId: question.authorId.toString(),
            answerId: answer.id.toString()
        })

        expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(answer.id)
    })

    it('should not be able to choose another user question best answer', async () => {
        const question = makeQuestions({
            authorId: new UniqueEntityID('author-1'),
          })
      
          const answer = makeAnswers({
            questionId: question.id,
          })
      
          await inMemoryQuestionsRepository.create(question)
          await inMemoryAnswersRepository.create(answer)

          const result = await sut.execute({
            answerId: answer.id.toString(),
            authorId: 'author-2',
          })
      
          expect(result.isLeft()).toBe(true)
          expect(result.value).toBeInstanceOf(NotAllowedError)
        })
})