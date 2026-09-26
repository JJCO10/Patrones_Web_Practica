import express from 'express'

const app = express()
app.use(express.json())

const CATALOGO_URL = 'http://localhost:4001'
const PAGOS_URL = 'http://localhost:4002'

app.post('/pedidos', async (req, res) => {
  const pedido = req.body

  try {
    // 1. Reenvía al servicio de Catálogo
    const respCatalogo = await fetch(`${CATALOGO_URL}/catalogo/reservar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: pedido.items }),
    })
    if (!respCatalogo.ok) {
      const error = await respCatalogo.json()
      return res.status(502).json({ error: `Fallo en Catálogo: ${error.error}` })
    }
    const datosCatalogo = await respCatalogo.json()

    // 2. Reenvía al servicio de Pagos
    const respPagos = await fetch(`${PAGOS_URL}/pagos/procesar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total: pedido.total }),
    })
    if (!respPagos.ok) {
      const error = await respPagos.json()
      return res.status(502).json({ error: `Fallo en Pagos: ${error.error}` })
    }
    const datosPagos = await respPagos.json()

    // 3. Agrega ambas respuestas en una sola
    res.json({
      pedido: { cliente: pedido.cliente, direccion: pedido.direccion },
      catalogo: datosCatalogo,
      pagos: datosPagos,
    })
  } catch (err) {
    res.status(500).json({ error: `Gateway: ${err.message}` })
  }
})

app.listen(4000, () => console.log('API Gateway en puerto 4000'))