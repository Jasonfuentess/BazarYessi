import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import styled from "@emotion/styled";
import { shades } from "../../theme";
import { decreaseCount, increaseCount, removeFromCart, setIsCartOpen } from "../../state";
import { useNavigate } from "react-router-dom";

const FlexBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CartMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const isCartOpen = useSelector((state) => state.cart.isCartOpen);

  const totalPrice = cart.reduce((total, item) => {
    const count = item.count || 1;
    return total + count * (item.price || 0);
  }, 0);

  return (
    <Box
      display={isCartOpen ? "block" : "none"}
      backgroundColor="rgba(0, 0, 0, 0.4)"
      position="fixed"
      zIndex={10}
      width="100%"
      height="100%"
      left="0"
      top="0"
      overflow="auto"
    >
      <Box
        position="fixed"
        right="0"
        bottom="0"
        width="max(400px, 30%)"
        height="100%"
        backgroundColor="white"
      >
        <Box padding="30px" overflow="auto" height="100%">
          {/* HEADER */}
          <FlexBox mb="15px">
            <Typography variant="h3">Tu carrito ({cart.length})</Typography>
            <IconButton onClick={() => dispatch(setIsCartOpen({}))}>
              <CloseIcon />
            </IconButton>
          </FlexBox>

          {/* CART LIST */}
          <Box>
  {cart.map((item, index) => (
    <Box key={`${item.uniqueId}-${index}`}>
      <FlexBox p="15px 0">
        {/* Imagen del Producto */}
        <Box flex="1 1 40%">
          <img
            alt={item.name}
            width="75%"
            height="100%"
            src={item.imagePath || "/placeholder.jpg"}
          />
        </Box>

        {/* Detalles del Producto */}
        <Box flex="1 1 60%">
          <FlexBox mb="5px">
            <Box>
              <Typography fontWeight="bold">{item.name}</Typography>
              {/* Mostrar la opción seleccionada correctamente debajo del nombre */}
              <Typography variant="body2" color="textSecondary">
  {item.selectedOption ? item.selectedOption : item.category}
</Typography>
            </Box>
            <IconButton
              onClick={() =>
                dispatch(removeFromCart({ uniqueId: item.uniqueId }))
              }
            >
              <CloseIcon />
            </IconButton>
          </FlexBox>

          {/* Contador y Precio */}
          <FlexBox m="15px 0">
            <Box
              display="flex"
              alignItems="center"
              border={`1.5px solid ${shades.neutral[500]}`}
            >
              <IconButton
                onClick={() =>
                  dispatch(decreaseCount({ id: item.id, index }))
                }
              >
                <RemoveIcon />
              </IconButton>
              <Typography>{item.count}</Typography>
              <IconButton
                onClick={() =>
                  dispatch(increaseCount({ id: item.id, index }))
                }
              >
                <AddIcon />
              </IconButton>
            </Box>
            <Typography fontWeight="bold">${item.price.toFixed(2)}</Typography>
          </FlexBox>
        </Box>
      </FlexBox>
      <Divider />
    </Box>
  ))}
          </Box>



          {/* ACTIONS */}
          <Box m="20px 0">
            <FlexBox m="20px 0">
              <Typography fontWeight="bold">SUBTOTAL</Typography>
              <Typography fontWeight="bold">${totalPrice.toFixed(2)}</Typography>
            </FlexBox>
            <Button
              sx={{
                backgroundColor: shades.primary[400],
                color: "white",
                borderRadius: 0,
                minWidth: "100%",
                padding: "20px 40px",
                m: "20px 0",
              }}
              onClick={() => {
                navigate("/checkout");
                dispatch(setIsCartOpen({}));
              }}
            >
              Confirmar pedido
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CartMenu;
