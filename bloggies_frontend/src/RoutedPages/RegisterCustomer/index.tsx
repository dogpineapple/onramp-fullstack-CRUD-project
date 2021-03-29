import React, { ReactEventHandler, useState } from "react";
import styled from 'styled-components' 
import {CreateTokenCardData} from '@stripe/stripe-js';
import { BASE_URL } from "../../config";
import { useSelector, useDispatch } from "react-redux";
import { CustomReduxState } from "../../custom";
import { createCustomer } from "../../redux/stripeAction";


const RegisterCustomer = ()  => {
  const [email, setEmail] = useState('')
  const dispatch = useDispatch()

  const user = useSelector(
    (st: CustomReduxState) => st.user
  );


  const handleSubmit = async (event: any) => {
      event.preventDefault()
      dispatch(createCustomer())
      console.log('customer');
    }

  return (
    <div>
        <form onSubmit={handleSubmit}>
        {/* {email} onChange={(e) => setEmail(e.target.value)} */}
            <button type="submit">Register</button>
        </form>
    </div>
  )
}

  export default RegisterCustomer