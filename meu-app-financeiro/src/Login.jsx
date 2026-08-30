
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import { useState, useEffect } from 'react';

import useAutenticacao from './Service/useAutenticacao';

function Login() {
  const login = useAutenticacao((state) => state.login);
  const autenticado = useAutenticacao((state) => state.autenticado);

  const navigate = useNavigate();

  const navega = (email, senha) => {
    if(!email || !senha){
      console.log("Faltam parâmetros (tela)")
      return;
    }
    login(email, senha);
  } 

  useEffect(() => {
    if(autenticado){
      navigate('/home')
    }
  }, [autenticado, navigate])

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <section className={styles.main}>
      <div className={styles.formContainer}>

        <h2 className={styles.title}>Login</h2>

        <div className={styles.inputs}>
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

          <button className={`${styles.button} ${styles.loginButton}`}
          onClick={() => {
            navega(email, senha)
          }}
          >
            Login
          </button>

          <div className={styles.registerContainer}>
            <p className={styles.text}>
              Ainda não possui uma conta?
            </p>

            <button
              className={`${styles.button} ${styles.registerButton}`}
              onClick={() => navigate('/registro')}
            >
              Registre-se
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Login;

