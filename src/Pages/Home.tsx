import {
  Typography,
  Container,
  Card,
  CardContent,
  Stack,
  Fab,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SportsHandball } from "@mui/icons-material";
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

const Home = () => {
  // Utils
  const navigate = useNavigate();

  // Variables
  const Players: Player[] = Data;

  // Methods
  const handleClickFab = (): void => {
    navigate("/SelectPlayers");
  };

  return (
    <Container sx={{ padding: 0 }}>
      <Typography variant="h5" textAlign={"center"}>
        Gardiens
      </Typography>

      <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={2}>
        {Players.map(
          (player) =>
            player.position === "Goalkeeper" && (
              <Card
                key={uuidv4()}
                sx={{ backgroundColor: "primary.main", color: "white" }}
              >
                <CardContent>
                  <Typography variant="h6" textAlign={"center"}>
                    {player.name.toUpperCase()}
                  </Typography>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Stack direction="column">
                      <Typography variant="body1" textAlign={"center"}>
                        Arrêts
                      </Typography>
                      <Typography variant="body1" textAlign={"center"}>
                        {player.shoots.goals}
                      </Typography>
                      <Typography variant="body1" textAlign={"center"}>
                        {Math.round(
                          (player.shoots.stops /
                            (player.shoots.goals + player.shoots.stops)) *
                            100
                        )}
                        {" %"}
                      </Typography>
                    </Stack>
                    <Stack direction="column">
                      <Typography variant="body1" textAlign={"center"}>
                        Victoires
                      </Typography>
                      <Typography variant="body1" textAlign={"center"}>
                        {player.matchs.wins}
                      </Typography>
                      <Typography variant="body1" textAlign={"center"}>
                        {Math.round(
                          (player.matchs.wins / player.matchs.total) * 100
                        )}
                        {" %"}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            )
        )}
      </Stack>

      <Typography variant="h5" textAlign={"center"}>
        Joueurs
      </Typography>

      <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={2}>
        {Players.map(
          (player) =>
            player.position === "Player" && (
              <Card
                key={uuidv4()}
                sx={{ backgroundColor: "primary.main", color: "white" }}
              >
                <CardContent>
                  <Typography variant="h6" textAlign={"center"}>
                    {player.name.toUpperCase()}
                  </Typography>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Stack direction="column">
                      <Typography variant="body1" textAlign={"center"}>
                        Buts
                      </Typography>
                      <Typography variant="body1" textAlign={"center"}>
                        {player.shoots.goals}
                      </Typography>
                      <Typography variant="body1" textAlign={"center"}>
                        {Math.round(
                          (player.shoots.goals /
                            (player.shoots.goals + player.shoots.stops)) *
                            100
                        )}
                        {" %"}
                      </Typography>
                    </Stack>
                    <Stack direction="column">
                      <Typography variant="body1" textAlign={"center"}>
                        Victoires
                      </Typography>
                      <Typography variant="body1" textAlign={"center"}>
                        {player.matchs.wins}
                      </Typography>
                      <Typography variant="body1" textAlign={"center"}>
                        {Math.round(
                          (player.matchs.wins / player.matchs.total) * 100
                        )}
                        {" %"}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            )
        )}
      </Stack>

      <Fab
        color="secondary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleClickFab}
      >
        <SportsHandball />
      </Fab>
    </Container>
  );
};

export default Home;
