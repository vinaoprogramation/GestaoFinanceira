import { create } from 'zustand';
import { storeToken, removeToken } from './authStorage';

import api from './api';

const BASE_URL = "http://localhost:3001"

const useUsuario = create((set, get) => ({

  usuario: null,

  consultaUsuario: async () => {

    try {
      const response = await api.get(`${BASE_URL}/consultar/eu`);

      const answer = await response.data;

      if (!answer) {
        console.log("Erro dentro da consulta do usuário")
        return;
      }

      if (answer.usuario) {
        set({ usuario: answer.usuario })
      }

    } catch (error) {
      console.log("Erro ao realizar consulta do usuário: " + error)
    }


  },

}));

export default useUsuario;