import { create } from 'zustand';
import { storeToken, removeToken } from './authStorage';

import api from './api';

const BASE_URL = "http://localhost:3001"

const useBancario = create((set, get) => ({
    mostraTela: false,
    mostrarInputConta: false,
    contas: [],
    conta: null,

    consultaContas: async () => {

        try {
            const response = await api.get(`${BASE_URL}/buscar/contas`);

            const answer = await response.data;

            if (!answer) {
                console.log("Erro ao realizar consulta das contas")
                return;
            }

            if (answer.contas) {
                set({ contas: answer.contas })
            }

        } catch (error) {
            console.log("Erro ao realizar consulta do usuário: " + error)
        }


    },


    consultaConta: async (id, senha) => {

        console.log("yeah")

        try {
            const response = await api.post(`${BASE_URL}/auth/conta/${id}`,{
                senha: senha
            });

            const answer = await response.data;

            if (!answer) {
                console.log("Erro ao realizar consulta das contas")
                return;
            }

            if (answer.conta) {
                console.log(answer.conta)
                set({ conta: answer.conta })
            }

        } catch (error) {
            console.log("Erro ao realizar consulta do usuário: " + error)
        }


    },



    criaConta: async (nome_conta, saldo_inicial, senha) => {

        try {
            const response = await api.post(`${BASE_URL}/conta`, {
                nome_conta: nome_conta,
                saldo_inicial: saldo_inicial    ,
                senha: senha
            });

            const answer = await response.data;

            if (!answer) {
                console.log("Erro dentro da consulta do usuário")
                return;
            }

            return true;

        } catch (error) {
            console.log("Erro ao realizar consulta do usuário: " + error)
        }


    },


    setTela: () => {
        const tela = get().mostraTela 
        set({mostraTela: !tela})
    },

    setInputConta: () => {
        const input = get().mostrarInputConta 
        set({mostrarInputConta: !input})
    }

}));

export default useBancario;