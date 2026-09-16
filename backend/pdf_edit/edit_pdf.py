from pypdf import PdfReader, PdfWriter
from pathlib import Path
from os import listdir
from os.path import isfile, join


PDF_DIR = Path(__file__).resolve().parent.parent / "testing_pdf"


def merge_pdfs(pdfs):
    merger = PdfWriter()

    for pdf in pdfs:
        merger.append(str(PDF_DIR/pdf))

    merger.write(str(PDF_DIR / "combined.pdf"))
    print("Sucess")


