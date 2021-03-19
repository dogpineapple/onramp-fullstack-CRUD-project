import React, { useState } from "react";
import {Elements,CardElement,} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";




const UserSubscriptionPayment = () => {
    const stripe = loadStripe(
        "pk_test_HhZvywQBKlQhmxjtLZPFI0JB00VLQoBMBe" ) 

    return (
    <div>
        <Elements stripe={stripe}> 
            
        </Elements>
    </div>
    )
}


export default UserSubscriptionPayment