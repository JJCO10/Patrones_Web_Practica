import { inventario } from './inventario.js'
import { CircuitBreaker } from '../patterns/CircuitBreaker.js'
import { retry } from '../patterns/retry.js'

const breaker = new CircuitBreaker(items => retry(() => inventario.reservar(items), { intentos: 3, esperaMs: 300 }), { umbralErrores: 3, tiempoEsperaMs: 2000 })

for (let i = 0; i < 10; i++) {
  try {
    await breaker.ejecutar([{ id: 1, cantidad: 2 }, { id: 2, cantidad: 1 }])
    console.log(`Intento ${i}: éxito — estado: ${breaker.estadoActual}`)
  } catch (e) {
    console.log(`Intento ${i}: ${e.message} — estado: ${breaker.estadoActual}`)
  }
}