import React, { useState } from "react";
import {
  Elements,
  CardElement,
} from "@stripe/react-stripe-js";
import "./PaymentPage.css"
import styled from 'styled-components'

const PaymentPage = ()  => {
  
  const [paymentLoading, setPaymentLoading] = useState(false)
  
  // const StyledCard = styled.div `
  //   padding: 3rem
  //   background-color: white;
  //   padding: 10px 20px 11px;
  //   border-radius: 5px;
  //   width: 100%;
  //   border: 1px solid #afafaf;
  //   box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);`
  
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