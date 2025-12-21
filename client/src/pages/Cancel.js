import React from 'react'
import CANCELIMAGE from '../assest/cancel.gif'
import { Link } from 'react-router-dom'

const Cancel = () => {
  return (
    <div className='bg-slate-200 w-full max-w-md mx-auto flex justify-center items-center flex-col p-4 m-2 rounded'>
      <img
        src={CANCELIMAGE}
        alt=''
        width={150}
        height={150}
        className='mix-blend-multiply'
      />
      <p className='text-brand-primary font-bold text-xl'>Payment Cancel</p>
      <Link to={"/cart"} className='p-2 px-3 mt-5 border-2 border-brand-primary rounded font-semibold text-brand-primary hover:bg-brand-primaryHover hover:text-white'>Go To Cart</Link>
    </div>
  )
}

export default Cancel
