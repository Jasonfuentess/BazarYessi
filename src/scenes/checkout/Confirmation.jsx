import { Box, Typography, useMediaQuery } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useLocation } from "react-router-dom";

const Confirmation = () => {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || "No disponible"; // Obtener el número del pedido

  // Responsividad: Ajusta el tamaño de fuente según el dispositivo
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:900px)");

  return (
    <Box 
      m="90px auto" 
      width={isMobile ? "95%" : isTablet ? "80%" : "60%"} 
      minHeight="50vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Alert severity="success" sx={{ padding: "25px", fontSize: isMobile ? "14px" : "16px" }}>
        <AlertTitle sx={{ fontSize: isMobile ? "18px" : "22px", fontWeight: "bold" }}>
          🎉 ¡Pedido Confirmado!
        </AlertTitle>

        <Typography sx={{ fontSize: isMobile ? "14px" : "16px", marginBottom: "10px" }}>
          **¡Gracias por tu compra!** Hemos registrado tu pedido con éxito.  
        </Typography>

        <Typography sx={{ fontSize: isMobile ? "14px" : "16px", fontWeight: "bold" }}>
          📦 **Pago contra entrega:** No necesitas hacer ningún pago ahora.  
        </Typography>

        <Typography sx={{ fontSize: isMobile ? "14px" : "16px", fontWeight: "bold" }}>
          📞 **Nos contactaremos contigo** en breve para coordinar la entrega.  
        </Typography>

        <Box mt="15px">
          <Typography sx={{ fontSize: isMobile ? "14px" : "16px", fontWeight: "bold" }}>
            ℹ️ **Importante:**  
          </Typography>
          <Typography sx={{ fontSize: isMobile ? "14px" : "16px", mt: "5px" }}>
            🔹 **Toma una captura o Guarda tu número de orden** para hacer seguimiento de tu pedido.  
          </Typography>
          <Typography sx={{ fontSize: isMobile ? "14px" : "16px", mt: "5px" }}>
            🔹 Si tienes dudas, contáctanos por **WhatsApp o correo electrónico**.  
          </Typography>
          <Typography sx={{ fontSize: isMobile ? "14px" : "16px", mt: "5px" }}>
            🔹 Para verificar el estado de tu pedido, **proporciónanos tu número de orden**.  
          </Typography>
        </Box>

        <Typography 
          sx={{ 
            fontSize: isMobile ? "18px" : "22px", 
            fontWeight: "bold", 
            marginTop: "20px",
            color: "#d32f2f", // Resaltar el número de orden
            textAlign: "center",
            border: "2px solid #d32f2f",
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: "#fff5f5"
          }}
        >
          📌 Número de Orden: {orderNumber}
        </Typography>
      </Alert>
    </Box>
  );
};

export default Confirmation;
