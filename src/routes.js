import express from "express";

const routes = new express.Router();

// import ClienteController from "./app/controllers/ClienteController";
import RestauranteController from "./app/controllers/RestauranteController";
import ClienteController from "./app/controllers/ClienteController";
import ComidaController from "./app/controllers/ComidaController";
import PedidoController from "./app/controllers/PedidoController";
import DetalhesPedidoController from "./app/controllers/DetalhesPedidoController";
import UsuarioController from "./app/controllers/UsuarioController";

routes.get("/", (req, res) => {
  return res.json({ ok: "ok" });
});

routes.get("/usuario", UsuarioController.show);

routes.post("/restaurante/criar", RestauranteController.store);
routes.post(
  "/restaurante/encontrarpornome",
  RestauranteController.restauranteByName
);
routes.get("/restaurante/listar", RestauranteController.index);
routes.get(
  "/restaurante/entregagratis",
  RestauranteController.allEntregaGratis
);
routes.get(
  "/restaurante/entregarapida",
  RestauranteController.allEntregaRapida
);
routes.get("/restaurante/cardapio", RestauranteController.cardapio);
routes.get("/restaurante/popular", RestauranteController.popular);
routes.get(
  "/restaurante/populares",
  RestauranteController.restaurantesPopularesMoura
);
routes.get("/restaurante/precomedio", RestauranteController.precoMedio);
routes.put("/restaurante/tipoentrega", RestauranteController.updateEntrega);
routes.put("/restaurante/status", RestauranteController.updateStatus);
routes.get(
  "/restaurante/comidamaispedida",
  RestauranteController.comidaMaisPedia
);
routes.get(
  "/restaurante/comidamaispedidapedido",
  RestauranteController.comidaMaisPedidaPedido
);
routes.get("/restaurante/:id_restaurante", RestauranteController.show);

routes.post("/comida/adicionarcomida", ComidaController.store);
routes.post("/comida/encontrarcomidapornome", ComidaController.comidaByName);
routes.get("/comida/promocao", ComidaController.comidaPromocao);
routes.get("/comida/listar", ComidaController.index);
routes.get("/comida/populares", ComidaController.comidasPopulares);
routes.put("/comida/delete", ComidaController.deleteFromCardapio);
routes.put("/comida/update", ComidaController.update);

routes.post("/cliente/criar", ClienteController.store);
routes.get("/cliente/listar", ClienteController.index);
routes.get("/cliente/:id_cliente", ClienteController.show);

routes.post("/pedido/criar", PedidoController.store);
routes.get(
  "/pedido/historicocliente",
  PedidoController.historicoPedidosCliente
);
routes.get(
  "/pedido/historicorestaurante",
  PedidoController.historicoPedidosRestaurante
);
routes.get("/pedido/comidas", PedidoController.comidasPedido);
routes.get("/pedido/relatorio", PedidoController.relatorioDia);
routes.put("/pedido/atualizarprecototal", PedidoController.updatePrecoPedido);

// lista pedidos de um determinado restaurante
// QUERY: id_restaurante
routes.get("/pedido/listar", PedidoController.store);

// id_pedido, id_comida, quantidade
routes.post("/detalhes_pedido/inserircomida", DetalhesPedidoController.store);

export default routes;
