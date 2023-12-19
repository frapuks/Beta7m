import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../Store/Type";
import { Edit } from "@mui/icons-material";
import { Player } from "../Types";

const Dashboard = () => {
  // Utils
  const navigate = useNavigate();
  const urlApi: string = import.meta.env.VITE_API_ROOT;

  // Variables
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const Players: Player[] = useSelector(
    (state: RootState) => state.players.players
  );

  // States
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openValidSnackbar, setOpenValidSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // Methods
  const handleCloseSnackbar = (): void => {
    setOpenErrorSnackbar(false);
    setOpenValidSnackbar(false);
  };
  const handleOpenDialog = (): void => {
    setOpenDialog(true);
  };
  const handleCloseDialog = (): void => {
    setOpenDialog(false);
  };

  const handleClickLogout = async () => {
    await fetch(`${urlApi}/signout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${refreshToken}`,
      },
    });

    localStorage.clear();
    navigate("/");
  };

  const handleSubmitEdit = async (
    event: React.FormEvent<HTMLFormElement>,
    player: Player
  ) => {
    event.preventDefault();
    const form: FormData = new FormData(event.currentTarget);
    const response = await fetch(`${urlApi}/players/${player.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${accessToken}`,
      },
      body: JSON.stringify({
        first_name: form.get("first_name"),
        last_name: form.get("last_name"),
        is_goalkeeper: form.get("is_goalkeeper") === "on",
      }),
    });
    if (!response.ok) {
      setOpenErrorSnackbar(true);
      return;
    }
    setOpenValidSnackbar(true);
  };

  const handleAddPlayer = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);
    const response = await fetch(`${urlApi}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: form.get("first_name"),
        last_name: form.get("last_name"),
        is_goalkeeper: form.get("is_goalkeeper") === "on",
      }),
    });
    if (!response.ok) {
      setOpenErrorSnackbar(true);
      return;
    }
    navigate("/");
  };

  return (
    <Container sx={{ padding: 0 }}>
      <Stack direction="row" justifyContent="center" sx={{ padding: 1 }}>
        <Button variant="contained" color="error" onClick={handleClickLogout}>
          Déconnexion
        </Button>
      </Stack>

      <List>
        <Divider />
        <ListItem secondaryAction={<Typography>Gardien / Valider</Typography>}>
          <ListItemText primary="Prénom / Nom"/>
        </ListItem>
        <Divider />
        {Players.map((player) => (
          <Box
          key={uuidv4()}
            component="form"
            onSubmit={(event) => handleSubmitEdit(event, player)}
          >
            <ListItem
              secondaryAction={
                <Fab type="submit" color="primary" size="small">
                  <Edit />
                </Fab>
              }
            >
              <TextField
                name="first_name"
                defaultValue={player.first_name}
                variant="standard"
                autoComplete="off"
                />
              <TextField
                name="last_name"
                defaultValue={player.last_name}
                variant="standard"
                autoComplete="off"
              />
              <Switch name="is_goalkeeper" defaultChecked={player.is_goalkeeper} />
            </ListItem>
            <Divider />
          </Box>
        ))}
        <ListItem>
          <Button variant="contained" onClick={handleOpenDialog}>
            Ajouter un joueur
          </Button>
        </ListItem>
        <Divider />
      </List>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <Box component="form" onSubmit={handleAddPlayer}>
          <DialogTitle>Ajouter un joueur</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <TextField name="last_name" size="small" label="Nom" required />
            <TextField name="first_name" size="small" label="Prénom" required />
            <Stack direction="row" alignItems="center">
              <Typography>Gardien :</Typography>
              <Switch name="is_goalkeeper" />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button type="submit" variant="contained" autoFocus>
              Valider
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar open={openErrorSnackbar} onClose={handleCloseSnackbar}>
        <Alert severity="error">Erreur Serveur</Alert>
      </Snackbar>
      <Snackbar open={openValidSnackbar} onClose={handleCloseSnackbar}>
        <Alert>Modifications enregistrées</Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
