from PIL import Image
import os

gif_path = r"images\vol10\pigs-GIF.gif"
webp_path = r"images\vol10\pigs-GIF.webp"

try:
    # GIFを開く（アニメーション対応）
    img = Image.open(gif_path)
    
    # webpで保存（アニメーション対応）
    img.save(webp_path, 'WEBP', save_all=True, duration=img.info.get('duration', 100))
    
    # ファイルサイズを確認
    gif_size = os.path.getsize(gif_path) / 1024
    webp_size = os.path.getsize(webp_path) / 1024
    
    print(f"変換完了:")
    print(f"GIF: {gif_size:.2f} KB")
    print(f"WEBP: {webp_size:.2f} KB")
    print(f"削減率: {(1 - webp_size/gif_size)*100:.1f}%")
except Exception as e:
    print(f"エラー: {e}")
