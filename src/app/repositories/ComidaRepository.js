import database from "../../database";

class ComidaRepository {
  async insertOne(id_restaurante, nome, preco, descricao) {
    try {
      const result = await database.client.query(
        `INSERT INTO comida(id_restaurante, nome, preco, descricao) 
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [id_restaurante, nome, preco, descricao]
      );
      return result.rows[0];
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async updateOne(id_comida, nome, preco, descricao, promocao) {
    try {
      const result = await database.client.query(
        `
        UPDATE comida
        SET nome = $1, preco = $2, descricao = $3, promocao = $5
        WHERE id = $4 returning *;
        `,
        [nome, preco, descricao, id_comida, promocao]
      );

      result.rows[0];
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async deleteFromCardapio(id_comida) {
    try {
      const result = await database.client.query(
        `UPDATE comida
        SET cardapio = false
        WHERE id = $1 returning *; `,
        [id_comida]
      );
      return result.rows[0];
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async findMostPopularAntigo() {
    try {
      const result = await database.client.query(`
        SELECT comida.nome, id_comida, COUNT(*) AS VezesPedida, SUM(quantidade) AS QuantidadeDeComida, 
        usuario.nome AS NomeRestaurante, 
        usuario.id AS id_restaurante
        FROM detalhes_pedido
        INNER JOIN comida ON comida.id = detalhes_pedido.id_comida
        INNER JOIN pedido ON pedido.id = detalhes_pedido.id_pedido
        INNER JOIN usuario ON pedido.id_restaurante = usuario.id
        GROUP BY id_comida, comida.nome, usuario.nome, usuario.id
        ORDER BY QuantidadeDeComida DESC;
      `);

      return result.rows;
    } catch (err) {
      return err;
    }
  }

  async findMostPopular() {
    try {
      const result = await database.client.query(`
        SELECT comida.nome, id_comida, COUNT(*) AS VezesPedida, SUM(quantidade) AS QuantidadeDeComida, 
        usuario.nome AS NomeRestaurante, 
        usuario.id AS id_restaurante
        FROM detalhes_pedido
        INNER JOIN comida ON comida.id = detalhes_pedido.id_comida
        INNER JOIN pedido ON pedido.id = detalhes_pedido.id_pedido
        INNER JOIN usuario ON comida.id_restaurante = usuario.id
        WHERE usuario.aberto
        GROUP BY id_comida, comida.nome, usuario.nome, usuario.id
        ORDER BY QuantidadeDeComida DESC;
      `);
      console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async findMostPopularPedido() {
    try {
      const result = await database.client.query(`
        SELECT comida.nome, id_comida, COUNT(*) AS VezesPedida, SUM(quantidade) AS QuantidadeDeComida, 
        usuario.nome AS NomeRestaurante, 
        usuario.id AS id_restaurante
        FROM detalhes_pedido
        INNER JOIN comida ON comida.id = detalhes_pedido.id_comida
        INNER JOIN pedido ON pedido.id = detalhes_pedido.id_pedido
        INNER JOIN usuario ON comida.id_restaurante = usuario.id
        GROUP BY id_comida, comida.nome, usuario.nome, usuario.id
        ORDER BY VezesPedida DESC;
      `);
      console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async findComidaByName(nome_comida) {
    try {
      const result = await database.client.query(
        `
        SELECT comida.nome as comida_nome, * FROM comida
        INNER JOIN usuario
        ON comida.id_restaurante = usuario.id  
        WHERE usuario.aberto AND lower($1) SIMILAR TO lower(concat('%(', array_to_string(string_to_array(usuario.nome, ' '), '|'), '|', array_to_string(string_to_array(comida.nome, ' '), '|'),'|', array_to_string(string_to_array(comida.descricao, ' '), '|'), ')%'))
      `,
        [`%${nome_comida}%`]
      );

      return result.rows;
    } catch (err) {
      return err;
    }
  }

  async findComidaPromocao() {
    try {
      const result = await database.client.query(
        `
        SELECT *, usuario.nome as nome_restaurante, comida.nome as nome_comida FROM comida
        INNER JOIN usuario ON usuario.id = comida.id_restaurante
        WHERE usuario.aberto AND comida.promocao
      `
      );

      return result.rows;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

export default new ComidaRepository();
