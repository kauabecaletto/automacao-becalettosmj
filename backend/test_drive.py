from google.oauth2 import service_account
from googleapiclient.discovery import build

CREDENTIALS_FILE = "credentials/service-account.json"

SCOPES = [
    "https://www.googleapis.com/auth/drive.readonly"
]


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


def buscar_fotos(drive, codigo):
    arquivos = listar_arquivos(drive)

    codigo = str(codigo)

    fotos = []

    for arquivo in arquivos:
        nome = arquivo["name"]

        if not arquivo["mimeType"].startswith("image/"):
            continue

        if nome == codigo or nome.startswith(f"{codigo}_"):
            fotos.append(arquivo)

    return fotos


def testar_codigo(drive, codigo):
    fotos = buscar_fotos(drive, codigo)

    print(f"\nPeça: {codigo}")
    print(f"Fotos encontradas: {len(fotos)}")

    if not fotos:
        print("  Nenhuma foto encontrada.")
        return

    for foto in fotos:
        print(
            f"  - {foto['name']} "
            f"({foto['mimeType']})"
        )


def main():
    drive = conectar_drive()

    print("====================================")
    print(" TESTE DO CATÁLOGO DE FOTOS")
    print("====================================")

    testar_codigo(drive, "1545")
    testar_codigo(drive, "919")
    testar_codigo(drive, "9999")

    print("\n====================================")
    print(" TESTE FINALIZADO")
    print("====================================")


if __name__ == "__main__":
    main()