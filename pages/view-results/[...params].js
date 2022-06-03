import React, {useEffect, useState, useCallback} from 'react'
import styles from '../../styles/FillForm.module.css'
import { useRouter } from 'next/router'

//  web3
import { ethers } from 'ethers'
import {
	chain,
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi'

import { contractAddress } from "../../config"
import Formify from "../../artifacts/contracts/Formify.sol/Formify.json"

const ipfsURI = 'https://ipfs.io/ipfs/'


// 5 questions , 15 replies
const mockResults = [
  { answers: [ 0, 2 ] },
  { answers: [ 2, 1 ] },
  { answers: [ 3, 2 ] },
  { answers: [ 3, 1 ] },
  { answers: [ 1, 0 ] },
  { answers: [ 0, 3 ] },
  { answers: [ 1, 1 ] },
  { answers: [ 0, 3 ] },
  { answers: [ 2, 1 ] },
  { answers: [ 1, 2 ] },
  { answers: [ 2, 1 ] },
  { answers: [ 2, 0 ] },
  { answers: [ 2, 1 ] },
  { answers: [ 0, 2 ] },
  { answers: [ 2, 2 ] },
  { answers: [ 1, 1 ] },
  { answers: [ 0, 0 ] },
  { answers: [ 3, 3 ] }
]

const ViewResults = () => {

	const [form, setForm] = React.useState(null);
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState(null);
	// authentication
	const { data: account } = useAccount();
	const { connect, connectors, error, isConnecting, pendingConnector } =
		useConnect({
			chains: [chain.polygonMumbai]
		})
	const { disconnect } = useDisconnect();
  // route
  const router = useRouter();
  const { params = [] } = router.query;

	useEffect(() => {
		async function fetchResults(){
			console.log("fetching results");
			setLoading(true);
			const address = params[0];
			const formId = params[1];
			if (typeof window.ethereum !== 'undefined') {
				const provider = new ethers.providers.Web3Provider(window.ethereum)
				const signer = provider.getSigner()
				const contract = new ethers.Contract(contractAddress, Formify.abi,signer);
				try {
					const results = await contract.viewResults(address, formId);
					console.log("results", results)
					await fetchQuestions(results[0]);
					// setResults(results);
					console.log("calculating mock results");
					const finalResult = calculateResult(results[1]);
					console.log(finalResult)
					setResults(finalResult);
				}catch(e){
					console.log(e)
				}
			}
			setLoading(false);
		}
		if(params.length == 2 && account ){
			fetchResults();
		}
	},[params, account])


	const calculateResult = (data) => {
		const replies = data.length;
		const totQuestions = data[0].answers.length;
		const answers = {
			0:0, 1:0, 2:0, 3:0
		}
		let mainArr = [];
		for(let i = 0;i < totQuestions;i++){
			mainArr.push(JSON.parse(JSON.stringify(answers)))
		}
	
		data.map((res,idx) => {
				res.answers.map((ans,idx2) => {
					mainArr[idx2][ans] += 1;
				})
		});
	
		for(let j = 0;j < totQuestions;j++){
			for(let i = 0;i < 4;i++){
				mainArr[j][i] = (mainArr[j][i] * 100 ) / replies;
			}
		}
		return mainArr;
		
	}

	async function fetchQuestions(ipfsHash){
		const ipfsUrl = `${ipfsURI}${ipfsHash}`;
		const questions = await fetch(ipfsUrl)
		const data = await questions.json();
		console.log("form", data)
		setForm(data);
	}	

	if( params.length != 2){
		return <div className={styles.center}>
			<label>Invalid Address !</label>
		</div>
	}

	if(loading){
		return <div className={styles.center}>
			<label>Loading...</label>
		</div>
	}

  return (
		account ? form && results && (
			<form className={styles.container} >
				<h1 className={styles.title}>{form.data.title}</h1>
				<label>{form.data.description}</label>
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
                          <div key={opt} className={styles.option} style={{background: `linear-gradient(90deg, rgb(59 70 99)${results[qid][oid].toFixed(0)}%, #14161f 0%)`}}>
														<div style={{background: "none"}}>
                              <input 
                                  type={'radio'} 
                                  className={styles.input} 
                                  name={oid}
                                  value={oid}
                              />
															<span className={styles.radioBtnText} style={{fontWeight: 600}}>{opt} </span>
															</div>
															<span className={styles.responsePercent} style={{fontWeight: 600}}>{(results[qid][oid].toFixed(2))}%</span> 
                              {/* <br /> */}
                          </div>
                          )
                      })}
                  </div>
								</div>
							)
						})
					}
				</div>
			</form>
		) : 
		(
			<div className={styles.center}>
				{connectors.map((connector) => (
    		  <button
    		    disabled={!connector.ready}
						className={styles.submitBtn}
    		    key={connector.id}
    		    onClick={() => connect(connector)}
    		  >
    		    Connect with {connector.name}
    		    {!connector.ready && ' (unsupported)'}
    		    {isConnecting &&
    		      connector.id === pendingConnector?.id &&
    		      ' (connecting)'}
    		  </button>
    		))}
			</div>
		) 		
    
  )
}

export default ViewResults