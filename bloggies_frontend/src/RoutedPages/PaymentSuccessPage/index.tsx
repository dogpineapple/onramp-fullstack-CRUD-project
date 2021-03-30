import React from "react";
import styled from 'styled-components'



function PaymentSuccessPage() {

const ContainerDiv = styled.div `

`

const Paragraph = styled.p `
font-size: 20px;
font-family:  monaco, Consolas, Lucida Console; 
text-color: blue;
text-decoration shadow;
margin: 5rem auto;
text-shadow: 1px 2px 3px #FFF000;`


  return (
    <ContainerDiv className="PaymentSuccessPage">

      <Paragraph>Thank you for subscribing!<br>
      </br>
        Congrats on being a premium user
      </Paragraph>

    </ContainerDiv>
  );
};

export default PaymentSuccessPage;