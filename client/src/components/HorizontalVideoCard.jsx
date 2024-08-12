import { useState, useEffect } from "react";
import styled from "styled-components";
import { api } from "../constant";
import { format } from "timeago.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Container = styled.div`
  padding: 0px 25px;
  align-items: center;
  margin-bottom: 20px;
  &:hover {
    cursor: pointer;
  }
  display: none;
  @media (min-width: 760px) {
    display: flex;
  }
`;

const Image = styled.img`
  width: 40%;
  /* min-width: 100px; */
  min-height: 10px;
  border-radius: 5%;
  background-color: #999;
  margin-right: 10px;
  @media (min-width: 760px) {
    width: 30%;
    min-width: 360px;
    height: 200px;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => (props.type ? "start" : "space-between")};
  align-items: ${(props) => (props.type ? "center" : "start")};
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  -webkit-box-orient: vertical;
  line-height: 1.2em; /* Adjust line-height to control spacing */
  max-height: 2.4em; /* Should be 2 * line-height */
  word-break: break-word; /* Ensure long words break correctly */
  @media (max-width: 760px) {
    -webkit-line-clamp: 1;
    font-size: 14px;
  }
`;

const Text = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.textsoft};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  -webkit-box-orient: vertical;
  line-height: 1.2em; /* Adjust line-height to control spacing */
  max-height: 2.4em; /* Should be 2 * line-height */
  word-break: break-word; /* Ensure long words break correctly */
  @media (max-width: 600px) {
    -webkit-line-clamp: 1;
    font-size: 11px;
    display: ${(props) => props.desc ? "none": "flex"};
  }
`;

const ChannelImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
`;

const Gap = styled.div`
  height: 10px;
`;

const RemoveButton = styled.button`
  border: none;
  border-radius: 50%;
  font-size: 20px;
  padding: 5px;
  background: transparent;
  color: ${({ theme }) => theme.text};
  &:hover {
    cursor: pointer;
  }
`;

const HorizontalVideoCard = ({ video, removeVideoById, type }) => {
  const navigate = useNavigate();
  const [channel, setChannel] = useState({});
  let flag = true;

  useEffect(() => {
    console.log("card");
    const fetchchannel = async () => {
      try {
        const res = await fetch(`${api}/users/find/${video.userId}`);
        const data = await res.json();
        console.log(data);
        setChannel(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchchannel();
  }, [video.userId]);

  const onRemove = async (event) => {
    flag = false;
    event.stopPropagation();
    try {
      console.log(video);
      const res = await axios.delete(`${api}/history/${video.historyId}`, {
        withCredentials: true,
        headers: {
          "content-tye": "application/json",
        },
      });
      console.log(res.data);
      removeVideoById(video.historyId);
    } catch (err) {
      console.error(err);
    }
    flag = true;
  };

  return (
    <Container
      onClick={() => {
        if (flag) navigate(`/video/${video._id}`);
      }}
    >
      <Row>
        <Image src={video.imgUrl} />
        <Column>
          <Row>
            <Title>{video.title}</Title>
            {type === "history" && (
              <RemoveButton onClick={onRemove}>&#10005;</RemoveButton>
            )}
          </Row>
          {type === "search" && <Gap />}
          <Row type={true}>
            <ChannelImage src={channel.img} />
            <Text>{channel.name}</Text>
          </Row>
          <Gap />
          <Text>
            {video.views} views . {format(video.createdAt)}
          </Text>
          <Gap />
          <Text desc={true}>
            {video.desc}
          </Text>
        </Column>
      </Row>
    </Container>
  );
};

export default HorizontalVideoCard;
