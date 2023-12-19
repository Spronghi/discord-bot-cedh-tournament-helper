import { Client, GatewayIntentBits } from 'discord.js'
import { config } from 'dotenv'
import http from 'http'

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

async function checkMsg(msg) {
  // TODO check if this can be removed at some point
  // if (!msg.author.bot) return;
  const lines = msg.content.toLowerCase().split("\n");
  const locationLine = lines.find(l => l.includes("location:"))

  if (!locationLine) return;

  const isDiscord = locationLine.includes("https://discord.gg/")
  const isNetherlands = locationLine.includes("netherlands")

  if (isDiscord || isNetherlands) return;

  console.log("Deleted message", msg.author.username, locationLine)

  msg.delete()

}

async function checkHistory(msg) {
  const messages = await msg.channel.messages.fetch({ limit: 100 })

  console.log(`Received ${messages.size} messages`);

  const promises = messages.map(message => checkMsg(message))
  await Promise.allSettled(promises)
}

client.on("messageCreate", async (msg) => {
  try {
    if (msg.channel.name !== "upcoming-tournaments") return;

    if (msg.content === "/cedh-tournaments-check") {
      await checkHistory(msg)
      await msg.delete()

      return
    }

    await checkMsg(msg)
  } catch (error) {
    console.error(error)
  }
})

client.login(process.env.TOKEN)
