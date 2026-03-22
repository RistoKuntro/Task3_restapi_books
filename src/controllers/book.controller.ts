import { Request, Response } from "express";
import * as bookService from "../services/book.service.js";
export async function getAllBooks(req: Request, res: Response) {
  try {
    const books = await bookService.getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
export async function createBook(req: Request, res: Response) {
  try {
    const book = await bookService.createBook(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
