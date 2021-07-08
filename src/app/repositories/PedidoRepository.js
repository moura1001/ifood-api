import database from "../../database";

class PedidoRepository {
  async insertOne(id_restaurante, id_cliente, tipo_entrega, endereco_entrega) {
    try {
      const result = await database.client.query(
        `INSERT INTO pedido(id_restaurante, id_cliente, tipo_entrega, endereco_entrega) 
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [id_restaurante, id_cliente, tipo_entrega, endereco_entrega]
      );

      console.log(result.rows);
      return result.rows[0];
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async historicoCliente(id_cliente) {
    try {
      const result = await database.client.query(
        `
        SELECT pedido.id as id_pedido, * FROM pedido
        INNER JOIN usuario ON pedido.id_restaurante = usuario.id
        WHERE pedido.id_cliente = $1
        ORDER BY pedido.data DESC;
      `,
        [id_cliente]
      );
      return result.rows;
    } catch (err) {
      return err;
    }
  }

  async historicoRestaurante(id_restaurante) {
    try {
      const result = await database.client.query(
        `
        SELECT pedido.id as id_pedido, * FROM pedido
        INNER JOIN usuario ON pedido.id_cliente = usuario.id
        WHERE pedido.id_restaurante = $1
        ORDER BY pedido.data DESC;
      `,
        [id_restaurante]
      );
      return result.rows;
    } catch (err) {
      return err;
    }
  }

  async relatorioPorDia(dia) {
    try {
      const result = await database.client.query(
        `
      SELECT * FROM pedido
      WHERE pedido.data > CURRENT_DATE - interval '$1 day'
      ORDER BY pedido.data
      `,
        [dia]
      );
      return result.rows;
    } catch (err) {
      return err;
    }
  }

  async updatePrecototal(
    id_pedido,
    preco_total,
    preco_restaurante,
    preco_cliente
  ) {
    try {
      const result = await database.client.query(
        `
      UPDATE pedido
      SET preco_total = $2, preco_restaurante = $3, preco_cliente = $4
      WHERE id = $1 returning *;
      `,
        [id_pedido, preco_total, preco_restaurante, preco_cliente]
      );
      return result.rows;
    } catch (err) {
      return err;
    }
  }

  async comidasPedido(id_pedido) {
    try {
      const result = await database.client.query(
        `
        SELECT * FROM detalhes_pedido
        INNER JOIN comida ON detalhes_pedido.id_comida = comida.id
        WHERE detalhes_pedido.id_pedido = $1;
      `,
        [id_pedido]
      );
      return result.rows;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

export default new PedidoRepository();
