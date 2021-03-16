import React, { useState } from 'react'
import axios from 'axios'

//Functionality for payment success and for payment cancelation 


interface FormData {
    answer1: string    
    answer2: string 
    answer3: string 

}




const formPost = (formData: FormData) => {
     // goes on register form to post membership registration status
     return axios.post('/register/membership-status')
     //if successful then direct user to success page if not successful then show pending message
     //after form message is posted to db server checks to ensure answers are correct then 
     //another func sends SendGrid email to users email  
 }




const onSubmit = async () => {
    try {
        await formPost({answer1: '', answer2: '', answer3: ''})
    } catch(error) {
        console.log(error)
    }   
}




