import { useSelector, useDispatch } from "react-redux";
import { Box, Button, Stepper, Step, StepLabel, Typography } from "@mui/material";
import { Formik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import { shades } from "../../theme";
import Payment from "./Payment";
import Shipping from "./Shipping";
import { db } from "../../BDD/firebase-config"; // Importa Firestore
import { collection, addDoc } from "firebase/firestore"; // Funciones de Firestore
import { setIsCartOpen, clearCart } from "../../state"; // Para cerrar el carrito al finalizar compra
import { useNavigate } from "react-router-dom"; // Redirección

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const isFirstStep = activeStep === 0;
  const isSecondStep = activeStep === 1;
  const navigate = useNavigate(); // Para redirigir al usuario

  const handleFormSubmit = async (values, actions) => {
    setActiveStep(activeStep + 1);

    

    // Si es la última parte, guarda el pedido
    if (isSecondStep) {
      await saveOrderToFirestore(values);
    }

    actions.setTouched({});
  };
// 📌 Función para generar un número de orden corto y único
function generateOrderNumber() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let orderNumber = "ORD-";
  for (let i = 0; i < 6; i++) {
    orderNumber += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return orderNumber;
}
  // 📌 Función para guardar el pedido en Firestore
  async function saveOrderToFirestore(values) {
    try {
      const orderNumber = generateOrderNumber(); // Generar número único

      const orderData = {
        orderNumber, // Número único del pedido
        userName: `${values.billingAddress.firstName} ${values.billingAddress.lastName}`,
        email: values.email,
        phoneNumber: values.phoneNumber,
        billingAddress: values.billingAddress,
        products: cart.map(({ id, name, price, count, category, imagePath, selectedOption }) => ({
          id,
          name,
          price,
          count,
          category,
          selectedOption: selectedOption || category, // Si tiene opción seleccionada, guardarla
          imagePath,
        })),
        totalAmount: cart.reduce((total, item) => total + item.count * item.price, 0),
        timestamp: new Date(),
      };

      // Guardar en Firestore
      await addDoc(collection(db, "orders"), orderData);
      dispatch(clearCart());

      // Cerrar carrito y redirigir
      navigate("/confirmation", { state: { orderNumber } });

    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      alert("❌ Hubo un error al guardar el pedido.");
    }
  }

  return (
    <Box width="80%" m="100px auto">
      <Stepper activeStep={activeStep} sx={{ m: "20px 0" }}>
        <Step><StepLabel>Facturación</StepLabel></Step>
        <Step><StepLabel>Pago</StepLabel></Step>
      </Stepper>
      <Box>
        <Formik onSubmit={handleFormSubmit} initialValues={initialValues} validationSchema={checkoutSchema[activeStep]}>
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              {isFirstStep && (
                <Shipping values={values} errors={errors} touched={touched} handleBlur={handleBlur} handleChange={handleChange} setFieldValue={setFieldValue} />
              )}
              {isSecondStep && (
                <Payment values={values} errors={errors} touched={touched} handleBlur={handleBlur} handleChange={handleChange} setFieldValue={setFieldValue} />
              )}
              <Box display="flex" justifyContent="space-between" gap="50px">
                {!isFirstStep && (
                  <Button fullWidth color="primary" variant="contained" sx={{ backgroundColor: shades.primary[200], color: "white", padding: "15px 40px" }} onClick={() => setActiveStep(activeStep - 1)}>
                    Atrás
                  </Button>
                )}
                <Button fullWidth type="submit" color="primary" variant="contained" sx={{ backgroundColor: shades.primary[400], color: "white", padding: "15px 40px" }}>
                  {!isSecondStep ? "Siguiente" : "Confirmar Pedido"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

const initialValues = {
  billingAddress: { firstName: "", lastName: "", street1: "", street2: "", city: ""},
  email: "",
  phoneNumber: "",
};

const checkoutSchema = [
  yup.object().shape({
    billingAddress: yup.object().shape({
      firstName: yup.string().required("Requerido"),
      lastName: yup.string().required("Requerido"),
      street1: yup.string().required("Requerido"),
      street2: yup.string(),
      city: yup.string().required("Requerido"),
    }),
  }),
  yup.object().shape({
    email: yup.string().required("Requerido"),
    phoneNumber: yup.string().required("Requerido"),
  }),
];

export default Checkout;
