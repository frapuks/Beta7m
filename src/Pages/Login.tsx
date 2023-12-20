import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // Utils
  const navigate = useNavigate();
  const urlApi: string = import.meta.env.VITE_API_ROOT;

  // States
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Methods
  const handleClickShowPassword = (): void => setShowPassword((show) => !show);
  const handleChange = (): void => setError(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form: FormData = new FormData(event.currentTarget);
    const response = await fetch(`${urlApi}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    if (!response.ok) {
      setError(true);
      return;
    }
    const data = await response.json();
    localStorage.setItem("accessToken", data.tokens.accessToken);
    localStorage.setItem("refreshToken", data.tokens.refreshToken);
    const user = {
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
    };
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/dashboard");
  };

  return (
    <Container sx={{ padding: 0 }}>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="space-evenly"
        spacing={3}
      >
        <Avatar sx={{ bgcolor: "primary.main" }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack direction="column" spacing={2}>
            <TextField
              label="Adresse email"
              required
              fullWidth
              name="email"
              autoComplete="email"
              autoFocus
              // defaultValue="admin@admin.com"
              onChange={handleChange}
            />
            <TextField
              label="Mot de passe"
              required
              fullWidth
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              // defaultValue="admin"
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" fullWidth variant="contained">
              Se connecter
            </Button>
          </Stack>
        </Box>
        {error && (
          <Alert severity="error">Erreur dans le mot de passe ou l'email</Alert>
        )}
      </Stack>
    </Container>
  );
};

export default Login;
