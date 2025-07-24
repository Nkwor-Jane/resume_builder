from fastapi import FastAPI, HTTPException, status, Request
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

app = FastAPI()

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "message": "Validation failed",
            "errors": exc.errors(),
            "body": exc.body,
        },
    )


class Book(BaseModel):
    title: str # Title must be a string
    pages: int # Pages must be an integer
    

@app.get("/books/{book_id}")
async def read_book(book_id: int):
	# Simulate checking a database for the book
    if book_id != 1:
    # Raise a 404 if the book is not found
        raise HTTPException(status_code=404, detail="Book not found")
    return {"book_id": book_id, "title": "The Hobbit"}

@app.post("/books", status_code=status.HTTP_201_CREATED)
def add_book(book: Book):
    return {"message": "Book created successfully"}

