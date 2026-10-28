import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Plus, Save } from 'lucide-react';
import QuestionForm from '../components/QuestionForm';
import { errorMessage, quizService } from '../services/quizService';
import type { QuestionInput, QuizInput } from '../types/quiz';
const newQuestion = (): QuestionInput => ({ text: '', type: 'boolean', correctAnswer: 'true', options: [] });
export default function CreateQuizPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const { control, register, handleSubmit, setValue, setError, formState: { errors, isSubmitting } } = useForm<QuizInput>({ defaultValues: { title: '', questions: [newQuestion()] } });
  const { fields, append, remove } = useFieldArray({ control, name: 'questions' });
  const onSubmit = handleSubmit(async (data) => {
    setServerError('');
    for (const [index, question] of data.questions.entries()) {
      if (question.type === 'checkbox' && !question.options?.some((o) => o.isCorrect)) {
        setError(`questions.${index}.options`, { message: 'Select at least one correct answer' });
        setServerError(`Question ${index + 1}: select at least one correct checkbox answer.`);
        return;
      }
    }
    try {
      const quiz = await quizService.create({ title: data.title.trim(), questions: data.questions.map((q) => ({ text: q.text.trim(), type: q.type, ...(q.type === 'checkbox' ? { options: q.options?.map((o) => ({ text: o.text.trim(), isCorrect: o.isCorrect })) } : { correctAnswer: q.correctAnswer?.trim() }) })) });
      navigate(`/quizzes/${quiz.id}`);
    } catch (error) { setServerError(errorMessage(error)); }
  });
  return <div className="page narrow"><div className="page-heading"><div><span className="eyebrow">QUIZ CREATOR</span><h1>Create a quiz</h1><p>Add questions and choose the correct answers.</p></div></div><form onSubmit={onSubmit} noValidate><section className="card"><div className="field"><label htmlFor="quiz-title">Quiz title</label><input id="quiz-title" placeholder="e.g. JavaScript Fundamentals" {...register('title', { required: 'Quiz title is required' })}/>{errors.title && <small className="error">{errors.title.message}</small>}</div></section><div className="section-heading"><h2>Questions <span className="count">{fields.length}</span></h2></div>{fields.map((field, index) => <QuestionForm key={field.id} index={index} control={control} register={register} setValue={setValue} errors={errors} onRemove={() => remove(index)} canRemove={fields.length > 1}/>)}<button type="button" className="button secondary full" onClick={() => append(newQuestion())}><Plus size={18}/> Add another question</button>{serverError && <p role="alert" className="alert">{serverError}</p>}<div className="form-actions"><button className="button primary" type="submit" disabled={isSubmitting}><Save size={18}/>{isSubmitting ? 'Saving...' : 'Create quiz'}</button></div></form></div>;
}
