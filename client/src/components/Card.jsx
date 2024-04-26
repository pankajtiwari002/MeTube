import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import {format} from 'timeago.js';
import { api } from '../constant.js';

const Container = styled.div`
    width: ${(props) => props.type !== "sm" && "360px"};
    margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
    cursor: pointer;
    display: ${(props) => props.type === "sm" ? "flex": ""};
    gap: ${(props) => props.type === "sm" && "10px"};
`

const Image = styled.img`
    flex: 1;
    width: 100%;
    height: ${(props) => props.type === "sm" ? "120px": "220px"};
    border-radius: 5%;
    background-color: #999;
`

const Details = styled.div`
    flex: 1;
    margin-top: ${(props) => props.type !== "sm" && "16px"};
    display: flex;
    gap: 12px;
`

const ChannelImage = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #999;
    display: ${(props) => props.type === "sm" && "none"};
`

const Texts = styled.div``

const Title = styled.h1`
    font-size: 16px;
    font-weight: 500;
    color: ${({theme}) => theme.text};
`

const ChannelName = styled.h2`
    font-size: 14px;
    color: ${({theme}) => theme.textSoft};
    margin: 5px 0px;
`

const Info = styled.div`
    font-size: 14px;
    color: ${({theme}) => theme.textSoft};
`

const Card = ({type,video}) => {

    const [channel,setChannel] = useState({})

  useEffect(() => {
    console.log("card")
    const fetchchannel = async () => {
      try{
        const res = await fetch(`${api}/users/find/${video.userId}`)
        const data = await res.json()
        console.log(data)
        setChannel(data)
      }catch(err){
        console.error(err)
      }
    }
    fetchchannel()
  },[video.userId])

  return (
    <Link to={`/video/${video._id}`} style={{textDecoration: "none",color: "inherit"}}>
      <Container type={type}>
            <Image type={type} src={video.imgUrl} />
            <Details type={type}>
                <ChannelImage type={type} src={video.videoUrl}/>
                <Texts>
                    <Title>{video.title}</Title>
                    <ChannelName>{channel.name}</ChannelName>
                    <Info>{video.views} views . {format(video.createdAt)}</Info>
                </Texts>
            </Details>
        </Container>
    </Link>
  )
}

export default Card