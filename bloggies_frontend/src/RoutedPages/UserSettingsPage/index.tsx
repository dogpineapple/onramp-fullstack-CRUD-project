import React, { useContext } from "react";
import styled from "styled-components";
import moment from "moment";
import { useSelector } from "react-redux";
import { CustomReduxState } from "../../custom";
import CancelModal from "../../CancelModal";

const ContentContainers = styled.div`
  grid-column: 1 / 2;
  margin-top: 80px;
`;

const VariableContainers = styled.div`
  grid-column: 2 / 3;
  margin-top: 80px;
`;
const Headers = styled.h2`
`;

const UserSettingsPageContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  margin-top: 100px;
`;

const CancelButton = styled.button`
  margin-top: 0px;
`;

const SettingsHeader = styled.h1`
  grid-column: 1 / 3;
`

/**
 * UserSettingsPage renders the settings page for
 * user membership settings.
 */

function UserSettingsPage() {
  let userInfo = useSelector((st: CustomReduxState) => st.user);
  console.log(userInfo)
  return (
    <UserSettingsPageContainer className="UserSettingsPage">
      <SettingsHeader>
        {`${userInfo.display_name}'s Settings` }
      </SettingsHeader>
      <ContentContainers>
        <Headers>My subscription will end on date:</Headers>
      </ContentContainers>
      <VariableContainers>
        <Headers>
          {moment(userInfo.membership_end_date).format("MMMM Do, YYYY")}
        </Headers>
      </VariableContainers>
      <ContentContainers>
        <Headers>Date to contribute content by:</Headers>
      </ContentContainers>
      <VariableContainers>
        <Headers>{moment(userInfo.cancel_at).format("MMMM Do, YYYY")}</Headers>
      </VariableContainers>
      <ContentContainers>
        <Headers>Cancel Premium Subscription?</Headers>
      </ContentContainers>
      <VariableContainers>
        <CancelModal />
      </VariableContainers>
    </UserSettingsPageContainer>
  );
}

export default UserSettingsPage;
