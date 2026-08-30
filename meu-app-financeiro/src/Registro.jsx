
import { useNavigate } from 'react-router-dom';
import styles from './registro.module.css';
import { useState, useEffect } from 'react';

import useAutenticacao from './Service/useAutenticacao';

function Registro() {
  const registro = useAutenticacao((state) => state.registro);
  const autenticado = useAutenticacao((state) => state.autenticado);

  const navigate = useNavigate();

  const navega = (nome, email, senha) => {
    if (!nome || !email || !senha) {
      console.log("Faltam parâmetros (tela)")
      return;
    }
    registro(nome, email, senha);
  }

  useEffect(() => {
    if (autenticado) {
      navigate('/home')
    }
  }, [autenticado, navigate])

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <section className={styles.main}>
      <div className={styles.formContainer}>

        <h2 className={styles.title}>Registro</h2>

        <div className={styles.inputs}>

          <input
            className={styles.input}
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

        </div>

        <div className={styles.buttons}>

          <button className={`${styles.button} ${styles.registerButton}`}
          onClick={() => {
            navega(nome, email, senha)
          }}
          >
            Registre-se
          </button>

          <div className={styles.loginContainer}>
            <p className={styles.text}>
              Já possui uma conta?
            </p>

            <button
              className={`${styles.button} ${styles.loginButton}`}
              onClick={() => navigate('/')}
            >
              Login
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Registro;

