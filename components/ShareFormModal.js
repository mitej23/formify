import React, { useEffect, useState} from 'react'
import {createPortal} from 'react-dom'
import styles from '../styles/Modal.module.css'
import {MdOutlineClose} from 'react-icons/md'


const ShareFormModal = ({account,id,setModal}) => {
  const [mounted, setMounted] = useState(false);

  const urlDev = "http://localhost:3000/"

  useEffect(() => {
    setMounted(true);
    console.log(account)
    return () => setMounted(false);
  },[])

  return mounted ? createPortal(
    <>
      <div className={styles.overlay}></div>
      <div className={styles.modal}>
        <MdOutlineClose className={styles.close} size={24} color="white" onClick={() => setModal(false)}/>
        <h2 className={styles.title}>Share Form</h2>
        <div className={styles.shareLink}>
          <p>{urlDev}{account.address}/{id}</p>
        </div>
      </div>
    </>
    ,
    document.getElementById('modal-root')
  ) : null;
}

export default ShareFormModal;