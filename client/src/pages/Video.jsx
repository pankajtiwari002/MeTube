import {
  AddTaskOutlined,
  ReplyOutlined,
  ThumbDown,
  ThumbDownOffAltOutlined,
  ThumbUp,
  ThumbUpOutlined,
} from "@mui/icons-material";
import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Comments from "../components/Comments";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { api } from "../constant";
import {
  dislike,
  fetchFailure,
  fetchStart,
  fetchSuccess,
  like,
} from "../redux/videoSlice";
import { format } from "timeago.js";
import { subscription } from "../redux/userSlice";
import Recommendation from "../components/Recommendation";
import VideoDescription from "../components/VideoDescription";
import defaultImage from "../img/profile_placeholder.jpg";

const Container = styled.div`
  display: flex;
  gap: 24px;
  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;
const Content = styled.div`
  flex: 7;
  @media (max-width: 1200px) {
    flex: content;
  }
`;
const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: start;
    justify-content: space-evenly;
  }
`;

const Info = styled.div`
  color: ${({ theme }) => theme.textSoft};
  margin-bottom: 10px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
`;
const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;
const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;
const ChannelDetail = styled.div`
  /* display: flex; */
  /* flex-direction: column; */
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;
const ChannelCounter = styled.div`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: ${(props) => (props.subscribe ? "#000000a2" : "#cc1a00")};
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const VideoFrame = styled.video`
  display: flex;
  width: 100%;
  max-height: 720px;
  object-fit: fill;

  @media (max-width: 768px) {
    /* transform: rotate(90deg);
    max-height: 100vh;
    width: 100vh; */
  }
`;
const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();

  const videoId = useLocation().pathname.split("/")[2];
  const [flag, setFlag] = useState(
    currentUser === null ? false : currentUser.subscribedUsers.includes(videoId)
  );
  const [channel, setChannel] = useState({});
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastSpaceBarTime, setLastSpaceBarTime] = useState(0);

  useEffect(() => {
    const addView = async () => {
      try {
        const res = await axios.put(`${api}/videos/view/${videoId}`);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    addView();
  }, [videoId]);

  useEffect(() => {
    const addToHistory = async () => {
      if (!currentUser) return;
      try {
        const res = await axios.post(
          `${api}/history/`,
          {
            userId: currentUser._id,
            videoId: videoId,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(res);
      } catch (err) {
        console.error(err);
      }
    };

    addToHistory();
  }, [videoId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchStart());
        const videoRes = await axios.get(`${api}/videos/find/${videoId}`);
        const channelRes = await axios.get(
          `${api}/users/find/${videoRes.data.userId}`
        );
        console.log(videoRes.data);
        console.log(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
        setChannel(channelRes.data);
      } catch (err) {
        console.error(err);
        dispatch(fetchFailure());
      }
    };
    fetchData();
  }, [videoId, dispatch]);

  const handleLike = async () => {
    if (!currentUser) return;
    try {
      const cookies = document.cookie.split(";");
      let access_token = "";
      for (let cookie of cookies) {
        if (cookie.startsWith("access_token=")) {
          access_token = cookie.substring(13);
          break;
        }
      }
      console.log(access_token);
      await axios.put(
        `${api}/users/like/${currentVideo._id}`,
        {},
        {
          withCredentials: true, // Ensure cookies are sent with the request
          headers: {
            "Content-Type": "application/json", // Set the appropriate content type
          },
        }
      );
      dispatch(like(currentUser._id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async () => {
    if (!currentUser) return;
    try {
      const cookies = document.cookie.split(";");
      let access_token = "";
      for (let cookie of cookies) {
        if (cookie.startsWith("access_token=")) {
          access_token = cookie.substring(13);
          break;
        }
      }
      console.log(access_token);
      await axios.put(
        `${api}/users/dislike/${currentVideo._id}`,
        {},
        {
          withCredentials: true, // Ensure cookies are sent with the request
          headers: {
            "Content-Type": "application/json", // Set the appropriate content type
          },
        }
      );
      dispatch(dislike(currentUser._id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSub = async () => {
    if (!currentUser) return;
    try {
      const cookies = document.cookie.split(";");
      let access_token = "";
      for (let cookie of cookies) {
        if (cookie.startsWith("access_token=")) {
          access_token = cookie.substring(13);
          break;
        }
      }
      console.log(access_token);
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
        setFlag(false);
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
        setFlag(true);
      }
      dispatch(subscription(channel._id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyPress = (event) => {
    if (event.which == 32) {
      console.log("Space Bar Pressed");
      // let time = Date.now();
      // if (time - lastSpaceBarTime > 500) {
      //   setLastSpaceBarTime((prev) => time);
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
      // } else {
      //   console.log("Ignore Space Bar");
      // }
    } else if (event.shiftKey && event.key == ">") {
      if (videoRef.current.playbackRate != 2.0) {
        videoRef.current.playbackRate += 0.25;
      }
    } else if (event.shiftKey && event.key == "<") {
      if (videoRef.current.playbackRate != 0.25) {
        videoRef.current.playbackRate -= 0.25;
      }
    }
  };

  useEffect(() => {
    return () => {
      console.log("hi");
      if (videoRef.current) {
        videoRef.current
          .requestPictureInPicture()
          .then(() => {
            console.log("Entered Picture-in-Picture mode");
          })
          .catch((error) => {
            console.error("Failed to enter Picture-in-Picture mode:", error);
          });
      }
    };
  }, []);

  return (
    <Container >
      <Content>
        <VideoFrame
          ref={videoRef}
          src={currentVideo?.videoUrl}
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onKeyDown={handleKeyPress}
        />
        {/* <VideoPlayer src={currentVideo?.videoUrl}/> */}
        <Title>{currentVideo?.title}</Title>
        <Details>
          <Info>
            {currentVideo?.views} views • {format(currentVideo?.createdAt)}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentUser !== null &&
              currentVideo?.likes?.includes(currentUser._id) ? (
                <ThumbUp />
              ) : (
                <ThumbUpOutlined />
              )}{" "}
              {currentVideo?.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {currentUser !== null &&
              currentVideo?.dislikes?.includes(currentUser._id) ? (
                <ThumbDown />
              ) : (
                <ThumbDownOffAltOutlined />
              )}{" "}
              Dislike
            </Button>
            <Button>
              <ReplyOutlined /> Share
            </Button>
            <Button>
              <AddTaskOutlined /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image
              src={
                channel.img && channel.img !== "" ? channel.img : defaultImage
              }
            />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.Subscribers} subscribers</ChannelCounter>
              {/* <Description>{currentVideo?.desc}</Description> */}
              <VideoDescription description={currentVideo?.desc} />
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe subscribe={flag} onClick={handleSub}>
            {flag ? "SUBSCRIBED" : "SUBSCRIBE"}
          </Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={currentVideo?._id} />
      </Content>
      <Recommendation
        currentVideoId={currentVideo?._id}
        tags={currentVideo?.tags}
      />
    </Container>
  );
};

export default Video;
