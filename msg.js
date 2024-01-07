import logger from './logger.js'

export async function checkMsg(msg) {
    // TODO check if this can be removed at some point
    // if (!msg.author.bot) return;

    const lines = msg.content.toLowerCase().split("\n")

    const mediumLine = lines.find(l => l.includes("medium:"))
    const isOnDiscord = !!mediumLine?.includes("webcam")

    const locationLine = lines.find(l => l.includes("location:"))
    const isInTheNetherlands = !!locationLine?.includes("netherlands")

    const logInfos = JSON.stringify({
        isOnDiscord,
        isInTheNetherlands,
        locationLine,
        mediumLine
    })

    if (isOnDiscord || isInTheNetherlands) {
        logger.info("NOT deleting message", logInfos)

        return
    }

    msg.delete()

    logger.info("Deleted message", logInfos)
}

export async function checkHistory(msg) {
    const messages = await msg.channel.messages.fetch({ limit: 100 })

    logger.info(`Checking ${messages.size} messages in channel`);

    const promises = messages.map(message => checkMsg(message))
    await Promise.allSettled(promises).catch(logger.error)
}

