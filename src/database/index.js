import { Pool } from "pg";

class Database {
  constructor() {
    this.init();
  }

  async init() {
    this.client = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
      ssl: true,
    });

    this.client.connect();

    this.client.query(
      `
      DROP TABLE IF EXISTS usuario, pedido, comida, detalhes_pedido;

      CREATE TABLE IF NOT EXISTS usuario(
        id SERIAL PRIMARY KEY, 
        provedor BOOLEAN NOT NULL,
        nome VARCHAR(255) NOT NULL,
        senha VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        endereco VARCHAR(255) NOT NULL,
        categoria VARCHAR(255),
        aberto BOOLEAN,
        tipo_entrega VARCHAR(255)
      );
      
      CREATE TABLE IF NOT EXISTS comida(
        id SERIAL PRIMARY KEY,
        id_restaurante INTEGER NOT NULL, 
        nome VARCHAR(255) NOT NULL, 
        descricao TEXT NOT NULL,
        preco double precision DEFAULT 10 NOT NULL,
        promocao BOOLEAN DEFAULT FALSE,
        cardapio BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (id_restaurante) REFERENCES usuario(id)
      );

      CREATE TABLE IF NOT EXISTS pedido(
        id SERIAL PRIMARY KEY,
        id_cliente INTEGER NOT NULL, 
        id_restaurante INTEGER NOT NULL, 
        data TIMESTAMP NOT NULL DEFAULT NOW(),
        tipo_entrega VARCHAR(255),
        endereco_entrega VARCHAR(255),
        preco_total double precision NOT NULL DEFAULT 0,
        preco_cliente double precision NOT NULL DEFAULT 0,
        preco_restaurante double precision NOT NULL DEFAULT 0,
        frete double precision NOT NULL DEFAULT 2,
        FOREIGN KEY (id_cliente) REFERENCES usuario(id), 
        FOREIGN KEY (id_restaurante) REFERENCES usuario(id)
      );

      CREATE TABLE IF NOT EXISTS detalhes_pedido(
        id SERIAL PRIMARY KEY,
        id_pedido INTEGER NOT NULL, 
        id_comida INTEGER NOT NULL, 
        preco_comida double precision NOT NULL DEFAULT 10, 
        quantidade INTEGER NOT NULL DEFAULT 1,
        data TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (id_pedido) REFERENCES pedido(id),
        FOREIGN KEY (id_pedido) REFERENCES comida(id)
      );
    `,
      (err) => {
        if (!err) console.log("Database connected! \nTABELAS CRIADAS!");
        else console.log(err);

        this.seeds();
      }
    );
  }

  seeds() {
    this.client.query(
      `
      INSERT INTO usuario (nome, senha, email, endereco, provedor)
      VALUES ('Hudson', 1234, 'hudson@gmail.com', 'valentina', false),
              ('Bruno', 1234, 'bruno@gmail.com', 'mangabeira', false),
              ('Carlos', 1234, 'carlos@gmail.com', 'bessa', false),
              ('Moura', 1234, 'moura@gmail.com', 'bancarios', false);
    `,
      (err) => {
        if (!err) console.log("CLIENTES CRIADOS!");
        else console.log(err);
      }
    );

    this.client.query(
      `
      INSERT INTO usuario(nome, senha, email, endereco, provedor, categoria, aberto, tipo_entrega)
      VALUES 
      ('Akita', 1234, 'akita@gmail.com', 'bessa', true, 'japones', true, 'gratis'),
      ('China', 1234, 'china@gmail.com', 'estados', true, 'chines', true, 'gratis'),
      ('Dominos', 1234, 'dominos@gmail.com', 'estados', true, 'pizzaria', true, 'gratis'),
      ('Emporio', 1234, 'emporio@gmail.com', 'bancarios', true, 'popular', true, 'gratis'),
      ('Peixada', 1234, 'peixada@gmail.com', 'bancarios', true, 'popular', true, 'rapida'),
      ('Passagem', 1234, 'passagem@gmail.com', 'mangabeira', true, 'popular', true, 'rapida');

    `,
      (err) => {
        this.client.query(
          `
          INSERT INTO comida(id_restaurante, nome, preco, descricao)
          VALUES 
          (5, 'Sushi', 5.0, 'peça de peixe'),
          (5, 'Temaki', 20.0, 'temaki recheado'),
          (6, 'yakisoba', 5.0, 'macarrçao chines'),
          (6, 'polvo com camarão', 20.0, 'frutos do mar'),
          (7, 'Pizza de americana', 30.0, 'queijo, palmito, ervilha, ovo'),
          (7, 'Pizza de bacon', 29.0, 'catupiry, bacon'),
          (8, 'Arroz integral', 10.0, 'arroz'),
          (8, 'Arroz Branco', 10.0, 'arroz'),
          (8, 'Arroz com cenoura', 10.0, 'arroz'),
          (8, 'Carne cozida', 10.0, 'carne'),
          (8, 'Frango grelhado', 10.0, 'frango'),
          (9, 'Salmão frito', 10.0, 'peixe'),
          (9, 'Bacalhau frito', 10.0, 'peixe'),
          (9, 'Baiacu cozido', 10.0, 'peixe'),
          (10, 'Espaguete', 10.0, 'macarrão'),
          (10, 'churrasco', 10.0, 'carne'),
          (10, 'salada', 10.0, 'legumes');
        `,
          (err) => {
            this.client.query(
              `
              INSERT INTO pedido(id_cliente, id_restaurante, preco_total, preco_restaurante, preco_cliente)
              VALUES 
              (1, 7, 30, 30, 30),
              (2, 7, 288, 288, 288),
              (3, 8, 250, 250, 250),
              (3, 8, 60, 60, 60),
              (3, 8, 70, 70, 70);
            `,
              (err) => {
                this.client.query(
                  `
                INSERT INTO detalhes_pedido(id_pedido, id_comida, quantidade) 
                VALUES 
                (1, 5, 1),
                (2, 5, 7),
                (2, 6, 3),
                (3, 8, 5),
                (3, 7, 5),
                (3, 9, 15),
                (4, 9, 6),
                (5, 10, 7);
              `,
                  (err) => {
                    if (!err) console.log("DETALHES PEDIDOS CRIADOS!");
                    else console.log(err);
                  }
                );
                if (!err) console.log("PEDIDOS CRIADOS!");
                else console.log(err);
              }
            );
            if (!err) console.log("COMIDAS CRIADOS!");
            else console.log(err);
          }
        );

        if (!err) console.log("RESTAURANTES CRIADOS!");
        else console.log(err);
      }
    );
  }
}

export default new Database();
