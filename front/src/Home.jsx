import Typography from '@mui/material/Typography';

function Home() {

    return (
      <div className="Home">
        <div className="">
            <Typography variant="h1">Port de Plaisance de Russell</Typography>
            <Typography>Bienvenue sur l'API du Port de Plaisance de Russell. Cette API va vous permettre
                d'enregistrer des réservations sur les différents catways du port.</Typography> 
            <button type="button" className="btn btn-danger px-4 mt-4" data-bs-target="#github" data-bs-toggle="modal">En savoir plus</button>
        </div>
      </div>
    );
  }
  
  export default Home;
  