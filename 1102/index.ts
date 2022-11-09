// import { BlockChain } from "./src/core/blockChain";
import { P2PServer } from "./src/core/server/p2p";
import express from "express";

const app = express();
const ws = new P2PServer();

app.listen(8000, () => {
  console.log("hi");
  ws.listen();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("bit-chain");
});

/** 블록 내용 조회 */
app.get("/chains", (req, res) => {
  res.json(ws.getChain());
});

/** 블록 채굴 */
app.post("/mineBlock", (req, res) => {
  const { data } = req.body;
  const newBlock = ws.addBlock(data);
  if (newBlock.isError) return res.send(newBlock.value);
  res.json(newBlock.value);
});

/** P2PServer 웹소켓 연결 요청 */
app.post("/addtopeer", (req, res) => {
  const { peer } = req.body;
  console.log("hi");
  ws.connectToPeer(peer);
});

/** 연결된 socket 조회 */
app.get("/peer", (req, res) => {
  console.log("hi");
  const sockets = ws.getSockets().map((socket: any) => {
    return res.json(socket);
  });
});
