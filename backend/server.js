const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:5173'
}

const app = express();
app.use(express.json());
app.use(cors(corsOptions))


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'escola',
  database: 'gestao_financeira_db'
});





const middleware = (async (req, res, next) => {
  const tokenInteiro = req.headers.authorization;

  if (!tokenInteiro) {
    return res.json({
      mensagem: "Token não informado"
    });
  }

  const token = tokenInteiro.split(" ")[1];

  if (!token) {
    return res.json({
      mensagem: "Formato de token inválido"
    });
  }

  try {
    const verificaToken = await jwt.verify(token, '12345');

    if (!verificaToken) {
      return res.json({
        mensagem: "Token inválido"
      })
    }
    next();
  } catch (error) {
    return res.json({
      mensagem: `Erro interno no middleware ${error}`
    })
  }




})

const adicionaExtrato = async (req, res, id_conta, tipo, valor, descricao) => {

  if (!tipo || !valor || !descricao || !id_conta) {
    console.log("Parâmtros inválidos ou faltosos")
    return;
  }

  const tokenInteiro = req.headers.authorization;

  if (!tokenInteiro) {
    console.log("Token não informado")
    return;
  }

  const token = tokenInteiro.split(" ")[1];

  const payload = jwt.decode(token, "1234");

  const id = payload.id;

  const buscaUsuarioSql = "SELECT * FROM usuario WHERE id_usuario = ?";

  const buscaUsuario = await pool.execute(buscaUsuarioSql, [id]);

  if (buscaUsuario[0] == "") {
    console.log("Usuário não encontrado")
    return;
  }

  const insereExtratoQuery = "CALL adicionar_item_extrato(?, ?, ?, ?, ?)";

  const insereExtrato = await pool.execute(insereExtratoQuery, [id, id_conta, tipo, valor, descricao]);

  if (!insereExtrato) {
    console.log("Erro ao inserir extrato");
    return;
  }

  return true;

};


app.get("/", (req, res) => {
  return res.json({
    mensagem: "Rota base"
  })
});

app.post("/usuario", async (req, res) => {

  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.json({
      mensagem: "Preencha todos os campos"
    })
  }

  try {
    const verificaExistenciaSql = "SELECT email FROM usuario WHERE email = ?";

    const verificaExistencia = await pool.execute(verificaExistenciaSql, [email]);


    if (verificaExistencia[0] != "") {
      return res.json({
        mensagem: "Já existe um usuário cadastrado com esse email"
      });
    }

    const hash = await bcrypt.hash(senha, 10);

    const sql = "INSERT INTO usuario (nome_usuario, email, senha) VALUES (?, ?, ?)";

    const insere = await pool.execute(sql, [nome, email, hash]);


    if (!insere) {
      return res.json({
        mensagem: "Erro ao cadastrar usuário"
      })
    }

    return res.json({
      mensagem: "Usuário cadastrado com sucesso",
      nome,
      email,
    })
  } catch (error) {
    return res.status(500).json({
      mensagem: `Erro interno ao cadastrar usuário ${error}`
    })
  }
});


app.post("/auth/usuario", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.json({
      mensagem: "Preencha todos os campos"
    });
  }

  const verificaEmailSql = "SELECT id_usuario, email, senha FROM usuario WHERE email = ?";

  const verificaEmail = await pool.execute(verificaEmailSql, [email]);

  if (verificaEmail[0] == "") {
    return res.json({
      mensagem: "Usuário não encontrado"
    });
  }

  const senhaBuscada = verificaEmail[0][0]?.senha;

  if (!senhaBuscada) {
    return res.json({
      mensagem: "Erro ao buscar a senha do usuário"
    });
  }

  const verificaSenha = await bcrypt.compare(senha, senhaBuscada);

  if (!verificaSenha) {
    return res.json({
      mensagem: "Email ou senha incorretos"
    });
  }

  const id = verificaEmail[0][0]?.id_usuario

  const payload = {
    id: id,
    email: email,
  }

  const token = jwt.sign(payload, '12345');

  return res.json({
    mensagem: "Usuário autenticado com sucesso!",
    token: token,
  })
});



app.get("/consultar/eu", middleware, async (req, res) => {
  const tokenInteiro = req.headers.authorization;

  if (!tokenInteiro) {
    return res.json({
      mensagem: "Token não informado"
    });
  }

  const token = tokenInteiro.split(" ")[1];

  const payload = jwt.decode(token, "1234");

  const id = payload.id;

  const buscaUsuarioSql = "SELECT * FROM usuario WHERE id_usuario = ?";

  const buscaUsuario = await pool.execute(buscaUsuarioSql, [id]);

  if (buscaUsuario[0] == "") {
    return res.json({
      mensagem: "Usuário não encontrado"
    })
  }

  if (!buscaUsuario[0][0].nome_usuario || !buscaUsuario[0][0].email || !buscaUsuario[0][0].senha) {
    return res.json({
      mensagem: "Usuário fragmentado"
    })
  }

  const usuario = {
    nome: buscaUsuario[0][0].nome_usuario,
    email: buscaUsuario[0][0].email,
  };

  return res.json({
    mensagem: "Usuário buscado com sucesso",
    usuario
  })
});


app.get("/buscar/contas", middleware, async (req, res) => {
  const tokenInteiro = req.headers.authorization;

  if (!tokenInteiro) {
    return res.json({
      mensagem: "Token não informado"
    });
  }

  const token = tokenInteiro.split(" ")[1];

  const payload = jwt.decode(token, "1234");

  const id = payload.id;

  const buscaUsuarioSql = "SELECT * FROM usuario WHERE id_usuario = ?";

  const buscaUsuario = await pool.execute(buscaUsuarioSql, [id]);

  if (buscaUsuario[0] == "") {
    return res.json({
      mensagem: "Usuário não encontrado"
    })
  }

  const buscaContasUsuarioQuery = "SELECT nome_conta, id_conta FROM conta WHERE id_usuario = ?";

  const buscaContasUsuario = await pool.execute(buscaContasUsuarioQuery, [id]);

  if (buscaContasUsuario[0] == "") {
    return res.json({
      mensagem: "Nenhuma conta encontrada",
      numero_contas: 0
    })
  }

  return res.json({
    mensagem: "Contas buscadas com sucesso",
    numero_contas: buscaContasUsuario[0].length,
    contas: buscaContasUsuario[0]
  })

});


app.post("/auth/conta/:id", middleware, async (req, res) => {
  const { senha } = req.body;
  const id_conta = req.params.id

  if (!senha || !id_conta) {
    return res.json({
      mensagem: "Senha ou conta não informada"
    })
  }

  const tokenInteiro = req.headers.authorization;

  if (!tokenInteiro) {
    return res.json({
      mensagem: "Token não informado"
    });
  }

  const token = tokenInteiro.split(" ")[1];

  const payload = jwt.decode(token, "1234");

  const id = payload.id;

  const buscaUsuarioSql = "SELECT * FROM usuario WHERE id_usuario = ?";

  const buscaUsuario = await pool.execute(buscaUsuarioSql, [id]);

  if (buscaUsuario[0] == "") {
    return res.json({
      mensagem: "Usuário não encontrado"
    })
  }

  const buscaContaQuery = "SELECT id_conta, nome_conta, senha, saldo, numero_conta FROM conta WHERE id_conta = ? AND id_usuario = ?";

  const buscaConta = await pool.execute(buscaContaQuery, [id_conta, id]);

  if (buscaConta[0] == "") {
    return res.json({
      mensagem: "Conta não existe ou não pertence ao usuário"
    });
  }

  const senhaDb = buscaConta[0][0].senha;

  const verificaSenha = await bcrypt.compare(senha, senhaDb);

  if (!verificaSenha) {
    return res.json({
      mensagem: "Senha incorreta"
    })
  }

  const nome = buscaConta[0][0].nome_conta;
  const saldo = buscaConta[0][0].saldo;
  const numero_conta = buscaConta[0][0].numero_conta;

  return res.json({
    mensagem: "Autencicação realizada com sucesso",
    conta: {
      nome_conta: nome,
      saldo: saldo,
      numero_conta: numero_conta,
    }
  })

});




app.get("/extrato/:numero", middleware, async (req, res) => {
  const { senha } = req.body;
  const id_conta = req.params.id

  if (!senha || !id_conta) {
    return res.json({
      mensagem: "Senha ou conta não informada"
    })
  }

  const tokenInteiro = req.headers.authorization;

  if (!tokenInteiro) {
    return res.json({
      mensagem: "Token não informado"
    });
  }

  const token = tokenInteiro.split(" ")[1];

  const payload = jwt.decode(token, "1234");

  const id = payload.id;

  const buscaUsuarioSql = "SELECT * FROM usuario WHERE id_usuario = ?";

  const buscaUsuario = await pool.execute(buscaUsuarioSql, [id]);

  if (buscaUsuario[0] == "") {
    return res.json({
      mensagem: "Usuário não encontrado"
    })
  }


})

app.post("/conta", middleware, async (req, res) => {

  const { nome_conta, saldo_inicial, senha } = req.body


  const tokenInteiro = req.headers.authorization;

  if (!tokenInteiro) {
    return res.json({
      mensagem: "Token não informado"
    });
  }

  const token = tokenInteiro.split(" ")[1];

  const payload = jwt.decode(token, "1234");

  const id = payload.id;


  const verificaNomeContaQuery = "SELECT nome_conta FROM conta WHERE nome_conta = ? AND id_usuario = ?";

  const verificaNomeConta = await pool.execute(verificaNomeContaQuery, [nome_conta, id]);

  if (verificaNomeConta[0] != "") {
    return res.json({
      mensagem: "Já existe uma conta com esse nome."
    })
  }

  if (saldo_inicial < 0) {
    return res.json({
      mensagem: "O saldo inicial não pode ser negativo"
    })
  }

  const hash = await bcrypt.hash(senha, 10);

  if (!hash) {
    return res.json({
      mensagem: "Erro ao encriptar senha"
    })
  }

  const criaContaQuery = "INSERT INTO conta (nome_conta, numero_conta, saldo, senha, id_usuario) VALUES (?, FLOOR(RAND() * (9999 - 1000 + 1)), ?, ?, ?)";

  const criaConta = await pool.execute(criaContaQuery, [nome_conta, saldo_inicial, hash, id]);

  if (!criaConta) {
    return res.json({
      mensagem: "Erro interno ao criar conta"
    });
  }

  const procuraTitularContaQuery = "SELECT nome_usuario FROM usuario WHERE id_usuario = ?";

  const procuraTitularConta = await pool.execute(procuraTitularContaQuery, [id]);

  if (procuraTitularConta[0] == "") {
    return res.json({
      mensagem: "Erro ao criar a conta(cadastro de usuário errado)"
    })
  }

  const nome = procuraTitularConta[0][0].nome_usuario

  return res.json({
    mensagem: "Conta criada com sucesso!",
    nome: nome_conta,
    titular: nome
  });

})

app.patch("/conta/:id/saldo", middleware, async (req, res) => {
  const { movimentacao, tipo, descricao } = req.body;
  const id_conta = req.params.id;

  if (!movimentacao || !tipo || !descricao) {
    return res.json({
      mensagem: "Faltam Parâmetros"
    })
  }

  if (movimentacao == 0) {
    return res.json({
      mensagem: "A movimentação deve ser de depósito ou saque"
    })
  }

  const verificaIdContaQuery = "SELECT id_conta FROM conta WHERE id_conta = ?";

  const verificaIdConta = await pool.execute(verificaIdContaQuery, [id_conta]);

  if (verificaIdConta[0] == "") {
    return res.json({
      mensagem: "Conta não existe"
    })
  }

  const verificaSaldoQuery = "SELECT saldo FROM conta WHERE id_conta = ?"

  const verificaSaldo = await pool.execute(verificaSaldoQuery, [id_conta]);

  if (verificaSaldo[0] == "") {
    return res.json({
      mensagem: "Erro ao consultar saldo"
    })
  }



  const saldo = parseInt(verificaSaldo[0][0].saldo)

  if (movimentacao < 0 && saldo < (movimentacao * -1)) {
    return res.json({
      mensagem: "Saldo insuficiente"
    })
  }

  const saldoAtualizado = saldo + parseInt(movimentacao)

  const realizaMovimentacaQuery = "UPDATE conta SET saldo = ? WHERE id_conta = ?";

  const realizaMovimentacao = await pool.execute(realizaMovimentacaQuery, [saldoAtualizado, id_conta]);

  if (realizaMovimentacao[0] == "") {
    return res.json({
      mensagem: "Erro interno ao realizar movimentação"
    })
  };

  const saldoNovo = parseInt(saldo) + parseInt(movimentacao);

  const extrato = await adicionaExtrato(req, res, id_conta, tipo, movimentacao, descricao);

  if (!extrato) {
    return res.json({
      mensagem: "Operação realizada com sucesso, mas erro ao adicionar extrato.",
      movimentacao: movimentacao,
      saldo_atual: saldoNovo,
    })
  }

  return res.json({
    mensagem: "Movimentação realizada com sucesso!",
    movimentacao: movimentacao,
    tipo: tipo,
    descricao: descricao,
    saldo_atual: saldoNovo,
  })

});

app.patch("/conta/transfere/:id", middleware, async (req, res) => {
  const { valor, conta_destino } = req.body;
  const id_conta = req.params.id;


  if (valor <= 0) {
    return res.json({
      mensagem: "A transferência deve ter um valor positivo"
    })
  }

  const verificaIdContaQuery = "SELECT id_conta FROM conta WHERE id_conta = ?";



  const verificaIdConta = await pool.execute(verificaIdContaQuery, [id_conta]);


  if (verificaIdConta[0] == "") {
    return res.json({
      mensagem: "Conta não existe"
    })
  }


  const verificaContaDestinoQuery = "SELECT id_conta FROM conta WHERE id_conta = ?";

  const verificaContaDestino = await pool.execute(verificaContaDestinoQuery, [conta_destino]);


  if (verificaContaDestino[0] == "") {
    return res.json({
      mensagem: "Conta Destino não existe"
    })
  }

  const verificaSaldoQuery = "SELECT saldo FROM conta WHERE id_conta = ?"

  const verificaSaldo = await pool.execute(verificaSaldoQuery, [id_conta]);

  if (verificaSaldo[0] == "") {
    return res.json({
      mensagem: "Erro ao consultar saldo"
    })
  }

  const saldo = parseInt(verificaSaldo[0][0].saldo)


  if (saldo < valor) {
    return res.json({
      mensagem: "Saldo insuficiente"
    })
  }


  const realizaMovimentacaoOrigemQuery = "UPDATE conta SET saldo = saldo - ?  WHERE id_conta = ?";

  const realizaMovimentacaoOrigem = await pool.execute(realizaMovimentacaoOrigemQuery, [valor, id_conta]);

  if (realizaMovimentacaoOrigem[0] == "") {
    return res.json({
      mensagem: "Erro ao retirar valor da conta de origem"
    })
  }


  const realizaMovimentacaoDestinoQuery = "UPDATE conta SET saldo = saldo + ?  WHERE id_conta = ?";

  const realizaMovimentacaoDestino = await pool.execute(realizaMovimentacaoDestinoQuery, [valor, conta_destino]);

  if (realizaMovimentacaoDestino[0] == "") {
    return res.json({
      mensagem: "Erro enviar valor à conta de destino"
    })
  };

  const saldoNovo = parseInt(saldo) - parseInt(valor);



  return res.json({
    mensagem: "Transferência realizada com sucesso!",
    conta_origem: id_conta,
    saldo_atual: saldoNovo,
    conta_destino: conta_destino

  })



})

app.listen(3001, (req, res) => {
  console.log("Servidor rodando na porta 3001")
})
