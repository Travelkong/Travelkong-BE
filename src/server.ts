import { Server } from "http"

async function startServer(server: Server): Promise<void> {
    const port: string | number = process.env.API_PORT ?? 8080
    server.listen(port, () => console.log(`[server]: The server is running on port: ${port}`))
}

export default startServer