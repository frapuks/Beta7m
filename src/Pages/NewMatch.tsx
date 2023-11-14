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
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../Store/Type";
import { v4 as uuidv4 } from "uuid";
import { Cancel, CheckCircle, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

enum ShootResult {
  GOAL = "goal",
  STOP = "stop",
}

interface Shoot {
  player: string;
  goalkeeper: string;
  result: ShootResult;
}

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

interface Match {
  playersWin: Boolean;
  shootList: Shoot[];
}

const SelectPlayers = () => {
  // Utils
  const navigate = useNavigate();

  // Variables
  const goalkeepers: Player[] = useSelector(
    (state: RootState) => state.selectPlayers.goalkeepers
  );
  const players: Player[] = useSelector(
    (state: RootState) => state.selectPlayers.players
  );
  const target = Math.ceil(players.length * 1.5);

  // States
  const [score, setScore] = useState(0);
  const [shootList, setShootList] = useState<Shoot[]>([]);

  // Methods
  const handleShoot = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const form: FormData = new FormData(event.currentTarget);

    const newShoot: Shoot = {
      player: form.get("player") as string,
      goalkeeper: form.get("goalkeeper") as string,
      result: form.get("result") as ShootResult,
    };

    if (!newShoot.player || !newShoot.goalkeeper || !newShoot.result) return;

    if (isGoal(newShoot.result)) setScore(score + 1);
    setShootList([...shootList, newShoot]);
  };

  const handleEndGame = (): void => {
    const playersWin: Boolean = score === target;
    const newMatch: Match = { playersWin, shootList };
    // TODO : Envoyer newMatch en BDD
    console.log(newMatch);
    navigate("/");
  };

  const isGoal = (value: string): Boolean => {
    return value === ShootResult.GOAL;
  };

  const removeShoot = (shoot: Shoot): void => {
    setShootList(shootList.filter((el) => el != shoot));
    if (isGoal(shoot.result)) setScore(score - 1);
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
                            shoot.player === player.name &&
                            !isGoal(shoot.result)
                        )
                      }
                    />
                  }
                  value={player.name}
                  label={player.name}
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
                    value={goalkeeper.name}
                    label={goalkeeper.name}
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
                  <TableCell>{shoot.player}</TableCell>
                  <TableCell>{shoot.goalkeeper}</TableCell>
                  <TableCell>
                    {isGoal(shoot.result) ? (
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

        <Button variant="contained" color="error" onClick={handleEndGame}>
          Terminer le match
        </Button>
      </Stack>
    </Container>
  );
};

export default SelectPlayers;
