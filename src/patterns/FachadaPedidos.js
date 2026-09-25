import { inventario } from '../services/inventario.js'
import { envios } from '../services/envios.js'
import { eventos, EVENTO_PEDIDO_CONFIRMADO } from './comunication/eventos.js'
import { CircuitBreaker } from './resilience/CircuitBreaker.js'
import { retry } from './resilience/retry.js'

/**
 * EJERCICIO 2 — Facade
 *
 * procesarPedido() debe orquestar, EN ORDEN, estas 4 operaciones:
 *   1. inventario.reservar(pedido.items)
 *   2. this.pago.procesar(pedido.total)      (el IPago inyectado)
 *   3. envios.programar(pedido.direccion)
 *   4. notificaciones.confirmar(pedido.cliente)
 *
 * Si el pago falla (resultado.exito === false), NO debe continuar con
 * envío ni notificación: debe lanzar un Error con un mensaje claro.
 *
 * Referencia: mismo patrón visto en clase, pero aquí "Pagos" es un
 * IPago ya adaptado (Ejercicio 1) en vez de un servicio directo — así
 * la Fachada no sabe (ni le importa) si por debajo está la Pasarela X
 * o la Y.
 */
const inventarioBreaker = new CircuitBreaker(items => retry(() => inventario.reservar(items), { intentos: 3, esperaMs: 300 }), { umbralErrores: 3, tiempoEsperaMs: 5000 })

export class FachadaPedidos {
  constructor(pago) {
    this.pago = pago // instancia de IPago: AdapterPasarelaX o AdapterPasarelaY
  }

  async procesarPedido(pedido) {
    // TODO(Ejercicio 2): implementar la orquestación descrita arriba
    try {
      await inventarioBreaker.ejecutar(pedido.items)
      const resultadoPago = await this.pago.procesar(pedido.total)
      if (!resultadoPago.exito) {
        throw new Error('El pago falló')
      }
      await envios.programar(pedido.direccion)
      eventos.dispatchEvent(new CustomEvent(EVENTO_PEDIDO_CONFIRMADO, { detail: { cliente: pedido.cliente } }))
    } catch (error) {
      if (error.message.includes('Circuito ABIERTO')) {
        throw new Error('Inventario no disponible. Inténtelo más tarde.')
      }
      throw new Error(`Error al procesar el pedido: ${error.message}`)

    }
  }
}
