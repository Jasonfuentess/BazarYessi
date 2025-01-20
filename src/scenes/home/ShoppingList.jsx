import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../BDD/firebase-config"; // Firestore Config
import Item from "../../components/Item";
import { Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

const ShoppingList = () => {
  const [value, setValue] = useState("all");
  const [items, setItems] = useState([]); // Lista de productos

  const breakPoint = useMediaQuery("(min-width:600px)");

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, "products");
      const productsSnapshot = await getDocs(productsCollection);

      // Mapea los datos para que coincidan con la estructura usada
      const productsList = productsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          price: data.price,
          category: data.category,
          imagePath: data.imagePath, // Ruta de imagen desde Firestore
        };
      });

      setItems(productsList);
      console.log("Productos obtenidos:", productsList);
    } catch (error) {
      console.error("Error al obtener productos de Firestore:", error);
    }
  };

  // Llama a la función fetchProducts al cargar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtrado por categoría
  const filteredItems =
    value === "all"
      ? items
      : items.filter((item) => item.category === value);

  const handleChange = (event, newValue) => {
    setValue(newValue); // Cambia la categoría seleccionada
  };

  return (
    <Box width="80%" margin="80px auto">
      <Typography variant="h3" textAlign="center">
        Nuestro <b>Catalogo</b>
      </Typography>
      <Tabs
        textColor="primary"
        indicatorColor="primary"
        value={value}
        onChange={handleChange}
        centered
        TabIndicatorProps={{ sx: { display: breakPoint ? "block" : "none" } }}
        sx={{
          m: "25px",
          "& .MuiTabs-flexContainer": {
            flexWrap: "wrap",
          },
        }}
      >
        <Tab label="TODO" value="all" />
        <Tab label="3 X 5" value="3x5" />
        <Tab label="DOCENAS || 1/2 DOCENAS" value="Docenas || 1/2 docena" />
        {/* <Tab label="TOP RATED" value="topRated" /> */}
      </Tabs>
      <Box
  margin="0 auto"
  display="grid"
  justifyContent="space-around"
  sx={{
    gridTemplateColumns: {
      xs: "repeat(2, 1fr)", // 2 columnas en móviles
      sm: "repeat(2, 1fr)", // 2 columnas en tablets
      md: "repeat(2, 1fr)", // 3 columnas en laptops (1024px a 1440px)
      lg: "repeat(3, 1fr)", // 4 columnas en pantallas grandes (>1440px)
      xl: "repeat(4, 1fr)", // 4 columnas en pantallas grandes (>1440px)

    },
    rowGap: { xs: "24px", sm: "28px", md: "32px", lg: "36px" }, // Espaciado entre filas dinámico
    columnGap: { xs: "12px", sm: "16px", md: "20px", lg: "24px" }, // Espaciado entre columnas dinámico
    "& > *": {
      maxWidth: { xs: "140px", sm: "180px", md: "240px", lg: "300px" }, // Tamaños dinámicos
      margin: "0 auto", // Centrar los ítems
    },
  }}
>
       {filteredItems.length === 0 ? (
          <Typography>No products available.</Typography>
        ) : (
          filteredItems.map((item) => (
            <Item item={item} key={item.id} />
          ))
        )}
      </Box>
    </Box>
  );
};

export default ShoppingList;
