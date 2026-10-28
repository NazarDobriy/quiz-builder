import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { Quiz } from './models/quiz.model';
import { Question, QuestionType } from './models/question.model';
import { QuestionOption } from './models/question-option.model';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Quiz) private readonly quizModel: typeof Quiz,
    @InjectModel(Question) private readonly questionModel: typeof Question,
    @InjectModel(QuestionOption) private readonly optionModel: typeof QuestionOption,
    private readonly sequelize: Sequelize,
  ) {}

  async create(dto: CreateQuizDto) {
    for (const question of dto.questions) {
      if (question.type === QuestionType.BOOLEAN && !['true', 'false'].includes(question.correctAnswer ?? '')) {
        throw new BadRequestException('Boolean questions require correctAnswer "true" or "false"');
      }
      if (question.type === QuestionType.INPUT && !question.correctAnswer?.trim()) {
        throw new BadRequestException('Input questions require a non-empty correctAnswer');
      }
      if (question.type === QuestionType.CHECKBOX) {
        if (!question.options || question.options.length < 2 || !question.options.some((o) => o.isCorrect)) {
          throw new BadRequestException('Checkbox questions require at least two options and one correct option');
        }
        if (question.options.some((o) => !o.text.trim())) {
          throw new BadRequestException('Option text must not be empty');
        }
      }
    }

    const quizId = await this.sequelize.transaction(async (transaction) => {
      const quiz = await this.quizModel.create({ title: dto.title.trim() } as Quiz, { transaction });
      for (const [position, item] of dto.questions.entries()) {
        const question = await this.questionModel.create({
          quizId: quiz.id, text: item.text.trim(), type: item.type,
          correctAnswer: item.type === QuestionType.CHECKBOX ? null : item.correctAnswer!.trim(), position,
        } as Question, { transaction });
        if (item.type === QuestionType.CHECKBOX) {
          for (const [optionPosition, option] of item.options!.entries()) {
            await this.optionModel.create({
              questionId: question.id, text: option.text.trim(), isCorrect: option.isCorrect, position: optionPosition,
            } as QuestionOption, { transaction });
          }
        }
      }
      return quiz.id as number;
    });
    return this.findOne(quizId);
  }

  async findAll() {
    const quizzes = await this.quizModel.findAll({
      attributes: ['id', 'title', 'createdAt'],
      include: [{ model: Question, attributes: ['id'], required: false }],
      order: [['createdAt', 'DESC']],
    });
    return quizzes.map((quiz) => ({
      id: quiz.id, title: quiz.title, questionCount: quiz.questions?.length ?? 0, createdAt: quiz.createdAt,
    }));
  }

  async findOne(id: number) {
    const quiz = await this.quizModel.findByPk(id, {
      include: [{ model: Question, include: [QuestionOption] }],
    });
    if (!quiz) throw new NotFoundException(`Quiz ${id} not found`);
    const data = quiz.toJSON() as Quiz & { questions: (Question & { options: QuestionOption[] })[] };
    data.questions?.sort((a, b) => a.position - b.position);
    data.questions?.forEach((q) => q.options?.sort((a, b) => a.position - b.position));
    return data;
  }

  async remove(id: number) {
    const quiz = await this.quizModel.findByPk(id);
    if (!quiz) throw new NotFoundException(`Quiz ${id} not found`);
    await quiz.destroy();
  }
}
