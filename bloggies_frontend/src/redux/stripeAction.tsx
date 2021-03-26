import { Dispatch } from "react";
import { Action } from "redux";
import { BASE_URL } from "../config";
import { UPDATE_CUSTOMER_ID } from "./actionTypes";
import {gotServerErr, deleteServerErr} from "./actionCreators"

/**
 * POST request to add a post to backend and dispatches
 * action to update redux store.
 */

 
export const createCustomer = () => {
    return async function (dispatch:Dispatch<Action>) {
      const res = await fetch(`${BASE_URL}/checkout/create-customer`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        } 
      })
      const resData = await res.json() 
      if(res.status == 201) {
        dispatch(deleteServerErr())
        dispatch(gotCustomer(resData))
      } else {
        dispatch(gotServerErr(resData.error.message))
      }
    }
  }
 
  const gotCustomer = (customer:any) => {
    return {type: UPDATE_CUSTOMER_ID, payload: customer} 
      
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

