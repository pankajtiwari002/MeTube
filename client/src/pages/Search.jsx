import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";
import { api } from "../constant";
import HorizontalVideoCard from "../components/HorizontalVideoCard";

const Container = styled.div`
   display: grid;
  /* background-color: red; */
  /* flex-wrap: wrap;  */
  margin-bottom: 30px;
  grid-template-columns: auto;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

const Search = () => {
  const [videos, setVideos] = useState([]);
  const query = useLocation().search;

  useEffect(() => {
    console.log("Pankaj");
    const fetchVideos = async () => {
      const res = await axios.get(`${api}/videos/search${query}`);
      setVideos(res.data);
    };
    fetchVideos();
  }, [query]);

  return (
    <Container>
      {videos.map((video) => (
        <>
        <HorizontalVideoCard key={video._id} video={video} type={"search"} />
        <Card key={video._id} video={video} type={"search"} search={true}/>
        </>
      ))}
    </Container>
  );
};

export default Search;
