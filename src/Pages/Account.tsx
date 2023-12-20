import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { User } from "../Types";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // Utils
  const navigate = useNavigate();
  const urlApi: string = import.meta.env.VITE_API_ROOT;
  const user: User = JSON.parse(localStorage.getItem("user")!);

  // Variables
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  // States
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openValidSnackbar, setOpenValidSnackbar] = useState(false);
  const [validConfirmEmail, setValidConfirmEmail] = useState(false);
  const [validConfirmNewPassword, setValidConfirmNewPassword] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);

  // Methods
  // const handleClickShowPassword = (): void => setShowPassword((show) => !show);
  const handleClickShowNewPassword = (): void =>
    setShowNewPassword((show) => !show);
  const handleClickShowNewPasswordConfirm = (): void =>
    setShowNewPasswordConfirm((show) => !show);
  const handleCloseSnackbar = (): void => {
    setOpenErrorSnackbar(false);
    setOpenValidSnackbar(false);
  };

  const handleSubmitEmail = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    const form: FormData = new FormData(event.currentTarget);
    const response = await fetch(`${urlApi}/users/${user.id!}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${accessToken}`,
      },
      body: JSON.stringify({
        email: form.get("email"),
      }),
    });
    if (!response.ok) {
      setOpenErrorSnackbar(true);
      return;
    }
    user.email = form.get("email") as string;
    localStorage.setItem("user", JSON.stringify(user));
    setOpenValidSnackbar(true);
  };

  const handleSubmitPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    const form: FormData = new FormData(event.currentTarget);
    const response = await fetch(`${urlApi}/users/${user.id!}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${accessToken}`,
      },
      body: JSON.stringify({
        // username: user.username,
        // email: form.get("email"),
        // password: form.get("password"),
        // newPassword: form.get("newPassword"),
        // newPasswordConfirm: form.get("newPasswordConfirm"),
        password: form.get("newPassword"),
        passwordConfirm: form.get("newPasswordConfirm"),
      }),
    });
    if (!response.ok) {
      setOpenErrorSnackbar(true);
      return;
    }
    setOpenValidSnackbar(true);
  };

  const handleChangeConfirmEmail = (): void => {
    const emailElement = document.getElementById(
      "inputEmail"
    )! as HTMLInputElement;
    const emailConfirmElement = document.getElementById(
      "inputEmailConfirm"
    )! as HTMLInputElement;
    setValidConfirmEmail(emailElement.value === emailConfirmElement.value);
  };

  const handleChangeIsValidPassword = (): void => {
    handleChangeConfirmPassword();
    const newPassword = (
      document.getElementById("inputNewPassword")! as HTMLInputElement
    ).value;
    newPassword.length >= 8;
    setIsValidPassword(newPassword.length >= 8);
  };

  const handleChangeConfirmPassword = (): void => {
    const newPassword = (
      document.getElementById("inputNewPassword")! as HTMLInputElement
    ).value;
    const newPasswordConfirm = (
      document.getElementById("inputNewPasswordConfirm")! as HTMLInputElement
    ).value;
    setValidConfirmNewPassword(newPassword === newPasswordConfirm);
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

  return (
    <Container sx={{ padding: 0 }}>
      <Typography component="h1" variant="h5" textAlign="center">
        Votre compte
      </Typography>

      <Stack
        direction="column"
        alignItems="center"
        justifyContent="space-evenly"
        spacing={3}
      >
        <Divider sx={{ alignSelf: "stretch" }} />
        <Box component="form" onSubmit={handleSubmitEmail}>
          <Stack direction="column" spacing={2}>
            <TextField
              id="inputEmail"
              label="Email"
              required
              name="email"
              autoComplete="email"
              defaultValue={user.email}
            />
            <TextField
              id="inputEmailConfirm"
              label="Confirmation de l'email"
              required
              name="emailConfirm"
              autoComplete="email"
              onChange={handleChangeConfirmEmail}
              color={validConfirmEmail ? "primary" : "warning"}
              helperText={
                validConfirmEmail ? "Email valide" : "Email non valide"
              }
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!validConfirmEmail}
            >
              Modifier l'email
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ alignSelf: "stretch" }} />

        <Box component="form" onSubmit={handleSubmitPassword}>
          <Stack direction="column" spacing={2}>
            {/* <TextField
              label="Email"
              required
              name="email"
              autoComplete="email"
              defaultValue={user.email}
            />
            <TextField
              id="inputPassword"
              label="Mot de passe"
              required
              fullWidth
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            /> */}
            <TextField
              id="inputNewPassword"
              label="Nouveau mot de passe"
              required
              name="newPassword"
              onChange={handleChangeIsValidPassword}
              autoComplete="new-password"
              type={showNewPassword ? "text" : "password"}
              helperText={
                isValidPassword
                  ? "Mot de passe valide"
                  : "8 car + min + Maj + chiffre"
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowNewPassword}>
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="inputNewPasswordConfirm"
              label="Confirmation du mot de passe"
              required
              name="newPasswordConfirm"
              onChange={handleChangeConfirmPassword}
              autoComplete="new-password"
              type={showNewPasswordConfirm ? "text" : "password"}
              color={validConfirmNewPassword ? "primary" : "warning"}
              helperText={
                validConfirmNewPassword
                  ? "Mots de passes correspondants"
                  : "Les mots de passe dont différents"
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowNewPasswordConfirm}>
                      {showNewPasswordConfirm ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!validConfirmNewPassword}
            >
              Modifier le mot de passe
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ alignSelf: "stretch" }} />

        <Button variant="contained" color="error" onClick={handleClickLogout}>
          Déconnexion
        </Button>
      </Stack>

      <Snackbar open={openErrorSnackbar} onClose={handleCloseSnackbar}>
        <Alert severity="error">Erreur Serveur</Alert>
      </Snackbar>
      <Snackbar open={openValidSnackbar} onClose={handleCloseSnackbar}>
        <Alert>Modifications enregistrées</Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
