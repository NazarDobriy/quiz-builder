import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { QuizzesModule } from './quizzes/quizzes.module';
import { Quiz } from './quizzes/models/quiz.model';
import { Question } from './quizzes/models/question.model';
import { QuestionOption } from './quizzes/models/question-option.model';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        host: config.get<string>('DB_HOST', '127.0.0.1'),
        port: Number(config.get('DB_PORT', 5433)),
        username: config.get<string>('DB_USERNAME', 'quiz_user'),
        password: config.get<string>('DB_PASSWORD', 'quiz_password'),
        database: config.get<string>('DB_DATABASE', 'quiz_builder'),
        models: [Quiz, Question, QuestionOption],
        autoLoadModels: true,
        synchronize: config.get<string>('DB_SYNC', 'false') === 'true',
        logging: console.log,
      }),
    }),
    QuizzesModule,
  ],
})
export class AppModule {}
