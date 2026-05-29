"""
Resume parsing service
Extracts text from PDF and DOCX files
"""
import fitz  # PyMuPDF
import pdfplumber
import docx


def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from PDF using PyMuPDF and pdfplumber fallback"""
    text = ""
    try:
        # Try PyMuPDF first
        doc = fitz.open(pdf_path)
        for page in doc:
            text += page.get_text()
        doc.close()
        
        # If text is empty or too short, try pdfplumber for better table/layout parsing
        if len(text.strip()) < 100:
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() or ""
                    
    except Exception as e:
        print(f"PDF Extraction error: {e}")
        
    return text.strip()

def extract_text_from_docx(docx_path: str) -> str:
    """Extract text from DOCX file"""
    text = ""
    try:
        doc = docx.Document(docx_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        print(f"DOCX Extraction error: {e}")
        
    return text.strip()
