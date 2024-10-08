import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { api } from "../constant.js";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice.js";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase.js";
import { useNavigate } from "react-router";
import GoogleImg from "../img/google-logo.png";
import OTPField from "../components/OTPField.jsx";
import defaultImage from "../img/profile_placeholder.jpg";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../firebase.js";

const Container = styled.div`
  display: none;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  margin: auto;
  width: 90%;
  max-width: 400px;
  min-height: 500px;
  @media (max-width: 760px) {
    display: flex;
    flex-direction: column;
  }
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const SectionContainer = styled.div`
  width: 45%;
  max-width: 200px;
  padding: 10px;
  background: ${(props) => props.signIn ? "linear-gradient(to right, #ff4b2b, #ff416c)": "#fff"};
  color: ${(props) => props.signIn ? "white": "black"};
  text-align: center;
  cursor: pointer;
  
`;

const SignInContainer = styled.div`
  margin-top: 10px;
  display: ${({ visible }) => (visible ? "flex" : "none")};
  /* justify-content: center;
  align-items: center;
  align-content: center; */
  width: 100%;
  padding: 10%;
  background-color: #fff;
`;

const SignUpContainer = styled.div`
  margin-top: 10px;
  display: ${({ visible }) => (visible ? "flex" : "none")};
  /* align-items: center;
  align-content: center; */
  width: 100%;
  padding: 10%; 
  background-color: #fff;
`;

const Form = styled.form`
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
`;

const Input = styled.input`
  display: ${(props) => (props.visible ? "flex" : "none")};
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
`;

const Button = styled.button`
  border-radius: 20px;
  border: 1px solid #ff4b2b;
  background-color: #ff4b2b;
  display: ${(props) => (props.visible ? "flex" : "none")};
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  margin-bottom: 5px;
  &:hover {
    cursor: pointer;
  }
  &:active {
    transform: scale(0.95);
  }
  &:focus {
    outline: none;
  }
`;

const GoogleButton = styled.div`
  padding: 10px 20px;
  border: 1px solid gray;
  border-radius: 5em;
  color: black;
  font-weight: 300;
  display: flex;
  align-content: center;
  align-items: center;
  font-size: 14px;
  &:hover {
    cursor: pointer;
  }
  margin-bottom: 10px;
`;

const Image = styled.img`
  height: 25px;
  margin-right: 5px;
`;

const Anchor = styled.a`
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
`;

const ImageContainer = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HiddenInput = styled.input`
  display: none;
`;

const DangerMessage = styled.p`
  color: red;
  font-size: 14px;
  font-weight: 500;
  display: ${(props) => (props.visible ? "flex" : "none")};
  margin-bottom: 5px;
`;

const App = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);
  const [image, setImage] = useState(null);
  const [isEmailVerify, setIsEmailVerify] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const dispatch = useDispatch();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    ) {
      return true;
    }
    return false;
  };

  const sendOtp = async (e) => {
    try {
      e.preventDefault();
      setErrorMessage("");
      console.log("hello1");
      if (username.trim().length === 0) {
        setErrorMessage("First Fill the Name");
        return;
      }
      if (!validateEmail(email)) {
        console.log("hello2");
        setErrorMessage("Invalid Email");
        return;
      }
      console.log("hello3");
      const res = await axios.post(`${api}/auth/sendotp`, {
        username,
        email,
      });
      console.log(res.data);
      console.log("hello4");
      if ("error" in res.data) {
        console.log("hello5");
        setErrorMessage(res.data.error);
      }
      if ("success" in res.data) {
        setIsOtpSent(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const verifyOtp = async (e) => {
    try {
      e.preventDefault();
      setErrorMessage("");
      const res = await axios.post(`${api}/auth/verifyotp`, {
        email,
        otp,
      });
      if ("error" in res.data) {
        setErrorMessage(res.data.error);
      } else {
        setIsEmailVerify(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignUp = async (e) => {
    try {
      e.preventDefault();
      setErrorMessage("");
      if (!validatePassword(createPassword)) {
        setErrorMessage(
          "Password must be 8+ characters with letters, numbers, and symbols"
        );
        return;
      }
      dispatch(loginStart());
      let imageUrl = "";
      if (imageSrc) {
        const storage = getStorage(app);
        const imagePath = imageSrc.split("/");
        const imageName = imagePath[imagePath.length - 1].split(".")[0];
        const fileName =
          imageName + Math.random().toString(16).slice(2).toString();
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        const res = await uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.log("firebase Error: ", error.message);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              imageUrl = downloadURL;
            });
          }
        );
      }
      const res = await axios.post(
        `${api}/auth/signup`,
        {
          email,
          name: username,
          password: createPassword,
          img: imageUrl,
        },
        {
          withCredentials: true,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(document.cookie);
      if (res.status === "404") {
        console.log("user not found");
        dispatch(loginFailure());
      } else if (res.status == "400") {
        console.log("wrong credential");
        dispatch(loginFailure());
      } else {
        const user = res.data;
        // document.cookie = `access_token=${user["access_token"]}`;
        console.log(res);
        console.log(user);
        dispatch(loginSuccess(user));
        navigate(`/`);
      }
    } catch (err) {
      console.error(err);
      dispatch(loginFailure());
    }
  };

  const handleSignIn = async (e) => {
    try {
      e.preventDefault();
      dispatch(loginStart());
      const res = await axios.post(
        `${api}/auth/signin`,
        {
          email: userEmail,
          password,
        },
        {
          withCredentials: true,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(document.cookie);
      if (res.status === "404") {
        console.log("user not found");
        dispatch(loginFailure());
      } else if (res.status == "400") {
        console.log("wrong credential");
        dispatch(loginFailure());
      } else {
        const user = res.data;
        // document.cookie = `access_token=${user["access_token"]}`;
        console.log(res);
        console.log(user);
        dispatch(loginSuccess(user));
        navigate(`/`);
      }
    } catch (err) {
      dispatch(loginFailure());
      // console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    dispatch(loginStart());
    console.log("Sign In With Google");
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        axios
          .post(
            `${api}/auth/google`,
            {
              name: result.user.displayName,
              email: result.user.email,
              img: result.user.photoURL,
            },
            {
              withCredentials: true,
              credentials: "include",
            }
          )
          .then((res) => {
            dispatch(loginSuccess(res.data));
            navigate(`/`);
          });
      })
      .catch((err) => {
        console.log(err);
        dispatch(loginFailure());
      });
  };

  return (
    <Container>
      <Row>
        <SectionContainer signIn={isSignIn} onClick={() => setIsSignIn(true)}>
          Sign In
        </SectionContainer>
        <SectionContainer signIn={!isSignIn} onClick={() => setIsSignIn(false)}>
          Sign Up
        </SectionContainer>
      </Row>
      <SignInContainer visible={isSignIn}>
        <Form>
          <Input
            visible={true}
            type="text"
            placeholder="Email"
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <Input
            visible={true}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Anchor href="#">Forgot your password?</Anchor>
          <GoogleButton onClick={signInWithGoogle}>
            {" "}
            <Image src={GoogleImg} /> Continue With Google
          </GoogleButton>
          <Button visible={true} onClick={handleSignIn}>
            Sigin In
          </Button>
        </Form>
      </SignInContainer>
      <SignUpContainer visible={!isSignIn}>
        <Form>
          <ImageContainer
            onClick={() => document.getElementById("imgInput").click()}
          >
            <HiddenInput
              type="file"
              accept="image/*"
              id="imgInput"
              onChange={handleImageChange}
            />
            <ProfileImage src={imageSrc || defaultImage} alt="Selected" />
          </ImageContainer>
          <Input
            visible={true}
            type="text"
            placeholder="Name"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            visible={true}
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            readOnly={isEmailVerify}
          />
          <OTPField visible={!isEmailVerify} setOtp={setOtp} />
          <Input
            visible={isEmailVerify}
            type="password"
            placeholder="Password"
            onChange={(e) => setCreatePassword(e.target.value)}
          />
          <DangerMessage visible={errorMessage.trim() !== ""}>
            {errorMessage}
          </DangerMessage>
          <Button visible={!isEmailVerify && !isOtpSent} onClick={sendOtp}>
            Send OTP
          </Button>
          <Button visible={!isEmailVerify && isOtpSent} onClick={verifyOtp}>
            Verify OTP
          </Button>
          <Button visible={isEmailVerify} onClick={handleSignUp}>
            Sign Up
          </Button>
        </Form>
      </SignUpContainer>
    </Container>
  );
};

export default App;
