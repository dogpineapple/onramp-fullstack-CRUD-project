import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { User } from "../custom";
import UserCard from "../UserCard";

interface IProp {
  users: Array<User>
}

function UserList({ users }: IProp) {
  return (
    <Container className="UserList mt-3">
      <Row>
        {users.length > 0 ? 
            users.length > 0 &&
              users.map(u => {
                return <UserCard key={u.id} user={u} />
              })
          : <Col md={12}>
            <p className="mt-5">No users found.</p>
          </Col>
        }
      </Row>
    </Container>
  );
};

export default UserList;