import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Question } from './question.model';

@Table({ tableName: 'question_options', timestamps: false })
export class QuestionOption extends Model<QuestionOption> {
  @ForeignKey(() => Question)
  @Column({ type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE' })
  declare questionId: number;

  @BelongsTo(() => Question)
  declare question?: Question;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare text: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare isCorrect: boolean;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare position: number;
}
