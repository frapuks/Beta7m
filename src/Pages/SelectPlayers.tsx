import {
  Box,
  Typography,
  Container,
  Stack,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormLabel,
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Switch,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  setGoalkeepers,
  setShooters,
} from "../Store/Slices/selectMatchPlayersSlice";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../Store/Type";
import { Player } from "../Types";
import { Add } from "@mui/icons-material";
import { useState } from "react";

const SelectPlayers = () => {
  // Utils
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const urlApi = "https://api-beta7m.fg-tech.fr/api/v1";
  // const urlApi = "http://localhost:4009/api/v1";

  // Variables
  const Players: Player[] = useSelector(
    (state: RootState) => state.players.players
  );

  // States
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Methods
  const handleOpenDialog = (): void => {
    setOpenDialog(true);
  };
  const handleCloseDialog = (): void => {
    setOpenDialog(false);
  };
  const handleCloseSnackbar = (): void => {
    setOpenSnackbar(false);
  };

  const handleSubmitForm = (event: React.FormEvent): void => {
    event.preventDefault();
    const form: FormData = new FormData(event.currentTarget as HTMLFormElement);
    const goalkeepersId: string[] = form.getAll("goalkeeper") as any[];
    const shootersId: string[] = form.getAll("player") as any[];
    const goalkeepers: Player[] = Players.filter((player) =>
      goalkeepersId.includes(`${player.id!}`)
    );
    const shooters: Player[] = Players.filter((player) =>
      shootersId.includes(`${player.id!}`)
    );
    dispatch(setGoalkeepers(goalkeepers));
    dispatch(setShooters(shooters));
    navigate("/NewMatch");
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
      setOpenSnackbar(true);
      return;
    }
    navigate("/");
  };

  return (
    <Container sx={{ padding: 0 }}>
      <Typography variant="h5" textAlign={"center"}>
        Selection des joueurs
      </Typography>

      <Box id="playersForm" component="form" onSubmit={handleSubmitForm}>
        <FormGroup>
          <FormLabel>Gardiens</FormLabel>
          {Players.map(
            (player) =>
              player.is_goalkeeper && (
                <FormControlLabel
                  key={uuidv4()}
                  name="goalkeeper"
                  control={<Checkbox />}
                  value={player.id}
                  label={`${player.first_name} ${player.last_name.toUpperCase()}`}
                />
              )
          )}
        </FormGroup>

        <FormGroup>
          <FormLabel>Joueurs</FormLabel>
          {Players.map(
            (player) =>
              !player.is_goalkeeper && (
                <FormControlLabel
                  key={uuidv4()}
                  name="player"
                  control={<Checkbox />}
                  value={player.id}
                  label={`${player.first_name} ${player.last_name.toUpperCase()}`}
                />
              )
          )}
        </FormGroup>

        <Stack direction="row" justifyContent="center">
          <Button type="submit" variant="contained">
            Valider
          </Button>
        </Stack>
      </Box>

      <Fab
        color="secondary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleOpenDialog}
      >
        <Add />
      </Fab>

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

      <Snackbar open={openSnackbar} onClose={handleCloseSnackbar}>
        <Alert severity="error">Erreur Serveur</Alert>
      </Snackbar>
    </Container>
  );
};

export default SelectPlayers;
