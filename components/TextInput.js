import React from 'react'
import { useRef, useEffect } from 'react'
import styles from "../styles/TextInput.module.css"

const TextInput = ({label,value,setValue, register, name}) => {
  return (
    <>
      <label className={styles.label}>{label}</label>
      <br/>
      <input
        className={styles.input} 
        type="text" 
        // value={value}
        // onChange={(e) => setValue(e.target.value)}
        {...register(name,{required: true})}
      />
      <br/>
    </>
  )
}

export default TextInput