import React from 'react';
import ReactDOM from 'react-dom/client';
import './component/style.css';
import Home from './Home';
import Header from './component/header';
import Footer from './component/footer';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom"; // J'importe le router, puis le créer les balises BrowserRouter pour entourer le module App qui est ma page principale
import {Routes, Route} from "react-router-dom"; // J'importe le système de route ; Link pour éviter le rechargement de page, on remplace les a par link
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
// Définition du thème de l'application
const theme = createTheme({
  palette: {
    primary: {
      main: "#004b87", // Couleur principale (Header, boutons principaux, etc.)
    },
    secondary: {
      main: "#00a8cc", // Couleur secondaire
    },
    accent: {
      main: "#ff6b6b", // Couleur secondaire
    },
    background: {
      main: "#f7f9fc",
    },
    text: {
      primary: "#333333", // Couleur du texte principal
      secondary: "#555555", // Couleur du texte secondaire
    },
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </React.StrictMode>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
