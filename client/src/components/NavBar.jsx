import {
  AccountCircleOutlined,
  SearchOutlined,
  VideoCallOutlined,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Upload from "./Upload";
import logoImg from "../img/vidzilla2.png";

const Container = styled.div`
  position: sticky;
  background: ${({ theme }) => theme.bg};
  top: 0;
  height: 60px;
`;
const Wrapper = styled.div`
  height: 100%;
  padding: 5px 20px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  position: relative;
`;
const Search = styled.div`
  width: 60%;
  max-width: 500px;
  max-height: 30px;
  overflow: hidden;
  /* position: absolute;
  top: 7px;
  left: 0px;
  right: 30px; */
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 13px;
  padding-right: 0px;
  border: 1px solid #ccc;
  gap: 5px;
  border-radius: 5em;
  @media (min-width: 760px) {
    width: 50%;
  }
`;
const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
  width: 100%;
`;

const SearchButton = styled.div`
  background-color: ${({ theme }) => theme.searchBg};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  border-left: 1px solid #ccc;
  &:hover {
    cursor: pointer;
  }
`;

const ClearButton = styled.div`
  color: ${({ theme }) => theme.text};
  padding: 13px;
  display: ${(props) => props.visible ? "flex" : "none"};
  &:hover{
    cursor: pointer;
  }
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
  color: ${({ theme }) => theme.text};
  &:hover{
    cursor: pointer;
  }
`;
const Avatar = styled.img`
  height: 32px;
  width: 32px;
  border-radius: 50%;
  background-color: #999;
`;

const Logo = styled.div`
  display: none;
  align-items: center;
  font-weight: bold;
  margin-left: 50px;
  color: ${({ theme }) => theme.text};
  @media (min-width: 760px) {
    display: flex;
  }
`;

const Img = styled.img`
  height: 60px;
`;

const NavBar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const [focus,setFocus] = useState(false)

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Call your function here
      if(q.trim() !=="") navigate(`/search?q=${q}`)
    }
  };

  const onClear = () => {
    const input = document.getElementById("search");
    input.value = "";
    input.focus=false;
    setQ("");
    setFocus(false)
  }
  return (
    <>
      <Container>
        <Wrapper>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Logo>
              <Img src={logoImg} />
              VidZilla
            </Logo>
          </Link>
          <Search>
            <Input
              id="search"
              placeholder="Search"
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setFocus(true)}
              onKeyPress={handleKeyPress}
            />
            <ClearButton visible={focus} onClick={onClear}>
              <CloseIcon />
            </ClearButton>
            <SearchButton onClick={() => {if(q.trim() !=="") navigate(`/search?q=${q}`)}}>
              <SearchOutlined />
            </SearchButton>
          </Search>
          {currentUser ? (
            <User>
              <VideoCallOutlined onClick={() => setOpen(true)} />
              <Avatar
                src={currentUser.img}
                onClick={() => {
                  navigate("profile");
                }}
              />
              {/* {currentUser.name} */}
            </User>
          ) : (
            <Link to="signin" style={{ textDecoration: "none" }}>
              <Button>
                <AccountCircleOutlined />
                Signin
              </Button>
            </Link>
          )}
        </Wrapper>
      </Container>
      {open && <Upload setOpen={setOpen} />}
    </>
  );
};

export default NavBar;
