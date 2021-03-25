import { Dispatch } from "react";
import { Action } from "redux";
import { BASE_URL } from "../config";


/**
 * POST request to add a post to backend and dispatches
 * action to update redux store.
 */

 export function addUserPaymentForm() {
    return async function (dispatch: Dispatch<Action>) {
      const res = await fetch(`${BASE_URL}/`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ }),
        headers: {
          "Content-type": "application/json"
        }
      });
      const resData = await res.json();
      if (res.status === 201) {
        // dispatch(());
        dispatch((resData.form));
      } else {
        dispatch((resData.error.message));
      }
    }
  }


  export const stripeTokenHandler = (token: { id: any; }) => {
    return async function (dispatch:Dispatch<Action>) {
    const paymentData = {token: token.id};  
    // Use fetch to send the token ID and any other payment data to your backend server.
    const response = await fetch(`${BASE_URL}/charge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData),
    });
  
    // Return and display the result of the charge.
    return response.json();
  }
}



// export const createCustomer = () => {
//     let billingEmail = document.querySelector('#email').value;
//     return fetch('/create-customer', {
//       method: 'post',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         email: billingEmail,
//       }),
//     })
//       .then((response) => {
//         return response.json();
//       })
//       .then((result) => {
//         // result.customer.id is used to map back to the customer object
//         return result;
//       });
//   }