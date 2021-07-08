import ComidaRepository from "../repositories/ComidaRepository";
import PedidoRepository from "../repositories/PedidoRepository";
import RestauranteRepository from "../repositories/RestauranteRepository";

class PedidoController {
  async store(req, res) {
    const { id_restaurante, id_cliente, tipo_entrega, endereco_entrega } = req.body;
    console.log("req pedido");
    console.log(req.body);
    const isOpen = await RestauranteRepository.verifyStatus(id_restaurante);

    if (!id_restaurante) {
      return res.status(404).json({ error: "É necessário escolher um restaurante" });
    }

    if (!id_cliente) {
      return res.status(404).json({ error: "É necessário ter um cliente" });
    }

    if(!isOpen){
      return res.json({ error: "Restaurante fechado. Não é possível finalizar o pedido." });
    }

    const pedido = await PedidoRepository.insertOne(
      id_restaurante,
      id_cliente,
      tipo_entrega,
      endereco_entrega
    );

    return res.json({ pedido });
  }

  async index(req, res) {
    const { id_restaurante } = req.body;

    if (!id_restaurante) {
      res.status(404).json({ error: "É necessário escolher um restaurante" });
    }

    const comidas = await ComidaRepository.findAll(1);

    return res.json({ comidas });
  }

  async historicoPedidosCliente(req, res) {
    const pedidos = await PedidoRepository.historicoCliente(
      req.query.id_cliente
    );

    return res.json({ pedidos });
  }

  async historicoPedidosRestaurante(req, res) {
    const pedidos = await PedidoRepository.historicoRestaurante(
      req.query.id_restaurante
    );

    return res.json({ pedidos });
  }

  async relatorioDia(req, res) {
    const relatorio1dia = await PedidoRepository.relatorioPorDia(1);
    const relatorio7dias = await PedidoRepository.relatorioPorDia(7);
    const relatorio30dias = await PedidoRepository.relatorioPorDia(30);

    return res.json({
      relatorio1dia,
      relatorio7dias,
      relatorio30dias,
    });
  }

  async updatePrecoPedido(req, res) {
    let { id_pedido, preco_total, tipo_entrega } = req.body;

    let preco_restaurante = preco_total;
    let preco_cliente = preco_total;

    if (tipo_entrega === "gratis") {
      preco_restaurante = preco_total - 2;
    }

    if (tipo_entrega === "rapida") {
      preco_total = preco_total + 2;
      preco_restaurante = preco_total;
      preco_cliente = preco_total;
    }

    const pedido = await PedidoRepository.updatePrecototal(
      id_pedido,
      preco_total,
      preco_restaurante,
      preco_cliente
    );

    return res.json({ pedido });
  }

  async comidasPedido(req, res) {
    const comidas = await PedidoRepository.comidasPedido(req.query.id_pedido);

    return res.json({ comidas });
  }
}

export default new PedidoController();
