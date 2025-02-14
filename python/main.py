import os
from PIL import Image

# Input and output folder paths
input_folder = r"C:\Users\O.Feronel\OneDrive - ams OSRAM\Documents\TATAY_INTERNMENT\federico.github.io\PHOTOS"
output_folder = r"C:\Users\O.Feronel\OneDrive - ams OSRAM\Documents\TATAY_INTERNMENT\federico.github.io\lowResPhotos"
new_size = (800, 600)  # Change to desired resolution (width, height)

# Ensure output folder exists
os.makedirs(output_folder, exist_ok=True)

# Process each image
for filename in os.listdir(input_folder):
    if filename.lower().endswith((".png", ".jpg", ".jpeg", ".bmp", ".gif")):
        img_path = os.path.join(input_folder, filename)
        img = Image.open(img_path)
        
        # Resize using LANCZOS instead of ANTIALIAS
        img_resized = img.resize(new_size, Image.LANCZOS)
        
        # Save the resized image
        output_path = os.path.join(output_folder, filename)
        img_resized.save(output_path)

        print(f"Resized and saved: {output_path}")

print("All images processed successfully!")
