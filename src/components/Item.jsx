import { useState } from "react";
import { useDispatch } from "react-redux";
import { IconButton, Box, Typography, useTheme, Button, useMediaQuery } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { shades } from "../theme";
import { addToCart } from "../state";
import { useNavigate } from "react-router-dom";

const Item = ({ item, width }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const {
    palette: { neutral },
  } = useTheme();

  // Detectar si es móvil
  const isMobile = useMediaQuery("(max-width:600px)");

  // Desestructurar datos del ítem dinámicamente
  const { id, category = "N/A", price = 0, name = "Unnamed", imagePath = "/assets/images/placeholder.jpg" } = item;

  return (
    <Box
      width={isMobile ? "100px" : width} // Reducir tamaño en móviles
      sx={{
        margin: isMobile ? "8px" : "0", // Ajustar márgenes en móviles
        textAlign: isMobile ? "left" : "left", // Centrar contenido en móviles
      }}
    >
      <Box
        position="relative"
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
      >
        <img
          alt={name}
          width={isMobile ? "170px" : "300px"} // Cambiar ancho en móviles
          height={isMobile ? "270px" : "400px"} // Cambiar altura en móviles
          src={imagePath} // Usar URL dinámica de Firebase Storage
          style={{
            cursor: "pointer",
            objectFit: "cover",
            borderRadius: "8px",
          }}
          onClick={() => navigate(`/item/${id}`)}
        />
        {/* <Box
          display={isHovered ? "block" : "none"}
          position="absolute"
          bottom="10%"
          left="0"
          width="100%"
          padding="0 5%"
        >
          <Box display="flex" justifyContent="space-between">
            <Box
              display="flex"
              alignItems="center"
              backgroundColor={shades.neutral[100]}
              borderRadius="3px"
            >
              <IconButton onClick={() => setCount(Math.max(count - 1, 1))}>
                <RemoveIcon />
              </IconButton>
              <Typography color={shades.primary[300]}>{count}</Typography>
              <IconButton onClick={() => setCount(count + 1)}>
                <AddIcon />
              </IconButton>
            </Box>
             <Button
              onClick={() => {
                // Agregar producto al carrito
                dispatch(
                  addToCart({
                    id,
                    name,
                    price,
                    count,
                    imagePath,
                    category,
                  })
                );
              }}
              sx={{
                backgroundColor: shades.primary[300],
                color: "white",
                fontSize: isMobile ? "10px" : "inherit",
              }}
            >
              Add to Cart
            </Button> 
          </Box>
        </Box> */}
      </Box>

      <Box mt="8px">
        <Typography
          variant="subtitle2"
          color={neutral.dark}
          sx={{
            fontSize: isMobile ? "12px" : "inherit", // Reducir texto en móviles
          }}
        >
          {category.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
        </Typography>
        <Typography
          sx={{
            fontSize: isMobile ? "14px" : "inherit", // Reducir texto en móviles
          }}
        >
          {name}
        </Typography>
        <Typography
          fontWeight="bold"
          sx={{
            fontSize: isMobile ? "14px" : "inherit", // Reducir texto en móviles
          }}
        >
          ${price.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default Item;
