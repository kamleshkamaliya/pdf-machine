import sys
import os

# 🛠️ System libraries ko pehle prioritize karein
try:
    from lxml import etree
    import fitz
    from pdf2docx import Converter
except ImportError:
    # Agar normal import fail ho, tabhi manual path dalo
    user_site = os.path.expanduser("~/Library/Python/3.9/lib/python/site-packages")
    if user_site not in sys.path:
        sys.path.insert(0, user_site)
    from lxml import etree
    import fitz
    from pdf2docx import Converter

def convert_pdf_to_word(pdf_file, docx_file):
    try:
        # Page count check logic
        doc = fitz.open(pdf_file)
        if len(doc) > 2:
            print("PAGE_LIMIT_ERROR")
            doc.close()
            return
        doc.close()

        # Conversion logic
        cv = Converter(pdf_file)
        cv.convert(docx_file, start=0, end=None)
        cv.close()
        print("SUCCESS")
    except Exception as e:
        print(f"ERROR: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) > 2:
        convert_pdf_to_word(sys.argv[1], sys.argv[2])