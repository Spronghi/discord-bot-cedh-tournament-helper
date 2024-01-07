export async function checkMsg(msg) {
    // TODO check if this can be removed at some point
    // if (!msg.author.bot) return;

    const lines = msg.content.toLowerCase().split("\n")

    const mediumLine = lines.find(l => l.includes("medium:"))
    const isOnDiscord = !!mediumLine?.includes("webcam")

    const locationLine = lines.find(l => l.includes("location:"))
    const isInTheNetherlands = !!locationLine?.includes("netherlands")

    if (isOnDiscord || isInTheNetherlands) {
        console.log("NOT deleting message", JSON.stringify({
            isOnDiscord,
            isInTheNetherlands,
            locationLine,
            mediumLine
        }))

        return
    }

    msg.delete()

    console.log("Deleted message", JSON.stringify({
        isOnDiscord,
        isInTheNetherlands,
    }))
}

export async function checkHistory(msg) {
    const messages = await msg.channel.messages.fetch({ limit: 100 })

    console.log(`Checking ${messages.size} messages in channel`);

    const promises = messages.map(message => checkMsg(message))
    await Promise.allSettled(promises).catch(console.log)
}

