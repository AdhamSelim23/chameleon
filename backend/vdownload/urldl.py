import yt_dlp
import uuid
from pathlib import Path

VIDEO_PATH = Path(__file__).resolve().parent.parent / "testing"

def download_video(video_url):
    filename = f"{uuid.uuid4().hex}"

    # Configure download options
    ydl_opts = {
        # Select best video and best audio, or best overall if separate tracks aren't available
        'format': 'bestvideo+bestaudio/best',
        
        # Merge the tracks into a standard MP4 container
        'merge_output_format': 'mp4',
        
        # Set the output directory and filename template
        'outtmpl': str(VIDEO_PATH / f'{filename}.%(ext)s'),
        
        # Post-processing: Remux to mp4 if necessary without re-encoding
        'postprocessors': [{
            'key': 'FFmpegVideoConvertor',
            'preferedformat': 'mp4',
        }],
    }

    try:
        print(f"Starting download for: {video_url}")
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])
        print("Download completed successfully!")
        return(filename)
    except Exception as e:
        print(f"An error occurred: {e}")


