from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
import uvicorn
from vcompression.compress import compress_video
import os
from pathlib import Path
import aiofiles

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VIDEO_DIR = Path("testing")

@app.get("/")
async def root():
    return{"message": "Hellow"}

@app.post("/videoCompress",
        response_class=FileResponse,
        responses={
        200: {
            "content": {"video/mp4": {}}  
        }
    })
async def upload_file(file: UploadFile):
    data = file.file
    async with aiofiles.open(VIDEO_DIR / 'input.mp4', 'wb') as out_file:
        while content := await file.read(1024):  # async read chunk
            await out_file.write(content)  # async write chunk
    compress_video(VIDEO_DIR / 'input.mp4', str(VIDEO_DIR / 'output.mp4'))
    file_path = str(VIDEO_DIR / 'output.mp4')
    return FileResponse(file_path, media_type="vide/mp4", filename="output.mp4" )


if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)