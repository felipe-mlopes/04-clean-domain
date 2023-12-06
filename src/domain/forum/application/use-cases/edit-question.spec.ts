import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { EditQuestionUseCase } from "./edit-question";
import { makeQuestions } from "test/factories/make-questions";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        inMemoryQuestionRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
        sut = new EditQuestionUseCase(inMemoryQuestionRepository, inMemoryQuestionAttachmentsRepository)
    })

    it('should be able to edit a question', async () => {
        const newQuestion = makeQuestions({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-1'))

        await inMemoryQuestionRepository.create(newQuestion)

        inMemoryQuestionAttachmentsRepository.items.push(
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityID('1')
            }),
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityID('2')
            })
        )

        await sut.execute({
            authorId: 'author-1',
            questionId: newQuestion.id.toValue(),
            title: 'Pergunta teste',
            content: 'Conteúdo teste',
            attachmentsIds: ['1', '3']
        })

        expect(inMemoryQuestionRepository.items[0]).toMatchObject({
            title: 'Pergunta teste',
            content: 'Conteúdo teste',
        })

        expect(inMemoryQuestionRepository.items[0].attachments.currentItems).toHaveLength(2)
        expect(inMemoryQuestionRepository.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
        ])
    }) 

    it('should be not able to edit a question from another user', async () => {
        const newQuestion = makeQuestions(
            {
              authorId: new UniqueEntityID('author-1'),
            }, new UniqueEntityID('question-1'),
          )
      
          await inMemoryQuestionRepository.create(newQuestion)
      
          const result = await sut.execute({
            questionId: newQuestion.id.toValue(),
            authorId: 'author-2',
            title: 'Pergunta teste',
            content: 'Conteúdo teste',
            attachmentsIds: []
          })

          expect(result.isLeft()).toBe(true)
          expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})