import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { EditAnswerUseCase } from "./edit-answer";
import { makeAnswers } from "test/factories/make-answers";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswerRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        inMemoryAnswerRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
        sut = new EditAnswerUseCase(inMemoryAnswerRepository, inMemoryAnswerAttachmentsRepository)
    })

    it('should be able to edit a answer', async () => {
        const newAnswer = makeAnswers({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))

        await inMemoryAnswerRepository.create(newAnswer)

        inMemoryAnswerAttachmentsRepository.items.push(
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('1')
            }),
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('2')
            })
        )

        await sut.execute({
            authorId: 'author-1',
            answerId: newAnswer.id.toValue(),
            content: 'Conteúdo teste',
            attachmentsIds: ['1', '3']
        })

        expect(inMemoryAnswerRepository.items[0]).toMatchObject({
            content: 'Conteúdo teste',
        })

        expect(inMemoryAnswerRepository.items[0].attachments.currentItems).toHaveLength(2)
        expect(inMemoryAnswerRepository.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
        ])
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
            attachmentsIds: []
          })

          expect(result.isLeft()).toBe(true)
          expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})