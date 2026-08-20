import re

from pypdf import PdfReader
from google.oauth2 import service_account
from googleapiclient.discovery import build


# ==========================================
# CONFIGURAÇÕES
# ==========================================

PDF_FILE = "romaneio thais(1).pdf"
CREDENTIALS_FILE = "credentials/service-account.json"

SCOPES = [
    "https://www.googleapis.com/auth/drive.readonly"
]


# ==========================================
# GOOGLE DRIVE
# ==========================================

def conectar_drive():
    credentials = service_account.Credentials.from_service_account_file(
        CREDENTIALS_FILE,
        scopes=SCOPES
    )

    return build(
        "drive",
        "v3",
        credentials=credentials
    )


def listar_arquivos(drive):
    query = (
        "trashed = false "
        "and mimeType contains 'image/'"
    )

    response = drive.files().list(
        q=query,
        pageSize=100,
        spaces="drive",
        fields="files(id, name, mimeType, size)"
    ).execute()

    return response.get("files", [])


def buscar_fotos(codigo, arquivos):
    codigo = str(codigo)

    fotos = []

    for arquivo in arquivos:
        nome = arquivo["name"]

        if not arquivo["mimeType"].startswith("image/"):
            continue

        if nome == codigo or nome.startswith(f"{codigo}_"):
            fotos.append(arquivo)

    return fotos


# ==========================================
# PDF
# ==========================================

def extrair_texto(pdf_file):
    reader = PdfReader(pdf_file)

    texto_completo = ""

    for pagina in reader.pages:
        texto = pagina.extract_text()

        if texto:
            texto_completo += texto + "\n"

    return texto_completo


def extrair_informacoes_romaneio(texto):

    linhas = texto.splitlines()

    numero_romaneio = None
    vendedor = None
    itens = []

    # --------------------------------------
    # Número do romaneio
    # --------------------------------------

    match_romaneio = re.search(
        r"N[º°]\s*(\d+)",
        texto
    )

    if match_romaneio:
        numero_romaneio = match_romaneio.group(1)

    # --------------------------------------
    # Vendedor
    # --------------------------------------
    #
    # Procuramos a linha que contém
    # "Vendedor:".
    #
    # O PDF pode juntar a linha seguinte,
    # então pegamos somente o trecho entre
    # "Vendedor:" e "R ALVARO".
    #

    for linha in linhas:

        if "Vendedor:" not in linha:
            continue

        trecho = linha.split(
            "Vendedor:",
            1
        )[1]

        trecho = trecho.split(
            "R ALVARO",
            1
        )[0]

        vendedor = trecho.strip()

        break

    # --------------------------------------
    # Produtos
    # --------------------------------------

    for linha in linhas:

        linha = linha.strip()

        if not re.match(
            r"^\d{3,5}\s+",
            linha
        ):
            continue

        # Os quatro últimos campos numéricos
        # representam:
        #
        # quantidade
        # valor unitário
        # desconto
        # total
        #
        # Mantemos o regex tolerante a casos
        # em que o PDF junta texto e número.

        match = re.match(
            r"^(\d{3,5})\s+(.+?)"
            r"\s*(\d+,\d{3})\s+"
            r"([\d.]+,\d{2})\s+"
            r"([\d.]+,\d{2})\s+"
            r"([\d.]+,\d{2})$",
            linha
        )

        if not match:
            continue

        codigo = match.group(1)
        descricao = match.group(2).strip()

        quantidade_texto = match.group(3)

        quantidade = float(
            quantidade_texto.replace(
                ",",
                "."
            )
        )

        itens.append({
            "codigo": codigo,
            "descricao": descricao,
            "quantidade": quantidade
        })

    return {
        "numero": numero_romaneio,
        "vendedor": vendedor,
        "itens": itens
    }


# ==========================================
# CRUZAMENTO
# ==========================================

def analisar_romaneio(romaneio, arquivos_drive):

    resultado = {}

    for item in romaneio["itens"]:

        codigo = item["codigo"]

        # Código repetido significa mais de uma
        # unidade da mesma peça.
        #
        # A foto será enviada apenas uma vez.

        if codigo in resultado:

            resultado[codigo]["quantidade"] += (
                item["quantidade"]
            )

            continue

        fotos = buscar_fotos(
            codigo,
            arquivos_drive
        )

        resultado[codigo] = {
            "codigo": codigo,
            "descricao": item["descricao"],
            "quantidade": item["quantidade"],
            "fotos": fotos
        }

    return resultado


# ==========================================
# RELATÓRIO
# ==========================================

def exibir_relatorio(romaneio, resultado):

    com_foto = []
    sem_foto = []

    total_fotos = 0

    for item in resultado.values():

        if item["fotos"]:
            com_foto.append(item)
            total_fotos += len(item["fotos"])
        else:
            sem_foto.append(item)

    print("\n")
    print("========================================")
    print(" RELATÓRIO DO ROMANEIO")
    print("========================================")

    print(
        f"\nRomaneio: {romaneio['numero']}"
    )

    print(
        f"Vendedora: {romaneio['vendedor']}"
    )

    print(
        f"Itens no romaneio: "
        f"{len(romaneio['itens'])}"
    )

    print(
        f"Códigos únicos: "
        f"{len(resultado)}"
    )

    # --------------------------------------
    # COM FOTO
    # --------------------------------------

    print("\n----------------------------------------")
    print(" PEÇAS COM FOTO")
    print("----------------------------------------")

    if not com_foto:

        print("Nenhuma peça possui foto.")

    else:

        for item in com_foto:

            print(
                f"✓ {item['codigo']} "
                f"| Qtd: {item['quantidade']:g} "
                f"| {len(item['fotos'])} foto(s)"
            )

            for foto in item["fotos"]:

                print(
                    f"    └─ {foto['name']}"
                )

    # --------------------------------------
    # SEM FOTO
    # --------------------------------------

    print("\n----------------------------------------")
    print(" PEÇAS SEM FOTO")
    print("----------------------------------------")

    if not sem_foto:

        print("Todas as peças possuem foto.")

    else:

        for item in sem_foto:

            print(
                f"✗ {item['codigo']} "
                f"| Qtd: {item['quantidade']:g}"
            )

    # --------------------------------------
    # RESUMO
    # --------------------------------------

    print("\n----------------------------------------")
    print(" RESUMO")
    print("----------------------------------------")

    print(
        f"Peças com foto: "
        f"{len(com_foto)}"
    )

    print(
        f"Peças sem foto: "
        f"{len(sem_foto)}"
    )

    print(
        f"Total de fotos disponíveis: "
        f"{total_fotos}"
    )

    print("\n========================================")
    print(" FIM DO RELATÓRIO")
    print("========================================")


# ==========================================
# MAIN
# ==========================================

def main():

    print("========================================")
    print(" PROCESSANDO ROMANEIO")
    print("========================================")

    # 1. PDF

    texto = extrair_texto(
        PDF_FILE
    )

    print("\n✓ PDF lido.")

    # 2. Romaneio

    romaneio = extrair_informacoes_romaneio(
        texto
    )

    print("✓ Informações extraídas.")

    # 3. Drive

    drive = conectar_drive()

    print("✓ Google Drive conectado.")

    # 4. Catálogo

    arquivos_drive = listar_arquivos(
        drive
    )

    print(
        f"✓ {len(arquivos_drive)} "
        f"foto(s) encontradas no catálogo."
    )

    # 5. Cruzamento

    resultado = analisar_romaneio(
        romaneio,
        arquivos_drive
    )

    # 6. Relatório

    exibir_relatorio(
        romaneio,
        resultado
    )


if __name__ == "__main__":
    main()