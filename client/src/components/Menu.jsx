import React, { useState } from "react";
import styled from "styled-components";
import logoImg from "../img/vidzilla2.png";
import { Scrollbar } from "react-scrollbars-custom";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import Cookies from "js-cookie";

import {
  AccountCircleOutlined,
  ArticleOutlined,
  ExploreOutlined,
  FlagOutlined,
  HelpOutlineOutlined,
  HistoryOutlined,
  Home,
  LibraryMusicOutlined,
  LiveTvOutlined,
  MovieOutlined,
  SettingsOutlined,
  SportsBasketballOutlined,
  SportsEsportsOutlined,
  Subscriptions,
  VideoLibraryOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";

// css

const MainContainer = styled.div`
  width: 0px;
  transition: width 0.3s ease;
  @media (min-width: 1300px) {
    width: ${({ isOpen }) => (isOpen ? "200px" : "20px")};
  }
`;

const Container = styled.div`
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  position: fixed;
  /* top: 0; */
  left: ${({ isOpen }) => (isOpen ? "0" : "-100%")};
  height: 100vh;
  width: 200px;
  z-index: 1000;
  transition: left 0.3s ease;
`;

const Wrapper = styled.div`
  padding: 18px 26px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  gap: 5px;
  font-weight: bold;
  margin-bottom: 25px;
  @media (min-width: 760px) {
    display: none;
  }
`;

const Img = styled.img`
  height: 50px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 7.5px 0px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;

const Hr = styled.hr`
  border: 0.5px solid ${({ theme }) => theme.soft};
  margin: 15px 0px;
`;

const Login = styled.div``;
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
`;
const Title = styled.h2`
  font-size: 14px;
  font-weight: 500;
  color: #aaaaaa;
  margin-bottom: 20px;
`;

const Hamburger = styled.div`
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 1100;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const Gap = styled.div`
  height: 20px;
`;

const Menu = ({ darkMode, setDarkMode }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const handleLogOut = () => {
    Cookies.remove("access_token", { path: "/" });
    localStorage.removeItem("persist:root");
    Promise.resolve(dispatch(logout()));
  };

  const changeMode = () => {
    setDarkMode((prev) => !prev);
    toggleMenu();
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <MainContainer isOpen={isOpen}>
      <Hamburger onClick={toggleMenu}>
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </Hamburger>
      <Container isOpen={isOpen}>
        <Scrollbar style={{ width: "200px", height: "100vh" }}>
          <Wrapper>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Logo onClick={toggleMenu}>
                <Img src={logoImg} />
                VidZilla
              </Logo>
            </Link>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Item onClick={toggleMenu}>
                <Home />
                Home
              </Item>
            </Link>
            <Link
              to="/trend"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Item onClick={toggleMenu}>
                <ExploreOutlined />
                Explore
              </Item>
            </Link>
            <Link
              to="/sub"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Item onClick={toggleMenu}>
                <Subscriptions />
                Subscription
              </Item>
            </Link>
            <Hr />
            <Link
              to="/savedVideos"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Item>
                <VideoLibraryOutlined />
                Library
              </Item>
            </Link>
            <Link
              to="/history"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Item onClick={toggleMenu}>
                <HistoryOutlined />
                History
              </Item>
            </Link>
            {!currentUser ? (
              <>
                <Login>
                  <Link to="signin" style={{ textDecoration: "none" }}>
                    <Button onClick={toggleMenu}>
                      <AccountCircleOutlined />
                      SIGN IN
                    </Button>
                  </Link>
                </Login>
                <Hr />
              </>
            ) : (
              <>
                <Login onClick={handleLogOut}>
                  <Button>
                    <AccountCircleOutlined />
                    SIGN OUT
                  </Button>
                </Login>
                <Hr />
              </>
            )}
            <Title>Best of VidZilla</Title>
            <Link
              to="/music"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Item>
                <LibraryMusicOutlined />
                Music
              </Item>
            </Link>
            <Link
              to="/sports"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Item>
                <SportsBasketballOutlined />
                Sports
              </Item>
            </Link>
            <Link
              to="/gaming"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Item>
                <SportsEsportsOutlined />
                Gaming
              </Item>
            </Link>
            <Link
              to="/movies"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Item>
                <MovieOutlined />
                Movies
              </Item>
            </Link>
            <Link
              to="/news"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Item>
                <ArticleOutlined />
                News
              </Item>
            </Link>
            <Hr />
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
              Help
            </Item>
            <Item onClick={changeMode}>
              <Subscriptions />
              {darkMode ? "Light Mode" : "Dark Mode"}
            </Item>
          </Wrapper>
          <Gap />
          <Gap />
          <Gap />
        </Scrollbar>
      </Container>
    </MainContainer>
  );
};

export default Menu;
