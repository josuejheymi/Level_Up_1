import api from "../config/api";

export const productService = {
  getAll: async () => {
    const response = await api.get("/productos");
    return response.data;
  },
  create: async (productData) => {
    const response = await api.post("/productos", productData);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/productos/${id}`);
  }
};