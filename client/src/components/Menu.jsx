
import React from 'react'
import styled from 'styled-components'
import logoImg from '../img/logo.png'
import { AccountCircleOutlined, ArticleOutlined, Explore, ExploreOutlined, FlagOutlined, HelpOutlineOutlined, HistoryOutlined, Home, HomeMini, LibraryMusicOutlined, LiveTvOutlined, MovieOutlined, SettingsOutlined, SportsBasketballOutlined, SportsEsportsOutlined, Subscriptions, VideoLibraryOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
// css

const Container = styled.div`
  flex: 1;
  background: ${({theme}) => theme.bgLighter};
  // height: calc((100vh - 100%) / 2)
  color: ${({theme}) => theme.text};
  font-size: 14px;
  position: sticky;
  top: 0;
  // overflow-y: auto;
`;

const Wrapper = styled.div`
  padding: 18px 26px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  margin-bottom: 25px;
`;

const Img = styled.img`
  height: 25px;
`

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 7.5px 0px;
  cursor: pointer;

  &:hover {
    background-color: ${({theme}) => theme.soft};
  }

`

const Hr = styled.hr`
  border: 0.5px solid ${({theme}) => theme.soft};
  margin: 15px 0px;
`

const Login = styled.div`
`
const Button = styled.button`
  margin-top: 10px;
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  font-weight: 500;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`
const Title = styled.h2`
  font-size: 14px;
  font-weight: 500;
  color: #aaaaaa;
  margin-bottom: 20px;
`;


const Menu = ({darkMode, setDarkMode}) => {

  const {currentUser} = useSelector(state => state.user);

  const changeMode = () => {
    setDarkMode((prev) => !prev)
  }

  return (
    <Container>
        <Wrapper>
        <Link to="/" style={{textDecoration: "none",color: "inherit"}}>
          <Logo>
            <Img src={logoImg} />
            YouTube
          </Logo>
        </Link>
        <Link to="/" style={{textDecoration: "none",color: "inherit"}}>
          <Item>
            <Home />
            Home
          </Item>
        </Link>
        <Link to="/trend" style={{textDecoration: "none",color: "inherit"}}>
          <Item>
          <ExploreOutlined />
          Explore
          </Item>
        </Link>
        <Link to="/sub" style={{textDecoration: "none",color: "inherit"}}>
          <Item>
          <Subscriptions />
            Subscription
          </Item>
        </Link>
          <Hr />
          <Item>
            <VideoLibraryOutlined />
            Library
          </Item>

          <Item>
            <HistoryOutlined />
            History
          </Item>
          {!currentUser && <>
            <Login>
              Sign in to like videos, comments and subscribe.
              <Link to="signin" style={{textDecoration: "none"}}>
              <Button>
                <AccountCircleOutlined />
                SIGN IN
              </Button>
              </Link>
            </Login>
          <Hr />
          </>
          }
          {/* <Title>Best of YouTube</Title>
          <Item>
            <LibraryMusicOutlined />
            Music
          </Item> */}
          {/* <Item>
            <SportsBasketballOutlined />
            Sports
          </Item>

          <Item>
            <SportsEsportsOutlined />
            Gaming
          </Item> */}

          {/* <Item>
            <MovieOutlined />
            Movies
          </Item> */}
          {/* <Item>
            <ArticleOutlined />
            News
          </Item> */}

          {/* <Item>
            <LiveTvOutlined />
            Live
          </Item> */}
          {/* <Hr /> */}

          <Item>
            <SettingsOutlined />
            Settings
          </Item>
          <Item>
            <FlagOutlined />
            Support
          </Item>

          <Item>
            <HelpOutlineOutlined />
            help
          </Item>

          <Item onClick={changeMode}>
            <Subscriptions />
            {darkMode? "Light Mode" : "Dark Mode"}
          </Item>
        </Wrapper>
    </Container>
  )
}

export default Menu
