import RestauranteRepository from "../repositories/RestauranteRepository";
import UsuarioRepository from "../repositories/UsuarioRepository";

class RestauranteController {
  async store(req, res) {
    const { nome, provedor, senha, email, endereco, categoria } = req.body;

    const aberto = true;
    const tipo_entrega = "rapida";
    const emailExists = await UsuarioRepository.verifyExistingEmail(email);

    if (!provedor) {
      return res.json({ error: "Cadastro do restaurante incompleto!" });
    }
    if (emailExists) {
      return res.json({ error: "Email existente!" });
    }

    const restaurante = await RestauranteRepository.criarRestaurante([
      nome,
      provedor,
      senha,
      email,
      endereco,
      categoria,
      aberto,
      tipo_entrega,
    ]);

    console.log(restaurante);

    return res.json({ restaurante: restaurante });
  }

  async index(req, res) {
    try {
      const restaurantes = await RestauranteRepository.findAll();
      return res.json({ restaurantes });
    } catch (err) {
      return res.json({ error: err });
    }
  }

  async show(req, res) {
    try {
      const restaurante = await RestauranteRepository.findOne(
        req.query.id_restaurante
      );
      return res.json({ restaurante });
    } catch (err) {
      return res.json({ error: err });
    }
  }

  async restauranteByName(req, res) {
    try {
      const restaurante = await RestauranteRepository.findRestauranteByName(
        req.body.nome_restaurante
      );

      return res.json({ restaurante });
    } catch (err) {
      return res.json({ error: err });
    }
  }

  async cardapio(req, res) {
    try {
      const cardapio = await RestauranteRepository.cardapio(
        req.query.id_restaurante
      );

      return res.json({ cardapio });
    } catch (err) {
      return res.json({ error: err });
    }
  }

  async comidaMaisPedia(req, res) {
    try {
      const comida = await RestauranteRepository.comidaMaisPedida(
        req.query.id_restaurante
      );

      return res.json({ comida });
    } catch (err) {
      return res.json({ error: err });
    }
  }

  async comidaMaisPedidaPedido(req, res) {
    try {
      const comida = await RestauranteRepository.comidaMaisPedidaPedido(
        req.query.id_restaurante
      );

      return res.json({ comida });
    } catch (err) {
      return res.json({ error: err });
    }
  }

  async allEntregaGratis(req, res) {
    try {
      const restaurantes = await RestauranteRepository.findAllEntregaGratis();

      return res.json({ restaurantes });
    } catch (err) {
      return res.json({ error: err });
    }
  }

  async allEntregaRapida(req, res) {
    try {
      const restaurantes = await RestauranteRepository.findAllEntregaRapida();

      return res.json({ restaurantes });
    } catch (err) {
      return res.json({ error: err });
    }
  }

  async restaurantesPopularesMoura(req, res) {
    try {
      const restaurantes = await RestauranteRepository.restaurantesPopularesMoura();

      return res.json({ restaurantes });
    } catch (err) {
      return res.json({ error: err });
    }
  }

  async popular(req, res) {
    try {
      const restaurantes = await RestauranteRepository.findAllPopular();

      return res.json({ restaurantes });
    } catch (err) {
      return res.json({ error: err });
    }
  }

  async precoMedio(req, res) {
    try {
      const comidas = await RestauranteRepository.precoMedio(
        req.query.id_restaurante
      );

      return res.json({ comidas });
    } catch (err) {
      return res.json({ error: err });
    }
  }

  async updateEntrega(req, res) {
    try {
      const restaurante = await RestauranteRepository.updateEntrega(
        req.body.id_restaurante,
        req.body.tipo_entrega
      );

      return res.json({ restaurante });
    } catch (err) {
      return res.json({ error: err });
    }
  }

  async updateStatus(req, res) {
    try {
      const restaurante = await RestauranteRepository.updateStatus(
        req.body.id_restaurante
      );

      return res.json({ restaurante });
    } catch (err) {
      return res.json({ error: err });
    }
  }
}

export default new RestauranteController();
