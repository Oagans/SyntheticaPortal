from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from uuid import uuid4
import openai
import os

app = FastAPI()

openai.api_key = os.getenv("OPENAI_API_KEY", "SUA_CHAVE_OPENAI_AQUI")  

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def serve_home():
    return FileResponse("index.html")

@app.get("/documentos")
def serve_docs():
    return FileResponse("documentos.html")

@app.get("/arte-cultura")
def serve_arte():
    return FileResponse("arte-cultura.html")

@app.get("/avancos")
def serve_avanco():
    return FileResponse("avancos.html")

@app.get("/ia-hub")
def serve_ia():
    return FileResponse("ia-hub.html")

class Content(BaseModel):
    title: str
    description: str
    category: str
     
db: List[dict] = []

@app.get("/contents")
def get_contents():
    print (db)
    return db

@app.post("/contents", response_model=Content)
def add_content(content: Content):
    content_id = len(db) + 1
    new_content = {"id": content_id, **content.dict()}
    db.append(new_content)
    print (db)
    return new_content

@app.put("/contents/{content_id}", response_model=Content)
def update_content(content_id: int, content: Content):
    for idx, item in enumerate(db):
        if item["id"] == content_id:
            db[idx] = {"id": content_id, **content.dict()}
            return db[idx]
    raise HTTPException(status_code=404, detail="Conteúdo não encontrado")

@app.delete("/contents/{content_id}")
def delete_content(content_id: int):
    for idx, item in enumerate(db):
        if item["id"] == content_id:
            db.pop(idx)
            return {"message": "Conteúdo excluído com sucesso"}
    raise HTTPException(status_code=404, detail="Conteúdo não encontrado")


class ChatMessage(BaseModel):
    message: str


class PerguntaRequest(BaseModel):
    session_id: Optional[str] = None
    pergunta: str

sessions: Dict[str, List[Dict[str, str]]] = {}
