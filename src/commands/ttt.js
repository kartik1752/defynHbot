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

        if (opponent.id === message.author.id) {
            return message.reply("❌ You cannot play with yourself.");
        }

        const players = [message.author.id, opponent.id];
        let turn = 0;

        let board = Array(9).fill(null);

        function checkWinner() {
            const wins = [
                [0,1,2],[3,4,5],[6,7,8],
                [0,3,6],[1,4,7],[2,5,8],
                [0,4,8],[2,4,6]
            ];

            for (const [a,b,c] of wins) {
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    return board[a];
                }
            }

            if (board.every(cell => cell !== null)) return "draw";

            return null;
        }

        function createBoard(disabled = false) {

            const rows = [];

            for (let i = 0; i < 3; i++) {

                const row = new ActionRowBuilder();

                for (let j = 0; j < 3; j++) {

                    const index = i * 3 + j;

                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId(index.toString())
                            .setLabel(board[index] ? board[index] : "⬜")
                            .setStyle(
                                board[index] === "X"
                                    ? ButtonStyle.Danger
                                    : board[index] === "O"
                                    ? ButtonStyle.Primary
                                    : ButtonStyle.Secondary
                            )
                            .setDisabled(disabled || board[index] !== null)
                    );

                }

                rows.push(row);
            }

            return rows;
        }

        const msg = await message.channel.send({
            content: `🎮 **Tic Tac Toe**\n❌ <@${players[0]}> vs ⭕ <@${players[1]}>\nTurn: <@${players[0]}>`,
            components: createBoard()
        });

        const collector = msg.createMessageComponentCollector({
            time: 300000
        });

        collector.on("collect", async (interaction) => {

            if (!players.includes(interaction.user.id)) {
                return interaction.reply({
                    content: "❌ You are not part of this game.",
                    ephemeral: true
                });
            }

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

            const result = checkWinner();

            if (result) {

                collector.stop();

                if (result === "draw") {

                    return interaction.update({
                        content: "🤝 **Game ended in a draw!**",
                        components: createBoard(true)
                    });

                } else {

                    const winner = result === "X" ? players[0] : players[1];

                    return interaction.update({
                        content: `🏆 <@${winner}> **wins the game!**`,
                        components: createBoard(true)
                    });

                }

            }

            turn = turn === 0 ? 1 : 0;

            await interaction.update({
                content: `🎮 **Tic Tac Toe**\n❌ <@${players[0]}> vs ⭕ <@${players[1]}>\nTurn: <@${players[turn]}>`,
                components: createBoard()
            });

        });

        collector.on("end", async () => {

            if (!msg.editable) return;

            await msg.edit({
                content: "⌛ Game expired.",
                components: createBoard(true)
            });

        });

    }
};