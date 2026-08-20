import os
import re
import tempfile

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pypdf import PdfReader

from google.oauth2 import service_account
from googleapiclient.discovery import build


# ============================================================
# CONFIGURAÇÕES
# ============================================================

CREDENTIALS_FILE = "credentials/service-account.json"

SCOPES = [
    "https://www.googleapis.com/auth/drive.readonly"
]


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="Becaletto API",
    description="API para análise de romaneios e catálogo de fotos.",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# GOOGLE DRIVE
# ============================================================

def conectar_drive():

    if not os.path.exists(CREDENTIALS_FILE):
        raise FileNotFoundError(
            f"Arquivo de credenciais não encontrado: "
            f"{CREDENTIALS_FILE}"
        )

    credentials = (
        service_account
        .Credentials
        .from_service_account_file(
            CREDENTIALS_FILE,
            scopes=SCOPES
        )
    )

    return build(
        "drive",
        "v3",
        credentials=credentials
    )


def listar_fotos_drive(drive):

    query = (
        "trashed = false "
        "and mimeType contains 'image/'"
    )

    response = (
        drive.files()
        .list(
            q=query,
            pageSize=100,
            spaces="drive",
            fields=(
                "files("
                "id,"
                "name,"
                "mimeType,"
                "size"
                ")"
            )
        )
        .execute()
    )

    return response.get("files", [])


def buscar_fotos(codigo, arquivos_drive):

    codigo = str(codigo)

    fotos = []

    for arquivo in arquivos_drive:

        nome = arquivo["name"]

        if not arquivo["mimeType"].startswith("image/"):
            continue

        if (
            nome == codigo
            or nome.startswith(f"{codigo}_")
        ):
            fotos.append(
                {
                    "id": arquivo["id"],
                    "nome": nome,
                    "mimeType": arquivo["mimeType"]
                }
            )

    return fotos


# ============================================================
# PDF
# ============================================================

def extrair_texto_pdf(caminho_pdf):

    reader = PdfReader(caminho_pdf)

    texto_completo = ""

    for pagina in reader.pages:

        texto = pagina.extract_text()

        if texto:
            texto_completo += texto + "\n"

    return texto_completo


# ============================================================
# EXTRAÇÃO DO ROMANEIO
# ============================================================

def extrair_numero_romaneio(texto):

    padroes = [
        r"N[º°]\s*(\d+)",
        r"Romaneio\s*[:#]?\s*(\d+)",
        r"ROMANEIO\s*[:#]?\s*(\d+)"
    ]

    for padrao in padroes:

        match = re.search(
            padrao,
            texto,
            re.IGNORECASE
        )

        if match:
            return match.group(1)

    return None


def extrair_vendedora(texto):

    linhas = texto.splitlines()

    for linha in linhas:

        if "Vendedor:" not in linha:
            continue

        trecho = linha.split(
            "Vendedor:",
            1
        )[1]

        trecho = trecho.strip()

        # Remove informações que eventualmente
        # aparecem depois do nome.

        marcadores = [
            "R ALVARO",
            " - CIDADE",
            "Cidade",
            "Endereço",
            "Endereco"
        ]

        for marcador in marcadores:

            if marcador in trecho:

                trecho = trecho.split(
                    marcador,
                    1
                )[0]

        trecho = re.sub(
            r"\s+",
            " ",
            trecho
        ).strip()

        if trecho:
            return trecho

    return None


def extrair_itens(texto):

    linhas = texto.splitlines()

    itens = []

    for linha in linhas:

        linha = linha.strip()

        if not linha:
            continue

        # Código de peça normalmente possui
        # entre 3 e 5 dígitos.

        if not re.match(
            r"^\d{3,5}\s+",
            linha
        ):
            continue

        # Tenta localizar o código no início.

        match_codigo = re.match(
            r"^(\d{3,5})\s+",
            linha
        )

        if not match_codigo:
            continue

        codigo = match_codigo.group(1)

        # ----------------------------------------------------
        # Quantidade
        # ----------------------------------------------------
        #
        # Para nosso fluxo, a quantidade não é essencial.
        #
        # O mais importante é identificar o código.
        #
        # Mesmo assim tentamos extrair.
        #

        quantidade = 1

        resto = linha[
            match_codigo.end():
        ]

        numeros = re.findall(
            r"\d+,\d{3}",
            resto
        )

        if numeros:

            try:

                valor = numeros[0].replace(
                    ",",
                    "."
                )

                quantidade_float = float(
                    valor
                )

                # Corrige casos como:
                # 1,000
                # 2,000

                if quantidade_float.is_integer():

                    quantidade = int(
                        quantidade_float
                    )

            except ValueError:
                quantidade = 1

        itens.append(
            {
                "codigo": codigo,
                "quantidade": quantidade
            }
        )

    return itens


# ============================================================
# CONSOLIDAÇÃO
# ============================================================

def consolidar_itens(itens, arquivos_drive):

    resultado = {}

    for item in itens:

        codigo = item["codigo"]

        if codigo not in resultado:

            fotos = buscar_fotos(
                codigo,
                arquivos_drive
            )

            resultado[codigo] = {
                "codigo": codigo,
                "quantidade": item["quantidade"],
                "fotos": fotos
            }

        else:

            # Se o mesmo código aparecer novamente,
            # significa mais de uma unidade da peça.
            #
            # Não adicionamos novas fotos.

            resultado[codigo]["quantidade"] += (
                item["quantidade"]
            )

    return list(
        resultado.values()
    )


# ============================================================
# ANÁLISE
# ============================================================

def analisar_romaneio(caminho_pdf):

    texto = extrair_texto_pdf(
        caminho_pdf
    )

    numero = extrair_numero_romaneio(
        texto
    )

    vendedora = extrair_vendedora(
        texto
    )

    itens = extrair_itens(
        texto
    )

    drive = conectar_drive()

    arquivos_drive = listar_fotos_drive(
        drive
    )

    pecas = consolidar_itens(
        itens,
        arquivos_drive
    )

    pecas_com_foto = [
        p
        for p in pecas
        if len(p["fotos"]) > 0
    ]

    pecas_sem_foto = [
        p
        for p in pecas
        if len(p["fotos"]) == 0
    ]

    total_fotos = sum(
        len(p["fotos"])
        for p in pecas
    )

    return {
        "romaneio": numero,
        "vendedora": vendedora,

        "total_itens": len(itens),

        "codigos_unicos": len(pecas),

        "fotos_disponiveis": total_fotos,

        "pecas_com_foto": len(
            pecas_com_foto
        ),

        "pecas_sem_foto": len(
            pecas_sem_foto
        ),

        "pecas": pecas
    }


# ============================================================
# ENDPOINT
# ============================================================

@app.post("/api/analisar")
async def analisar(
    arquivo: UploadFile = File(...)
):

    if not arquivo.filename:
        raise HTTPException(
            status_code=400,
            detail="Nenhum arquivo foi enviado."
        )

    extensao = os.path.splitext(
        arquivo.filename
    )[1].lower()

    if extensao != ".pdf":

        raise HTTPException(
            status_code=400,
            detail="O arquivo precisa ser um PDF."
        )

    caminho_temporario = None

    try:

        # ----------------------------------------------------
        # Salva temporariamente o PDF
        # ----------------------------------------------------

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        ) as arquivo_temporario:

            caminho_temporario = (
                arquivo_temporario.name
            )

            conteudo = await arquivo.read()

            arquivo_temporario.write(
                conteudo
            )

        # ----------------------------------------------------
        # Analisa
        # ----------------------------------------------------

        resultado = analisar_romaneio(
            caminho_temporario
        )

        return resultado

    except Exception as erro:

        print(
            "ERRO AO ANALISAR ROMANEIO:"
        )

        print(erro)

        raise HTTPException(
            status_code=500,
            detail=str(erro)
        )

    finally:

        # ----------------------------------------------------
        # Remove o arquivo temporário
        # ----------------------------------------------------

        if (
            caminho_temporario
            and os.path.exists(
                caminho_temporario
            )
        ):

            os.remove(
                caminho_temporario
            )


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/api/health")
def health():

    return {
        "status": "ok",
        "service": "becaletto-api"
    }