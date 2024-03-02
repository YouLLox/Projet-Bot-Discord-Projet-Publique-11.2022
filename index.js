const Discord = require('discord.js');
const client = new Discord.Client({ intents: [3276799] });
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const { token, color_wrong, color_good, color_base, color_stop, prefix, logs, image, rules, benevole, noble, helper, moderateur, responsable, communauté, warn, level } = require('./config.json');
const chalk = require('chalk');
const Database = require("easy-json-database")
const database = require('./db/database.json');
const db = { database: new Database('./db/database.json') }
const emoji = require("./db/emoji.json")
const general = require('./db/general.json')
const synchronizeSlashCommands = require('@frostzzone/discord-sync-commands');
const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonStyle, Colors, channelLink, TextInputStyle, ImageFormat, PermissionFlagsBits, ChannelFlags, ChannelType, messageLink } = require('discord.js');



//Slashs Commands \\\
synchronizeSlashCommands(client, [{
    name: 'Renvoyer de la classe',
    type: 2,
}, {
    name: 'Transférer la classe',
    type: 2,
}, {
    name: 'Fermer cette classe',
    type: 2,
}, {
    name: 'blacklist',
    description: "Permet de blacklist un utilisateur des systèmes du bot.",
    options: [{
        type: 6,
        name: 'utilisateur',
        description: 'Sélectionner un utilisateur.',
        required: true,
    }, {
        type: 3,
        name: 'raison',
        description: 'Raison du blacklist.',
        required: true,
    }]
}, {
    name: 'unblacklist',
    description: "Permet de retirer de la blacklist un utilisateur.",
    options: [{
        type: 6,
        name: 'utilisateur',
        description: 'Sélectionner un utilisateur.',
        required: true,
    }, {
        type: 3,
        name: 'raison',
        description: 'Raison du unblacklist.',
        required: true,
    }]
}, {
    name: 'inviter',
    description: "Inviter un membre dans votre classe privée.",
    options: [{
        type: 6,
        name: 'utilisateur',
        description: 'Sélectionner un utilisateur.',
        required: true,
    }]
}, {
    name: 'transfer',
    description: "Nommer une autre personne que vous professeur.",
    options: [{
        type: 6,
        name: 'utilisateur',
        description: 'Sélectionner un utilisateur.',
        required: true,
    }]
}, {
    name: 'renvoyer',
    description: "Expuler un membre de votre classe privée.",
    options: [{
        type: 6,
        name: 'utilisateur',
        description: 'Sélectionner un utilisateur.',
        required: true,
    }]
}, {
    name: 'quitter',
    description: 'Quitter une classe.',
}, {
    name: 'admin_inviter',
    description: 'Permet d\'administrer les classes',
    options: [{
        type: 6,
        name: 'utilisateur',
        description: 'Sélectionner un utilisateur.',
        required: true,
    }]
}], {
    debug: false

});



client.on('ready', async () => {

    client.user.setPresence({ activities: [{ name: 'Faire ses devoirs' }], status: 'ready' });

    console.log(chalk.blue(`${client.user.tag} est maintenant en ligne et disponible pour tous les serveurs/utilisateurs !`))

});

client.on('messageCreate', async (message) => {

    if (!(db.database.has(String(message.author.id + "-blacklist")))) {
        if (!((message.author).bot)) {


            db.database.add(String(message.author.id + "-xp"), 10)

            if ((db.database.get(String(message.author.id + "-xp"))) >= 50) {
                db.database.add(String(message.author.id + "-level"), 1)

                var embed = new EmbedBuilder()
                    .setColor(color_base)
                    .setDescription(`${emoji.stars} **〢 L'utilisateur ${message.author} est passé au niveau \` ${db.database.get(String(message.author.id + "-level"))} \` !**`)

                message.guild.channels.cache.get(level).send({ embeds: ([embed]) })

            }
        }
    }

    if (message.content == prefix + "rc_panel") {
        if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

            message.delete()

            var embed = new EmbedBuilder()
                .setColor(color_base)
                .setTitle(`${emoji.rank} | Rejoindre notre équipe`)
                .setImage(image)
                .setDescription(`**\`\`\`Remplissez un petit formulaire et devenez Helper ou Bénévole !\`\`\`**\n> ${emoji.fire} 〢 *Attention, pour rejoindre nos rangs vous devez correspondre à certains critères disponibles en appuyant sur le bouton "Critères". En cas de non-respect de ces critères, votre candidature sera refusée !*`)

            const benevole_join = new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(emoji.flags)
                .setLabel("Bénévole")
                .setCustomId("benevole_join")

            const equipe_join = new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(emoji.rank)
                .setLabel("Equipier")
                .setCustomId("equipe_join")

            const criteres = new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(emoji.search)
                .setLabel("Critères")
                .setCustomId("criteres")

            const menu_rc = new ActionRowBuilder()
                .addComponents(benevole_join)
                .addComponents(equipe_join)
                .addComponents(criteres)

            message.channel.send({ embeds: ([embed]), components: [menu_rc] })

        } else {

            var embed = new EmbedBuilder()
                .setColor(color_wrong)
                .setDescription(emoji.wrong + general.permission_admin)

            message.reply({
                embeds: ([embed])
            }).then(async (response) => {
                await delay(Number(5) * 1000)
                await response.delete()
            })
        }
    }

    if (message.content == prefix + "class_panel") {
        if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

            var embed = new EmbedBuilder()
                .setColor(color_base)
                .setTitle(`${emoji.drink} | Ouvrir une classe`)
                .setDescription(`**\`\`\`Ouvrez une classe rien qu'a vous afin de poser vos questions à la communauté, devenez professeur et modérez votre classe !\`\`\`**\n> ${emoji.fire} 〢 *Attention, dans les classes, le règlement disponible dans <#${rules}> doit être respecté !*`)
                .setImage(image)

            const add_class = new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(emoji.conference)
                .setLabel("Ouvrir une classe")
                .setCustomId("add_class")

            const add_class_vocal = new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(emoji.sound)
                .setLabel("Ouvrir un vocal")
                .setCustomId("add_class_vocal")

            const class_panel = new ActionRowBuilder()
                .addComponents(add_class)
                .addComponents(add_class_vocal)

            message.channel.send({ embeds: ([embed]), components: [class_panel] })
            message.delete()
        } else {

            var embed = new EmbedBuilder()
                .setColor(color_wrong)
                .setDescription(emoji.wrong + general.permission_admin)

            message.reply({
                embeds: ([embed])
            }).then(async (response) => {
                await delay(Number(5) * 1000)
                await response.delete()
            })
        }
    }

});


///Commandes (Slashs commands)\\\
client.on('interactionCreate', async (interaction) => {

    if (interaction.customId === "equipe_join") {
        if (!(db.database.has(String(interaction.member.id + "-blacklist")))) {
            if ((db.database.get(String(interaction.member.id + "-level"))) >= "2") {

                

            } else {

                var embed = new EmbedBuilder()
                    .setColor(color_wrong)
                    .setDescription(`${emoji.wrong}${general.level_5}`)

                interaction.reply({ embeds: ([embed]), ephemeral: true})
            }
        } else {

            var embed = new EmbedBuilder()
                .setColor(color_wrong)
                .setDescription(emoji.wrong + general.blacklist)

            interaction.reply({ embeds: ([embed]), ephemeral: true })
        }
    }

    if (interaction.customId === "criteres") {

        var embed = new EmbedBuilder()
            .setColor(color_base)
            .setTitle(emoji.search + " | Critères de recrutements")
            .setDescription(`__**Si j'appuie sur "${emoji.flags} 〢 Bénévole"**__\n> En appuyant sur "Bénévole" vous acceptez de porter régulièrement assistance à la communauté de LSS si un membre rencontre des problèmes sur un exercice, devoir...\n\n ${emoji.rules} **|** __**Critères:**__\n> - Avoir __minimum__ 15 ans\n> - Etre __actif__ sur le serveur\n> - Avoir un __niveau scolaire correct__ peut import le domaine\n> - Avoir reçu __moins__ de 3 avertissements \n\n__**Si j'appuie sur "${emoji.rank} 〢 Equipier"**__\n> En appuyant sur "Equipier" vous acceptez et vous engagez à avoir une activité régulière sur le serveur afin de porter assistance aux utilisateurs ayant des questions (exclues les questions scolaires).\n\n ${emoji.rules} **|** __**Critères:**__\n> - Avoir __minimum__ 15 ans\n> - Etre __actif__ sur le serveur\n> - Avoir un __niveau scolaire correct__ non demandé\n> - Bien __connaître__ le serveur et son __fonctionnement__\n> - Avoir __moins__ de 3 avertissements`)

        interaction.reply({ embeds: ([embed]), ephemeral: true })
    }

    if (interaction.commandName === "Transférer la classe") {
        if ((interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) || (interaction.member.roles.cache.has(responsable))) {
            if (db.database.has(String(interaction.channel.id + "-class_channel"))) {

                let user = interaction.targetUser
                let chanel = interaction.channel
                let util = interaction.guild.members.cache.get(db.database.get(String(interaction.channel.id + "-class_channel")))

                if (!(db.database.has(String(user.id + "-class")))) {

                    chanel.edit({
                        topic: `${emoji.owner} **〢 Le professeur de la classe est ${user}.**`,
                    })
                    chanel.permissionOverwrites.edit((user.id), {
                        ViewChannel: true,
                        SendMessages: true,
                    })

                    db.database.set(String(user.id + "-class"), chanel.id)
                    db.database.delete(String(util.id + "-class"))
                    db.database.delete(String(util.id + "-class_channel"))
                    db.database.set(String(chanel + "-class_channel"), user.id)

                    var embed = new EmbedBuilder()
                        .setColor(color_good)
                        .setDescription(`${emoji.good}${general.class_transfer}`)

                    interaction.reply({ embeds: ([embed]), ephemeral: true })

                    var embed = new EmbedBuilder()
                        .setColor(color_wrong)
                        .setDescription(`${emoji.owner} **〢 La classe vient d'être transférée à ${user} par un \`Administrateur\` !**`)

                    chanel.send({ embeds: ([embed]) })

                    var embed = new EmbedBuilder()
                        .setColor(color_wrong)
                        .setTimestamp()
                        .setTitle(`${emoji.moderator} | Transfer classe (admin)`)
                        .setDescription(`> ${emoji.moderator} **〢 Transféré par: \`${interaction.member.user.tag} | ${interaction.member.id}\`**\n> ${emoji.rank} **〢 Nouveau: \`${user.tag} | ${user.id}\`**\n> ${emoji.calandar} **〢 Channel: \`${chanel.name} | ${chanel.createdAt}\`**\n> ${emoji.unlock} **〢 Publique: \`${db.database.get(String(chanel.id + "-class_access"))}\`**`)
                        .setImage(image)

                    interaction.guild.channels.cache.get(logs).send({ embeds: ([embed]) })

                } else {

                    var embed = new EmbedBuilder()
                        .setColor(color_wrong)
                        .setDescription(`${emoji.wrong}${general.two_class}`)

                    interaction.reply({ embeds: ([embed]), ephemeral: true })
                }

            } else {

                var embed = new EmbedBuilder()
                    .setColor(color_wrong)
                    .setDescription(`${emoji.wrong} | **Vous devez avoir le rôle <@&${responsable}> pour poursuivre !**`)

                interaction.reply({ embeds: ([embed]), ephemeral: true })
            }
        }
    }

    if (interaction.commandName === "Fermer cette classe") {
        if ((interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) || (interaction.member.roles.cache.has(responsable)) || (interaction.member.roles.cache.has(moderateur))) {
            if (db.database.has(String(interaction.channel.id + "-class_channel"))) {

                let user = interaction.targetUser
                let chanel = interaction.channel
                let classe = interaction.guild.members.cache.get(db.database.get(String(interaction.channel.id + "-class_channel")))

                var embed = new EmbedBuilder()
                    .setColor(color_wrong)
                    .setTimestamp()
                    .setTitle(`${emoji.conference} | Classe Fermée (admin)`)
                    .setDescription(`> ${emoji.rank} **〢 Fermé par: \`${interaction.member.user.tag} | ${interaction.member.id}\`**\n> ${emoji.moderator} **〢 Professeur: \`${classe.user.tag} | ${classe.id}\`**\n> ${emoji.calandar} **〢 Date: \`${chanel.createdAt}\`**\n> ${emoji.unlock} **〢 Publique: \`${db.database.get(String(interaction.channel.id + "-class_access"))}\`**`)
                    .setImage(image)

                interaction.guild.channels.cache.get(logs).send({ embeds: ([embed]) })

                try {
                    var embed = new EmbedBuilder()
                        .setColor(color_base)
                        .setDescription(emoji.stars + general.force_close)

                    classe.send({ embeds: ([embed]) })
                } catch (err) {
                    console.log(chalk.blueBright(err + " | Cet utilisateur a ses MP fermés !"))
                }

                interaction.channel.delete()
                await db.database.delete(String(classe + "-class"))
                await db.database.delete(String(interaction.channel.id + "-class_channel"))
                await db.database.delete(String(interaction.channel.id + "-class_access"))
            } else {

                var embed = new EmbedBuilder()
                    .setColor(color_wrong)
                    .setDescription(`${emoji.wrong}${general.class_channel}`)

                interaction.reply({ embeds: ([embed]), ephemeral: true })
            }
        } else {

            var embed = new EmbedBuilder()
                .setColor(color_wrong)
                .setDescription(`${emoji.wrong} | **Vous devez avoir le rôle <@&${responsable}> ou <@&${moderateur}> pour poursuivre !**`)

            interaction.reply({ embeds: ([embed]), ephemeral: true })
        }
    }

    if (interaction.commandName === "Renvoyer de la classe") {
        if ((interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) || (interaction.member.roles.cache.has(responsable)) || (interaction.member.roles.cache.has(moderateur))) {
            if (db.database.has(String(interaction.channel.id + "-class_channel"))) {

                let user = interaction.targetUser
                let chanel = interaction.channel

                chanel.permissionOverwrites.edit((user.id), {
                    ViewChannel: false,
                    SendMessages: false,
                })

                var embed = new EmbedBuilder()
                    .setColor(color_wrong)
                    .setTimestamp()
                    .setTitle(`${emoji.ban} | Utilisateur renvoyé (admin)`)
                    .setDescription(`> ${emoji.moderator} **〢 Expulsé par: \`${interaction.member.user.tag} | ${interaction.member.id}\`**\n> ${emoji.rank} **〢 Utilisateur: \`${user.tag} | ${user.id}\`**\n> ${emoji.calandar} **〢 Date: \`${interaction.channel.createdAt}\`**\n> ${emoji.unlock} **〢 Publique: \`${db.database.get(String(interaction.channel.id + "-class_access"))}\`**`)
                    .setImage(image)

                const link_chanel_renvoyer = new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("S'y rendre !")
                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${chanel.id}`)

                const link_renvoyer_menu = new ActionRowBuilder()
                    .addComponents(link_chanel_renvoyer)

                interaction.guild.channels.cache.get(logs).send({ embeds: ([embed]), components: [link_renvoyer_menu] })

                var embed = new EmbedBuilder()
                    .setColor(color_good)
                    .setDescription(`${emoji.good}${general.user_remove}`)

                interaction.reply({ embeds: ([embed]), ephemeral: true })

                var embed = new EmbedBuilder()
                    .setColor(color_wrong)
                    .setDescription(`${emoji.ban} **〢 ${user} vient d'être renvoyé de la classe par un \`Administrateur\` !**`)

                chanel.send({ embeds: ([embed]) })

            } else {

                var embed = new EmbedBuilder()
                    .setColor(color_wrong)
                    .setDescription(`${emoji.wrong}${general.class_channel}`)

                interaction.reply({ embeds: ([embed]), ephemeral: true })
            }
        } else {

            var embed = new EmbedBuilder()
                .setColor(color_wrong)
                .setDescription(`${emoji.wrong} | **Vous devez avoir le rôle <@&${responsable}> ou <@&${moderateur}> pour poursuivre !**`)

            interaction.reply({ embeds: ([embed]), ephemeral: true })
        }
    }

    if (interaction.commandName === "admin_inviter") {
        if ((interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) || (interaction.member.roles.cache.has(responsable)) || (interaction.member.roles.cache.has(moderateur))) {

            let user = interaction.options.getUser("utilisateur")
            let chanel = interaction.channel


            var embed = new EmbedBuilder()
                .setColor(color_wrong)
                .setTimestamp()
                .setTitle(`${emoji.ban} | Utilisateur invité (admin)`)
                .setDescription(`> ${emoji.moderator} **〢 Invité par: \`${interaction.member.user.tag} | ${interaction.member.id}\`**\n> ${emoji.rank} **〢 Utilisateur: \`${user.tag} | ${user.id}\`**\n> ${emoji.calandar} **〢 Channel: \`${chanel.name}\`**\n> ${emoji.unlock} **〢 Publique: \`${db.database.get(String(chanel.id + "-class_access"))}\`**`)
                .setImage(image)

            const link_chanel_inviter = new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel("S'y rendre !")
                .setURL(`https://discord.com/channels/${interaction.guild.id}/${chanel.id}`)

            const link_inviter_menu = new ActionRowBuilder()
                .addComponents(link_chanel_inviter)

            interaction.guild.channels.cache.get(logs).send({ embeds: ([embed]), components: [link_inviter_menu] })

            chanel.permissionOverwrites.edit((user.id), {
                ViewChannel: true,
                SendMessages: true,
            })

            var embed = new EmbedBuilder()
                .setColor(color_good)
                .setDescription(`${emoji.good}${general.user_add}`)

            interaction.reply({ embeds: ([embed]), ephemeral: true })

            var embed = new EmbedBuilder()
                .setColor(color_wrong)
                .setDescription(`${emoji.stars} **〢 ${user} vient d'être ajouté à la classe par un \`Administrateur\` !**`)

            chanel.send({ embeds: ([embed]) })

        } else {

            var embed = new EmbedBuilder()
                .setColor(color_wrong)
                .setDescription(`${emoji.wrong} | **Vous devez avoir le rôle <@&${responsable}> ou <@&${moderateur}> pour poursuivre !**`)

            interaction.reply({ embeds: ([embed]), ephemeral: true })
        }
    }

    if (interaction.commandName === "quitter") {
        if (db.database.has(String(interaction.channel.id + "-class_channel"))) {
            if (!(db.database.has(String(interaction.member.id + "-blacklist")))) {

                interaction.channel.permissionOverwrites.edit((interaction.member.id), {
                    ViewChannel: false,
                    SendMessages: false,
                })

                var embed = new EmbedBuilder()
                    .setColor(color_base)
                    .setTimestamp()
                    .setTitle(`${emoji.ban} | Quitté la classe`)
                    .setDescription(`> ${emoji.rank} **〢 Utilisateur: \`${interaction.member.user.tag} | ${interaction.member.id}\`**\n> ${emoji.calandar} **〢 Channel: \`${interaction.channel.name} | ${interaction.channel.createdAt}\`**\n> ${emoji.unlock} **〢 Publique: \`${db.database.get(String(interaction.channel.id + "-class_access"))}\`**`)
                    .setImage(image)

                interaction.guild.channels.cache.get(logs).send({ embeds: ([embed]) })

                var embed = new EmbedBuilder()
                    .setColor(color_base)
                    .setDescription(`${emoji.fire} **〢 ${interaction.member} vient de quitter la classe !**`)

                interaction.channel.send({ embeds: ([embed]) })

            } else {

                var embed = new EmbedBuilder()
                    .setColor(color_wrong)
                    .setDescription(emoji.wrong + general.blacklist)

                interaction.reply({ embeds: ([embed]), ephemeral: true })
            }
        } else {

            var embed = new EmbedBuilder()
                .setColor(color_wrong)
                .setDescription(`${emoji.wrong}${general.class_channel}`)

            interaction.reply({ embeds: ([embed]), ephemeral: true })
        }
    }

    if (interaction.commandName === "renvoyer") {
        if (!(db.database.has(String(interaction.member.id + "-blacklist")))) {
            if ((db.database.has(String(interaction.member.id + "-class")))) {

                let user = interaction.options.getUser("utilisateur")
                let chanel = interaction.guild.channels.cache.get(db.database.get(String(interaction.member.id + "-class")))

                chanel.permissionOverwrites.edit((user.id), {
                    ViewChannel: false,
                    SendMessages: false,
                })

                var embed = new EmbedBuilder()
                    .setColor(color_base)
                    .setTimestamp()
                    .setTitle(`${emoji.ban} | Utilisateur renvoyé`)
                    .setDescription(`> ${emoji.moderator} **〢 Expulsé par: \`${interaction.member.user.tag} | ${interaction.member.id}\`**\n> ${emoji.rank} **〢 Utilisateur: \`${user.tag} | ${user.id}\`**\n> ${emoji.calandar} **〢 Date: \`${interaction.channel.createdAt}\`**\n> ${emoji.unlock} **〢 Publique: \`${db.database.get(String(interaction.channel.id + "-class_access"))}\`**`)
                    .setImage(image)

                const link_chanel_renvoyer = new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("S'y rendre !")
                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${chanel.id}`)

                const link_renvoyer_menu = new ActionRowBuilder()
                    .addComponents(link_chanel_renvoyer)

                interaction.guild.channels.cache.get(logs).send({ embeds: ([embed]), components: [link_renvoyer_menu] })

                var embed = new EmbedBuilder()
                    .setColor(color_base)
                    .setDescription(`${emoji.ban} **〢 ${user} vient d'être renvoyé de la classe !**`)

                chanel.send({ embeds: ([embed]) })


            } else {

                var embed = new EmbedBuilder()
                    .setColor(color_wrong)
                    .setDescription(emoji.wrong + general.absent_class)

                interaction.reply({ embeds: ([embed]), ephemeral: true })
            }
        } else {

            var embed = new EmbedBuilder()
                .setColor(color_wrong)
                .setDescription(emoji.wrong + general.blacklist)

            interaction.reply({ embeds: ([embed]), ephemeral: true })
        }
    }

    if (interaction.commandName === "transfer") {
        if (!(db.database.has(String(interaction.member.id + "-blacklist")))) {
            if ((db.database.has(String(interaction.member.id + "-class")))) {

                let user = interaction.options.getUser("utilisateur")
                let classe = db.database.get(String(interaction.member.id + "-class"))
                let chanel = interaction.guild.channels.cache.get(classe)

                if (!(db.database.has(String(user.id + "-class")))) {
                    if ((db.database.get(String(user.id + "-level"))) >= "2") {

                        chanel.edit({
                            topic: `${emoji.owner} **〢 Le professeur de la classe est ${user}.**`,
                        })
                        chanel.permissionOverwrites.edit((user.id), {
                            ViewChannel: true,
                            SendMessages: true,
                        })

                        db.database.set(String(user.id + "-class"), chanel.id)
                        db.database.delete(String(interaction.member.id + "-class"))
                        db.database.delete(String(interaction.member.id + "-class_channel"))
                        db.database.set(String(chanel.id + "-class_channel"), user.id)

                        var embed = new EmbedBuilder()
                            .setColor(color_good)
                            .setDescription(`${emoji.good}${general.class_transfer}`)

                        interaction.reply({ embeds: ([embed]), ephemeral: true })

                        var embed = new EmbedBuilder()
                            .setColor(color_base)
                            .setDescription(`${emoji.owner} **〢 La classe vient d'être transférée à ${user} !**`)

                        chanel.send({ embeds: ([embed]) })

                        var embed = new EmbedBuilder()
                            .setColor(color_base)
                            .setTimestamp()
                            .setTitle(`${emoji.moderator} | Transfer classe`)
                            .setDescription(`> ${emoji.moderator} **〢 Ancien professeur: \`${interaction.member.user.tag} | ${interaction.member.id}\`**\n> ${emoji.rank} **〢 Nouveau: \`${user.tag} | ${user.id}\`**\n> ${emoji.calandar} **〢 Channel: \`${chanel.name} | ${chanel.createdAt}\`**\n> ${emoji.unlock} **〢 Publique: \`${db.database.get(String(chanel.id + "-class_access"))}\`**`)
                            .setImage(image)

                        interaction.guild.channels.cache.get(logs).send({ embeds: ([embed]) })

                    } else {

                        var embed = new EmbedBuilder()
                            .setColor(color_wrong)
                            .setDescription(`${emoji.wrong}${general.level_2_user}`)

                        interaction.reply({ embeds: ([embed]), ephemeral: true })
                    }
                } else {

                    var embed = new EmbedBuilder()
                        .setColor(color_wrong)
                        .setDescription(`${emoji.wrong}${general.two_class}`)

                    interaction.reply({ embeds: ([embed]), ephemeral: true })
                }


            } else {

                var embed = new EmbedBuilder()
                    .setColor(color_wrong)
                    .setDescription(emoji.wrong + general.absent_class)

                interaction.reply({ embeds: ([embed]), ephemeral: true })
            }
        } else {

            var embed = new EmbedBuilder()
                .setColor(color_wrong)
                .setDescription(emoji.wrong + general.blacklist)

            interaction.reply({ embeds: ([embed]), ephemeral: true })
        }
    }

    if (interaction.commandName === "inviter") {
        if (!(db.database.has(String(interaction.member.id + "-blacklist")))) {
            if ((db.database.has(String(interaction.member.id + "-class")))) {

                let user = interaction.options.getUser("utilisateur")
                let chanel = interaction.guild.channels.cache.get(db.database.get(String(interaction.member.id + "-class")))

                var embed = new EmbedBuilder()
                    .setColor(color_base)
                    .setTimestamp()
                    .setTitle(`${emoji.ban} | Utilisateur invité`)
                    .setDescription(`> ${emoji.moderator} **〢 Invité par: \`${interaction.member.user.tag} | ${interaction.member.id}\`**\n> ${emoji.rank} **〢 Utilisateur: \`${user.tag} | ${user.id}\`**\n> ${emoji.calandar} **〢 Date: \`${interaction.channel.createdAt}\`**\n> ${emoji.unlock} **〢 Publique: \`${db.database.get(String(interaction.channel.id + "-class_access"))}\`**`)
                    .setImage(image)

                const link_chanel_inviter = new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("S'y rendre !")
                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${chanel.id}`)

                const link_inviter_menu = new ActionRowBuilder()
                    .addComponents(link_chanel_inviter)

                interaction.guild.channels.cache.get(logs).send({ embeds: ([embed]), components: [link_inviter_menu] })

                chanel.permissionOverwrites.edit((user.id), {
                    ViewChannel: true,
                    SendMessages: true,
                })

                var embed = new EmbedBuilder()
                    .setColor(color_good)
                    .setDescription(`${emoji.good}${general.user_add}`)

                interaction.reply({ embeds: ([embed]), ephemeral: true })

                var embed = new EmbedBuilder()
                    .setColor(color_base)
                    .setDescription(`${emoji.stars} **〢 ${user} vient d'être ajouté à la classe !**`)

                chanel.send({ embeds: ([embed]) })

            } else {

                var embed = new EmbedBuilder()
                    .setColor(color_wrong)
                    .setDescription(emoji.wrong + general.absent_class)

                interaction.reply({ embeds: ([embed]), ephemeral: true })
            }
        } else {

            var embed = new EmbedBuilder()
                .setColor(color_wrong)
                .setDescription(emoji.wrong + general.blacklist)

            interaction.reply({ embeds: ([embed]), ephemeral: true })
        }
    }

    if (interaction.customId === "add_class") {
        if (!(db.database.has(String(interaction.member.id + "-blacklist")))) {
            if (!(db.database.has(String(interaction.member.id + "-class")))) {
                if (((db.database.get(String(interaction.member.id + "-class_cooldown"))) <= String(Math.floor(new Date().getTime() / 1000))) || (!(db.database.has(String(interaction.member.id + "-class_cooldown"))))) {
                    if ((db.database.get(String(interaction.member.id + "-level"))) >= "2") {

                        interaction.guild.channels.create({
                            name: interaction.member.user.username,
                            type: ChannelType.GuildText,
                            reason: `Création classe par ${interaction.member.user.tag} | ${interaction.member.id}`,
                            parent: interaction.guild.channels.cache.find((category) => category.id === "1038139614571024406"),
                            topic: `${emoji.owner} **〢 Le professeur de la classe est ${interaction.member}.**`,
                            permissionOverwrites: [{
                                id: interaction.guildId,
                                deny: [PermissionFlagsBits.ViewChannel],
                            }, {
                                id: interaction.member,
                                allow: [PermissionFlagsBits.ViewChannel],
                            }]
                        }).then(async (chanel) => {

                            db.database.set(String(interaction.member.id + "-class_cooldown"), (Math.floor(new Date().getTime() / 1000)) + 600)
                            db.database.set(String(interaction.member.id + "-class"), chanel.id)
                            db.database.set(String(chanel.id + "-class_channel"), interaction.member.id)


                            var embed = new EmbedBuilder()
                                .setColor(color_good)
                                .setDescription(emoji.good + " **| Votre classe a bien été créée !**")

                            const link_chanel = new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setLabel("S'y rendre !")
                                .setURL(`https://discord.com/channels/${interaction.guild.id}/${chanel.id}`)


                            const menu_link_chanel = new ActionRowBuilder()
                                .addComponents(link_chanel)

                            interaction.reply({ embeds: ([embed]), components: [menu_link_chanel], ephemeral: true })

                            var embed = new EmbedBuilder()
                                .setColor(color_base)
                                .setDescription(`${emoji.question} **〢 Souhaitez-vous que tout le monde puisse vous apporter de l'aide ?**`)

                            const accept_access = new ButtonBuilder()
                                .setStyle(ButtonStyle.Success)
                                .setLabel("Oui")
                                .setCustomId("accept_access")

                            const refuse_access = new ButtonBuilder()
                                .setStyle(ButtonStyle.Danger)
                                .setLabel("Non")
                                .setCustomId("refuse_access")

                            const stop_access = new ButtonBuilder()
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji(emoji.bin)
                                .setLabel("Supprimer")
                                .setCustomId("stop_access")

                            const infos_access = new ButtonBuilder()
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji(emoji.search)
                                .setLabel("Plus d'infos")
                                .setCustomId("infos_access")

                            const access = new ActionRowBuilder()
                                .addComponents(accept_access)
                                .addComponents(refuse_access)
                                .addComponents(stop_access)
                                .addComponents(infos_access)

                            chanel.send({ embeds: ([embed]), components: [access] })
                        });

                    } else {

                        var embed = new EmbedBuilder()
                            .setColor(color_wrong)
                            .setDescription(`${emoji.wrong}${general.level_2}`)

                        interaction.reply({ embeds: ([embed]), ephemeral: true })
                    }
                } else {

                    var embed = new EmbedBuilder()
                        .setColor(color_wrong)
                        .setDescription(emoji.wrong + " **| Vous devez patienter 10 minutes pour créer de nouveau une classe !**")

                    interaction.reply({ embeds: ([embed]), ephemeral: true })
                }
            } else {

                var embed = new EmbedBuilder()
                    .setColor(color_wrong)
                    .setDescription(emoji.wrong + " **| Vous ne pouvez ouvrir qu'une seule classe à la fois !**")

                interaction.reply({ embeds: ([embed]), ephemeral: true })
            }
        } else {

            var embed = new EmbedBuilder()
                .setColor(color_wrong)
                .setDescription(emoji.wrong + general.blacklist)

            interaction.reply({ embeds: ([embed]), ephemeral: true })
        }
    }

    if (interaction.customId === "accept_access") {
        if ((db.database.get(String(interaction.member.id + "-class"))) === interaction.channel.id) {

            db.database.set(String(interaction.channel.id + "-class_access"), "Oui")

            interaction.channel.permissionOverwrites.edit((helper), {
                ViewChannel: true,
                SendMessages: true,
            })

            interaction.channel.permissionOverwrites.edit((moderateur), {
                ViewChannel: true,
                SendMessages: true,
            })

            interaction.channel.permissionOverwrites.edit((responsable), {
                ViewChannel: true,
                SendMessages: true,
            })

            interaction.channel.permissionOverwrites.edit((benevole), {
                ViewChannel: true,
                SendMessages: true,
            })

            interaction.channel.permissionOverwrites.edit((interaction.member.id), {
                ViewChannel: true,
                SendMessages: true,
            })

            interaction.channel.permissionOverwrites.edit((communauté), {
                ViewChannel: true,
                SendMessages: true,
            })

            var embed = new EmbedBuilder()
                .setColor(color_good)
                .setDescription(`${emoji.good}${general.save}`)

            interaction.reply({ embeds: ([embed]), ephemeral: true })


            var embed = new EmbedBuilder()
                .setColor(color_base)
                .setImage(image)
                .setTitle(emoji.conference + " | Classe Ouverte")
                .setDescription(`**\`\`\`Bienvenue dans la classe ${interaction.channel.name}, le modérateur de la classe demande de l'aide !\`\`\`**\n> ${emoji.fire} 〢 *Attention, dans cette classe, le règlement disponible dans <#${rules}> doit être respecté !*\n\n${emoji.tv} **|** __**Informations:**__\n> ${emoji.moderator} **〢 Professeur: \`${interaction.member.user.tag} | ${interaction.member.id}\`**\n> ${emoji.calandar} **〢 Date: \`${interaction.channel.createdAt}\`**\n> ${emoji.unlock} **〢 Publique: \`Oui\`**\n\n${emoji.bot} **|** __**Commandes:**__\n> </inviter:1038877368082780180> ➜ *Ajouter un membre à votre classe.*\n> </renvoyer:1038878843953492068> ➜ *Renvoyer un membre de votre classe.*\n> </transfer:1039956664234811473> ➜ *Nommer une autre personne que vous professeur.*\n> </quitter:1040009864623169657> ➜ *Quitter une classe privée.*\n\n\n> ${emoji.fire} 〢 *Attention, le bouton "signaler" permet de signaler cette classe. Ce bouton ne doit être utilisé seulement si elle ne respect pas le règlement (Tout abus sera sanctionné).*`)

            const delete_class = new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("Supprimer")
                .setEmoji(emoji.bin)
                .setCustomId("delete_class")

            const signal_class = new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setEmoji(emoji.warn)
                .setCustomId("signal_class")

            const class_menu = new ActionRowBuilder()
                .addComponents(delete_class)
                .addComponents(signal_class)

            interaction.message.edit({ embeds: ([embed]), components: [class_menu] })


        } else {

            var embed = new EmbedBuilder()
                .setColor(color_wrong)
                .setDescription(emoji.wrong + general.class_access)

            interaction.reply({ embeds: ([embed]), ephemeral: true })
        }
    }

    if (interaction.customId === "refuse_access") {
        if ((db.database.get(String(interaction.member.id + "-class"))) === interaction.channel.id) {

            db.database.set(String(interaction.channel.id + "-class_access"), "Non")
            if (interaction.member.roles.cache.has(noble)) {

                interaction.channel.permissionOverwrites.edit((helper), {
                    ViewChannel: true,
                    SendMessages: true,
                })

                interaction.channel.permissionOverwrites.edit((moderateur), {
                    ViewChannel: true,
                    SendMessages: true,
                })

                interaction.channel.permissionOverwrites.edit((responsable), {
                    ViewChannel: true,
                    SendMessages: true,
                })

                interaction.channel.permissionOverwrites.edit((benevole), {
                    ViewChannel: true,
                    SendMessages: true,
                })

                interaction.channel.permissionOverwrites.edit((interaction.member.id), {
                    ViewChannel: true,
                    SendMessages: true,
                })

                interaction.channel.permissionOverwrites.edit((communauté), {
                    ViewChannel: false,
                    SendMessages: false,
                })

                var embed = new EmbedBuilder()
                    .setColor(color_good)
                    .setDescription(`${emoji.good}${general.save}`)

                interaction.reply({ embeds: ([embed]), ephemeral: true })

                var embed = new EmbedBuilder()
                    .setColor(color_base)
                    .setImage(image)
                    .setTitle(emoji.conference + " | Classe Ouverte")
                    .setDescription(`**\`\`\`Bienvenue dans la classe ${interaction.channel.name}, le modérateur de la classe demande de l'aide !\`\`\`**\n> ${emoji.fire} 〢 *Attention, dans cette classe, le règlement disponible dans <#${rules}> doit être respecté !*\n\n${emoji.tv} **|** __**Informations:**__\n> ${emoji.moderator} **〢 Professeur: \`${interaction.member.user.tag} | ${interaction.member.id}\`**\n> ${emoji.calandar} **〢 Date: \`${interaction.channel.createdAt}\`**\n> ${emoji.unlock} **〢 Publique: \`Oui\`**\n\n${emoji.bot} **|** __**Commandes:**__\n> </inviter:1038877368082780180> ➜ *Ajouter un membre à votre classe.*\n> </renvoyer:1038878843953492068> ➜ *Renvoyer un membre de votre classe.*\n> </transfer:1039956664234811473> ➜ *Nommer une autre personne que vous professeur.*\n> </quitter:1040009864623169657> ➜ *Quitter une classe privée.*\n\n\n> ${emoji.fire} 〢 *Attention, le bouton "signaler" permet de signaler cette classe. Ce bouton ne doit être utilisé seulement si elle ne respect pas le règlement (Tout abus sera sanctionné).*`)

                const delete_class = new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel("Supprimer")
                    .setEmoji(emoji.bin)
                    .setCustomId("delete_class")

                const signal_class = new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(emoji.warn)
                    .setCustomId("signal_class")

                const class_menu = new ActionRowBuilder()
                    .addComponents(delete_class)
                    .addComponents(signal_class)

                interaction.message.edit({ embeds: ([embed]), components: [class_menu] })


            } else {

                interaction.channel.permissionOverwrites.edit((helper), {
                    ViewChannel: true,
                    SendMessages: true,
                })

                interaction.channel.permissionOverwrites.edit((moderateur), {
                    ViewChannel: true,
                    SendMessages: true,
                })

                interaction.channel.permissionOverwrites.edit((responsable), {
                    ViewChannel: true,
                    SendMessages: true,
                })

                interaction.channel.permissionOverwrites.edit((benevole), {
                    ViewChannel: true,
                    SendMessages: true,
                })

                interaction.channel.permissionOverwrites.edit((interaction.member.id), {
                    ViewChannel: true,
                    SendMessages: true,
                })

                interaction.channel.permissionOverwrites.edit((communauté), {
                    ViewChannel: true,
                    SendMessages: false,
                })

                var embed = new EmbedBuilder()
                    .setColor(color_good)
                    .setDescription(`${emoji.good}${general.save}`)

                interaction.reply({ embeds: ([embed]), ephemeral: true })

                var embed = new EmbedBuilder()
                    .setColor(color_base)
                    .setImage(image)
                    .setTitle(emoji.conference + " | Classe Ouverte")
                    .setDescription(`**\`\`\`Bienvenue dans la classe ${interaction.channel.name}, le modérateur de la classe demande de l'aide !\`\`\`**\n> ${emoji.fire} 〢 *Attention, dans cette classe, le règlement disponible dans <#${rules}> doit être respecté !*\n\n${emoji.tv} **|** __**Informations:**__\n> ${emoji.moderator} **〢 Professeur: \`${interaction.member.user.tag} | ${interaction.member.id}\`**\n> ${emoji.calandar} **〢 Date: \`${interaction.channel.createdAt}\`**\n> ${emoji.unlock} **〢 Publique: \`Non\`**\n\n${emoji.bot} **|** __**Commandes:**__\n> </inviter:1038877368082780180> ➜ *Ajouter un membre à votre classe.*\n> </renvoyer:1038878843953492068> ➜ *Renvoyer un membre de votre classe.*\n> </transfer:1039956664234811473> ➜ *Nommer une autre personne que vous professeur.*\n> </quitter:1040009864623169657> ➜ *Quitter une classe privée.*\n\n\n> ${emoji.fire} 〢 *Attention, le bouton "signaler" permet de signaler cette classe. Ce bouton ne doit être utilisé seulement si elle ne respect pas le règlement (Tout abus sera sanctionné).*`)

                const delete_class = new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel("Supprimer")
                    .setEmoji(emoji.bin)
                    .setCustomId("delete_class")

                const signal_class = new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(emoji.warn)
                    .setCustomId("signal_class")

                const class_menu = new ActionRowBuilder()
                    .addComponents(delete_class)
                    .addComponents(signal_class)

                interaction.message.edit({ embeds: ([embed]), components: [class_menu] })
            }

        } else {

            var embed = new EmbedBuilder()
                .setColor(color_wrong)
                .setDescription(emoji.wrong + general.class_access)

            interaction.reply({ embeds: ([embed]), ephemeral: true })
        }
    }

    if (interaction.customId === "signal_class") {
        if (!(db.database.has(String(interaction.member.id + "-blacklist")))) {
            if (!((db.database.get(String(interaction.member.id + "-class"))) === interaction.channelId)) {
                if (((db.database.get(String(interaction.member.id + "-warn_cooldown"))) <= String(Math.floor(new Date().getTime() / 1000))) || (!(db.database.has(String(interaction.member.id + "-warn_cooldown"))))) {

                    db.database.set(String(interaction.member.id + "-warn_cooldown"), (Math.floor(new Date().getTime() / 1000)) + 600)

                    let user = interaction.guild.members.cache.get(db.database.get(String(interaction.channel.id + "-class_channel")))

                    var embed = new EmbedBuilder()
                        .setColor(color_wrong)
                        .setTimestamp()
                        .setTitle(`${emoji.ban} | Classe Signalée`)
                        .setDescription(`> ${emoji.rank} **〢 Signalé par: \`${interaction.member.user.tag} | ${interaction.member.id}\`**\n> ${emoji.moderator} **〢 Professeur: \`${user.user.tag} | ${user.id}\`**\n> ${emoji.calandar} **〢 Date: \`${interaction.channel.createdAt}\`**\n> ${emoji.unlock} **〢 Publique: \`${db.database.get(String(interaction.channel.id + "-class_access"))}\`**`)
                        .setImage(image)

                    const link_chanel_warn = new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel("S'y rendre !")
                        .setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`)

                    const warn_menu = new ActionRowBuilder()
                        .addComponents(link_chanel_warn)

                    interaction.guild.channels.cache.get(warn).send({ embeds: ([embed]), components: [warn_menu] })

                    var embed = new EmbedBuilder()
                        .setColor(color_good)
                        .setDescription(`${emoji.good}${general.good_warn}`)

                    interaction.reply({ embeds: ([embed]), ephemeral: true })



                } else {

                    var embed = new EmbedBuilder()
                        .setColor(color_wrong)
                        .setDescription(`${emoji.wrong}${general.warn_cooldown}`)

                    interaction.reply({ embeds: ([embed]), ephemeral: true })
                }
            } else {

                var embed = new EmbedBuilder()
                    .setColor(color_wrong)
                    .setDescription(`${emoji.wrong}${general.auto_warn}`)

                interaction.reply({ embeds: ([embed]), ephemeral: true })
            }
        } else {

            var embed = new EmbedBuilder()
                .setColor(color_wrong)
                .setDescription(emoji.wrong + general.blacklist)

            interaction.reply({ embeds: ([embed]), ephemeral: true })
        }
    }

    if (interaction.customId === "delete_class") {
        if ((db.database.get(String(interaction.member.id + "-class"))) === interaction.channelId) {


            var embed = new EmbedBuilder()
                .setColor(color_base)
                .setTimestamp()
                .setTitle(`${emoji.conference} | Classe Fermée`)
                .setDescription(`> ${emoji.moderator} **〢 Professeur: \`${interaction.member.user.tag} | ${interaction.member.id}\`**\n> ${emoji.calandar} **〢 Date: \`${interaction.channel.createdAt}\`**\n> ${emoji.unlock} **〢 Publique: \`${db.database.get(String(interaction.channel.id + "-class_access"))}\`**`)
                .setImage(image)

            interaction.guild.channels.cache.get(logs).send({ embeds: ([embed]) })

            try {
                var embed = new EmbedBuilder()
                    .setColor(color_base)
                    .setDescription(emoji.stars + general.delete_class)

                interaction.member.send({ embeds: ([embed]) })
            } catch (err) {
                console.log(chalk.blueBright(err + " | Cet utilisateur a ses MP fermés !"))
            }

            interaction.channel.delete()
            db.database.delete(String(interaction.member.id + "-class"))
            db.database.delete(String(interaction.channel.id + "-class_channel"))
            db.database.delete(String(interaction.channel.id + "-class_access"))

        } else {

            var embed = new EmbedBuilder()
                .setColor(color_wrong)
                .setDescription(`${emoji.wrong}${general.class_access}`)

            interaction.reply({ embeds: ([embed]), ephemeral: true })
        }
    }

    if (interaction.customId === "stop_access") {
        if ((db.database.get(String(interaction.member.id + "-class"))) === interaction.channelId) {

            interaction.channel.delete()

            try {
                var embed = new EmbedBuilder()
                    .setColor(color_base)
                    .setDescription(emoji.stars + general.delete_class)

                interaction.member.send({ embeds: ([embed]) })
            } catch (err) {
                console.log(chalk.blueBright(err + " | Cet utilisateur a ses MP fermés !"))
            }

            var embed = new EmbedBuilder()
            var embed = new EmbedBuilder()
                .setColor(color_base)
                .setTitle(`${emoji.conference} | Classe fermée`)
                .setDescription(`**${emoji.user} 〢 Professeur:** \`\`\`${interaction.member.user.tag} | ${interaction.member.id}\`\`\`\n**${emoji.pen} 〢 Raison:** \`\`\`Aucune\`\`\``)
                .setTimestamp()
                .setThumbnail(interaction.member.user.displayAvatarURL())
                .setImage(image)

            interaction.guild.channels.cache.get(logs).send({ embeds: ([embed]) })

            db.database.delete(String(interaction.member.id + "-class"))
            db.database.delete(String(interaction.channel.id + "-class_channel"))
            db.database.delete(String(interaction.member.id + "-class"))
            db.database.delete(String(interaction.channel.id + "-class_access"))

        } else {

            var embed = new EmbedBuilder()
                .setColor(color_wrong)
                .setDescription(`${emoji.wrong}${general.class_access}`)

            interaction.reply({ embeds: ([embed]), ephemeral: true })
        }
    }

    if (interaction.customId === "infos_access") {

        var embed = new EmbedBuilder()
            .setColor(color_base)
            .setTitle(emoji.search + " | Informations supplémentaires")
            .setDescription(`__**Si j'appuie sur "${emoji.good} 〢 Oui"**__\n> En appuyant sur "Oui" vous acceptez que toute la communauté de LSS puisse rejoindre votre classe afin de vous apporter de l'aide.\n\n__**Si j'appuie sur "${emoji.wrong} 〢 Non"**__\n> En appuyant sur "Non" vous refusez l'aide de la communauté de LSS par conséquant, seul les <@&${benevole}> ainsi que les personnes que vous avez invités pourront vous aider.\n > ${emoji.fire} 〢 *Attention, si vous ne possédez pas le rôle <@&${noble}> toute la communauté pourra visioner votre conversation !*`)

        interaction.reply({ embeds: ([embed]), ephemeral: true })
    }

    if (interaction.commandName === "blacklist") {
        if (interaction.member.id === interaction.guild.ownerId) {

            let user = interaction.options.getUser("utilisateur")
            let reason = interaction.options.getString("raison")

            db.database.set(String(user.id + "-blacklist"), reason)

            var embed = new EmbedBuilder()
                .setColor(color_base)
                .setDescription(`${emoji.lock} | **L'utilisateur \`${user.tag} | ${user.id}\` a bien été ajouté à la blacklist pour la raison \`${reason}\` !**`)

            interaction.reply({ embeds: ([embed]) })

            try {
                var embed = new EmbedBuilder()
                    .setColor(color_base)
                    .setDescription(`${emoji.lock} | **Vous avez été ajouté dans la blacklist de \`${interaction.guild.name}\` !**`)
                    .setTimestamp()

                user.send({ embeds: ([embed]) })
            } catch (err) {
                console.log(chalk.blueBright(err + " | L'utilisateur a ses MP fermés !"))
            }

            var embed = new EmbedBuilder()
                .setColor(color_base)
                .setTitle(`${emoji.lock} | Utilisateur blacklist`)
                .setDescription(`**${emoji.user} 〢 Utilisateur:** \`\`\`${user.tag} | ${user.id}\`\`\`\n**${emoji.pen} 〢 Raison:** \`\`\`${reason}\`\`\``)
                .setTimestamp()
                .setThumbnail(user.displayAvatarURL())
                .setImage(image)

            interaction.guild.channels.cache.get(logs).send({ embeds: ([embed]) })

        } else {

            var embed = new EmbedBuilder()
                .setColor(color_wrong)
                .setDescription(emoji.owner + general.permission_owner)

            interaction.reply({ embeds: ([embed]), ephemeral: true })
        }
    }

    if (interaction.commandName === "unblacklist") {
        if (interaction.member.id === interaction.guild.ownerId) {

            let user = interaction.options.getUser("utilisateur")
            let reason = interaction.options.getString("raison")

            db.database.delete(String(user.id + "-blacklist"))

            var embed = new EmbedBuilder()
                .setColor(color_base)
                .setDescription(`${emoji.unlock} | **L'utilisateur \`${user.tag} | ${user.id}\` a bien été retiré de la blacklist pour la raison \`${reason}\` !**`)

            interaction.reply({ embeds: ([embed]) })

            try {
                var embed = new EmbedBuilder()
                    .setColor(color_base)
                    .setDescription(`${emoji.unlock} | **Vous avez été retiré de la blacklist de \`${interaction.guild.name}\` !**`)
                    .setTimestamp()

                user.send({ embeds: ([embed]) })
            } catch (err) {
                console.log(chalk.blueBright(err + " | L'utilisateur a ses MP fermés !"))
            }

            var embed = new EmbedBuilder()
                .setColor(color_base)
                .setTitle(`${emoji.unlock} | Utilisateur unblacklist`)
                .setDescription(`**${emoji.user} 〢 Utilisateur:** \`\`\`${user.tag} | ${user.id}\`\`\`\n**${emoji.pen} 〢 Raison:** \`\`\`${reason}\`\`\``)
                .setTimestamp()
                .setThumbnail(user.displayAvatarURL())
                .setImage(image)

            interaction.guild.channels.cache.get(logs).send({ embeds: ([embed]) })

        } else {

            var embed = new EmbedBuilder()
                .setColor(color_wrong)
                .setDescription(emoji.owner + general.permission_owner)

            interaction.reply({ embeds: ([embed]), ephemeral: true })
        }
    }


});
//process.on('unhandledRejection', (reason, promise) => { console.log(chalk.redBright(`Une erreur est survenue: ${reason}\n----------------------\n ${promise}`)) })
//process.on('exit', code => { console.log(chalk.redBright(`Le processus s'est arrêté avec le code: ${code} !`)) })
//process.on('uncaughtException', (err, origin) => { console.log(chalk.redBright(`Erreur dans une boucle: ${err}\n------------\n Origine: ${origin}`)) })
//process.on("warning", (...args) => console.log(chalk.redBright(...args)))

client.login(token)