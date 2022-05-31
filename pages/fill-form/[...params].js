import React, {useEffect} from 'react'
import styles from '../../styles/FillForm.module.css'
import { useRouter } from 'next/router'

import { useForm } from 'react-hook-form';
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
import { contractAddress } from "../../config"
import Formify from "../../artifacts/contracts/Formify.sol/Formify.json"

const ipfsURI = 'https://ipfs.io/ipfs/'

const FillForm = () => {

	const [form, setForm] = React.useState(null);
	const [btnLoading, setBtnLoading] = React.useState(false);
	const [createdBy, setCreatedBy] = React.useState(null);
	const [loading, setLoading] = React.useState(false);
	const [access, setAccess] = React.useState(true);
	const [alreadyFilled, setAlreadyFilled] = React.useState(false);
	const [formSubmitted, setFormSubmitted] = React.useState(false);
	// route
	const router = useRouter();
	const { params = [] } = router.query;
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
	const { disconnect } = useDisconnect();

	// forms
	const {register, handleSubmit, errors, reset} = useForm();	

	const connectToMetamask = () => {
    console.log("connect to metamask");
    connect(connector)
  }

	useEffect(() => {
		try {
			async function fetchData(){
				setLoading(true);
				const address = params[0];
				const formId = params[1];
				if (typeof window.ethereum !== 'undefined') {
					const provider = new ethers.providers.Web3Provider(window.ethereum)
					const signer = provider.getSigner()
					console.log(signer)
					const contract = new ethers.Contract(contractAddress, Formify.abi,signer);
					try {
						//const form = await contract.getForm(address, formId);
						const form = ['0x264C890F87100Af322e95A5AF5d6f3BC3190eBBf', '0x9C7252d3475CE7eb00289C558319F18321b46C47', 'QmbMCQuVNe9zUqHnPFqu4fwkWAAtG3a7fM73WM5w5cqdEu', 2, true];
						setCreatedBy(form[0]);
						if(form){
							const ipfsHash = form[2];
							await fetchQuestions(ipfsHash);
						}
					} catch (error) {
						setLoading(false);
						setAccess(false);
						if(error?.reason == "You have already submmited your form"){
							setAlreadyFilled(true);
						}
					}
				}
			}
			if(params.length == 2 && account){
				console.log("fetching data...");
				fetchData();
			}
		} catch (error) {
			console.log(error);
		}
	},[params,account])

	async function fetchQuestions(ipfsHash){
		const ipfsUrl = `${ipfsURI}${ipfsHash}`;
		const questions = await fetch(ipfsUrl)
		console.log(questions)
		const data = await questions.json();
		console.log(data);
		setForm(data);
		setAccess(true);
		setLoading(false);
	}	
		
	const formSubmit = async (data) => {
		setBtnLoading(true);
		console.log(data);
		let answers = [];
		for(let i = 0; i < form.questions.length; i++){
			answers.push(parseInt(data[i]));
		}
		// call contract
		submitFormToChain(answers);
		console.log(answers);
	}

	const submitFormToChain = async (data) => { 
		if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, Formify.abi,signer);
      try {
        await contract.fillForm(
          data,
          params[0],
          parseInt(params[1]),
        );
		    const results = await contract.viewResults(params[0], parseInt(params[1]));
		    console.log(results);
				setFormSubmitted(true);
      } catch (error) {
        console.log("Error: ", error);
      }
			setBtnLoading(false);	
		}
	}

	if( params.length != 2){
		return <div className={styles.center}>
			<label>Invalid Address !</label>
		</div>
	}

	if(formSubmitted){
		return <div className={styles.center}>
			<label>Form Submitted !</label>
		</div>
	}

	if(alreadyFilled){
		return <div className={styles.center}>
			<label>You have already filled this form !</label>
		</div>
	}

	if(loading){
		return <div className={styles.center}>
			<label>Loading...</label>
		</div>
	}

	if(!access){
		return <div className={styles.center}>
			<label>Access Denied !</label>
		</div>
	}

	console.log(form);

  return (
    account ? form &&(
			<form className={styles.container} onSubmit={handleSubmit(formSubmit)}>
				<h1 className={styles.title}>{form.data.title}</h1>
				<label>{form.data.description}</label>
				<br />
				<label>Created By: {createdBy}</label>
				<br />
				<div className={styles.questionsContainer}>
					{
						form?.questions.map((q, qid) => {
							return (
								<div className={styles.questionContainer} key={qid}>
                  <div className={styles.questionTitleContainer}>
                    <h3>{q.question}</h3>
									</div>
									<div className={styles.optionsContainer}>
                      {q.options.map((opt,oid) => {
                          return (
                          <div key={opt} className={styles.option}>
                              <input 
                                  type={'radio'} 
                                  className={styles.input} 
                                  name={oid}
                                  value={oid}
																	{...register(	`${qid}`, {required: true})}    
                              /><span className={styles.radioBtnText}>{opt}</span>
                              <br />
                          </div>
                          )
                      })}
                  </div>
								</div>
							)
						})
					}
				</div>
				<button className={styles.submitBtn} type="submit">
					{btnLoading ? 'Submitting...' : 'Submit'}
				</button>
			</form>
		) : (
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

  )
}

export default FillForm