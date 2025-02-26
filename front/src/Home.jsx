import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';



const style = {
  position: 'absolute',
  top: '45%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function Home() {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const theme = useTheme(); // Accéder au thème


  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // ❌ Empêche la redirection du formulaire

    try {
      const response = await fetch("./users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Connexion réussie :", data);
        // 🔹 Stocke le token si besoin (localStorage ou state global)
      } else {
        console.error("Erreur :", data.message);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

    return (
      <Container component="div" className="Home" maxWidth="false" sx={{ width: '85%' }}>
          <Typography variant="h1">Port de Plaisance de Russell</Typography>
          <Typography>Bienvenue sur l'application de gestion des réservations de catways du port de plaisance de Russell</Typography>
          <Typography>Cette plateforme vous permet de gérer facilement les réservations des catways, ces appontements réservés pour amarrer vos bateaux. 
            Grâce à une interface simple et intuitive, la capitainerie peut suivre en temps réel l'occupation des catways, les dates de réservation et 
            les informations associées aux réservations. L'application offre également une gestion sécurisée des utilisateurs et une API privée pour un
              contrôle optimal des informations.</Typography> 
            <Button variant="contained" onClick={handleOpen}>Se connecter</Button>

            {/* Modal sans animation react-spring */}
            <Modal
              open={open}
              onClose={handleClose}
              closeAfterTransition
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100vh' // Assurer un centrage vertical complet
                }}
              >
                <Slide direction="down" in={open} mountOnEnter unmountOnExit>
                  <Box align="center" sx={style} style={{ backgroundColor: theme.palette.secondary.accent,}}>
                    <Typography align="center" id="spring-modal-title" variant="h6" component="h2">
                      Se connecter
                    </Typography>
                    <Divider />
                    <Box
                      component="form"
                      sx={{ '& .MuiTextField-root': { m: 3, width: '35ch', 
                        display: 'flex', flexDirection:'column'
                       } }}
                      noValidate
                      autoComplete="off"
                      onSubmit={handleSubmit}
                    >
                      <TextField 
                        id="email"
                        label="Email"
                        type="email"
                        placeholder="example@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <TextField 
                        id="password"
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button variant="contained" type="submit">Se connecter</Button>
                    </Box>
                  </Box>
                </Slide>
              </Box>
            </Modal>
        </Container>
    );
  }
  
  export default Home;
  