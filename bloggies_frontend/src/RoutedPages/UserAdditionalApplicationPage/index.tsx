import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { CustomReduxState } from "../../custom";
import UserApplicationForm from "../../Forms/UserApplicationForm";

function UserAddtionalApplicationPage() {
  // check user status and make sure they cannot access the additional form if they have not filled out the first form
  const checkStatus = useSelector(
    (st: CustomReduxState) => st.user.membership_status
  );
  const history = useHistory();
  if (checkStatus === 'none') {
    history.push('/register/membership-form')
  }
  return (
    <div className="UserAddtionalApplicationPage">
      <h1 className="mt-5">Learning Circle Premuim Supplemental Account Application</h1>
      <p>
        We would love to have you as part of The Learning Circle, however we need a bit more information, please fill out the form below so we can get to know you better!
      </p>
      <UserApplicationForm show={true}/>
    </div>
  );
}

export default UserAddtionalApplicationPage;
