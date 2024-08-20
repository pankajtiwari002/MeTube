import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./Card.jsx";
import { api } from "../constant.js";

const Container = styled.div`
  flex: 4;
  @media (max-width: 1200px) {
    flex: content;
    margin-bottom: 50px;
  }
`;

const Gap = styled.div`
  height: 0px;
  @media (max-width: 760px) {
    height: 50px;
  }
  @media (max-width: 1200px) {
    height: 30px;
  }
`;

const Recommendation = ({ currentVideoId, tags }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      console.log(tags);
      const url = `${api}/videos/tags?tags=${tags}`;
      console.log(url);
      const res = await axios.get(url);
      setVideos(res.data);
    };
    fetchVideos();
  }, [tags]);

  return (
    <Container>
      {videos.map(
        (video) =>
          currentVideoId !== video._id && (
            <Card type="sm" key={video._id} video={video} />
          )
      )}
      <Gap />
    </Container>
  );
};

export default Recommendation;
