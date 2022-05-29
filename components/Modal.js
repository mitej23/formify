import React from 'react'
import {createPortal} from 'react-dom'
import styles from '../styles/Modal.module.css'
import {MdOutlineClose} from 'react-icons/md'

import TextInput from './TextInput';
import { useForm } from 'react-hook-form';

const Modal = ({ questions, setQuestions, setModal}) => {

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

  const handleSubmitForm = (data) => {
    console.log(data)
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
    setModal(false);
  }

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, [])

  return mounted ? createPortal(
    <>
        <div className={styles.overlay} />
        <form className={styles.modal} onSubmit={handleSubmit(handleSubmitForm)}>
            <MdOutlineClose className={styles.close} size={24} color="white" onClick={() => setModal(false)}/>
            <h1 className={styles.title}>Add Question</h1>
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
            <button className={styles.submitBtn} type="submit">Submit</button>
        </form>
    </>,
    document.querySelector('#modal-root')
  ): null;
}

export default Modal