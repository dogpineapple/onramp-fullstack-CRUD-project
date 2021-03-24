import React, { ReactEventHandler, useState } from "react";
import "./PaymentPage.css"
import styled from 'styled-components'
import { CardElement, useStripe, useElements} from "@stripe/react-stripe-js"; 
import {CreateTokenCardData} from '@stripe/stripe-js';


const PaymentPage = ()  => {

  return (
       
    <div>
      <form id="payment-form">
        <div id="card-element">
          {/* <!-- Elements will create input elements here --> */}
        </div>

        {/* <!-- We'll put the error messages in this element --> */}
        <div id="card-element-errors" role="alert"></div>
        <button type="submit">Subscribe</button>
      </form>
  </div>

  )
}

export default PaymentPage;


