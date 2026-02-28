import sys
import os
from pdf2docx import Converter

def convert_pdf_to_docx(pdf_file, docx_file):
    try:
        # Check if input file exists
        if not os.path.exists(pdf_file):
            print(f"Error: Input file not found at {pdf_file}")
            sys.exit(1)

        # Conversion start
        cv = Converter(pdf_file)
        cv.convert(docx_file, start=0, end=None)
        cv.close()
        print("SUCCESS")
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 pdf2word.py <input_pdf> <output_docx>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    
    convert_pdf_to_docx(input_path, output_path)