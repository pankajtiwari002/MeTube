import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { api } from "../constant";
import HorizontalVideoCard from "../components/HorizontalVideoCard";
import styled from "styled-components";

const Gap = styled.div`
  height: 40px;
`;

const SavedVideos = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [videos, setVideos] = useState([]);

  const removeVideoById = async (id) => {
    const res = await axios.delete(`${api}/savedVideo/${id}`, {
      withCredentials: true,
      headers: {
        "content-tye": "application/json",
      },
    });
    console.log(res.data);
    setVideos(videos.filter((video) => video.savedVideoId !== id));
  };

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
        let url = `${api}/savedVideo/${currentUser._id}`;
        const res = await axios.get(url, {
          withCredentials: true, // Ensure cookies are sent with the request
          headers: {
            "Content-Type": "application/json", // Set the appropriate content type
          },
        });
        const data = res.data;
        console.log(data);
        const SavedVideoPromises = data.map(async (watchLater) => {
          const videoId = watchLater.videoId;
          console.log(videoId);
          const SavedVideo = await axios.get(`${api}/videos/find/${videoId}`);
          console.log(SavedVideo.data);
          console.log(watchLater._id);
          const video = { ...SavedVideo.data, savedVideoId: watchLater._id };
          console.log(video);
          return video;
        });
        let SavedVideos = await Promise.all(SavedVideoPromises);
        setVideos(SavedVideos);
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
        <HorizontalVideoCard
          key={video._id}
          video={video}
          removeVideoById={removeVideoById}
          type={"watchLater"}
        />
      ))}
      <Gap />
    </>
  );
};

export default SavedVideos;
