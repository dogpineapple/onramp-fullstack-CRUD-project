import React, { useContext } from "react";
import styled from "styled-components";
import moment from "moment";
import { useSelector } from "react-redux";
import { CustomReduxState } from "../../custom";
import CancelModal from "../../CancelModal";

const ContentContainers = styled.div`
  grid-column: 1 / 2;
`;

const VariableContainers = styled.div`
  grid-column: 2 / 3;
`;
const Headers = styled.h2`
  margin-top: 50px;
`;

const UserSettingsPageContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
`;

const CancelButton = styled.button`
  margin-top: 50px;
`;

/**
 * UserSettingsPage renders the settings page for
 * user membership settings.
 */

function UserSettingsPage() {
  let userInfo = useSelector((st: CustomReduxState) => st.user);
  return (
    <UserSettingsPageContainer className="UserSettingsPage">
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
        <Headers>placeholder</Headers>
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
