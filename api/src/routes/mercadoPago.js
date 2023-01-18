const { Router } = require("express");
const {crearOrden}= require ("../controllers/mercadoPago.controller")

const router = Router();
router.post("/crearOrden", crearOrden);

module.exports= router