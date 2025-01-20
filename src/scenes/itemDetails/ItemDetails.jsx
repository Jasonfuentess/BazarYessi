import { Box, Button, IconButton, Typography, Tabs, Tab, MenuItem, Select } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { shades } from "../../theme";
import { addToCart } from "../../state";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { db } from "../../BDD/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import Item from "../../components/Item";

const ItemDetails = () => {
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const navigate = useNavigate(); // Para redirigir

  const [value, setValue] = useState("description");
  const [count, setCount] = useState(1);
  const [item, setItem] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Docena");
  const [price, setPrice] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOptionChange = (e) => {
    const option = e.target.value;
    setSelectedOption(option);
    if (option === "1/2 Docena") {
      setPrice(item?.price / 2);
    } else {
      setPrice(item?.price);
    }
  };

  async function getItem() {
    const itemsCollection = collection(db, "products");
    const snapshot = await getDocs(itemsCollection);
    const product = snapshot.docs.find((doc) => doc.id === itemId)?.data();
    setItem(product);
    setPrice(product?.price || 0);
  }

  async function getRelatedItems() {
    const itemsCollection = collection(db, "products");
    const snapshot = await getDocs(itemsCollection);
    const relatedItems = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((doc) => doc.id !== itemId);
    setItems(relatedItems);
  }

  useEffect(() => {
    getItem();
    getRelatedItems();
  }, [itemId]);

  return (
    <Box width="80%" m="80px auto">
      <Box display="flex" flexWrap="wrap" columnGap="40px">
        {/* IMAGE */}
        <Box flex="1 1 40%" mb="40px">
          <img
            alt={item?.name}
            width="100%"
            style={{ maxHeight: "400px", objectFit: "contain" }}
            src={item?.imagePath || "/placeholder.jpg"}
          />
        </Box>

        {/* DETAILS */}
        <Box flex="1 1 50%" mb="40px" >
         

          <Box m="65px 0 25px 0">
            <Typography variant="h3">{item?.name}</Typography>
            <Typography>${price.toFixed(2)}</Typography>
            <Typography sx={{ mt: "20px" }}>{item?.description}</Typography>
          </Box>

          {/* QUANTITY AND ADD TO CART */}
          <Box display="flex" alignItems="center" minHeight="50px" gap="20px">
            <Box
              display="flex"
              alignItems="center"
              border={`1.5px solid ${shades.neutral[300]}`}
              p="2px 5px"
            >
              <IconButton onClick={() => setCount(Math.max(count - 1, 1))}>
                <RemoveIcon />
              </IconButton>
              <Typography sx={{ p: "0 5px" }}>{count}</Typography>
              <IconButton onClick={() => setCount(count + 1)}>
                <AddIcon />
              </IconButton>
            </Box>

            <Button
              sx={{
                backgroundColor: shades.primary[500],
                color: "white",
                borderRadius: 0,
                padding: "10px 40px",
              }}
              onClick={() =>
                dispatch(
                  addToCart({
                    item: {
                      id: item?.category === "Docenas || 1/2 docena"
                        ? `${itemId}-${selectedOption}` // Si es docena, agregar opción al id
                        : itemId, // Si no, usar solo itemId
                      name: item?.name,
                      price,
                      count,
                      imagePath: item?.imagePath,
                      category: item?.category, // Muestra la categoría normal
                      selectedOption: item?.category === "Docenas || 1/2 docena"
                      ? selectedOption
                      : null, // Solo agregar opción si es "Docenas || 1/2 docena"
                    },
                  })
                )
              }
            >
              AÑADIR AL CARRITO
            </Button>
          </Box>

          {/* CATEGORY SELECTOR */}
          {item?.category === "Docenas || 1/2 docena" ? (
            <Box mt="20px">
              <Typography>Seleccionar:</Typography>
              <Select value={selectedOption} onChange={handleOptionChange} sx={{ minWidth: "150px" }}>
                <MenuItem value="Docena">Docena</MenuItem>
                <MenuItem value="1/2 Docena">1/2 Docena</MenuItem>
              </Select>
            </Box>
          ) : null}

          <Box mt="20px">
            
            <Typography mt="10px">Categorías: {item?.category}</Typography>
          </Box>
        </Box>
      </Box>

      {/* INFORMATION */}
      <Box m="20px 0">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Descripción" value="description" />
        </Tabs>
        {value === "description" && <Typography fontSize={14}>{item?.description}</Typography>}
      </Box>

      {/* PRODUCTOS RELACIONADOS */}
       {/* PRODUCTOS RELACIONADOS */}
       <Box mt="50px" width="100%">
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb="20px">
          Productos Relacionados
        </Typography>
        <IconButton
          className="prev-button"
          sx={{ position: "absolute", left: 0 }}
          style={{ color: "black" }}
        >
          <NavigateBeforeIcon />
        </IconButton>
        <IconButton
          className="next-button"
          sx={{ position: "absolute", right: 0 }}
          style={{ color: "black" }}
        >
          <NavigateNextIcon />
        </IconButton>
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          breakpoints={{
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          style={{ padding: "10px" }}
        >
          {items.map((relatedItem) => (
            <SwiperSlide
              key={relatedItem.id}
              onClick={() => navigate(`/item/${relatedItem.id}`)}
              style={{ cursor: "pointer" }}
            >
              <Box textAlign="center" padding="10px">
                <img
                  src={relatedItem.imagePath || "/placeholder.jpg"}
                  alt={relatedItem.name}
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <Typography>{relatedItem.name}</Typography>
                <Typography>{relatedItem.category}</Typography>
                <Typography>${relatedItem.price.toFixed(2)}</Typography>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

export default ItemDetails;
