# app_expo_contatos

Este aplicativo é um gerenciador de contatos completo com autenticação, desenvolvido em **Expo**, **React Native** e **TypeScript**, utilizando o **Expo Router** para navegação. Ele conecta-se a uma API Node.js/MongoDB com suporte a GridFS.

## Principais Funcionalidades

* **Autenticação Segura:** Criação de conta e login protegidos com tokens JWT armazenados de forma criptografada usando `Expo SecureStore`.
* **CRUD Completo de Contatos:** Permite listar, adicionar, editar e excluir contatos com campos para nome, e-mail, telefone e endereço.
* **Upload e Exibição de Fotos:** Seleção de imagens da galeria (via `Expo ImagePicker`) enviadas para a API (`POST /upload`) e integradas ao GridFS do MongoDB (`GET /upload/:id`).
