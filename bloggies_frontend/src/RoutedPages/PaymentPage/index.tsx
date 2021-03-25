import React, { ReactEventHandler, useState } from "react";
import "./PaymentPage.css"
import styled from 'styled-components'
import { CardElement, useStripe, useElements} from "@stripe/react-stripe-js"; 
import {CreateTokenCardData} from '@stripe/stripe-js';


const PaymentPage = ()  => {
  const stripe = useStripe();
  const elements = useElements();

  
  const handleSubmit = async (event:any) => {
    // Block native form submission.
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
    
  const cardElement = elements.getElement(CardElement);


  // Use your card Element with other Stripe.js APIs
  const {error, paymentMethod} = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement!,
  });

  if (error) {
    console.log('[error]', error);
  } else {
    console.log('[PaymentMethod]', paymentMethod);
      }
    };

  return (

    <div>
      <form id="payment-form" onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit">Subscribe</button>
      </form>
  </div>
  )
}

export default PaymentPage;


