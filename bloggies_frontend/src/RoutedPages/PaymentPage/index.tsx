import React, { useState } from "react";
import {
  Elements,
  CardElement,
} from "@stripe/react-stripe-js";
import "./PaymentPage.css"
import styled from 'styled-components'

const PaymentPage = ()  => {
  
  const [paymentLoading, setPaymentLoading] = useState(false)
  
  
  return (
    
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <form
        style={{
          display: "block",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CardElement
            className="card"
            options={{
              style: {
                base: {
                  backgroundColor: "white",
                } 
              },
            }}
          />
          <button
            className="pay-button"
            disabled={paymentLoading}
          >
            {paymentLoading ? "Loading..." : "Pay"}
          </button>
        </div>
      </form>
    </div>
  )
}


export default PaymentPage;