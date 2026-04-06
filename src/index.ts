/*
* npx ts-node src/deploy-commands.ts -> Para registrar os comandos no Discord
* npx ts-node src/index.ts -> Para iniciar o bot
*/

import { Client, GatewayIntentBits, Interaction } from 'discord.js';
import * as dotenv from 'dotenv';
import ping from './commands/ping';
import addpersonagem from './commands/addpersonagem';
import verpersonagem from './commands/verpersonagem';
import atualizarstatus from './commands/atualizarstatus';
import listarpersonagens from './commands/listarpersonagens';
import deletarpersonagem from './commands/deletarpersonagem';
import buscarmagia from './commands/buscarmagia';

dotenv.config();

type Comando = {
  data: any;
  execute: (interaction: any) => Promise<void>;
};

const commands: Record<string, Comando> = {
    ping,
    addpersonagem,
    verpersonagem,
    atualizarstatus,
    listarpersonagens,
    deletarpersonagem,
    buscarmagia,
};

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once('ready', () => {
  console.log(`🔮 Oráculo de Arton online como ${client.user?.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands[interaction.commandName];
  if (command) {
    await command.execute(interaction);
  } else {
    await interaction.reply('❌ Comando não reconhecido.');
  }
});

client.login(process.env.DISCORD_TOKEN);