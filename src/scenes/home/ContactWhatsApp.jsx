import { Box, Typography, IconButton, Button } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useState } from "react";

const ContactWhatsApp = () => {
  const [message, setMessage] = useState("");

  return (
    <Box
      width="80%"
      margin="80px auto"
      textAlign="center"
      borderRadius="12px"
      p="40px"
      backgroundColor="#F9F9F9"
      boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
    >
      <Box mb="20px">
        <IconButton>
          <WhatsAppIcon fontSize="large" sx={{ color: "#01FF2F" }} />
        </IconButton>
        <Typography variant="h3" fontWeight="bold" mb="10px">
          ¡Escríbenos ya por WhatsApp!
        </Typography>
        <Typography>
          Estamos listos para ayudarte con cualquier duda sobre
          nuestros productos.
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="15px"
        mt="30px"
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#01FF2F",
            color: "#000",
            fontWeight: "bold",
            fontSize: "16px",
            padding: "10px 20px",
            ":hover": { backgroundColor: "#1EBE57" },
          }}
          startIcon={<WhatsAppIcon />}
          onClick={() =>
            window.open(
              `https://wa.me/50379256824?text=${encodeURIComponent(
                message || "¡Hola! Me gustaría obtener más información."
              )}`,
              "_blank"
            )
          }
        >
          Contactar por WhatsApp
        </Button>
      </Box>
    </Box>
  );
};

export default ContactWhatsApp;
