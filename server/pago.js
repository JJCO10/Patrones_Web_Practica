import express from 'express'

const app = express()
app.use(express.json())

app.post('/pagos/procesar', (req, res) => {
  const { total } = req.body
  console.log('[Pagos] Procesando total:', total)

  if (Math.random() < 0.2) {
    return res.status(503).json({ error: 'Pagos no disponible' })
  }

  res.json({ exito: true, total })
})

app.listen(4002, () => console.log('Servicio Pagos en puerto 4002'))