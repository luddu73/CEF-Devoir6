import {Link} from "react-router-dom"; // J'importe le système de Link pour éviter le rechargement de page, on remplace les a par link
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

export default function Footer() {

    const theme = useTheme(); // Accéder au thème

    return(   
        <Box component="footer" style={{ backgroundColor: theme.palette.primary.main,}}>
            © Tous droits réservés - Ludovic CARRIL - 2025
        </Box>
    );
}