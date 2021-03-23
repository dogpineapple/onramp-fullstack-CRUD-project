import React from "react";
import UserApplicationForm from "../../Forms/UserApplicationForm";

function UserAddtionalApplicationPage() {
  return (
    <div className="UserAddtionalApplicationPage">
      <h1 className="mt-5">Learning Circle Premuim Supplemental Account Application</h1>
      <p>
        We would love to have you as part of The Learning Circle, however we need a bit more information, please fill out the form below so we can get to know you better!
      </p>
      <UserApplicationForm show={true}/>
      );
    </div>
  );
}

export default UserAddtionalApplicationPage;
