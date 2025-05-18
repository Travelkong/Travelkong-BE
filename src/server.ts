import type { Server } from "node:http"

async function startServer(server: Server): Promise<void> {
  const port: string | number = process.env.PORT ?? 8080
  server.listen(port, () => console.log(`Listening on port ${port}`))
}

export default startServer
