import qrcode
import io

class QRService:
    @staticmethod
    def generate_verification_qr(prescription_id: str, base_url: str = "https://clinic.com/verify/") -> bytes:
        """
        Generates a QR code for prescription verification and returns PNG bytes.
        """
        verification_url = f"{base_url}{prescription_id}"
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(verification_url)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG')
        return img_byte_arr.getvalue()
