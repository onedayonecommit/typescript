import { BlockChain } from "@core/index";
import { P2PServer } from "./src/core/server/p2p";
import express from "express";
import { json } from "stream/consumers";
import { ReceivedTx, Wallet } from "@core/wallet/wallet";

const app = express();
const ws = new P2PServer();

app.use(express.json());

// 블록체인 인터페이스 관리
// 다른사람이 내 노드의 블록을 조회하는 것을 방지
// 헤더에 Authorization를 조회
// 사용자가 인증된 경우에만 조회가 가능하도록 처리해야하는 경우
// Authorization : Basic 방식을 사용해서 인증되지 않은 사용자는 조회가 불가능하게
// 이부분은 요청의 헤더에 (req.headers.authorization) authorization 값이
// userid = "soon", userpw = "1234" 정보를 가지고 요청한 사용자만 서버 조회 가능하도록 처리
app.use((req,res,next)=>{
    // req.headers.authorization 타입이 string | undefined
    const baseAuth : string = (req.headers.authorization || "").split(" ")[1];
    if(baseAuth === "") return res.send("오류 빈값이다.");
    const [userid, userpw] = Buffer.from(baseAuth, "base64").toString().split(":");
    // 통과 다 되면 next();
    next();
})

// sendTransaction 라우터
app.post("/sendTransaction",(req,res)=>{
    try {
        const receivedTx : ReceivedTx = req.body;
        Wallet.sendTransaction(receivedTx);
        console.log(receivedTx);
    } catch (e) {
        if(e instanceof Error) console.log(e.message);
    }
    res.json({});
})

app.get('/',(req,res)=>{
    res.send('bit-chain');
});

// 블록 내용 조회
app.get('/chains', (req,res)=>{
    res.json(ws.getChain());
});

// 블록 채굴
app.post('/mineBlock',(req,res)=>{
    const { data } = req.body;
    const newBlock = ws.addBlock(data);
    if(newBlock.isError) return res.send(newBlock.value);
    res.json(newBlock.value);
});

// P2PServer 웹소켓 연결 요청
app.post('/addToPeer',(req,res)=>{
    const { peer } = req.body;
    ws.connectToPeer(peer);
});

// 연결된 socket 조회
app.get('/peer',(req,res)=>{
    const sockets = ws.getSockets().map((socket : any)=> socket)
    res.send(sockets);
});

app.listen(3000,()=>{
    console.log('열림');
    ws.listen();
})

// ts-node : 타입스크립트 node 환경 실행