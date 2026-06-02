import io
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage
from reportlab.lib.units import inch

# We will use standard fonts for now. The user can add Tamil TTF fonts later.
# To add Tamil: pdfmetrics.registerFont(TTFont('TamilFont', 'fonts/latha.ttf'))

class PrescriptionPDFGenerator:
    def __init__(self, clinic_data: dict, doctor_data: dict, patient_data: dict, medicines: list, notes: str, next_visit: str, qr_code_bytes: bytes):
        self.clinic_data = clinic_data
        self.doctor_data = doctor_data
        self.patient_data = patient_data
        self.medicines = medicines
        self.notes = notes
        self.next_visit = next_visit
        self.qr_code_bytes = qr_code_bytes
        self.styles = getSampleStyleSheet()

    def _build_header(self) -> list:
        elements = []
        # Title
        title_style = ParagraphStyle(
            'ClinicTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor("#2563eb"),
            alignment=1 # Center
        )
        elements.append(Paragraph(self.clinic_data.get('name', 'Elsan Clinic'), title_style))
        
        # Address & Contact
        contact_style = ParagraphStyle('Contact', parent=self.styles['Normal'], alignment=1, textColor=colors.gray)
        elements.append(Paragraph(self.clinic_data.get('address', '123 Health Avenue, Medical District'), contact_style))
        elements.append(Paragraph(f"Phone: {self.clinic_data.get('phone', '+91 98765 43210')} | Email: {self.clinic_data.get('email', 'contact@elsan.com')}", contact_style))
        elements.append(Spacer(1, 0.3 * inch))
        return elements

    def _build_doctor_info(self) -> list:
        elements = []
        doc_style = ParagraphStyle('DocInfo', parent=self.styles['Normal'], fontSize=12, fontName='Helvetica-Bold')
        elements.append(Paragraph(f"{self.doctor_data.get('name', '')}", doc_style))
        elements.append(Paragraph(f"{self.doctor_data.get('qualification', '')}", self.styles['Normal']))
        elements.append(Paragraph(f"{self.doctor_data.get('specialization', '')}", self.styles['Normal']))
        elements.append(Spacer(1, 0.2 * inch))
        return elements

    def _build_patient_info(self) -> list:
        # We use a table for a clean 2-column layout
        data = [
            [f"Patient Name: {self.patient_data.get('name', '')}", f"Date: {self.patient_data.get('date', '')}"],
            [f"Patient ID: {self.patient_data.get('id', '')}", f"Age/Gender: {self.patient_data.get('age', '')} / {self.patient_data.get('gender', '')}"],
            [f"Phone: {self.patient_data.get('phone', '')}", ""]
        ]
        
        t = Table(data, colWidths=[3.5 * inch, 3.5 * inch])
        t.setStyle(TableStyle([
            ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
            ('FONTSIZE', (0,0), (-1,-1), 10),
            ('TEXTCOLOR', (0,0), (-1,-1), colors.black),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.lightgrey),
        ]))
        return [t, Spacer(1, 0.3 * inch)]

    def _build_medicine_table(self) -> list:
        elements = []
        rx_style = ParagraphStyle('Rx', parent=self.styles['Heading2'], fontSize=18, fontName='Helvetica-Bold', textColor=colors.HexColor("#2563eb"))
        elements.append(Paragraph("Rx", rx_style))
        elements.append(Spacer(1, 0.1 * inch))

        # Table Header
        data = [["Medicine", "Dosage", "M-A-N", "Duration", "Instructions"]]
        
        # Table Rows
        for med in self.medicines:
            man = f"{'1' if med.get('morning') else '0'}-{'1' if med.get('afternoon') else '0'}-{'1' if med.get('night') else '0'}"
            data.append([
                med.get('medicine_name', ''),
                med.get('dosage', ''),
                man,
                f"{med.get('duration_days', '')} Days",
                med.get('instructions', '')
            ])
            
        t = Table(data, colWidths=[2.5*inch, 1*inch, 1*inch, 1*inch, 1.5*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f4f4f5")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor("#18181b")),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,0), 10),
            ('BOTTOMPADDING', (0,0), (-1,0), 12),
            ('BACKGROUND', (0,1), (-1,-1), colors.white),
            ('GRID', (0,0), (-1,-1), 1, colors.HexColor("#e4e4e7")),
            ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
            ('FONTSIZE', (0,1), (-1,-1), 9),
            ('PADDING', (0,0), (-1,-1), 8),
        ]))
        
        elements.append(t)
        elements.append(Spacer(1, 0.3 * inch))
        return elements

    def _build_notes_and_footer(self) -> list:
        elements = []
        if self.notes:
            elements.append(Paragraph("Doctor Notes:", self.styles['Heading4']))
            elements.append(Paragraph(self.notes, self.styles['Normal']))
            elements.append(Spacer(1, 0.2 * inch))
            
        if self.next_visit:
            elements.append(Paragraph(f"Next Visit: {self.next_visit}", self.styles['Heading4']))
            elements.append(Spacer(1, 0.5 * inch))
            
        # QR Code
        if self.qr_code_bytes:
            # We must load the bytes into a format ReportLab Image accepts (io.BytesIO)
            qr_io = io.BytesIO(self.qr_code_bytes)
            qr_img = RLImage(qr_io, width=1.2*inch, height=1.2*inch)
            elements.append(qr_img)
            
        elements.append(Spacer(1, 0.2 * inch))
        elements.append(Paragraph("This is a digitally generated prescription.", ParagraphStyle('Footer', parent=self.styles['Normal'], fontSize=8, textColor=colors.gray)))
        return elements

    def generate(self) -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer, 
            pagesize=A4,
            rightMargin=inch,
            leftMargin=inch,
            topMargin=inch,
            bottomMargin=inch
        )
        
        story = []
        story.extend(self._build_header())
        story.extend(self._build_doctor_info())
        story.extend(self._build_patient_info())
        story.extend(self._build_medicine_table())
        story.extend(self._build_notes_and_footer())
        
        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes
