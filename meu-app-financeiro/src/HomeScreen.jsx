
import { useNavigate } from 'react-router-dom';
import styles from './home.module.css';
import { useState, useEffect } from 'react';

function HomeScreen() {
  const navigate = useNavigate();

  return (
    <section className={styles.main}>
      <div>
        <div>
          <h1>Saldo Atual: </h1>
        </div>
      </div>
      

    </section>
  );
}

export default HomeScreen;

