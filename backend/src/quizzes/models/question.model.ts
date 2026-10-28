import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Quiz } from './quiz.model';
import { QuestionOption } from './question-option.model';

export enum QuestionType { BOOLEAN = 'boolean', INPUT = 'input', CHECKBOX = 'checkbox' }

@Table({ tableName: 'questions', timestamps: false })
export class Question extends Model<Question> {
  @ForeignKey(() => Quiz)
  @Column({ type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE' })
  declare quizId: number;

  @BelongsTo(() => Quiz)
  declare quiz?: Quiz;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare text: string;

  @Column({ type: DataType.ENUM(...Object.values(QuestionType)), allowNull: false })
  declare type: QuestionType;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare correctAnswer: string | null;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare position: number;

  @HasMany(() => QuestionOption, { onDelete: 'CASCADE', hooks: true })
  declare options?: QuestionOption[];
}
