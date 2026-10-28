import { useFieldArray, useWatch, type Control, type FieldErrors, type UseFormRegister, type UseFormSetValue } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { QuizInput } from '../types/quiz';

type Props = { index: number; control: Control<QuizInput>; register: UseFormRegister<QuizInput>; setValue: UseFormSetValue<QuizInput>; errors: FieldErrors<QuizInput>; onRemove: () => void; canRemove: boolean };
export default function QuestionForm({ index, control, register, setValue, errors, onRemove, canRemove }: Props) {
  const type = useWatch({ control, name: `questions.${index}.type` });
  const answer = useWatch({ control, name: `questions.${index}.correctAnswer` });
  const { fields, append, remove } = useFieldArray({ control, name: `questions.${index}.options` });
  const questionError = errors.questions?.[index];
  return <section className="card question-card"><div className="question-top"><span className="eyebrow">QUESTION {index + 1}</span><button type="button" className="icon-button danger" title="Remove question" disabled={!canRemove} onClick={onRemove}><Trash2 size={18}/></button></div>
    <div className="field"><label htmlFor={`question-${index}`}>Question text</label><input id={`question-${index}`} placeholder="Enter your question" {...register(`questions.${index}.text`, { required: 'Question text is required' })}/>{questionError?.text && <small className="error">{questionError.text.message}</small>}</div>
    <div className="field"><label htmlFor={`type-${index}`}>Answer type</label><select id={`type-${index}`} {...register(`questions.${index}.type`)} onChange={(e) => { const next = e.target.value as QuizInput['questions'][number]['type']; setValue(`questions.${index}.type`, next); setValue(`questions.${index}.correctAnswer`, next === 'boolean' ? 'true' : ''); if (next === 'checkbox') setValue(`questions.${index}.options`, [{ text: '', isCorrect: true }, { text: '', isCorrect: false }]); else setValue(`questions.${index}.options`, []); }}><option value="boolean">True / False</option><option value="input">Short text</option><option value="checkbox">Checkbox (multiple answers)</option></select></div>
    <div className="answer-area"><label className="answer-label">Correct answer</label>
    {type === 'boolean' && <div className="radio-row"><label><input type="radio" value="true" checked={answer === 'true'} onChange={() => setValue(`questions.${index}.correctAnswer`, 'true')}/> True</label><label><input type="radio" value="false" checked={answer === 'false'} onChange={() => setValue(`questions.${index}.correctAnswer`, 'false')}/> False</label></div>}
    {type === 'input' && <div className="field"><input placeholder="Enter the correct answer" {...register(`questions.${index}.correctAnswer`, { required: type === 'input' ? 'Answer is required' : false })}/>{questionError?.correctAnswer && <small className="error">{questionError.correctAnswer.message}</small>}</div>}
    {type === 'checkbox' && <div className="options">{fields.map((field, optionIndex) => <div className="option-row" key={field.id}><input aria-label={`Option ${optionIndex + 1} is correct`} type="checkbox" {...register(`questions.${index}.options.${optionIndex}.isCorrect`)}/><input aria-label={`Option ${optionIndex + 1} text`} placeholder={`Option ${optionIndex + 1}`} {...register(`questions.${index}.options.${optionIndex}.text`, { required: 'Option text is required' })}/><button className="icon-button" type="button" disabled={fields.length <= 2} onClick={() => remove(optionIndex)} title="Remove option"><Trash2 size={17}/></button>{questionError?.options?.[optionIndex]?.text && <small className="error">{questionError.options[optionIndex].text.message}</small>}</div>)}<button type="button" className="text-button" onClick={() => append({ text: '', isCorrect: false })}><Plus size={16}/> Add option</button><p className="hint">Check every correct option (at least one).</p></div>}
    </div>
  </section>;
}
