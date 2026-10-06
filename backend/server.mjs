import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors({
  origin: "https://paulinnobrer.github.io",
}));

app.use(express.json({ limit: "20kb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (_req, res) => {
  res.send("Backend Paulin ativo");
});

app.post("/api/gerar-site", async (req, res) => {
  try {
    const { empresa, tipo, estilo, descricao, whatsapp, cidade, extras } = req.body;

const ramo = tipo;
const contato = whatsapp;

if (!empresa || !ramo || !descricao) {
  return res.status(400).json({
    error: "Preencha o nome da empresa, o tipo de negócio e a descrição."
  });
}

const informacoes = [
  `Empresa: ${empresa}`,
  `Ramo: ${ramo}`,
  `Estilo: ${estilo || "moderno"}`,
  `Descrição: ${descricao}`,
  `WhatsApp: ${contato || "não informado"}`,
  `Cidade ou endereço: ${cidade || "não informado"}`,
  `Outras informações: ${extras || "nenhuma"}`
].join("\n");

    const pedido = String(req.body?.pedido || "").trim();

    if (!pedido) {
      return res.status(400).json({ erro: "Digite o que deseja criar." });
    }

    const resposta = await client.responses.create({
      model: "gpt-5-mini",
      instructions:
        "Crie uma página de vendas em HTML completo e responsivo, com CSS embutido. Retorne somente o HTML, sem bloco Markdown ou explicações.",
      input: pedido
    });

    res.json({ html: resposta.output_text });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Falha ao gerar o site." });
  }
});
