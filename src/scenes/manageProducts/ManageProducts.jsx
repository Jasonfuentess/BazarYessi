import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tabs,
  Tab,
  Select,
  Card,
  InputLabel,
  MenuItem,
  CardMedia,
  CardContent,
  FormControl,
  Checkbox,
} from "@mui/material";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { db } from "../../BDD/firebase-config";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ManageProducts = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [orderTabIndex, setOrderTabIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchProductQuery, setSearchProductQuery] = useState("");
  const [searchOrderQuery, setSearchOrderQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ name: "", price: 0, category: "", description: "", imagePath: "" });
  const [productId, setProductId] = useState(null);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const storage = getStorage(); // 🔹 Se define correctamente Firebase Storage
  const [productToDelete, setProductToDelete] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Obtener productos de Firebase
  const fetchProducts = async () => {
    try {
      const productsSnapshot = await getDocs(collection(db, "products"));
      const productsList = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
      setFilteredProducts(productsList);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  // Obtener pedidos de Firebase
  const fetchOrders = async () => {
    try {
      const ordersSnapshot = await getDocs(collection(db, "orders"));
      const ordersList = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersList);
      setFilteredOrders(ordersList);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // Filtrar productos en la búsqueda
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchProductQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchProductQuery, products]);

  // Filtrar pedidos en la búsqueda
  useEffect(() => {
    const query = searchOrderQuery.toLowerCase();
    const filtered = orders.filter((order) =>
      order.orderNumber.toLowerCase().includes(query) ||
      order.userName.toLowerCase().includes(query) ||
      order.email.toLowerCase().includes(query)
    );
    setFilteredOrders(filtered);
  }, [searchOrderQuery, orders]);
 // Abrir modal de agregar/editar producto
 const handleOpenProductDialog = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setIsEditing(true);
      setProductId(product.id);
    } else {
        setCurrentProduct({ name: "", price: 0, category: "", description: "", imagePath: "" });
        setIsEditing(false);
      setProductId(null);
    }
    setOpenProductDialog(true);
  };

    // Cerrar modal de producto
    const handleCloseProductDialog = () => {
        setOpenProductDialog(false);
      };

      // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Agregar producto a Firebase
  const handleAddProduct = async () => {
    try {
      const imageUrl = await uploadImageAndGetURL();
      const productData = { ...currentProduct,      
        price: parseFloat(currentProduct.price) || 0, // 🔹 Convertir precio a número
        imagePath: imageUrl || "" };

      await addDoc(collection(db, "products"), productData);
      fetchProducts();
      handleCloseProductDialog();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  // Editar producto en Firebase
  const handleEditProduct = async () => {
    try {
      const imageUrl = await uploadImageAndGetURL(); // Obtener la URL de la imagen si se subió
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, { ...currentProduct, 
        price: parseFloat(currentProduct.price) || 0, // 🔹 Convertir precio a número
        imagePath: imageUrl });

      fetchProducts();
      handleCloseProductDialog();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  // Eliminar producto de Firebase
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      const productRef = doc(db, "products", productToDelete.id);
      await deleteDoc(productRef);
      fetchProducts();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };
  // Abrir modal de detalles del pedido
  const handleOpenOrderDialog = (order) => {
    setCurrentOrder(order);
    setOpenOrderDialog(true);
  };
  const handleOpenDeleteDialog = (product) => {
    setProductToDelete(product);
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setProductToDelete(null);
    setOpenDeleteDialog(false);
  };
  // Cerrar modal de pedidos
  const handleCloseOrderDialog = () => {
    setOpenOrderDialog(false);
  };

  // Seleccionar/deseleccionar pedidos
  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );
  };
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Subir imagen a Firebase Storage y obtener la URL
  const uploadImageAndGetURL = async () => {
    if (!imageFile) return currentProduct.imagePath; // Si no hay imagen nueva, mantener la anterior

    const imageRef = ref(storage, `products/${imageFile.name}`);
    const uploadTask = uploadBytesResumable(imageRef, imageFile);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error al subir la imagen:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };
  // Cambiar estado de pedidos
  const updateOrderStatus = async (newStatus) => {
    try {
      await Promise.all(
        selectedOrders.map(async (orderId) => {
          const orderRef = doc(db, "orders", orderId);
          await updateDoc(orderRef, { status: newStatus });
        })
      );
      fetchOrders();
      setSelectedOrders([]);
    } catch (error) {
      console.error("Error al actualizar pedidos:", error);
    }
  };

  return (
    <Box p={3} width="80%" mx="auto" mt="80px">
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Gestión de Productos y Pedidos
      </Typography>

      <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)}>
        <Tab label="Productos" />
        <Tab label="Pedidos" />
      </Tabs>

      {/* Pestaña de Productos */}
      {tabIndex === 0 && (
        <Box>
          <TextField
            fullWidth
            label="Buscar producto..."
            variant="outlined"
            value={searchProductQuery}
            onChange={(e) => setSearchProductQuery(e.target.value)}
            sx={{ mb: 3 }}
          />
             <Button variant="contained" color="primary" onClick={() => handleOpenProductDialog()}>
            Agregar Producto
          </Button>
          <List>
            {filteredProducts.map((product) => (
              <ListItem key={product.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box display="flex" alignItems="center">
                  <CardMedia
                    component="img"
                    image={product.imagePath || "/placeholder.jpg"}
                    sx={{ width: 60, height: 60, borderRadius: "5px", mr: 2 }}
                  />
                  <ListItemText primary={product.name} secondary={`$${product.price}`} />
                </Box>
                <Box>
                <IconButton onClick={() => handleOpenProductDialog(product)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(product)} color="error">
                <DeleteIcon />
              </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      {/* Modal de agregar/editar producto */}
      {/* Modal de agregar/editar producto */}
      <Dialog open={openProductDialog} onClose={handleCloseProductDialog}>
        <DialogTitle>{isEditing ? "Editar Producto" : "Agregar Producto"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Nombre"
            name="name"
            value={currentProduct.name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Precio"
            name="price"
            type="number"
            value={currentProduct.price}
            onChange={handleChange}
          />
          {/* Selector de Categoría */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Categoría</InputLabel>
            <Select
              name="category"
              value={currentProduct.category}
              onChange={handleChange}
            >
              <MenuItem value="Docenas || 1/2 docena">Docenas || 1/2 docena</MenuItem>
              <MenuItem value="3x5">3x5</MenuItem>
            </Select>
          </FormControl>

          {/* Campo para la descripción */}
          <TextField
            fullWidth
            margin="dense"
            label="Descripción"
            name="description"
            value={currentProduct.description}
            onChange={handleChange}
            multiline
            rows={2}
          />
           <input type="file" accept="image/*" onChange={handleImageChange} />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProductDialog} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={isEditing ? handleEditProduct : handleAddProduct}
            color="primary"
            variant="contained"
          >
            {isEditing ? "Guardar Cambios" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>
 {/* Modal de confirmación de eliminación */}
 <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>¿Eliminar Producto?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">Cancelar</Button>
          <Button onClick={handleDeleteProduct} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
      {/* Pestaña de Pedidos */}
      {tabIndex === 1 && (
        <Box>
          <Tabs value={orderTabIndex} onChange={(e, newIndex) => setOrderTabIndex(newIndex)} sx={{ mb: 2 }}>
            <Tab label="Pendientes" />
            <Tab label="Completados" />
          </Tabs>

          <TextField
            fullWidth
            label="Buscar pedido (N° de orden, nombre o correo)..."
            variant="outlined"
            value={searchOrderQuery}
            onChange={(e) => setSearchOrderQuery(e.target.value)}
            sx={{ mb: 3 }}
          />

          {selectedOrders.length > 0 && (
            <Button
              variant="contained"
              color={orderTabIndex === 0 ? "success" : "warning"}
              onClick={() => updateOrderStatus(orderTabIndex === 0 ? "Completado" : "Pendiente")}
              sx={{ mb: 2 }}
            >
              {orderTabIndex === 0 ? "Marcar como Completado" : "Marcar como Pendiente"}
            </Button>
          )}

          <List>
            {filteredOrders
              .filter((order) => (orderTabIndex === 0 ? order.status !== "Completado" : order.status === "Completado"))
              .map((order) => (
                <ListItem key={order.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => handleSelectOrder(order.id)}
                  />
                  <ListItemText
                    primary={`Pedido #${order.orderNumber} - ${order.userName}`}
                    secondary={`Total: $${order.totalAmount} - Estado: ${order.status || "Pendiente"}`}
                  />
                  <IconButton onClick={() => handleOpenOrderDialog(order)} color="primary">
                    <VisibilityIcon />
                  </IconButton>
                </ListItem>
              ))}
          </List>
        </Box>
      )}

     {/* Modal de detalles del pedido con dirección de entrega */}
     <Dialog open={openOrderDialog} onClose={handleCloseOrderDialog} fullWidth>
        <DialogTitle>Detalles del Pedido</DialogTitle>
        <DialogContent>
          {currentOrder && (
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Número de Pedido: {currentOrder.orderNumber}
              </Typography>
              <Typography variant="body1">Cliente: {currentOrder.userName}</Typography>
              <Typography variant="body1">Correo: {currentOrder.email}</Typography>
              <Typography variant="body1" fontWeight="bold" mt={2}>
                Dirección de Entrega:
              </Typography>
              <Typography variant="body2">
                {currentOrder.billingAddress.street1}, {currentOrder.billingAddress.city}
              </Typography>
              <Typography variant="body1" fontWeight="bold" mt={2}>
                Estado del Pedido: {currentOrder.status || "Pendiente"}
              </Typography>
              <Typography variant="body1" fontWeight="bold" mt={2}>
                Productos:
              </Typography>
              {currentOrder.products.map((product, index) => (
                <Card key={index} sx={{ display: "flex", mb: 2 }}>
                  <CardMedia
                    component="img"
                    image={product.imagePath || "/placeholder.jpg"}
                    sx={{ width: 80, height: 80, borderRadius: "5px", mr: 2 }}
                  />
                  <CardContent>
                    <Typography variant="body1" fontWeight="bold">{product.name}</Typography>
                    <Typography variant="body2">Cantidad: {product.count}</Typography>
                    <Typography variant="body2">Precio: ${product.price.toFixed(2)}</Typography>
                  </CardContent>
                </Card>
              ))}
              <Typography variant="h6" fontWeight="bold">
                Total: ${currentOrder.totalAmount.toFixed(2)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOrderDialog} color="secondary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageProducts;
