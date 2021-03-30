import React, { ReactEventHandler, useState } from "react";
import "./PaymentPage.css"
import styled from 'styled-components'
import { CardElement, useStripe, useElements} from "@stripe/react-stripe-js"; 
import { BASE_URL } from "../../config";

import {CreateTokenCardData} from '@stripe/stripe-js';
import { Form} from "react-bootstrap";
import { ACTIVE, BASE_URL } from "../../config";
import {useDispatch, useSelector} from 'react-redux'
import { CustomReduxState } from "../../custom";
import {deleteServerErr, gotServerErr, gotMembershipStatus } from '../../redux/actionCreators'
import {gotSubscription} from '../../redux/stripeAction'
import {useHistory} from 'react-router-dom'

const PaymentPage = ()  => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch()
  const userCustomerId = useSelector((st:CustomReduxState) => st.user.customer_id )
  const history = useHistory()


  const handleSubmit = async (event:any) => {
    console.log('for the love of GOD');
    event.preventDefault();
    console.log('for');
    
    if (!stripe || !elements) {
      console.log('strippppppe');
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if(cardElement) {
      const paymentMethodRes = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement
      }); 
      if(paymentMethodRes.error) {
        alert(`${paymentMethodRes.error.message}`);
      }
      
      if(paymentMethodRes.paymentMethod) {
        
        const res = await fetch(`${BASE_URL}/checkout/create-subscription`,{
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }, 
          body: JSON.stringify({
            paymentMethodId: paymentMethodRes.paymentMethod.id, 
            customerId: userCustomerId,
          })
        })
        const resData = await res.json()
        if(res.status === 201) {
          dispatch(deleteServerErr());
          dispatch(gotSubscription(resData.subscription));
          if(resData.subscription.status === 'active'){
            dispatch(gotMembershipStatus(ACTIVE));
            history.push('/payment/success');
          }
        } else if(res.status === 402) {
          alert('card is invalid')
          dispatch(gotServerErr(resData.error.message));
        } else {
          dispatch(gotServerErr(resData.error.message));
        } 
      }
    }
  }


  const ContainerDiv = styled.div `
    align-items: center;
    margin: 10rem auto;
    position: relative;
    width: 30%;
    
  `

  const Form = styled.form `
  width: 100%;
  padding: 11px 15px 11px 0;
  `

  const Button = styled.button ` 
  display: block;
  font-size: 16px;
  width: 20em;
  height: 40px;
  margin: 40px auto;
  background-color: #ccc;
  box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 #ffb9f6;
  border-radius: 4px;
  color: #ggg;
  font-weight: 600;
  cursor: pointer;
  transition: all 100ms ease-in-out;
  will-change: transform, background-color, box-shadow;`


  const Card = styled.div `
  border: solid 2px #ccc;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  box-shadow: 5px 10px #ccc; 
  `

  const Header = styled.div `
    font-size: 20px;
    font-family:  monaco, Consolas, Lucida Console; 
    text-color: blue;
    text-decortion: line;

  `

  return (
    <ContainerDiv className='container'> 

    <Header> Make your Payment Here</Header>

    <Form className="PaymentForm" onSubmit={handleSubmit}> 
    
    <Card> 
      <CardElement 
      options={{
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
            padding: '5px',
            backgroundColor: 'greeen'
          },
          invalid: {
            color: '#9e2146',
          },
        },
      }}
      />
    </Card>
  
    <Button type="submit">
      Pay $30
    </Button>
    </Form>
  </ContainerDiv>

  )
        invalid: {
          color: '#9e2146',
        },
      },
    }}
  />
  </Form>
  </>
  );
}

export default PaymentPage;


