import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { api } from "../constant";
import HorizontalVideoCard from "../components/HorizontalVideoCard";
import styled from "styled-components";

const Gap = styled.div`
  height: 40px;
`;

const History = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [videos, setVideos] = useState([]);

  const removeVideoById = (id) => {
    setVideos(videos.filter((video) => video.historyId !== id));
  }

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
        let url = `${api}/history/${currentUser._id}`;
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
          const watchedVideo = await axios.get(`${api}/videos/find/${videoId}`);
          console.log(watchedVideo.data);
          console.log(history._id);
          const video = { ...watchedVideo.data, historyId: history._id };
          console.log(video);
          return video;
        });
        let watchedVideos = await Promise.all(watchedVideoPromises);
        setVideos(watchedVideos);
        console.log(videos);
      } catch (err) {
        // setVideos([])
        console.error(err);
      }
    };
    fetchVideos();
  }, []);

  return (
    <>
      {videos.map((video) => (
        <HorizontalVideoCard key={video._id} video={video} removeVideoById={removeVideoById} type={"history"} />
      ))}
      <Gap />
    </>
  );
};

export default History;
