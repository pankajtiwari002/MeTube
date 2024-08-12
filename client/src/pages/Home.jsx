import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import { api } from "../constant.js";
import axios from "axios";
import { useSelector } from "react-redux";

const Container = styled.div`
  display: grid;
  justify-content: flex-start;
  grid-template-columns: auto;
  flex-wrap: wrap;
  justify-content: space-evenly;
  @media (min-width: 760px) {
    grid-template-columns: auto auto;
    justify-content: space-evenly;
  }
  @media (min-width: 1200px) {
    grid-template-columns: auto auto auto;
    justify-content: start;
  }
`;

const Home = ({ type }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    console.log("hello");
    const fetchVideos = async () => {
      try {
        setVideos([]);
        const cookies = document.cookie.split(";");
        let access_token = "";
        for (let cookie of cookies) {
          if (cookie.startsWith("access_token=")) {
            access_token = cookie.substring(13);
            break;
          }
        }
        console.log(access_token);
        let url = `${api}/videos/${type}`;
        if (type === "history") {
          url = `${api}/history/${currentUser._id}`;
          const res = await axios.get(url, {
            withCredentials: true, // Ensure cookies are sent with the request
            headers: {
              "Content-Type": "application/json", // Set the appropriate content type
            },
          });
          const data = res.data;
          console.log(data);
          const watchedVideoPromises = data.map(async (history) => {
            const videoId = history.videoId;
            console.log(videoId);
            const watchedVideo = await axios.get(
              `${api}/videos/find/${videoId}`
            );
            console.log(watchedVideo.data);
            return watchedVideo.data;
          });
          let watchedVideos = await Promise.all(watchedVideoPromises);
          setVideos(watchedVideos);
          console.log(videos);
        } else {
          const res = await axios.get(url, {
            withCredentials: true, // Ensure cookies are sent with the request
            headers: {
              "Content-Type": "application/json", // Set the appropriate content type
            },
          });
          const data = res.data;
          console.log(data);
          setVideos(data);
        }
      } catch (err) {
        // setVideos([])
        console.error(err);
      }
    };
    fetchVideos();
  }, [type]);

  return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Home;
