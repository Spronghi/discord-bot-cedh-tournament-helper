import { Client, GatewayIntentBits } from 'discord.js'
import { config } from 'dotenv'
import http from 'http'
import { checkMsg, checkHistory } from './msg.js'

config()

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] })

http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-type': 'text/plain'
    });
    res.write('Hey');
    res.end();
}).listen(4000);

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
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
        console.error(error)
    }
})

client.login(process.env.TOKEN)
