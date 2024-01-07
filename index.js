import { Client, GatewayIntentBits } from 'discord.js'
import { config } from 'dotenv'
import http from 'http'
import url from 'url'

import logger from './logger.js'
import { checkMsg, checkHistory } from './msg.js'

config()

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] })

http.createServer((req, res) => {
    const { pathname } = url.parse(req.url)

    if (pathname !== "/ping") {
        res.writeHead(404, { 'Content-type': 'text/plain' });
        res.write('Not Found');
        res.end();

        return
    }

    res.writeHead(200, { 'Content-type': 'text/plain' });
    res.write('pong');
    res.end();
}).listen(4000);

client.on("ready", () => {
    logger.info(`Logged in as ${client.user.tag}!`)
})

client.on("messageCreate", async (msg) => {
    try {
        if (msg.channel.name !== "upcoming-tournaments") return;

        if (msg.content === "/cedh-tournaments-check") {
            await checkHistory(msg)

            return
        }

        await checkMsg(msg)
    } catch (error) {
        logger.error(error)
    }
})

client.login(process.env.TOKEN)
