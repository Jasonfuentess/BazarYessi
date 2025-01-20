import React, { useState } from "react";
import { Box, Button, TextField, Typography, Container, Alert, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../BDD/firebase-config";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Alternar visibilidad de contraseña
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Validar usuario con Firestore
  const handleLogin = async () => {
    try {
      const usersCollection = collection(db, "Usuarios"); // Colección en Firestore
      const usersSnapshot = await getDocs(usersCollection);
      const users = usersSnapshot.docs.map(doc => doc.data());

      const user = users.find(
        u => u.username === credentials.username && u.password === credentials.password
      );

      if (user) {
        localStorage.setItem("user", JSON.stringify(user)); // Guardar usuario en localStorage
        navigate("/admin/manage-products"); // Redirigir al panel de administración
      } else {
        setError("Usuario o contraseña incorrectos.");
      }
    } catch (err) {
      console.error("Error al autenticar:", err);
      setError("Ocurrió un error. Inténtalo nuevamente.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} p={4} boxShadow={3} borderRadius={2} bgcolor="white">
        <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
          Iniciar Sesión
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          fullWidth
          label="Usuario"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          label="Contraseña"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          margin="dense"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button fullWidth variant="contained" color="primary" onClick={handleLogin} sx={{ mt: 2 }}>
          Iniciar Sesión
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
