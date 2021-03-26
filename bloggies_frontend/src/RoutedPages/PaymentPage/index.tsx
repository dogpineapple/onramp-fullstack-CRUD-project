import React, { ReactEventHandler, useState } from "react";
import "./PaymentPage.css"
import styled from 'styled-components'
import { CardElement, useStripe, useElements} from "@stripe/react-stripe-js"; 
import {CreateTokenCardData} from '@stripe/stripe-js';
import { Form} from "react-bootstrap";
import { BASE_URL } from "../../config";


///Styled Components 


const PaymentPage = ()  => {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [billingDetails, setBillingDetails] = useState({
    phone: "",
    name: ""
  });


  
  const handleSubmit = async (event:any) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
  

  const cardElement = elements.getElement(CardElement);


  const createPaymentMethod = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement!
  });



  if (error) {
    console.log('[error]', error);
  } else {
    console.log('[PaymentMethod]', paymentMethod);
      }
    };


    // const createSubscription = async () => {
    //   try {
    //     const response = await fetch(`${BASE_URL}/create-subscription`,{
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         customerId: customerId, 
    //         paymentMethodId: paymentMethodId, 
    //         priceId: priceId
    //       })
    //     })
    //   } catch (error) {
    //       if(error) {
    //         throw error 
    //         console.log(error.message)
    //       }
    //     }
    // } 


  return (
    <>
    <Form onSubmit={handleSubmit}>
    
    <button type="submit">
      Pay $30
    </button>

    <CardElement
      options={{
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#9e2146',
        },
      },
    }}
  />
  </Form>
  </>
  )
}

export default PaymentPage;


