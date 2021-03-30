import React, { ReactEventHandler, useState } from "react";
import "./PaymentPage.css"
import styled from 'styled-components'
import { CardElement, useStripe, useElements} from "@stripe/react-stripe-js"; 
import {CreateTokenCardData} from '@stripe/stripe-js';
import { Form} from "react-bootstrap";
import { ACTIVE, BASE_URL } from "../../config";
import {useDispatch, useSelector} from 'react-redux'
import { CustomReduxState } from "../../custom";
import {deleteServerErr, gotServerErr, gotMembershipStatus } from '../../redux/actionCreators'
import {gotSubscription} from '../../redux/stripeAction'
import {useHistory} from 'react-router-dom'

///Styled Components 

const PaymentPage = ()  => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch()
  const userCustomerId = useSelector((st:CustomReduxState) => st.user.customer_id )
  const history = useHistory()

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


  return (
    <>
    <Form className="PaymentForm" onSubmit={handleSubmit}>
    
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
  );
}

export default PaymentPage;


