
import { useNavigate } from 'react-router-dom';
import styles from './home.module.css';
import { useState, useEffect } from 'react';


import useUsuario from './Service/useUsuario';
import useBancario from './Service/useBancario';
function HomeScreen() {

  const consultaUsuario = useUsuario((state) => state.consultaUsuario);
  const usuario = useUsuario((state) => state.usuario);

  const setTela = useBancario((state) => state.setTela);
  const mostraTela = useBancario((state) => state.mostraTela);

  const navigate = useNavigate();

  const [nomeConta, setNomeConta] = useState("");
  const [saldoInicial, setSaldoInicial] = useState("");
  const [senhaConta, setSenhaConta] = useState("");

  useEffect(() => {
    if (consultaUsuario) {
      consultaUsuario();
    }
  }, [consultaUsuario])

  return <>
    <section className={styles.main}>
      <div>
        <div className={styles.container}>
          <h1 className={styles.titulo}>Olá, {usuario?.nome} </h1>

          <div className={styles.conteudo}>
            <div className={styles.item}>
              <p className={styles.textoItem}>{usuario?.saldo}</p>
            </div>
          </div>
        </div>


        <button className={styles.card}
          onClick={() => {
            setTela();
          }}
        >
          <p className={styles.texto}>Adicionar conta</p>
        </button>
      </div>

      {
        mostraTela ?
          <>
            <div className={styles.tela}>
              <div className={styles.containerInput}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Nome da conta (ex: Salário)"
                />

                <input
                  className={styles.input}
                  type="text"
                  placeholder="Saldo Inicial (ex: 250,00)"
                />

                <input
                  className={styles.input}
                  type="password"
                  placeholder="Senha"
                />

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

    </section>



  </>;
}

export default HomeScreen;

