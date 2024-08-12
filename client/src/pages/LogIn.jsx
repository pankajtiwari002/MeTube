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
  uploadBytes,
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
  width: 678px;
  max-width: 100%;
  min-height: 500px;
  @media (min-width: 760px) {
    display: flex;
  }
`;

const SignUpContainer = styled.div`
  position: absolute;
  top: 0; 
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  ${(props) =>
    props.signinIn !== true
      ? `
   transform: translateX(100%);
   opacity: 1;
   z-index: 5;
 `
      : null} 
`;

const SignInContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  z-index: 2;
  ${(props) =>
    props.signinIn !== true ? `transform: translateX(100%);` : null}
`;

const Form = styled.form`
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-weight: bold;
  margin: 0;
`;

const Input = styled.input`
  display: ${(props) => props.visible ? "flex" : "none"};
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
  display: ${(props) => props.visible ? "flex" : "none"};
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
  &:hover {
    cursor: pointer;
  }
  margin-bottom: 10px;
`;

const Image = styled.img`
  height: 25px;
  margin-right: 5px;
`;

const GhostButton = styled(Button)`
  background-color: transparent;
  border-color: #ffffff;
`;

const Anchor = styled.a`
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
`;
const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden; 
  transition: transform 0.6s ease-in-out;
  z-index: 100;
  ${(props) =>
    props.signinIn !== true ? `transform: translateX(-100%);` : null}
`;

const Overlay = styled.div`
  background: #ff416c;
  background: -webkit-linear-gradient(to right, #ff4b2b, #ff416c);
  background: linear-gradient(to right, #ff4b2b, #ff416c);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  ${(props) => (props.signinIn !== true ? `transform: translateX(50%);` : null)}
`;

const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 0px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
`;

const LeftOverlayPanel = styled(OverlayPanel)`
  transform: translateX(-20%);
  ${(props) => (props.signinIn !== true ? `transform: translateX(0);` : null)}
`;

const RightOverlayPanel = styled(OverlayPanel)`
  right: 0;
  transform: translateX(0);
  ${(props) => (props.signinIn !== true ? `transform: translateX(20%);` : null)}
`;

const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 30px;
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
  display: ${(props) => props.visible ? "flex" : "none"};
  margin-bottom: 5px;
`;

const LogIn = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [image, setImage] = useState(null);
  const [isEmailVerify, setIsEmailVerify] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [otp,setOtp] = useState("");
  const [signIn, toggle] = useState(true);
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const dispatch = useDispatch();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file)
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
      setErrorMessage("")
      console.log("hello1")
      if(username.trim().length === 0){
        setErrorMessage("First Fill the Name")
        return
      }
      if(!validateEmail(email)){
        console.log("hello2")
        setErrorMessage("Invalid Email")
        return;
      }
      console.log("hello3")
      const res = await axios.post(`${api}/auth/sendotp`, {
        username,
        email,
      });
      console.log(res.data)
      console.log("hello4")
      if ("error" in res.data) {
        console.log("hello5")
        setErrorMessage(res.data.error);
      } 
      if("success" in res.data) {
        setIsOtpSent(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const verifyOtp = async (e) => {
    try {
      e.preventDefault();
      setErrorMessage("")
      const res = await axios.post(`${api}/auth/verifyotp`,{
        email,
        otp
      });
      console.log(res.data)
      if(res.data.error){
        setErrorMessage(res.data.error)
      }
      else{
        setIsEmailVerify(true)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSignUp = async (e) => {
    try {
      e.preventDefault();
      setErrorMessage("");
  
      // Validate password
      if (!validatePassword(createPassword)) {
        setErrorMessage("Password must be 8+ characters with letters, numbers, and symbols");
        return;
      }
  
      dispatch(loginStart());
      let imageUrl = "";
      console.log(imageSrc)
      // If an image is provided, upload it to Firebase and get the URL
      if (imageSrc) {
        const storage = getStorage(app);
        const imagePath = imageSrc.split('/');
        const imageName = imagePath[imagePath.length - 1].split('.')[0];
        const fileName = imageName + Math.random().toString(16).slice(2);
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
  
        // Await the image upload completion and retrieve the download URL
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
              console.error("Firebase Error:", error.message);
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }
      console.log(imageUrl)
      // Proceed to send the API request with the image URL (if any)
      const res = await axios.post(
        `${api}/auth/signup`,
        {
          email,
          name: username,
          password: createPassword,
          img: imageUrl, // Send the image URL here
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res)
      // Handle the response
      if (res.status === 404) {
        console.log("User not found");
        dispatch(loginFailure());
      } else if (res.status === 400) {
        console.log("Wrong credentials");
        dispatch(loginFailure());
      } else {
        const user = res.data;
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
      console.log(name,password)
      const res = await axios.post(
        `${api}/auth/signin`,
        {
          email: userEmail,
          password,
        },
        {
          withCredentials: true,
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
      <SignUpContainer signinIn={signIn}>
        <Form>
          <Title>Create Account</Title>
          <ImageContainer
            onClick={() => document.getElementById("imageInput").click()}
          >
            <HiddenInput
              type="file"
              accept="image/*"
              id="imageInput"
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
          <OTPField visible={!isEmailVerify} setOtp={setOtp}/>
          <Input
            visible={isEmailVerify}
            type="password"
            placeholder="Password"
            onChange={(e) => setCreatePassword(e.target.value)}
          />
          <DangerMessage visible={errorMessage.trim()!==""}>{errorMessage}</DangerMessage>
          <Button visible={!isEmailVerify && !isOtpSent} onClick={sendOtp}>Send OTP</Button>
          <Button visible={(!isEmailVerify && isOtpSent)} onClick={verifyOtp}>Verify OTP</Button>
          <Button visible={isEmailVerify} onClick={handleSignUp}>Sign Up</Button>
        </Form>
      </SignUpContainer>

      <SignInContainer signinIn={signIn}>
        <Form>
          <Title>Sign in</Title>
          <Input
            visible={true}
            type="email"
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
          <Button visible={true} onClick={handleSignIn}>Sigin In</Button>
        </Form>
      </SignInContainer>

      <OverlayContainer signinIn={signIn}>
        <Overlay signinIn={signIn}>
          <LeftOverlayPanel signinIn={signIn}>
            <Title>Welcome Back!</Title>
            <Paragraph>
              To keep connected with us please login with your personal info
            </Paragraph>
            <GhostButton visible={true} onClick={() => toggle(true)}>Sign In</GhostButton>
          </LeftOverlayPanel>

          <RightOverlayPanel signinIn={signIn}>
            <Title>Hello, Friend!</Title>
            <Paragraph>
              Enter Your personal details and start journey with us
            </Paragraph>
            <GhostButton visible={true} onClick={() => toggle(false)}>Sigin Up</GhostButton>
          </RightOverlayPanel>
        </Overlay>
      </OverlayContainer>
    </Container>
  );
};

export default LogIn;
