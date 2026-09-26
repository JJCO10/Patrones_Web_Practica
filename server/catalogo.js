import express from 'express'

const app = express()
app.use(express.json())

app.post('/catalogo/reservar', (req, res) => {
  const { items } = req.body
  console.log('[Catálogo] Reservando items:', items)

  // Simulamos una falla ocasional, igual que en inventario.js
  if (Math.random() < 0.2) {
    return res.status(503).json({ error: 'Catálogo no disponible' })
  }

  res.json({ reservado: true, items })
})

app.listen(4001, () => console.log('Servicio Catálogo en puerto 4001'))