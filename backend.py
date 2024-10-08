import fastapi
from typing import Any
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from sqlalchemy import create_engine, Boolean, Column, Integer, String
from sqlalchemy.orm import sessionmaker,declarative_base
import bcrypt

# Configuración de la base de datos
SQLALCHEMY_DATABASE_URL = "sqlite:///./data.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modelo de base de datos
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

# Modelo Pydantic para validación
class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int


    class Config:
        from_attributes=True
        

# Crear la base de datos si no existe
Base.metadata.create_all(bind=engine)

# Funciones de la base de datos
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    db_user = User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# FastAPI app
server = fastapi.FastAPI()
server.mount("/js", StaticFiles(directory="js"), name="js")

@server.get("/")
async def index():
    return HTMLResponse(open("index.html", "r", encoding="utf-8").read())

# Endpoint de registro de usuario
@server.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = create_user(db, user)
    return new_user

@server.get("/favicon.ico")
async def _():
        return fastapi.responses.RedirectResponse("/static/favicon.ico")


# Endpoint de login
@server.post("/login")
async def login(payload: Any = fastapi.Body(None), db: Session = Depends(get_db)):
    usr = payload.get("email")
    password = payload.get("password")
    if not usr or not password:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    db_user = get_user_by_email(db, usr)
    if db_user is None or not bcrypt.checkpw(password.encode('utf-8'), db_user.hashed_password.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {"status": 200, "message": "Login successful"}

if __name__=="__main__":
    import uvicorn
    uvicorn.run(server,host= "0.0.0.0",port=8000)