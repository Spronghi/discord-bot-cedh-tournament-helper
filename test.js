import assert from 'node:assert'
import { describe, it } from 'node:test';
import { checkHistory, checkMsg } from "./msg.js"

const inPersonNL = `
\`\`\`Lucky Top Deck cEDH series 3\`\`\`**Medium:** In Person
**Date:** January 27th, 2024
**Time:** 11:00 AM
**Location:** The Netherlands, Haarlem, Kruisweg 60. Het Spellenhuis
**Entry Fee:** ?25
**Prize Support:** __?10 store credit per swiss win, extra store credit for top 4 (?5 per tournament participants)__
**Description:**
> Lucky Top Deck is back with it's next tournament. We organize cEDH tournaments in The Netherlands ???? where players can compete against the best. We also provide a nice environment for newer players to the competitive meta to dive right in! Our event will be fully proxy friendly. An initiative from the players for the players. 
> 4 swiss rounds with top 4 final.
> 80 min rounds, no extra turns.
> Every win is rewarded
**Sign up here:** https://luckytopdeck.com/
**Restrictions:** Full proxy friendly. No counterfeits!. 
**Tournament Organizer:** Luck Top Deck @maratiam
**Tags:** @Tournament @In Person @Paid Entry
`

const inPersonNotNL = `
\`\`\`Commander Showdown 12: Stroke of Midnight\`\`\`**Medium:** In-Person
**Date:** Sunday, December 31st, 2023
**Time:** 11:00 AM Start, 9-11 AM Registration
**Location:** Crimson Lion Games, 7410 Blvd 26 Richland Hills, TX 76180
**Entry Fee:** $60 Pre-Registration, $70 Day Of
**Prize Support:** __1st FTV Mox Diamond, 2nd Revised Taiga & Dockside Extortionist, 3rd Revised Wheel of Fortune & Foil Borderless Force of Negation, 4th Power Artifact + Force of Will__
**Description:**
> https://facebook.com/events/s/commander-showdown-xii-the-str/874649017485846/
**Restrictions:** 5 Reserved List Proxies of cheapest printing over $100
**Tournament Organizer:** @kingthegreat.
**Tags:** @Tournament @Paid Entry @Restrictions @In Person**
`

const onDiscord = `
\`\`\`Lotus Series II - powered by ka0s\`\`\`**Medium:** Webcam 
**Date:**  December 30th
**Time:** 10AM EST
**Entry Fee:**  $40
**Prize Support: **
__1st: $1536 @128 players (30% of Entry Pool)
Entry to LotusCon 2024 ($99 value), a champion Interview for Youtube, place in our hall of fame, and discord bling! 
2nd-4th: $512 @128 players (10% of Entry Pool)
5th-8th: $205 @128 players, (4% of Entry Pool)
Top 16: Complimentary ka0s League Season 9 access, Top 16 discord bling
Top 64: Series points scaling with your standing to show off on the TopDeck Championship Series leaderboard, leading up to an in-person invitational of the year's best players! (topdeck.gg/championship-series-2024)
prize amounts scale with player count__
**Description:** 
> Take a break from fighting with your in-laws and come fight with your cEDH family at the second in a series of eleven high prize pool webcam tournaments leading up to LotusCon 2024, put on by Mythic Lotus Gaming and powered by ka0s Tournaments. Five 90min rounds of swiss, cut to top 16 into top 4. 
**Sign up here:**  https://topdeck.gg/event/7XTcfxNKd9IjCHwEor9k
**Discord:** https://discord.gg/G6xzDwp6M7
**Restrictions:** Proxy friendly
**Tournament Organizer:** @aaeia
**Tags:** @Tournament @Webcam @Paid Entry
`

const command = "/cedh-tournaments-check"

describe('msg.js', () => {
    it('should delete the message if it includes the command', async (t) => {
        const msg = { content: command, delete: t.mock.fn() }

        await checkMsg(msg)

        assert.strictEqual(msg.delete.mock.calls.length, 1)
    })

    it('should delete the message if medium is in person and location is not NL', async (t) => {
        const msg = { content: inPersonNotNL, delete: t.mock.fn() }

        await checkMsg(msg)

        assert.strictEqual(msg.delete.mock.calls.length, 1)
    })

    it("should NOT delete the message if medium is in person and location is NL", async (t) => {
        const msg = { content: inPersonNL, delete: t.mock.fn() }

        await checkMsg(msg)

        assert.strictEqual(msg.delete.mock.calls.length, 0)
    })

    it("should NOT delete the message if medium is in disdcord", async (t) => {
        const msg = { content: onDiscord, delete: t.mock.fn() }

        await checkMsg(msg)

        assert.strictEqual(msg.delete.mock.calls.length, 0)
    })

    it("should delete every non discord non NL message in the channel", async (t) => {
        const deleteFn = t.mock.fn()
        const msg = {
            channel: {
                messages: {
                    fetch: t.mock.fn(() => [
                        { content: inPersonNL, delete: deleteFn },
                        { content: onDiscord, delete: deleteFn },
                        { content: inPersonNotNL, delete: deleteFn },
                        { content: command, delete: deleteFn },
                    ])
                }
            }
        }

        await checkHistory(msg)

        assert.strictEqual(deleteFn.mock.calls.length, 2)
    })
})
