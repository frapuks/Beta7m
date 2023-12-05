import {
  Box,
  Typography,
  Container,
  Stack,
  FormControlLabel,
  FormLabel,
  Button,
  Radio,
  RadioGroup,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../Store/Type";
import { v4 as uuidv4 } from "uuid";
import { Cancel, CheckCircle, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Match, Player, Shoot } from "../Types";

enum ShootResult {
  GOAL = "goal",
  STOP = "stop",
}

const SelectPlayers = () => {
  // Utils
  const navigate = useNavigate();
  const urlApi = "https://api-beta7m.fg-tech.fr/api/v1";

  // Variables
  const goalkeepers: Player[] = useSelector(
    (state: RootState) => state.selectMatchPlayers.goalkeepers
  );
  const players: Player[] = useSelector(
    (state: RootState) => state.selectMatchPlayers.shooters
  );
  const target = Math.ceil(players.length * 1.5);

  // States
  const [score, setScore] = useState(0);
  const [shootList, setShootList] = useState<Shoot[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);

  // Methods
  const handleCloseSnackbar = () => { setOpenSnackbar(false); };

  const handleShoot = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const form: FormData = new FormData(event.currentTarget);
    const shooterId: number = +(form.get("player") as any);
    const goalkeeperId: number = +(form.get("goalkeeper") as any);
    const result: ShootResult = form.get("result") as any;
    const isGoal: boolean = boolIsGoal(result);

    const newShoot: Shoot = {
      is_Goal: isGoal,
      shooter_id: shooterId,
      goalkeeper_id: goalkeeperId,
      shooter: players.find(player => player.id == shooterId),
      goalkeeper: goalkeepers.find(player => player.id == goalkeeperId),
    };

    if (!result || !newShoot.shooter_id || !newShoot.goalkeeper_id) return;

    if (isGoal) setScore(score + 1);
    setShootList([...shootList, newShoot]);
  };

  const handleEndGame = async () => {
    setDisabledButton(true);
    const players_victory: boolean = score >= target;
    const match: Match = { players_victory };
    // TODO : Envoyer le Match et les tirs en BDD
    console.log(match, shootList);

    const response = await fetch(`${urlApi}/matchs/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({match, shootList})
    });
    if (!response.ok) {
      setDisabledButton(false);
      setOpenSnackbar(true);
      return;
    };

    navigate("/");
  };

  const boolIsGoal = (value: string): boolean => {
    return value === ShootResult.GOAL;
  };

  const removeShoot = (shoot: Shoot): void => {
    setShootList(shootList.filter((el) => el != shoot));
    if (shoot.is_Goal) setScore(score - 1);
  };

  return (
    <Container sx={{ padding: 0 }}>
      <Stack direction="column" justifyContent="center" gap={2}>
        <Typography variant="h5" textAlign={"center"}>
          Nouveau match
        </Typography>

        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          gap={2}
        >
          <Typography variant="body1" textAlign={"center"}>
            Score :
          </Typography>

          <Typography
            variant="h5"
            sx={{
              bgcolor: "primary.main",
              color: "white",
              padding: 2,
              borderRadius: 1,
            }}
          >
            {score} / {target}
          </Typography>
        </Stack>

        <Box id="playersForm" component="form" onSubmit={handleShoot}>
          <Stack direction="row" justifyContent="space-around" gap={1}>
            <RadioGroup>
              <FormLabel>Joueurs</FormLabel>
              {players.map((player) => (
                <FormControlLabel
                  key={uuidv4()}
                  name="player"
                  control={
                    <Radio
                      disabled={
                        !!shootList.find(
                          (shoot) =>
                            player.id === shoot.shooter?.id && !shoot.is_Goal
                        )
                      }
                    />
                  }
                  value={player.id}
                  label={player.first_name}
                  required
                />
              ))}
            </RadioGroup>

            <Stack direction="column" justifyContent="space-between" gap={1}>
              <RadioGroup>
                <FormLabel>Gardiens</FormLabel>
                {goalkeepers.map((goalkeeper) => (
                  <FormControlLabel
                    key={uuidv4()}
                    name="goalkeeper"
                    control={<Radio />}
                    value={goalkeeper.id}
                    label={goalkeeper.first_name}
                    required
                  />
                ))}
              </RadioGroup>
              <RadioGroup>
                <FormLabel>Résultat</FormLabel>
                <FormControlLabel
                  name="result"
                  control={<Radio />}
                  value={ShootResult.GOAL}
                  label="But"
                  required
                />
                <FormControlLabel
                  name="result"
                  control={<Radio />}
                  value={ShootResult.STOP}
                  label="Arrêt"
                  required
                />
              </RadioGroup>
            </Stack>
          </Stack>

          <Stack direction="column" alignItems="center">
            <Button type="submit" variant="contained">
              Valider
            </Button>
          </Stack>
        </Box>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>TIREUR</TableCell>
                <TableCell>GARDIEN</TableCell>
                <TableCell>BUT</TableCell>
                <TableCell align="center">
                  <Delete />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shootList.map((shoot) => (
                <TableRow key={uuidv4()}>
                  <TableCell>{shoot.shooter?.first_name}</TableCell>
                  <TableCell>{shoot.goalkeeper?.first_name}</TableCell>
                  <TableCell>
                    {shoot.is_Goal ? (
                      <CheckCircle color="primary" />
                    ) : (
                      <Cancel color="error" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => removeShoot(shoot)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button variant="contained" color="error" onClick={handleEndGame} disabled={disabledButton}>
          Terminer le match
        </Button>
      </Stack>

      <Snackbar open={openSnackbar} onClose={handleCloseSnackbar}>
        <Alert severity="error">Erreur Serveur</Alert>
      </Snackbar>
    </Container>
  );
};

export default SelectPlayers;
