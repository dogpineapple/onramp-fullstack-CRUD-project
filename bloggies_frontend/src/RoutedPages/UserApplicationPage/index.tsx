import React, {useState} from "react";
import UserApplicationForm from "../../Forms/UserApplicationForm";
import './UserApplicationPage.css'

/*
  * User Application Page for Learning Circle Premium
  * activated by clicking on 'get premium' in NavBar once signed in
  * Routes to '/register/membership-application'
  * might need to add logic to dynamically render this page depending on user status of none, rejected, pending, accepted, active
*/
function UserApplicationPage() {
  return (
    <div className="UserApplicationPage mt-5">
      <h1 className="mt-5">Learning Circle Premuim Account Application</h1>
      <p>
        We would love to have you as part of The Learning Circle, please fill out the form below so we can determine your eligibility!
      </p>
      <UserApplicationForm />
    </div>
  );
};

export default UserApplicationPage;