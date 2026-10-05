import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors({
  origin: "https://paulin-backend.onrender.com"
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

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor ativo na porta ${port}`);
});
