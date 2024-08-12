import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../constant";
import { subscription } from "../redux/userSlice";

const Container = styled.div`
  padding: 15px;
  &:hover {
    cursor: pointer;
    background-color: #0000002f;
    border-radius: 1em;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-right: 50px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin-bottom: 3px;
`;

const Text = styled.h3`
  font-size: 13px;
  color: ${({ theme }) => theme.textSoft};
`;

const SubscribeButton = styled.button`
  padding: 5px 8px;
  border-radius: 5px;
  background-color: ${(props) => (props.subscribe ? "#000000a2" : "#cc1a00")};
  color: white;
  margin-top: 10px;
  border: none;
  &:hover {
    cursor: pointer;
  }
`;

const ChannelCard = ({ channel }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [flag, setFlag] = useState(
   currentUser.subscribedUsers.includes(channel._id)
  );

  const handleSubscribe = async () => {
    try {
      if (currentUser.subscribedUsers.includes(channel._id)) {
        const res = await axios.put(
          `${api}/users/unsub/${channel._id}`,
          {},
          {
            withCredentials: true, // Ensure cookies are sent with the request
            headers: {
              "Content-Type": "application/json", // Set the appropriate content type
            },
          }
        );
        console.log(res.data)
        setFlag(false)
      } else {
        const res = await axios.put(
          `${api}/users/sub/${channel._id}`,
          {},
          {
            withCredentials: true, // Ensure cookies are sent with the request
            headers: {
              "Content-Type": "application/json", // Set the appropriate content type
            },
          }
        );
        console.log(res.data)
        setFlag(true)
      }
      dispatch(subscription(channel._id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Column>
        <Row>
          <ProfileImage src={channel.img} />
          <Column>
            <Title>{channel.name}</Title>
            <Text>
              {flag ? channel.subscribers : channel.subscribers-1} subscribers
              . 300 videos
            </Text>
            <SubscribeButton subscribe={flag} onClick={handleSubscribe}>
              {flag ? "Subscribed" : "Subscribe"}
            </SubscribeButton>
          </Column>
        </Row>
      </Column>
    </Container>
  );
};

export default ChannelCard;
