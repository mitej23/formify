import React from 'react'
import { useEffect } from 'react'
import TextInput from '../components/TextInput';

import styles from '../styles/CreateForm.module.css';
import { useForm } from 'react-hook-form';
import Modal from '../components/Modal';

const CreateForm = () => {

  const { register, handleSubmit, errors, reset } = useForm({
    defaultValues: {
        title: 'Edit-title',
        description: 'Edit-description',
        tokenType: 'NFT',
        gatedToken: '0x0',
    }
  });

  const [questions,setQuestions] = React.useState([]);
  const [modal,setModal] = React.useState(false);


  useEffect(() => {
    console.log('create form')
    // check whether user is logged in

    // if not, then login the user using metamask from context

  },[])  

  const handleSubmitForm = (data) => {
    if(questions.length == 0){
        alert("Please add atleast one question");
    }

    // create ipfs hash of the form

    console.log(data,questions);
  }

  return (
    <>
        <form className={`${styles.container} ${modal ? styles.blur : ""}`} onSubmit={handleSubmit(handleSubmitForm)}>
            <h1 className={styles.title}>Create Form</h1>
            <TextInput
                register={register}
                label="Title"
                name="title"
            />
            <TextInput
                register={register} 
                label="Description"
                name={'description'}
            />
            <label className={styles.label}>Token Type</label>
            <br />
            <div 
                className={styles.radioBtnContainer} 
                style={{
                    marginTop: '7px',
                }}
            >
                <input 
                    type={'radio'} 
                    className={styles.input} 
                    value="NFT"  
                    {...register("tokenType",{required: true})}
                /><span className={styles.radioBtnText}>NFT</span>
                <br />
                <input 
                    type={'radio'} 
                    className={styles.input} 
                    value="ERC20" 
                    {...register("tokenType",{required: true})}
                /><span className={styles.radioBtnText}>ERC20</span>
            <br />
            </div>   
            <TextInput
                register={register}
                label="Gated Token"
                name="gatedToken"
            />
            <div className={styles.questionHeaderContainer}>
                <h2 className={styles.questionTitle}>Questions ( {questions.length} )</h2>
                <button className={styles.questionAddBtn} onClick={() => setModal(true)}>Add</button>
            </div>
            <div className={styles.questionsContainer}>
                {
                    questions.length > 0 ? (
                        questions.map((q,id) => {
                            return (
                            <div className={styles.questionContainer} key={id}>
                                <h3>{q.question}</h3>
                                <div className={styles.optionsContainer}>
                                    {q.options.map((opt) => {
                                        return (
                                        <div key={opt} className={styles.option}>
                                            <input 
                                                type={'radio'} 
                                                className={styles.input} 
                                                name={id}
                                                value={opt}    
                                            /><span className={styles.radioBtnText}>{opt}</span>
                                            <br />
                                        </div>
                                        )
                                    })}
                                </div>
                            </div>
                            )
                        })
                    ):(
                        <label className={styles.questionEmptyMessage}>Add a question</label>
                    )
                }
            </div>  
            <button className={styles.submitBtn} type="submit">Submit</button> 
        </form>
        {   
            modal && <Modal setModal={setModal} questions={ques} setQuestions={setQuestions}/>
        }
    </>
    
  )
}

export default CreateForm