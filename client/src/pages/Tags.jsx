import { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import { api } from "../constant.js";
import axios from "axios";

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

const Gap = styled.div`
  height: 0px;
  @media (max-width: 760px) {
    height: 50px;
  }
  @media (max-width: 1200px) {
    height: 30px;
  }
`;

const Tags = ({ tag }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    console.log("hello");
    const fetchVideos = async () => {
      try {
        setVideos([]);
        let url = `${api}/videos/tags?tags=${tag}`;
        const res = await axios.get(url);
        const data = res.data;
        console.log(data);
        setVideos(data);
      } catch (err) {
        // setVideos([])
        console.error(err);
      }
    };
    fetchVideos();
  }, [tag]);

  return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
      <Gap />
    </Container>
  );
};

export default Tags;
