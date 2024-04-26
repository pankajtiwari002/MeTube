import Menu from './components/Menu.jsx'
import styled, { ThemeProvider } from 'styled-components'
import NavBar from './components/NavBar.jsx'
import { darkTheme, lightTheme } from './utils/theme.js';
import { useState } from 'react';
import { Outlet } from 'react-router-dom'

const Container = styled.div`
  display: flex;
  background: ${({theme}) => theme.bg};
  color: ${({theme}) => theme.text};
`;

const Main = styled.div`
  flex: 7;
`;

const Wrapper = styled.div`
  padding: 20px 10px;
`

function App() {
  const [darkMode,setDarkMode] = useState(true)

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
    <Container>
      <Menu setDarkMode={setDarkMode} darkMode={darkMode}/>
      <Main>
        <NavBar />
        <Wrapper>
          <Outlet />
        </Wrapper>
      </Main>
    </Container>
    </ThemeProvider>
  )
}

export default App
