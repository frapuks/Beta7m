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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { setGoalkeepers, setPlayers } from "../Store/Slices/selectPlayersSlice";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Data from "../Data/players.json";

interface Player {
  id: string;
  name: string;
  position: string;
  shoots: {
    goals: number;
    stops: number;
  };
  matchs: {
    total: number;
    wins: number;
  };
}

const SelectPlayers = () => {
  // Utils
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Variables
  const Players: Player[] = Data;

  // Methods
  const handleSubmitForm = (event: React.FormEvent): void => {
    event.preventDefault();

    const form: FormData = new FormData(event.currentTarget as HTMLFormElement);
    const goalkeepersId: FormDataEntryValue[] = form.getAll("goalkeeper");
    const playersId: FormDataEntryValue[] = form.getAll("player");

    const goalkeepers: Player[] = Players.filter((player) =>
      goalkeepersId.includes(player.id)
    );
    const players: Player[] = Players.filter((player) =>
      playersId.includes(player.id)
    );

    dispatch(setGoalkeepers(goalkeepers));
    dispatch(setPlayers(players));

    navigate("/NewMatch");
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
              player.position === "Goalkeeper" && (
                <FormControlLabel
                  key={uuidv4()}
                  name="goalkeeper"
                  control={<Checkbox />}
                  value={player.id}
                  label={player.name}
                />
              )
          )}
        </FormGroup>

        <FormGroup>
          <FormLabel>Joueurs</FormLabel>
          {Players.map(
            (player) =>
              player.position === "Player" && (
                <FormControlLabel
                  key={uuidv4()}
                  name="player"
                  control={<Checkbox />}
                  value={player.id}
                  label={player.name}
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
    </Container>
  );
};

export default SelectPlayers;
