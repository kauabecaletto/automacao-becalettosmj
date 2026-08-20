# Automação de envio de fotos

Sistema para automatização do processamento de romaneios e preparação do envio de fotos de peças para revendedoras.

## Objetivo

O projeto tem como objetivo automatizar o processo de:

1. Receber o romaneio em PDF;
2. Identificar as peças e suas quantidades;
3. Consultar o catálogo de fotos no Google Drive;
4. Apresentar as peças encontradas e as que não possuem foto;
5. Identificar a revendedora;
6. Preparar o envio das fotos pelo WhatsApp.

## Arquitetura

O projeto é dividido em frontend e backend.

```text
Frontend
   │
   │ HTTP
   ▼
Backend / FastAPI
   │
   ├── Leitura do PDF
   │
   └── Google Drive
