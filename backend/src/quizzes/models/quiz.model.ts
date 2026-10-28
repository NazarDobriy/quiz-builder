import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import { Question } from './question.model';

@Table({ tableName: 'quizzes', timestamps: true })
export class Quiz extends Model<Quiz> {
  @Column({ type: DataType.STRING(200), allowNull: false })
  declare title: string;

  @HasMany(() => Question, { onDelete: 'CASCADE', hooks: true })
  declare questions?: Question[];
}
