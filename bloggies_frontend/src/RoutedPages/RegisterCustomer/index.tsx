import React, { ReactEventHandler, useState } from "react";
import styled from 'styled-components' 
import {CreateTokenCardData} from '@stripe/stripe-js';
import { BASE_URL } from "../../config";
import { useSelector } from "react-redux";
import { CustomReduxState } from "../../custom";



const RegisterCustomer = ()  => {
  const [email, setEmail] = useState('')

  const user = useSelector(
    (st: CustomReduxState) => st.user
  );


  const handleSubmit = async (event: any) => {
    event.preventDefault()
    console.log(email)
    const customer = await createCustomer(email)
    console.log(customer);
  }

  const createCustomer = async (billingEmail: string) => {
    try {
      const response = await fetch(`${BASE_URL}/checkout/create-customer`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: billingEmail,
        //   user_id: user.id
        }),
      })
      
      if (!response.ok)
      return null;
      
      const result = await response.json();
      return result.customer.id;    
      
      
    } catch(error) {
        console.log(error)
    } 
}

  return (
       
    <div>
        <form onSubmit={handleSubmit}> 
            <input placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)}/> 
            <button type="submit">Register</button>
        </form>
  </div>
  )
}

  export default RegisterCustomer