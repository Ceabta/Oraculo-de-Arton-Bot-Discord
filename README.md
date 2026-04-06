# 🔮 Oráculo de Arton - Discord Bot

Um bot de Discord feito em TypeScript para campanhas de **Tormenta 20**! Gerencie fichas de personagem e consulte magias diretamente no servidor — ideal para campanhas online ou play-by-chat.

## ✨ Funcionalidades

- 📋 Adicionar personagens com atributos básicos (HP, Mana, Sanidade, Armadura, Situação)
- 📌 Visualizar todos os personagens cadastrados por usuário
- ♻️ Atualizar qualquer atributo do personagem (ex: HP, Mana)
- 🗑️ Deletar personagens com confirmação em 2 etapas
- 📖 Paginação automática ao listar muitos personagens
- 🔮 Buscar magias por nome com informações completas (círculo, escola, aprimoramentos e mais)
- 💾 Armazenamento local via arquivo JSON

---

## 🚀 Como usar

### ✅ Pré-requisitos

- Node.js 18+
- TypeScript
- Discord bot registrado com intents corretas

&nbsp;

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Copie o arquivo `.env.example` e renomeie para `.env`, preenchendo com suas credenciais.

3. Copie o arquivo `src/data/personagens.example.json` e renomeie para `personagens.json`:
   ```bash
   cp src/data/personagens.example.json src/data/personagens.json
   ```
   > Esse arquivo é onde os dados dos personagens são salvos. Ele **não será enviado ao GitHub**.

4. Execute o bot:
   ```bash
   npx ts-node src/index.ts
   ```

---

## 🔧 Comandos disponíveis

| Comando               | Descrição                                                              |
|-----------------------|------------------------------------------------------------------------|
| `/addpersonagem`      | Adiciona um novo personagem                                            |
| `/listarpersonagens`  | Lista os personagens do usuário com paginação                          |
| `/verpersonagem`      | Mostra os detalhes de um personagem específico                         |
| `/atualizar`          | Atualiza um ou mais atributos de um personagem                         |
| `/deletarpersonagem`  | Remove um personagem com confirmação por botão                         |
| `/buscarmagia`        | Busca uma magia do Tormenta 20 por nome (parcial, sem acento)          |
| `/ping`               | Verifica se o bot está online                                          |

---

## 🧱 Estrutura do Projeto

```
src/
├── commands/               # Comandos slash separados por arquivo
│   ├── addpersonagem.ts
│   ├── atualizarstatus.ts
│   ├── buscarmagia.ts
│   ├── deletarpersonagem.ts
│   ├── listarpersonagens.ts
│   └── verpersonagem.ts
├── data/
│   ├── magias.json           # 256 magias do Tormenta 20 e suplementos
│   └── personagens.json      # Armazena os personagens por usuário
├── deploy-commands.ts        # Script para registrar os comandos
├── emojis.ts                 # Emojis usados nos embeds
└── index.ts                  # Arquivo principal do bot
```

---

## 🪄 Magias disponíveis

O comando `/buscarmagia` cobre **256 magias** extraídas dos seguintes suplementos:

| Suplemento         | Magias |
|--------------------|--------|
| Tormenta 20        | 198    |
| Heróis de Arton    | 22     |
| Ameaças de Arton   | 7      |
| Deuses de Arton    | 29     |

A busca é por nome parcial e ignora acentos — `/buscarmagia armadura` retorna todas as magias com "armadura" no nome, de qualquer suplemento.

---

## 💾 Exemplo de estrutura JSON

```json
{
  "123456789012345678": {
    "Arthas": {
      "hp_total": 100,
      "hp_atual": 80,
      "mana": 50,
      "sanidade": 90,
      "armadura": 15,
      "situacao": "Vivo"
    }
  }
}
```

---

## 📷 Exemplo de visualização no Discord

<img width="903" height="406" alt="image" src="https://github.com/user-attachments/assets/e3dc971e-7bed-4677-bb75-804f23527cab" />


---

## 📦 Instalação local

```bash
git clone https://github.com/Ceabta/Ficha-RPG-Bot-Discord-TypeScript
cd Ficha-RPG-Bot-Discord-TypeScript
npm install
```

Edite o arquivo `.env` com seu token e ID de cliente:

```env
DISCORD_TOKEN=seu_token_aqui
CLIENT_ID=seu_id_de_aplicacao
```

---

## 🚀 Executando

```bash
npx ts-node src/deploy-commands.ts  # Registrar comandos (rode ao adicionar novos comandos)
npx ts-node src/index.ts            # Rodar o bot
```

---

## 🛡️ Licença

MIT © 2025 Leonardo Cesário
