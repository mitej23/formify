import React from 'react'
import {createPortal} from 'react-dom'
import styles from '../styles/Modal.module.css'
import {MdOutlineClose} from 'react-icons/md'

import TextInput from './TextInput';
import { useForm } from 'react-hook-form';

const Modal = ({ questions, setQuestions, setModal, editQuestion, setEditQuestion}) => {

  const { register, handleSubmit, errors, reset } = useForm({
    defaultValues: {
        question: 'Edit-Question',
        option1: 'Edit-Option1',
        option2: 'Edit-Option2',
        option3: 'Edit-Option3',
        option4: 'Edit-Option4',
    }
  });

  const [mounted, setMounted] = React.useState(false);

  const handleModalForm = (data) => {
    console.log(data)
    if(editQuestion){
        setQuestions(questions.map(question => {
            if(question.question == editQuestion.question){
                return {
                    ...question,
                    question: data.question,
                    options: [
                        data.option1,
                        data.option2,
                        data.option3,
                        data.option4
                    ] 
                }
            }
            return question
        }))
        setEditQuestion(null);
    }else{
        const newQuestion = {
            question: data.question,
            options: [
                data.option1,
                data.option2,
                data.option3,
                data.option4
            ]
        }
        setQuestions([...questions,newQuestion]);
    }
    
    setModal(false);
  }

  const handleModalClose = () => {
      setModal(false);
      setEditQuestion(null);
  }


  React.useEffect(() => {
    setMounted(true);
    if(mounted && editQuestion){
        // set default values
        reset({
            question: editQuestion.question,
            option1: editQuestion.options[0],
            option2: editQuestion.options[1],
            option3: editQuestion.options[2],
            option4: editQuestion.options[3],
        })
    }
    return () =>  { 
        setMounted(false);
    };
  }, [editQuestion, mounted, reset, setEditQuestion, setModal])

  return mounted ? createPortal(
    <div>
        <div className={styles.overlay}></div>
        <form className={styles.modal} onSubmit={handleSubmit(handleModalForm)}>
            <MdOutlineClose className={styles.close} size={24} color="white" onClick={handleModalClose}/>
            <h1 className={styles.title}>{editQuestion? "Edit Question":"Add Question"}</h1>
            <div className={styles.form}>
                <TextInput
                    register={register} 
                    label="Question"
                    name="question"
                />
                <h2 className={styles.optionsTitle}>Options</h2>
                <TextInput
                    register={register}
                    label="Option1"
                    name="option1"
                />
                <TextInput
                    register={register}
                    label="Option2"
                    name="option2"
                />
                <TextInput
                    register={register}
                    label="Option3"
                    name="option3"
                />
                <TextInput
                    register={register}
                    label="Option4"
                    name="option4"
                />
            </div>
            {editQuestion ? 
            <button className={styles.submitBtn} type="submit">Edit</button> :
            <button className={styles.submitBtn} type="submit">Submit</button>
            }
        </form>
    </div>,
    document.querySelector('#modal-root')
  ): null;
}

export default Modal