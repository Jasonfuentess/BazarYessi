import React, { useState, useEffect } from "react";
import {
  Badge,
  Box,
  IconButton,
  InputBase,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import {
  ShoppingBagOutlined,
  SearchOutlined,
  CloseOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../BDD/firebase-config"; // Asegúrate de que la configuración de Firebase sea correcta
import { shades } from "../../theme";
import { useDispatch, useSelector } from "react-redux";
import { setIsCartOpen } from "../../state";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]); // Datos de Firestore
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Función para obtener productos de Firestore
  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, "products");
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    } catch (error) {
      console.error("Error al obtener productos de Firestore:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleProductClick = (product) => {
    navigate(`/item/${product.id}`); // Redirige al detalle del producto
    setSearchQuery("");
    setFilteredProducts([]);
    setIsSearchOpen(false);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      width="100%"
      height="60px"
      backgroundColor="rgba(255, 255, 255, 0.95)"
      color="black"
      position="fixed"
      top="0"
      left="0"
      zIndex="1"
    >
      <Box
        width="80%"
        margin="auto"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        {/* Logo */}
        <Box
          onClick={() => navigate("/")}
          sx={{ "&:hover": { cursor: "pointer" } }}
          color={shades.secondary[500]}
          fontWeight="bold"
          fontSize="20px"
        >
          BAZAR YESSI'S
        </Box>

        {/* Barra de búsqueda */}
        <Box display="flex" alignItems="center" columnGap="20px" zIndex="2">
          <IconButton
            sx={{ color: "black" }}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            {isSearchOpen ? <CloseOutlined /> : <SearchOutlined />}
          </IconButton>
          {isSearchOpen && (
            <Box
              position="absolute"
              top="60px"
              left="25%"
              transform="translateX(-50%)"
              width="50%"
              bgcolor="white"
              boxShadow="0px 4px 6px rgba(0,0,0,0.1)"
              zIndex="10"
              padding="10px 20px"
              borderRadius="5px"
            >
              <InputBase
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={handleSearch}
                sx={{
                  width: "100%",
                  fontSize: "16px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  marginBottom: "10px",
                }}
              />
              {filteredProducts.length > 0 && (
                <List sx={{ maxHeight: "300px", overflowY: "auto" }}>
                  {filteredProducts.map((product) => (
                    <ListItem
                      key={product.id}
                      button
                      onClick={() => handleProductClick(product)}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={product.imagePath || "/placeholder.jpg"}
                          alt={product.name}
                          sx={{ width: 40, height: 40, borderRadius: "5px" }}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={product.name} />
                    </ListItem>
                  ))}
                </List>
              )}
              {searchQuery && filteredProducts.length === 0 && (
                <Typography variant="body2" color="textSecondary" textAlign="center">
                  No se encontraron resultados para "{searchQuery}"
                </Typography>
              )}
            </Box>
          )}

          {/* Ícono del carrito */}
          <Badge
            badgeContent={cart.length}
            color="secondary"
            invisible={cart.length === 0}
            sx={{
              "& .MuiBadge-badge": {
                right: 5,
                top: 5,
                padding: "0 4px",
                height: "14px",
                minWidth: "13px",
              },
            }}
          >
            <IconButton
              onClick={() => dispatch(setIsCartOpen({}))}
              sx={{ color: "black" }}
            >
              <ShoppingBagOutlined />
            </IconButton>
          </Badge>
        </Box>
      </Box>
    </Box>
  );
}

export default Navbar;
