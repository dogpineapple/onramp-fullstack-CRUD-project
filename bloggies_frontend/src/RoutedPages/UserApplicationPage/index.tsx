import React from "react";
import UserApplicationForm from "../../Forms/UserApplicationForm";
import './UserApplicationPage.css'

function UserApplicationPage() {
  return (
    <div className="UserApplicationPage mt-5">
      <h1 className="mt-5">Learning Circle Premuim Account Registration Form</h1>
      <p>
        We would love to have you as part of The Learning Circle, please fill out the form below so we can determine your eligibility!
      </p>
      <UserApplicationForm />
    </div>
  );
};

export default UserApplicationPage;