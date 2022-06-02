import React, { useEffect, useState } from 'react'
import styles from "../styles/Dashboard.module.css"

import { useRouter } from 'next/router';
import {MdShare} from "react-icons/md";
import {GrView} from "react-icons/gr";

import ShareFormModal from '../components/ShareFormModal';

//  web3
import { ethers } from 'ethers'
import {
	chain,
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi'

import { contractAddress } from "../config"
import Formify from "../artifacts/contracts/Formify.sol/Formify.json"

const ipfsURI = 'https://ipfs.io/ipfs/';

const Dashboard = () => {

  const router = useRouter();

  const [data, setData] = useState(null);
  const [allForms, setAllForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [shareFormId, setShareFormId] = useState(null);
	// authentication
	const { data: account } = useAccount();
	const { connect, connectors, error, isConnecting, pendingConnector } =
		useConnect({
			chains: [chain.polygonMumbai]
		})
	const { disconnect } = useDisconnect();

  const createNewForm = () => {
    console.log("create new form");
    router.push('/create-form');
  }
  
  useEffect(() => {
    async function fetchDashboard(){
      console.log("fetching dashboard data");
      setLoading(true);
      if (typeof window.ethereum !== 'undefined') {
				const provider = new ethers.providers.Web3Provider(window.ethereum)
				const signer = provider.getSigner()
				const contract = new ethers.Contract(contractAddress, Formify.abi,signer);
				try {
					const data = await contract.getUserForms();
					console.log(data);
					setData(data);
          if(data.length > 0){
            await fetchPostFromData(data);
          }
          setLoading(false);
				}catch(e){
					console.log(e)
				}
			}
    }
    if(account){
      fetchDashboard();
    }
  },[account])

  async function fetchPostFromData (data){
    console.log("fetching post from data",data);
    const allPosts = [];
    for(let i=0; i<data.length; i++){
      const ipfsUrl = `${ipfsURI}${data[i]}`;
      const response = await fetch(ipfsUrl);
      const post = await response.json()
      allPosts.push(post);
    }
    console.log(allPosts)
    setAllForms(allPosts);
    setLoading(false);
  }

  const shareForm = (id) => {
    console.log("share form");
    setShareModal(true);
    setShareFormId(id);
  }

  if(loading){
		return <div className={styles.center}>
			<label>Loading...</label>
		</div>
	}

  return (
    account ? data && (
      <>
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <h1>Your Dashboard</h1>
          <button onClick={createNewForm} className={styles.submitBtn}>Add</button>
        </div>
        {
          data.length === 0 ? (
            <div className={styles.messageContainer}>
              <label className={styles.center}>Create new Form</label>
            </div>
          ) : (
            <div className={styles.formsContainer}>
              {
                allForms.map((form, index) => {
                  return (
                    <div className={styles.formContainer} key={index}>
                      <div className={styles.formTitle}>
                        <h3>{form.data.title}</h3>
                      </div>
                      <div className={styles.formActions}>
                        <GrView className={`${styles.viewIcon} icon`} color={'white'} size={18}/>
                        <MdShare 
                          className={styles.icon} 
                          color={'white'}
                          onClick={() => shareForm(index)}  
                        />
                      </div>
                    </div>
                  ) 
                })
              }            
            </div>
            
          )
        }
      </div>
      { shareModal && <ShareFormModal setModal={setShareModal} account={account} id={shareFormId}/> }
      </>
    ) : (
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

export default Dashboard