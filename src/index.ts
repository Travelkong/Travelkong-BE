import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT ?? 8080;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Currently listening on port ${port}`);
});
