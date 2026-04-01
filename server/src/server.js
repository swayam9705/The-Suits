import "dotenv/config"
import { Server } from "@hocuspocus/server"
import { Redis } from "@hocuspocus/extension-redis"
import { Database } from "@hocuspocus/extension-database"
import { createClient } from "@supabase/supabase-js"

console.log("DEBUG: Connecting to redis at ", process.env.REDIS_URL)

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
)

const server = new Server({
    address: '127.0.0.1', // standard local address
    port: process.env.PORT || 1234,

    async onAuthenticate({ name, token }) {
        const { data, error } = await supabase
            .from("conferences")
            .select("conf_id")
            .eq("conf_id", name)
            .single()

        if (error || !data) {
            console.log(`DEV ERROR: Room ${name} does not exist.`)
            throw new Error("Conference Not Found")
        }

        let userPayload = { username: "Anonymous", avatarColor: "#000000" }

        try {
            if (token) {
                userPayload = JSON.parse(token)
            }
        }
        catch (err) {
            console.warn("Failed to parse user metadata. using defaults.")
        }

        return {
            user: {
                id: `user-${Math.random().toString(36).substr(2, 9)}`, // temporary session
                username: userPayload.username,
                avatarColor: userPayload.avatarColor
            }
        }
    },

    extensions: [
        new Redis({
            url: process.env.REDIS_URL,
            family: 0,
            redisOptions: {
                tls: { rejectUnauthorized: false },
            }
        }),

        new Database({
            fetch: async ({ name }) => {
                const { data, error } = await supabase
                    .from("files")
                    .select("content")
                    .eq("conf_id", name)
                    .single()
                
                if (error || !data) return null
                
                return new Uint8Array(data.content)
            },

            store: async ({ name, data }) => {
                try {
                    const { error } = await supabase
                        .from("files")
                        .update({
                            content: data,
                            updated_at: new Date().toISOString()
                        })
                        .eq("id", name)
                    
                    if (error) {
                        console.log("DEV ERROR: Supbase Store Error: ", error.message)
                    }
                }
                catch (err) {
                    console.log("DEV ERROR: Critical Store Error: ", err)
                }
            }
        })
    ],

    async onConnect({ request, connection }) {
        const ip = request.headers['x-formatted-for'] || connection.remoteAddress
        console.log(`[CONNECTED] IP: ${ip} | Time: ${new Date().toISOString()}`)
    }
})

server.listen()
console.log(`--- SERVER LIVE ON PORT ${process.env.PORT || 1234}`)