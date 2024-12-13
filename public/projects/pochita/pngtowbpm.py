from PIL import Image
import os

def convert_png_to_webp():
    # Obtener el directorio actual donde está el script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Buscar todos los archivos PNG en el directorio
    for filename in os.listdir(current_dir):
        if filename.lower().endswith('.png'):
            # Ruta completa del archivo PNG
            png_path = os.path.join(current_dir, filename)
            
            # Crear nombre para archivo WebP (reemplazar .png por .webp)
            webp_path = os.path.join(current_dir, filename.rsplit('.', 1)[0] + '.webp')
            
            try:
                # Abrir y convertir la imagen
                with Image.open(png_path) as img:
                    # Convertir y guardar como WebP
                    img.save(webp_path, 'WEBP')
                print(f"Convertido: {filename} -> {os.path.basename(webp_path)}")
            except Exception as e:
                print(f"Error al convertir {filename}: {str(e)}")

if __name__ == "__main__":
    convert_png_to_webp()
