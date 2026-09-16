from fastapi import Body, FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.openapi.utils import get_openapi
from pydantic import HttpUrl
import uvicorn
import os
from pathlib import Path
import aiofiles

from vcompression.compress import compress_video
from vdownload.urldl import download_video as download_url
from pdf_edit.edit_pdf import merge_pdfs

app = FastAPI()
app.openapi_version = "3.0.2"

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VIDEO_DIR = Path("testing")
PDF_DIR = Path("testing_pdf")
PDF_DIR.mkdir(parents=True, exist_ok=True)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="FastAPI",
        version="0.1.0",
        routes=app.routes,
    )
    openapi_schema["openapi"] = "3.0.2"

    def fix_binary_fields(schema):
        if isinstance(schema, dict):
            if schema.get("contentMediaType") == "application/octet-stream":
                schema.pop("contentMediaType", None)
                schema.pop("contentEncoding", None)
                schema["format"] = "binary"
            for value in schema.values():
                fix_binary_fields(value)
        elif isinstance(schema, list):
            for item in schema:
                fix_binary_fields(item)

    fix_binary_fields(openapi_schema.get("components", {}).get("schemas", {}))

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

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
async def url_to_mp4(url: HttpUrl = Body(...)):
    out = download_url(str(url))
    file_path = str(VIDEO_DIR / (str(out)+".mp4"))
    return FileResponse(file_path, media_type="video/mp4", filename="download.mp4")


@app.post("/merge_pdfs",
          response_class=FileResponse,
          responses={
              200: {
                  "content": {"application/pdf": {}}
              }
          }
          )
async def merging(files: list[UploadFile] = File(...)):
    merge_names = []
    n = 0
    for file in files:
        merge_names.append(str(f"{n}.pdf"))
        async with aiofiles.open(PDF_DIR / f"{n}.pdf", 'wb') as out_file:
            while content := await file.read(1024):
                await out_file.write(content)
        n += 1
        await file.close()

    merge_pdfs(merge_names)
    return FileResponse(str(PDF_DIR / "combined.pdf"), media_type="application/pdf", filename="combined.pdf")


if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)