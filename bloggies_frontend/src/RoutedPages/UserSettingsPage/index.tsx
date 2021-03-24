import React, { useContext } from "react";
import styled from "styled-components";
import moment from 'moment';
import { useSelector } from "react-redux";
import { CustomReduxState } from "../../custom";

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

/**
 * UserSettingsPage renders the settings page for
 * user membership settings.
 */

function UserSettingsPage() {
  let userInfo = useSelector((st: CustomReduxState) => {
    st.user
  })
  return (
    <UserSettingsPageContainer className="UserSettingsPage">
      <ContentContainers>
        <Headers>My subscription will end on date:</Headers>
      </ContentContainers>
      <VariableContainers>
        {/* <Headers>{moment(userInfo.last_updated_at).fromNow()}</Headers> */}
      </VariableContainers>
      <ContentContainers>
        <Headers>Date to contribute content by:</Headers>
      </ContentContainers>
      <ContentContainers>
        <Headers>Cancel Premium Subscription?</Headers>
      </ContentContainers>
    </UserSettingsPageContainer>
  );
}

export default UserSettingsPage;
