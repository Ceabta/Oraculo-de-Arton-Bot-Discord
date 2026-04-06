import { REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
import ping from './commands/ping';
import addpersonagem from './commands/addpersonagem';
import verpersonagem from './commands/verpersonagem';
import atualizarstatus from './commands/atualizarstatus';
import listarpersonagens from './commands/listarpersonagens';
import deletarpersonagem from './commands/deletarpersonagem';
import buscarmagia from './commands/buscarmagia';

dotenv.config();

const commands = [
    ping.data.toJSON(),
    addpersonagem.data.toJSON(),
    verpersonagem.data.toJSON(),
    atualizarstatus.data.toJSON(),
    listarpersonagens.data.toJSON(),
    deletarpersonagem.data.toJSON(),
    buscarmagia.data.toJSON(),
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log('📦 Registrando comandos do Oráculo de Arton...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      { body: commands }
    );

    console.log('✅ Comandos registrados com sucesso!');
  } catch (error) {
    console.error(error);
  }
})();