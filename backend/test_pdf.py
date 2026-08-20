import re
from pypdf import PdfReader


PDF_FILE = "romaneio thais(1).pdf"


def extrair_texto(pdf_file):
    reader = PdfReader(pdf_file)

    texto_completo = ""

    for pagina in reader.pages:
        texto = pagina.extract_text()

        if texto:
            texto_completo += texto + "\n"

    return texto_completo


def extrair_codigos(texto):
    codigos = []

    linhas = texto.splitlines()

    for linha in linhas:
        linha = linha.strip()

        # Procura linhas que começam com um código numérico
        # seguido de espaço.
        #
        # Exemplos:
        # 919 COLAR ELOS...
        # 1545 BRINCO ORGANICO...
        # 4232 BRINCO CORAÇÃO...
        #
        padrao = re.match(r"^(\d{3,5})\s+", linha)

        if padrao:
            codigo = padrao.group(1)
            codigos.append(codigo)

    return codigos


def main():
    print("====================================")
    print(" TESTE DE LEITURA DO ROMANEIO")
    print("====================================")

    texto = extrair_texto(PDF_FILE)

    print("\nTexto extraído do PDF com sucesso.")

    codigos = extrair_codigos(texto)

    print(f"\nQuantidade de itens encontrados: {len(codigos)}")

    print("\nCódigos encontrados:\n")

    for numero, codigo in enumerate(codigos, start=1):
        print(f"{numero:02d} - {codigo}")

    codigos_unicos = list(dict.fromkeys(codigos))

    print("\n====================================")
    print(" RESUMO")
    print("====================================")

    print(f"Total de itens: {len(codigos)}")
    print(f"Códigos únicos: {len(codigos_unicos)}")

    duplicados = []

    for codigo in codigos_unicos:
        quantidade = codigos.count(codigo)

        if quantidade > 1:
            duplicados.append((codigo, quantidade))

    if duplicados:
        print("\nCódigos repetidos:")

        for codigo, quantidade in duplicados:
            print(f"- {codigo}: {quantidade} vezes")

    print("\n====================================")
    print(" TESTE FINALIZADO")
    print("====================================")


if __name__ == "__main__":
    main()