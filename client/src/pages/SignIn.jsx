import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { api } from "../constant.js";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice.js";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase.js";
import {useCookies} from 'react-cookie' 

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Link = styled.span`
  margin-left: 30px;
`;

const SignIn = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [cookies, setCookie] = useCookies(['user']);

  const dispatch = useDispatch();

  const handleSignIn = async (e) => {
    try {
      e.preventDefault();
      dispatch(loginStart());
      const res = await axios.post(`${api}/auth/signin`, {
        name,
        password,
      });
      console.log(document.cookie);
      if (res.status === "404") {
        console.log("user not found");
        dispatch(loginFailure());
      } else if (res.status == "400") {
        console.log("wrong credential");
        dispatch(loginFailure());
      } else {
        const user = res.data;
        document.cookie = `access_token=${user['access_token']}`
        console.log(res)
        console.log(user);
        dispatch(loginSuccess(user));
      }
    } catch (err) {
      dispatch(loginFailure());
      // console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    dispatch(loginStart())
    console.log("Sign In With Google")
    signInWithPopup(auth,provider)
      .then((result) => {
        console.log(result);
        axios.post(`${api}/auth/google`,{
          name: result.user.displayName,
          email: result.user.email,
          img: result.user.photoURL,
        },{
          withCredntials: true,
          credentials: 'include'
        }).then((res)=>{
          dispatch(loginSuccess(res.data))
        })
      })
      .catch((err) => {
        dispatch(loginFailure())
      });
  };

  return (
    <Container>
      <Wrapper>
        <Title>Sign in</Title>
        <SubTitle>to continue to YouTube</SubTitle>
        <Input
          placeholder="username"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleSignIn}>Sign in</Button>
        <Title>or</Title>
        <Button onClick={signInWithGoogle}>Sign in With Google</Button>
        <Title>or</Title>
        <Input
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
        <Input
          type="password"
          placeholder="password"
          onChange={(e) => setCreatePassword(e.target.value)}
        />
        <Button>Sign up</Button>
      </Wrapper>
      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
};

export default SignIn;
