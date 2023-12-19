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
import {
  setGoalkeepers,
  setShooters,
} from "../Store/Slices/selectMatchPlayersSlice";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../Store/Type";
import { Player } from "../Types";

const SelectPlayers = () => {
  // Utils
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Variables
  const Players: Player[] = useSelector(
    (state: RootState) => state.players.players
  );

  // States

  // Methods
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

  return (
    <Container sx={{ padding: 0 }}>
      <Typography variant="h5" textAlign={"center"}>
        Selection des joueurs
      </Typography>

      <Box id="playersForm" component="form" onSubmit={handleSubmitForm}>
        <FormGroup>
          <FormLabel component="legend">Gardiens</FormLabel>
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
          <FormLabel component="legend">Joueurs</FormLabel>
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

    </Container>
  );
};

export default SelectPlayers;
