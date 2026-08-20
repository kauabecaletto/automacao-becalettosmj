# Becaletto

> Automação do processo de conferência de romaneios e envio de fotos de peças para revendedoras.

O **Becaletto** transforma um processo manual de conferência de malas em um fluxo digital: o usuário envia o romaneio, o sistema identifica as peças, consulta o catálogo de fotos e prepara o envio para a revendedora.

## ✨ O que o sistema faz

- 📄 Leitura de romaneios em PDF
- 🔎 Identificação automática das peças
- 🔢 Consolidação de peças repetidas
- 🖼️ Consulta de fotos no Google Drive
- 📋 Conferência das peças encontradas e sem foto
- 👩‍💼 Cadastro e seleção de revendedoras
- 📱 Preparação do envio pelo WhatsApp

## 🖥️ Fluxo

```text
        ROMANEIO
           │
           ▼
    ┌───────────────┐
    │  Upload PDF   │
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │    Análise    │
    │   do romaneio │
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │ Google Drive  │
    │  Catálogo de  │
    │     fotos     │
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │  Conferência  │
    │   das peças   │
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │ Revendedora   │
    │ + WhatsApp    │
    └───────┬───────┘
            │
            ▼
       ENVIO DAS FOTOS****
