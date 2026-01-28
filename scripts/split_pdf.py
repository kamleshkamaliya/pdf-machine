import sys
import os
import fitz  # PyMuPDF library

def split_pdf(input_path, output_dir, mode, range_str=None):
    try:
        # PDF Load karo
        doc = fitz.open(input_path)
        total_pages = len(doc)
        
        # Output folder check
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        print(f"DEBUG: Processing {total_pages} pages in mode '{mode}'")

        # --- MODE 1: SPLIT ALL PAGES ---
        if mode == 'all':
            for i in range(total_pages):
                # New PDF banao
                new_doc = fitz.open()
                # Page Insert karo (Ye data preserve karta hai)
                new_doc.insert_pdf(doc, from_page=i, to_page=i)
                
                output_path = os.path.join(output_dir, f"page_{i + 1}.pdf")
                new_doc.save(output_path)
                new_doc.close()

        # --- MODE 2: EXTRACT RANGE ---
        elif mode == 'range' and range_str:
            try:
                parts = range_str.split('-')
                start = int(parts[0])
                end = int(parts[1]) if len(parts) > 1 else start
                
                if start < 1: start = 1
                if end > total_pages: end = total_pages
                if start > end: start, end = end, start
            except:
                print("ERROR: Invalid Range")
                sys.exit(1)

            new_doc = fitz.open()
            # fitz 0-index use karta hai, isliye -1 kiya
            new_doc.insert_pdf(doc, from_page=start-1, to_page=end-1)
            
            output_path = os.path.join(output_dir, f"extracted_{start}-{end}.pdf")
            new_doc.save(output_path)
            new_doc.close()

        doc.close()
        print("SUCCESS")

    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Python arguments read karo
    if len(sys.argv) < 4:
        print("Usage: python3 split_pdf.py input.pdf output_dir mode [range]")
        sys.exit(1)

    input_f = sys.argv[1]
    output_d = sys.argv[2]
    mode_arg = sys.argv[3]
    range_arg = sys.argv[4] if len(sys.argv) > 4 else None

    split_pdf(input_f, output_d, mode_arg, range_arg)