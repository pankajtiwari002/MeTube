import { AddTaskOutlined, ReplyOutlined, ThumbDown, ThumbDownOffAlt, ThumbDownOffAltOutlined, ThumbUp, ThumbUpOutlined } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Comments from '../components/Comments'
import Card from '../components/Card'
import {useDispatch, useSelector} from 'react-redux'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { api } from '../constant'
import { dislike, fetchFailure, fetchStart, fetchSuccess, like } from '../redux/videoSlice'
import { format } from 'timeago.js'
import { subscription } from '../redux/userSlice'
import Recommendation from '../components/Recommendation'

const Container = styled.div`
  display: flex;
  gap: 24px;
`
const Content = styled.div`
  flex: 7;
`
const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Info = styled.div`
  color: ${({ theme }) => theme.textSoft};
`

const Buttons = styled.div`
  display: flex;
  gap: 20px;
`
const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`
const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`
const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`

const ChannelName = styled.span`
  font-weight: 500;
`
const ChannelCounter = styled.div`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
` 

const Description = styled.p`
  font-size: 14px;
`

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`

const Hr = styled.hr`
margin: 15px 0px;
border: 0.5px solid ${({ theme }) => theme.soft};
`

const VideoFrame = styled.video`
  display: flex;
  width: 100%;
  max-height: 720px;
  object-fit: fill;
`

const Video = () => {

  const {currentUser} = useSelector((state) => state.user)
  const {currentVideo} = useSelector((state) => state.video)
  const dispatch = useDispatch()

  const videoId = useLocation().pathname.split('/')[2]
  const [channel,setChannel] = useState({})

  useEffect(()=>{
    const addView = async() => {
      try {
        const res = await axios.put(`${api}/videos/view/${videoId}`);
        console.log(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    addView()
  },[videoId])

  useEffect(()=>{
    const fetchData = async () => {
      try {
        dispatch(fetchStart())
        const videoRes = await axios.get(`${api}/videos/find/${videoId}`)
        const channelRes = await axios.get(`${api}/users/find/${videoRes.data.userId}`)
        console.log(videoRes.data)
        console.log(channelRes.data)
        dispatch(fetchSuccess(videoRes.data))
        setChannel(channelRes.data)
      } catch (err) {
        console.error(err)
        dispatch(fetchFailure())
      }
    }
    fetchData()
  },[videoId,dispatch])

  const handleLike = async() => {
    try {
      const cookies = document.cookie.split(';')
      let access_token = "";
      for (let cookie of cookies){
        if(cookie.startsWith("access_token=")){
          access_token = cookie.substring(13)
          break
        }
      }
      console.log(access_token)
      await axios.put(`${api}/users/like/${currentVideo._id}`,{
        access_token,
      });
      dispatch(like(currentUser._id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleDislike = async() => {
    try {
      const cookies = document.cookie.split(';')
      let access_token = "";
      for (let cookie of cookies){
        if(cookie.startsWith("access_token=")){
          access_token = cookie.substring(13)
          break
        }
      }
      console.log(access_token)
      await axios.put(`${api}/users/dislike/${currentVideo._id}`,{
        access_token
      });
      dispatch(dislike(currentUser._id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleSub = async() => {
    try {
      const cookies = document.cookie.split(';')
      let access_token = "";
      for (let cookie of cookies){
        if(cookie.startsWith("access_token=")){
          access_token = cookie.substring(13)
          break
        }
      }
      console.log(access_token)
      if(currentUser.subscribedUsers.includes(channel._id)){
        const res = await axios.put(`${api}/users/unsub/${channel._id}`,{access_token});
      }
      else{
        const res = await axios.put(`${api}/users/sub/${channel._id}`,{access_token});
      }
      dispatch(subscription(channel._id))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Container>
      <Content>
      <VideoFrame src={currentVideo?.videoUrl} controls/>
          <Title>{currentVideo?.title}</Title>
        <Details>
          <Info>{currentVideo?.views} views • {format(currentVideo?.createdAt)}</Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo?.likes?.includes(currentUser._id) ? <ThumbUp /> : <ThumbUpOutlined />} {currentVideo?.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
            {currentVideo?.dislikes?.includes(currentUser._id) ? <ThumbDown /> :<ThumbDownOffAltOutlined />} Dislike
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
            <Image src={currentUser.img} />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.Subscribers} subscribers</ChannelCounter>
              <Description>
                {currentVideo?.desc}
              </Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handleSub}>{currentUser.subscribedUsers?.includes(channel._id) ? "SUBSCRIBED" : "SUBSCRIBE"}</Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={currentVideo?._id}/>
      </Content>
      <Recommendation tags={currentVideo?.tags} />
    </Container>
  )
}

export default Video