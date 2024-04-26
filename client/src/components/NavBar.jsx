import { AccountCircleOutlined, SearchOutlined, VideoCallOutlined } from '@mui/icons-material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import Upload from './Upload';

const Container = styled.div`
  position: sticky;
  background: ${({theme}) => theme.bgLighter};
  top: 0;
  height: 56px;
`;
const Wrapper = styled.div`
  height: 100%;
  padding: 5px 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
`;
const Search = styled.div`
  width: 40%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  gap: 5px;
  border-radius: 3px;

`;
const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
  width: 100%;
`;

const Button = styled.button`
  padding: 5px 15px;
  height: 40px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  font-weight: 500;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${({theme}) => theme.text};
`
const Avatar = styled.img`
  height: 32px;
  width: 32px;
  border-radius: 50%;
  background-color: #999;
`

const NavBar = () => {
  const {currentUser} = useSelector(state => state.user);
  const [open,setOpen] = useState(false)
  const [q,setQ] = useState("")
  const navigate = useNavigate()
  return (
    <>
    <Container>
      <Wrapper>
        <Search>
          <Input placeholder='Search' onChange={e => setQ(e.target.value)}/>
          <SearchOutlined onClick = {() => navigate(`/search?q=${q}`)}/>
        </Search>
        {currentUser ? 
        <User>
          <VideoCallOutlined onClick={() => setOpen(true)}/>
          <Avatar src={currentUser.img}/>
          {currentUser.name}
        </User>
        : <Link to="signin" style={{textDecoration: "none"}}>
          <Button>
            <AccountCircleOutlined />
            Signin
          </Button>
        </Link>}
      </Wrapper>
    </Container>
    {open && <Upload setOpen={setOpen}/>}
    </>
  )
}

export default NavBar