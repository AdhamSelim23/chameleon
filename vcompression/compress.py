import ffmpeg
import time
from pathlib import Path
import uuid

VIDEOS_DIR = Path("testing")


def compress_video(input , output_path, crf=23, preset='medium'):
    """
    Compresses a video file using ffmpeg-python.
    
    Parameters:
    - input_path (str): Path to the original input video.
    - output_path (str): Path where the compressed video will be saved.
    - crf (int): Constant Rate Factor (18-28 is typical). Lower = better quality/larger size.
    - preset (str): Compression speed (ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow). 
                    Slower presets achieve better compression efficiency.
    """

    
    try:
        start = time.time()
        filename = f"{uuid.uuid4().hex}.mp4"

        (
            ffmpeg
            .input(input)
            .output(
                output_path, 
                vcodec='libx264',   # Highly compatible video codec
                acodec='aac',       # Reliable audio codec
                crf=crf,            # Sets quality target 
                preset=preset       # Balances speed vs compression size
            )
            .overwrite_output()     # Overwrites output file if it exists
            .run(capture_stdout=True, capture_stderr=True)
        )
        end = time.time()
        return(filename)
    except ffmpeg.Error as e:
        print("FFmpeg Error:")
        print(e.stderr.decode('utf-8'))


