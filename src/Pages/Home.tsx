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
import { useEffect } from "react";
import { Match, Player, Shoot } from "../Types.js";
import { useDispatch, useSelector } from "react-redux";
import { setPlayers } from "../Store/Slices/playersSlice.js";
import { RootState } from "../Store/Type.js";

const Home = () => {
  // Utils
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const urlApi = "http://localhost:4110/api/v1";

  // Variables
  const players: Player[] = useSelector(
    (state: RootState) => state.players.players
  );

  // UseEffect
  useEffect(() => {
    dataFetch();
  }, []);

  // Methods
  const dataFetch = async () => {
    const response = await fetch(`${urlApi}/players/infos`);
    const data = await response.json();
    dispatch(setPlayers(data));
  };

  const handleClickFab = (): void => {
    navigate("/SelectPlayers");
  };

  const getGoalsAndStops = (
    shootList: Shoot[]
  ): { goals: number; stops: number } => {
    let goals = 0;
    let stops = 0;
    for (const shoot of shootList) {
      shoot.is_Goal ? goals++ : stops++;
    }
    return { goals, stops };
  };

  const getVictoryCount = (
    matchList: Match[]
  ): { goalkeeperVictories: number; shooterVictories: number } => {
    let shooterVictories = 0;
    let goalkeeperVictories = 0;
    for (const match of matchList) {
      match.players_victory ? shooterVictories++ : goalkeeperVictories++;
    }
    return { shooterVictories, goalkeeperVictories };
  };

  return (
    <Container sx={{ padding: 0 }}>
      <Typography variant="h5" textAlign={"center"}>
        Gardiens
      </Typography>

      <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={2}>
        {players.map(
          (player) =>
            player.is_goalkeeper &&
            !!player.goalkeeperList?.length && (
              <Card
                key={uuidv4()}
                sx={{ backgroundColor: "primary.main", color: "white" }}
              >
                <CardContent>
                  <Typography variant="h6" textAlign={"center"}>
                    {player.first_name.toUpperCase()}
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
                        {getGoalsAndStops(player.goalkeeperList!).stops} {" / "}{" "}
                        {player.goalkeeperList!.length}
                      </Typography>
                      <Typography variant="body1" textAlign={"center"}>
                        {Math.round(
                          (getGoalsAndStops(player.goalkeeperList!).stops /
                            player.goalkeeperList!.length) *
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
                        {getVictoryCount(player.matchList!).goalkeeperVictories}{" "}
                        {" / "} {player.matchList!.length}
                      </Typography>
                      <Typography variant="body1" textAlign={"center"}>
                        {Math.round(
                          (getVictoryCount(player.matchList!)
                            .goalkeeperVictories /
                            player.matchList!.length) *
                            100
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
        {players.map(
          (player) =>
            !player.is_goalkeeper &&
            !!player.shooterList?.length && (
              <Card
                key={uuidv4()}
                sx={{ backgroundColor: "primary.main", color: "white" }}
              >
                <CardContent>
                  <Typography variant="h6" textAlign={"center"}>
                    {player.first_name.toUpperCase()}
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
                        {getGoalsAndStops(player.shooterList!).goals} {" / "}{" "}
                        {player.shooterList!.length}
                      </Typography>
                      <Typography variant="body1" textAlign={"center"}>
                        {Math.round(
                          (getGoalsAndStops(player.shooterList!).goals /
                            player.shooterList!.length) *
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
                        {getVictoryCount(player.matchList!).shooterVictories}{" "}
                        {" / "} {player.matchList!.length}
                      </Typography>
                      <Typography variant="body1" textAlign={"center"}>
                        {Math.round(
                          (getVictoryCount(player.matchList!).shooterVictories /
                            player.shooterList!.length) *
                            100
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
