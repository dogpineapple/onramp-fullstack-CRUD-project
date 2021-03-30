import React from "react";
import styled from 'styled-components'



function PaymentCancelPage() {

  const ContainerDiv = styled.div `
  font-size: 20px;
  font-family:  monaco, Consolas, Lucida Console; 
  text-color: blue;
  text-decoration shadow;
  margin: 5rem auto;
  text-shadow: 3px 3px 6px #8b0000;

  `


  return (
    <ContainerDiv className="PaymentCancelPage">
      <p>Membership payment has been canceled! </p>
    </ContainerDiv>
  );
};

export default PaymentCancelPage;