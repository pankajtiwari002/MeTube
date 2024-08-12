import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../components/Card.jsx";
import axios from "axios";
import styled from "styled-components";
import { api } from "../constant.js";
import ChannelCard from "../components/ChannelCard.jsx";

const Container = styled.div`
  padding: 15px;
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
  width: 140px;
  height: 140px;
  border-radius: 50%;
  margin-right: 50px;
  @media (max-width: 900px) {
    width: 100px;
    height: 100px;
    margin-right: 30px;
  }
  @media (max-width: 1200px) {
    width: 90px;
    height: 90px;
    margin-right: 20px;
  }
`;

const Title = styled.h1`
  font-size: 40px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  @media (max-width: 760px) {
    font-size: 20px;
  }
`;

const Text = styled.h3`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

const Section = styled.div`
  padding: 10px 10px;
  color: ${({ theme }) => theme.text};
  border-bottom: 2px solid transparent;
  border-bottom-color: ${(props) =>
    props.currvalue === props.value && props.theme.text};
  font-size: 16px;
  font-weight: 400;
  &:hover {
    border-bottom: 2px solid;
    border-bottom-color: ${(props) =>
      props.currvalue === props.value ? props.theme.text : "gray"};
    cursor: pointer;
  }
`;

const Hr = styled.hr`
  width: 100%;
  color: ${({ theme }) => theme.textSoft};
`;

const Gap = styled.div`
  height: 20px;
`;

const SectionContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  flex-wrap: wrap;
  justify-content: start;
  @media (max-width: 1200px) {
    grid-template-columns: auto auto;
  }
  @media (max-width: 760px) {
    grid-template-columns: auto;
    justify-content: center;
  }
`;

const Videos = ({ videos }) => {
  // console.log(videos)
  return (
    <SectionContainer>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </SectionContainer>
  );
};

const Channels = ({ channels }) => {
  return (
    <>
      {channels.map((channel) => (
        <ChannelCard key={channel._id} channel={channel} />
      ))}
    </>
  );
};

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [currvalue, setCurrValue] = useState(0);
  const [userVideos, setUserVideos] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [subscribedUsers, setSubscribedUsers] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        let res = await axios.get(`${api}/videos/user/${currentUser._id}`);
        console.log("User Video: ", res.data);
        setUserVideos(res.data);
        res = await axios.get(`${api}/videos/likes/${currentUser._id}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Liked Video: ", res.data);
        setLikedVideos(res.data);
        res = await axios.get(`${api}/users/sub/${currentUser._id}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setSubscribedUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    getData();
  }, [currentUser._id]);

  const changeSection = (value) => {
    setCurrValue(value);
  };
  return (
    <Container>
      <Column>
        <Row>
          <ProfileImage src={currentUser.img} />
          <Column>
            <Title>{currentUser.name}</Title>
            <Text>{currentUser.email}</Text>
            <Text>{currentUser.subscribers} subscribers . 300 videos</Text>
          </Column>
        </Row>
        <Gap />
        <Row>
          <Section
            value={0}
            currvalue={currvalue}
            onClick={() => changeSection(0)}
          >
            Your Videos
          </Section>
          <Section
            value={1}
            currvalue={currvalue}
            onClick={() => changeSection(1)}
          >
            Liked Videos
          </Section>
          <Section
            value={2}
            currvalue={currvalue}
            onClick={() => changeSection(2)}
          >
            Subscribed Channels
          </Section>
        </Row>
        <Hr />
        <Gap />
        {currvalue === 0 ? (
          <Videos videos={userVideos} />
        ) : currvalue === 1 ? (
          <Videos videos={likedVideos} />
        ) : (
          <Channels channels={subscribedUsers} />
        )}
      </Column>
    </Container>
  );
};

export default Profile;
