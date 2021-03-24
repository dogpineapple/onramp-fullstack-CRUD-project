import React, { useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import PaymentPage from "../PaymentPage";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";


interface IUserFormProps {
    message: string;
}

const UserSubscriptionPayment = () => {
 



    
    return (
        <div>
            <PaymentPage/>
        </div>
        )
    }

    
export default UserSubscriptionPayment