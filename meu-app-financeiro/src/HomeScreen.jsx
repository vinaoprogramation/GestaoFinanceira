
import { useNavigate } from 'react-router-dom';
import styles from './home.module.css';
import { useState, useEffect } from 'react';


import useUsuario from './Service/useUsuario';
import useBancario from './Service/useBancario';


import excluir from './assets/bin.png';
import editar from './assets/edit.png';
import adicionar from './assets/add.png';

function HomeScreen() {

  const consultaUsuario = useUsuario((state) => state.consultaUsuario);
  const usuario = useUsuario((state) => state.usuario);

  const setTela = useBancario((state) => state.setTela);
  const mostraTela = useBancario((state) => state.mostraTela);

  const mostrarInputConta = useBancario((state) => state.mostrarInputConta);
  const setInputConta = useBancario((state) => state.setInputConta);

  const navigate = useNavigate();

  const [nomeConta, setNomeConta] = useState("");
  const [saldoInicial, setSaldoInicial] = useState("");
  const [senha, setSenha] = useState("");

  const [senhaConta, setSenhaConta] = useState("");

  const [index, setIndex] = useState(null);

  const consultaConta = useBancario((state) => state.consultaConta);

  useEffect(() => {
    if (consultaUsuario) {
      consultaUsuario();
    }
  }, [consultaUsuario])

  const criaConta = useBancario((state) => state.criaConta);
  const consultaContas = useBancario((state) => state.consultaContas);
  const contas = useBancario((state) => state.contas);

  const cria = async (nome_conta, saldo_inicial, senha) => {
    if (!nome_conta || !saldo_inicial || !senha) {
      console.log("Faltam parâmetros (tela)")
      return;
    }

    const criando = await criaConta(nome_conta, saldo_inicial, senha);

    if (criando) {
      setNomeConta("");
      setSaldoInicial("");
      setSenha("");
      setTela();
      if (consultaContas) {
        consultaContas();
      }
    }
  }

  useEffect(() => {
    if (consultaContas) {
      consultaContas();
    }
  }, [consultaContas])

  function listarContas() {

    const listaContas = contas;

    const consultaConta = async (id, senha) => {
      if (!id || !senha) {
        console.log("Faltam parâmetros (tela)")
        return;
      }

      const consulta = await consultaConta(id, senha);
      if (consulta) {
        setSenha("");
        setInputConta();
        setIndex(null);
        alert("Conta autenticada com sucesso!")
      }
    }


    return <>

      <ul className={styles.lista}>

        {listaContas.map((conta, index) => <>
          <button key={index}
            className={styles.itemLista}
            onClick={() => {
              setInputConta();
              setIndex(conta.id_conta)
            }}
          >
            {conta.nome_conta}
          </button>

          <button className={styles.botaoImagem}>
            <img
              className={styles.imagem}
              src={editar}
              alt="Ícone editar"
            />
          </button>



          <button className={styles.botaoImagem}>
            <img
              className={styles.imagem}
              src={excluir}
              alt="Ícone excluir"
            />
          </button>


        </>)}
      </ul>
    </>;
  }


  return <>
    <section className={styles.main}>
      <div>
        <div className={styles.container}>
          <h1 className={styles.titulo}>Olá, {usuario?.nome} </h1>

          <div className={styles.conteudo}>
            <div className={styles.item}>
              {listarContas()}
            </div>
          </div>
        </div>


        <button className={styles.card}
          onClick={() => {
            setTela();
          }}
        >
          <img
            src={adicionar}
            className={styles.imagemAdicionar}
          />
        </button>
      </div>

      {
        mostraTela ?
          <>
            <div className={styles.tela}>
              <div className={styles.containerInput}>

                <div className={styles.inputs}>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Nome da conta (ex: Salário)"
                    value={nomeConta}
                    onChange={(e) => setNomeConta(e.target.value)}
                  />

                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Saldo Inicial (ex: 250,00)"
                    value={saldoInicial}
                    onChange={(e) => setSaldoInicial(e.target.value)}
                  />

                  <input
                    className={styles.input}
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </div>


                <div className={styles.botoes}>
                  <button
                    className={styles.botao}
                    onClick={() => {
                      setTela();
                    }}
                  >
                    <p className={styles.textoBotao}>Cancelar</p>
                  </button>

                  <button
                    className={`${styles.botao} ${styles.criar}`}
                    onClick={async () => {
                      cria(nomeConta, saldoInicial, senha)

                    }}
                  >
                    <p className={styles.textoBotao}>Criar</p>
                  </button>
                </div>



              </div>

            </div>

          </>
          :
          null
      }

      {
        mostrarInputConta ?
          <>
            <div className={styles.tela}>
              <div className={styles.containerInput}>

                <div className={styles.inputs}>
                  <input
                    className={styles.input}
                    type="password"
                    placeholder="Senha"
                    value={senhaConta}
                    onChange={(e) => setSenhaConta(e.target.value)}
                  />


                  <p>index: {index}</p>
                </div>


                <div className={styles.botoes}>
                  <button
                    className={styles.botao}
                    onClick={() => {
                      setInputConta();
                      setIndex(null);
                    }}
                  >
                    <p className={styles.textoBotao}>Cancelar</p>
                  </button>

                  <button
                    className={`${styles.botao} ${styles.criar}`}
                    onClick={async () => {
                      consultaConta(index, senhaConta)
                    }}
                  >
                    <p className={styles.textoBotao}>Entrar</p>
                  </button>
                </div>



              </div>

            </div>

          </>
          :
          null
      }




    </section>



  </>;
}

export default HomeScreen;


