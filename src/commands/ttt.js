const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "ttt",

    async execute(message) {

        const opponent = message.mentions.users.first();

        if (!opponent) {
            return message.reply("❌ Mention a user to play.\nExample: `.ttt @user`");
        }

        if (opponent.bot) {
            return message.reply("❌ You cannot play against bots.");
        }

        const players = [message.author.id, opponent.id];
        let turn = 0;

        let board = [
            null, null, null,
            null, null, null,
            null, null, null
        ];

        function createBoard() {

            const rows = [];

            for (let i = 0; i < 3; i++) {

                const row = new ActionRowBuilder();

                for (let j = 0; j < 3; j++) {

                    const index = i * 3 + j;

                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId(index.toString())
                            .setLabel(board[index] ? board[index] : " ")
                            .setStyle(ButtonStyle.Secondary)
                    );

                }

                rows.push(row);
            }

            return rows;
        }

        const msg = await message.channel.send({
            content: `🎮 Tic Tac Toe\n❌ <@${players[0]}> vs ⭕ <@${players[1]}>\nTurn: <@${players[0]}>`,
            components: createBoard()
        });

        const filter = (i) => players.includes(i.user.id);

        const collector = msg.createMessageComponentCollector({
            filter,
            time: 600000
        });

        collector.on("collect", async (interaction) => {

            const index = parseInt(interaction.customId);

            if (interaction.user.id !== players[turn]) {
                return interaction.reply({
                    content: "❌ Not your turn!",
                    ephemeral: true
                });
            }

            if (board[index]) {
                return interaction.reply({
                    content: "❌ That spot is taken.",
                    ephemeral: true
                });
            }

            board[index] = turn === 0 ? "X" : "O";

            turn = turn === 0 ? 1 : 0;

            await interaction.update({
                content: `🎮 Tic Tac Toe\n❌ <@${players[0]}> vs ⭕ <@${players[1]}>\nTurn: <@${players[turn]}>`,
                components: createBoard()
            });

        });

    }
};