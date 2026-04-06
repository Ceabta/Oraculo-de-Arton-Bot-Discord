import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  ComponentType,
} from 'discord.js';
import { emojis } from '../emojis';
import magias from '../data/magias.json';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Aprimoramento {
  addPm: number;
  text: string;
}

interface Magia {
  nome: string;
  circulo: number;
  escola: string;
  suplemento: string;
  execucao?: string;
  alcance?: string;
  alvo?: string;
  area?: string;
  duracao?: string;
  resistencia?: string;
  descricao?: string;
  aprimoramentos?: Aprimoramento[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const escolaEmojis: Record<string, string> = {
  Abjur:  '🛡️',
  Adiv:   '🔮',
  Conv:   '✨',
  Encan:  '💫',
  Evoc:   '⚡',
  Ilusão: '🌀',
  Necro:  '💀',
  Trans:  '🔄',
};

const escolaNomes: Record<string, string> = {
  Abjur:  'Abjuração',
  Adiv:   'Adivinhação',
  Conv:   'Convocação',
  Encan:  'Encantamento',
  Evoc:   'Evocação',
  Ilusão: 'Ilusão',
  Necro:  'Necromancia',
  Trans:  'Transmutação',
};

/** Normaliza texto para comparação (remove acentos, minúsculas) */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/** Busca magias pelo nome (busca parcial, sem acento) */
function buscarMagias(query: string): Magia[] {
  const q = normalizar(query);
  return (magias as Magia[]).filter(m => normalizar(m.nome).includes(q));
}

/** Monta o embed com todas as informações da magia */
function montarEmbed(magia: Magia): EmbedBuilder {
  const emoji = escolaEmojis[magia.escola] ?? '🪄';
  const escolaNome = escolaNomes[magia.escola] ?? magia.escola;
  const circulo = magia.circulo ? `${magia.circulo}º Círculo` : '?';

  // Cabeçalho e cor por círculo
  const cores: Record<number, number> = {
    1: 0x3498db,
    2: 0x2ecc71,
    3: 0xe67e22,
    4: 0x9b59b6,
    5: 0xe74c3c,
  };
  const cor = cores[magia.circulo] ?? 0x95a5a6;

  const embed = new EmbedBuilder()
    .setTitle(`${emoji} ${magia.nome}`)
    .setColor(cor)
    .setFooter({ text: `${circulo} • ${escolaNome} • ${magia.suplemento ?? 'Tormenta 20'}` });

  // Linha de stats rápidos
  const stats: string[] = [];
  if (magia.execucao) stats.push(`⏱️ **Execução:** ${magia.execucao}`);
  if (magia.alcance)  stats.push(`📏 **Alcance:** ${magia.alcance}`);
  if (magia.alvo)     stats.push(`🎯 **Alvo:** ${magia.alvo}`);
  if (magia.area)     stats.push(`🗺️ **Área:** ${magia.area}`);
  if (magia.duracao)  stats.push(`⏳ **Duração:** ${magia.duracao}`);
  if (magia.resistencia) stats.push(`🎲 **Resistência:** ${magia.resistencia}`);

  if (stats.length) {
    embed.addFields({ name: '📋 Estatísticas', value: stats.join('\n'), inline: false });
  }

  // Descrição (truncada se muito longa)
  if (magia.descricao) {
    const desc = magia.descricao.length > 900
      ? magia.descricao.slice(0, 897) + '...'
      : magia.descricao;
    embed.addFields({ name: '📖 Descrição', value: desc, inline: false });
  }

  // Aprimoramentos
  if (magia.aprimoramentos && magia.aprimoramentos.length > 0) {
    const aprimTexto = magia.aprimoramentos
      .map(a => `**+${a.addPm} PM** — ${a.text}`)
      .join('\n');
    const truncado = aprimTexto.length > 1000
      ? aprimTexto.slice(0, 997) + '...'
      : aprimTexto;
    embed.addFields({ name: '⬆️ Aprimoramentos', value: truncado, inline: false });
  }

  return embed;
}

// ─── Comando ─────────────────────────────────────────────────────────────────

export default {
  data: new SlashCommandBuilder()
    .setName('buscarmagia')
    .setDescription('Busca informações de uma magia do Tormenta 20')
    .addStringOption(opt =>
      opt
        .setName('nome')
        .setDescription('Nome (ou parte do nome) da magia')
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const query = interaction.options.getString('nome', true).trim();
    const resultados = buscarMagias(query);

    // Nenhum resultado
    if (resultados.length === 0) {
      await interaction.reply({
        content: `${emojis.ficha} Nenhuma magia encontrada para **"${query}"**.\nVerifique o nome e tente novamente.`,
        ephemeral: true,
      });
      return;
    }

    // Resultado único → mostra direto
    if (resultados.length === 1) {
      await interaction.reply({ embeds: [montarEmbed(resultados[0])] });
      return;
    }

    // Muitos resultados (>25 é limite do select menu)
    if (resultados.length > 25) {
      await interaction.reply({
        content: `🔍 Encontrei **${resultados.length}** magias para **"${query}"**. Tente um nome mais específico.`,
        ephemeral: true,
      });
      return;
    }

    // Vários resultados → menu de seleção
    const opcoes = resultados.map(m => ({
      label: m.nome,
      description: `${m.circulo}º Círculo • ${escolaNomes[m.escola] ?? m.escola} • ${m.suplemento ?? 'T20'}`,
      value: m.nome,
    }));

    const menu = new StringSelectMenuBuilder()
      .setCustomId('selecionar_magia')
      .setPlaceholder('Escolha a magia...')
      .addOptions(opcoes);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);

    const reply = await interaction.reply({
      content: `🔍 Encontrei **${resultados.length}** magias para **"${query}"**. Qual você quer ver?`,
      components: [row],
      ephemeral: true,
    });

    // Aguarda a seleção por 30 segundos
    try {
      const selecionado = await reply.awaitMessageComponent({
        componentType: ComponentType.StringSelect,
        time: 30_000,
      }) as StringSelectMenuInteraction;

      const nomeSelecionado = selecionado.values[0];
      const magia = (magias as Magia[]).find(m => m.nome === nomeSelecionado);

      if (!magia) {
        await selecionado.update({ content: '❌ Magia não encontrada.', components: [] });
        return;
      }

      await selecionado.update({
        content: '',
        embeds: [montarEmbed(magia)],
        components: [],
      });
    } catch {
      // Timeout: remove o menu
      await interaction.editReply({
        content: '⏰ Tempo esgotado. Use `/buscarmagia` novamente.',
        components: [],
      });
    }
  },
};