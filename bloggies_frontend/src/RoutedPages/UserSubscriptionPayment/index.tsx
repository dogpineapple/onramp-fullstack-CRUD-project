import React, { useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import PaymentPage from "../PaymentPage";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";



const UserSubscriptionPayment = () => {
 const stripe = loadStripe('pk_test_51IYfMHEMWEqqB6FjCBOuBuEb3qZjOvZRQDvY8GultvK4Vh7PjLjc9elVwgTMiH41y1nXnXOyVlOa1OMKNR4lADSN00DmY9q4DR')


    return (
        <Elements stripe={stripe} >
            <PaymentPage/>
        </Elements>
        )
    }

    
export default UserSubscriptionPayment