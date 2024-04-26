import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Card from '../components/Card'
import {api} from '../constant.js'
import axios from 'axios'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  min-height: 600px;
  // overflow-y: auto;
`;

const Home = ({type}) => {

  const [videos,setVideos] = useState([])

  useEffect(() => {
    console.log("hello")
    const fetchVideos = async () => {
      try{
        const cookies = document.cookie.split(';')
        let access_token = "";
        for (let cookie of cookies){
          if(cookie.startsWith("access_token=")){
            access_token = cookie.substring(13)
            break
          }
        }
      console.log(access_token)
          const res = await axios.post(`${api}/videos/${type}`,{
            access_token,
          })
          const data = res.data
          console.log(data)
          setVideos(data)
      }catch(err){
        // setVideos([])
        // console.error(err)
      }
    }
    fetchVideos()
  },[type])

  return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video}/>
      ))}
    </Container>
  )
}

export default Home