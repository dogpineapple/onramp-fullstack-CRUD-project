import React from "react";

/**
 * UserSettingsPage renders the settings page for
 * user membership settings.
 */
function UserSettingsPage() {
  return (
    <div className="UserSettingsPage">
      Users can update their membership status here!
      <div className="UserSettingsPage-membership-deadlines">
        Membership end, Contribution deadline
      </div>
      <div className="UserSettingsPage-membership-settings">
        Cancel Membership
      </div>
    </div>
  );
};

export default UserSettingsPage;