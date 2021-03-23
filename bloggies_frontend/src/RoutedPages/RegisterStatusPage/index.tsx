import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CustomReduxState, User } from "../../custom";

/**
 * RegisterStatusPage renders a successful registration page and shows
 * the membership status of the newly registered user.
 */
// interface IProps {
//     user: User
// }
function RegisterStatusPage() {
  const checkStatus = useSelector(
    (st: CustomReduxState) => st.user.membership_status
  );
  const [status, setStatus] = useState("");

  let text: string | null = null;

    useEffect(() => {
    setStatus(checkStatus);

  }, [status]);

    if (status === "none") {
      text = "";
    } else if (status === "rejected") {
      text = "rejected";
    } else if (status === "pending") {
      text = "pending";
    } else if (status === "accepted") {
      text = "accepted";
    }
    
  return <div className="RegisterStatusPage">{text}</div>;
}

export default RegisterStatusPage;
