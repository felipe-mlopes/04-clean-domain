import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { EditQuestionUseCase } from "./edit-question";
import { makeQuestions } from "test/factories/make-questions";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
    beforeEach(() => {
        inMemoryQuestionRepository = new InMemoryQuestionsRepository()
        sut = new EditQuestionUseCase(inMemoryQuestionRepository)
    })

    it('should be able to edit a question', async () => {
        const newQuestion = makeQuestions({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-1'))

        await inMemoryQuestionRepository.create(newQuestion)

        await sut.execute({
            authorId: 'author-1',
            questionId: newQuestion.id.toValue(),
            title: 'Pergunta teste',
            content: 'Conteúdo teste',
        })

        expect(inMemoryQuestionRepository.items[0]).toMatchObject({
            title: 'Pergunta teste',
            content: 'Conteúdo teste',
        })
    }) 

    it('should be not able to edit a question from another user', async () => {
        const newQuestion = makeQuestions(
            {
              authorId: new UniqueEntityID('author-1'),
            }, new UniqueEntityID('question-1'),
          )
      
          await inMemoryQuestionRepository.create(newQuestion)
      
          expect(() => {
            return sut.execute({
              questionId: newQuestion.id.toValue(),
              authorId: 'author-2',
              title: 'Pergunta teste',
              content: 'Conteúdo teste',
            })
          }).rejects.toBeInstanceOf(Error)
    })
})