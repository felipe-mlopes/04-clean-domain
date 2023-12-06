import { Either, left, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { AnswerAttachmentRepository } from "../repositories/answer-attachment-repository";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface EditAnswerUseCaseRequest {
    authorId: string
    answerId: string
    content: string
    attachmentsIds: string []
}

type EditAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
    answer: Answer
}>

export class EditAnswerUseCase {
    constructor(
        private answerRepository: AnswersRepository,
        private answerAttachmentRepository: AnswerAttachmentRepository
    ) {}

    async execute({
        authorId,
        answerId,
        content,
        attachmentsIds
    }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
        const answer = await this.answerRepository.findById(answerId)

        if (!answer) {
            return left(new ResourceNotFoundError())
        }

        if (authorId !== answer.authorId.toString()) {
            return left(new NotAllowedError())
        }

        const currentAnswerAttachments = await this.answerAttachmentRepository.findManyByAnswerId(answerId)
        const answerAttachmentList = new AnswerAttachmentList(currentAnswerAttachments)

        const answerAttachments = attachmentsIds.map(attachmentId => {
            return AnswerAttachment.create({
                answerId: answer.id,
                attachmentId: new UniqueEntityID(attachmentId)
            })
        })

        answerAttachmentList.update(answerAttachments)

        answer.attachments = answerAttachmentList
        answer.content = content

        await this.answerRepository.save(answer)

        return right({
            answer
        })
    }
}