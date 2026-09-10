from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from pydantic import HttpUrl
import uvicorn
import os
from pathlib import Path
import aiofiles

from vcompression.compress import compress_video
from vdownload.urldl import download_video as download_url

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
    return FileResponse(file_path, media_type="video/mp4", filename="output.mp4" )



@app.post("/urltomp4",
          response_class=FileResponse,
          responses={
              200: {
                  "content": {"video/mp4": {}}
              }
          })
async def url_to_mp4(url: HttpUrl):
    out = download_url(str(url))
    print(out, "######################################################################################################")
    file_path = str(VIDEO_DIR / (str(out)+".mp4"))
    return FileResponse(file_path, media_type="video/mp4", filename="download.mp4")


if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)