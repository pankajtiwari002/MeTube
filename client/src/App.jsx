import Menu from "./components/Menu.jsx";
import styled, { ThemeProvider } from "styled-components";
import NavBar from "./components/NavBar.jsx";
import { darkTheme, lightTheme } from "./utils/theme.js";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Scrollbar } from "react-scrollbars-custom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout } from "./redux/userSlice.js";

const Container = styled.div`
  display: flex;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  height: 100vh;
`;

const Main = styled.div`
  flex: 10;
`;

const Wrapper = styled.div`
  padding: 20px 10px;
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const removePersistUserIfNotAccessToken = async () => {
      const cookies = document.cookie.split(";");
      console.log(document.cookie)
      let access_token = "";
      for (let cookie of cookies) {
        if (cookie.startsWith("access_token=")) {
          access_token = cookie.substring(13);
          break;
        }
      }
      console.log(access_token);
      if(access_token===""){
        console.log("access_token = ",access_token)
        localStorage.removeItem('persist:root');
        Promise.resolve(dispatch(logout()));
      }
    }
    removePersistUserIfNotAccessToken();
  },[dispatch])

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <NavBar />
      <Container>
        <Menu setDarkMode={setDarkMode} darkMode={darkMode} />
        <Main>
          <Scrollbar style={{ width: "100%", height: "100%" }}>
            <Wrapper>
              <Outlet />
            </Wrapper>
          </Scrollbar>
        </Main>
      </Container>
    </ThemeProvider>
  );
}

export default App;
