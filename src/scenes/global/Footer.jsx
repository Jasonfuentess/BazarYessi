import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import { shades } from "../../theme";

function Footer() {
  const {
    palette: { neutral },
  } = useTheme();

  return (
    <Box marginTop="70px" padding="40px 0" backgroundColor={neutral.light}>
      <Box
        width="80%"
        margin="auto"
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }} // Apilar en móviles, horizontal en pantallas más grandes
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        rowGap="30px"
        columnGap="clamp(20px, 30px, 40px)"
        sx={{
          textAlign: { xs: "center", sm: "left" }, // Centrar contenido en móviles
        }}
      >
        {/* Sección YESSI'S BOUTIQUE */}
        <Box width={{ xs: "100%", sm: "clamp(20%, 30%, 40%)" }} textAlign={{ xs: "center", sm: "left" }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            mb="30px"
            color={shades.secondary[500]}
          >
            BAZAR YESSI'S
          </Typography>
          <Typography>
            Contamos con un amplio catálogo donde encontrarás productos de calidad 
            que se adaptan a tus necesidades y gustos. Ofrecemos variedad, desde básicos esenciales 
            hasta artículos modernos, todo a precios accesibles.
            <br />
            Nuestra plataforma está diseñada para que puedas explorar y elegir fácilmente lo que más te gusta,
            asegurando una experiencia práctica y confiable. ¡Descubre lo que tenemos para ti y haz tus compras de forma sencilla y segura!
          </Typography>
        </Box>

        {/* Sección Sobre Nosotros */}
        <Box width={{ xs: "100%", sm: "clamp(20%, 30%, 40%)" }} textAlign={{ xs: "center", sm: "left" }}>
          <Typography variant="h4" fontWeight="bold" mb="30px">
            Sobre Nosotros
          </Typography>
          <Typography>
          En BAZAR YESSI'S , nos dedicamos a ofrecer productos de calidad
          que se adaptan a las necesidades de nuestros clientes. 
          Nos enorgullece ser un punto de referencia en el Mercado Sagrado Corazón,
          donde brindamos una experiencia de compra única y accesible.
          <br />
          Nuestra misión es ofrecer una variedad de artículos esenciales con el mejor balance
          entre calidad y precio, asegurando que cada cliente encuentre exactamente lo que necesita.
          Estamos comprometidos con la satisfacción de nuestros clientes
          y trabajamos día a día para mejorar nuestra atención y expandir nuestras opciones.
          <br />
          Ubicados en un lugar estratégico en el corazón de San Salvador, 
          buscamos ser la primera elección de quienes buscan practicidad,
          economía y confianza en un solo lugar. ¡Gracias por elegirnos!
          </Typography>
        </Box>

        {/* Sección Contáctanos */}
        <Box width={{ xs: "100%", sm: "clamp(20%, 25%, 30%)" }} textAlign={{ xs: "center", sm: "left" }}>
          <Typography variant="h4" fontWeight="bold" mb="30px">
            Contáctanos
          </Typography>
          <Typography mb="30px">
            Mercado Sagrado Corazón, Planta Baja, Local 1001, 6ª Calle Poniente y 1ª Avenida Sur, San Salvador, El Salvador.
          </Typography>
          <Typography mb="30px" sx={{ wordWrap: "break-word" }}>
            Correo: pecas1380@hotmail.com
          </Typography>
          <Typography mb="30px">(503)7925-6824</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
