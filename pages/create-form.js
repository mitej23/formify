import React from 'react'
import { useEffect } from 'react'
import {useRouter} from 'next/router'
import TextInput from '../components/TextInput';

import styles from '../styles/CreateForm.module.css';
import { useForm } from 'react-hook-form';
import Modal from '../components/Modal';
import {FiEdit} from 'react-icons/fi'
//  web3
import { create } from 'ipfs-http-client'
import { ethers } from 'ethers'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

import { contractAddress } from "../config"
import Formify from "../artifacts/contracts/Formify.sol/Formify.json"

const client = create('https://ipfs.infura.io:5001/api/v0');

const CreateForm = () => {

  const router = useRouter();
  // authentication
  const { data: account } = useAccount();
  const { connect, 
    connector, 
    error, 
    isConnecting, 
    pendingConnector } = useConnect({
      connector: new MetaMaskConnector(),
      onError: (error) => {
        console.log(error);
      }
    })
  const { disconnect } = useDisconnect()

  // forms

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
  const [btnLoading, setBtnLoading] = React.useState(false);

  const handleSubmitForm = async (data) => {
    if(questions.length == 0){
       return alert("Please add atleast one question");
    }
    setBtnLoading(true);
    const file = {
      data,
      questions
    }
    try {
      const added = await client.add(JSON.stringify(file));
      const path = added.path;
      const token = data.tokenType == "ERC20"? true : false; 
      saveForm(path, data, token);
    } catch (error) {
      console.log(error);
    }
  }

  const saveForm = async (ipfsPath, data, token) => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, Formify.abi,signer);
      try {
        const val = await contract.createForm(
          ipfsPath,
          data.gatedToken,
          questions.length,
          token
        );
        await val.wait();
        setBtnLoading(false);
        reset();
        setQuestions([]);
        router.push('/dashboard');
      } catch (error) {
        console.log("Error: ", error);
      }
    }

  }

  const connectToMetamask = () => {
    console.log("connect to metamask");
    connect(connector)
  }


  return (
    account ? (
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
                <div className={styles.questionAddBtn} onClick={() => setModal(true)}>Add</div>
            </div>
            <div className={styles.questionsContainer}>
                {
                    questions.length > 0 ? (
                        questions.map((q,id) => {
                            return (
                            <div className={styles.questionContainer} key={id}>
                                <div className={styles.questionTitleContainer}>
                                  <h2 className={styles.question}>{q.question}</h2>
                                  <FiEdit color='grey' className={styles.editBtn} />
                                </div>
                                
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
                        <div className={styles.questionEmptyMessage}>
                          <label>
                            Add a question
                          </label>
                        </div>
                    )
                }
            </div>  
            <button className={styles.submitBtn} type="submit" disabled={btnLoading}>
              {
                btnLoading ? "Loading..." : "Submit"
              }
            </button> 
        </form>
        {   
            modal && <Modal setModal={setModal} questions={questions} setQuestions={setQuestions}/>
        }
    </>
    ):
    (
      <div className={styles.connectContainer}>
        <button 
          className={styles.connectBtn}
          onClick={connectToMetamask}
          disabled={isConnecting}
        >
          Connect with Metamask
          {isConnecting &&
            connector === pendingConnector?.id &&
            ' (connecting)'}
        </button>
      </div>
    )  
  )
}

export default CreateForm;