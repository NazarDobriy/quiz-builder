import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Quiz } from './models/quiz.model';
import { Question } from './models/question.model';
import { QuestionOption } from './models/question-option.model';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';

@Module({
  imports: [SequelizeModule.forFeature([Quiz, Question, QuestionOption])],
  controllers: [QuizzesController],
  providers: [QuizzesService],
})
export class QuizzesModule {}
