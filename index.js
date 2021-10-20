// 1. IMPORTACIONES
const express = require("express")

const app = express()

const cors = require("cors")


// 2. MIDDLEWARES
// STRIPE CHECKOUT CONFIG
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_KEY)


app.use(express.json({extended: true}))
app.use(cors())



// 3. RUTEO
app.post("/checkout", async (req, res) => {

    // 1. ESTABLECER EL ID DEL PRODUCTO QUE NOSOTROS QUEREMOS USAR
    const { productId } = req.body

    // 2. CREAR SESIÓN EN STRIPE / EL USUARIO INICIA UN PROCESO DE PAGO
    const session = await stripe.checkout.sessions.create({
        // A. ESTABLECEMOS QUÉ PRODUCTOS SE VAN A COBRAR
        line_items: [
            {
                price: productId,
                quantity: 1
            }
        ],
        // B. MÉTODOS DE PAGO
        payment_method_types: ["card"],
        // C. TIPO DE PAGO: "PAYMENT" - UN ÚNICO PAGO || "SUBSCRIPTION  - RECURRENTE"
        mode: "payment",
        // D. ENLACE EN EL CUAL EL USUARIO SERÁ REDIRIGIDO SI TODO SALIÓ CON ÉXITO
        success_url: "http://localhost:3000/success",
        // E. ENLACE EN EL CUAL EL USUARIO SERÁ REDIRIGIDO SI TODO SALIÓ MAL (CANCELÓ, TIENE UNA TARJETA ROBADA, EXPIRADA, PUSO MAL LOS NÚMEROS)
        cancel_url: "http://localhost:3000/cancel",
    })

    res.json({
        data: session
    })
    

})


// 4. SERVIDOR
app.listen(3005, async () => {
    console.log("Servidor activo")
})