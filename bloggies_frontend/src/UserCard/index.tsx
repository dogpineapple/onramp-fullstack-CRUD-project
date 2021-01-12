import React from "react";
import { Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { User } from "../custom";
import { changeToURLFriendly } from "../helpers";
import moment from "moment";
import "./UserCard.css";

interface IProp {
  user: User
}

/**
 * `UserCard` renders a user object as a card.
 * Can redirect to a user's profile through a NavLink.
 */
function UserCard({ user }: IProp) {
  return (
    <Card className="UserCard text-left">
      <Card.Body>
        <Card.Text className="BlogCard-body">
          <NavLink to={`/users/${user.id}/${changeToURLFriendly(user.display_name)}/favorites`}>
            {user.display_name}
          </NavLink>
        </Card.Text>
        <Card.Subtitle>Joined {moment(user.join_date).fromNow()}</Card.Subtitle>
      </Card.Body>
    </Card>
  );
};

export default UserCard;