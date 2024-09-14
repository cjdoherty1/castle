import express from "express";

const movieRouter = express.Router();

movieRouter.get("/searchMovie/:query");