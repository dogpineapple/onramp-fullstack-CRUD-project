import React from "react";
import { User } from "../../custom";

/**
 * RegisterStatusPage renders a successful registration page and shows
 * the membership status of the newly registered user.
 */
// interface IProps {
//     user: User
// }
function RegisterStatusPage() {
    // if (user.membership_status === 'accepted') {

    // }
    return (
        <div className="RegisterStatusPage">
            Registration completed.
            Either membership approved or pending membership will show here
        </div>
    )
}

export default RegisterStatusPage;

