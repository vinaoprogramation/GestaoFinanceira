import { create } from 'zustand';
import { storeToken, removeToken } from './authStorage';

import api from './api';

const BASE_URL = "http://localhost:3001"

const useAutenticacao = create((set, get) => ({
  autenticado: false,

  login: async (email, senha) => {
    if (!email || !senha) {
      console.log("Faltam parâmetros")
      return;
    }

    try {
      const response = await api.post(`${BASE_URL}/auth/usuario`, {
          email: email,
          senha: senha,

      });

      const answer = await response.data;

      if (!answer) {
        console.log("Erro dentro do processamento do login")
        return;
      }

      if (!answer.token) {
        console.log("Token não retornado")
        return;
      }

      const setToken = await storeToken(answer.token);

      console.log(setToken)

      if (setToken) {
        set({ autenticado: true })
      }

    } catch (error) {
      console.log("Erro ao realizar login: " + error)
    }


  },


  registro: async (nome, email, senha) => {
    if (!nome || !email || !senha) {
      console.log("Faltam parâmetros")
      return;
    }

    try {
      const response = await api.post(`${BASE_URL}/usuario`, {

          nome: nome,
          email: email,
          senha: senha,

      });

      const answer = await response.data;

      if (!answer) {
        console.log("Erro dentro do processamento do login")
        return;
      }

      get().login(email, senha);

    } catch (error) {
      console.log("Erro ao realizar login: " + error)
    }


  },


  logout: async () => {
    await removeToken();

    set({ autenticado: false })
  }
}));

export default useAutenticacao;