import React, { useState } from "react";
import {Elements,CardElement,} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentPage from "../PaymentPage";


const UserSubscriptionPayment = () => {
    const stripe = loadStripe(
        "pk_test_HhZvywQBKlQhmxjtLZPFI0JB00VLQoBMBe" ) 

    return (
    <div>
        <Elements stripe={stripe}> 
            <PaymentPage/>
        </Elements>
    </div>
    )
}


export default UserSubscriptionPayment