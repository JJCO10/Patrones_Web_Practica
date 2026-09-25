import { notificaciones } from '../../services/notificaciones.js'
import { eventos, EVENTO_PEDIDO_CONFIRMADO } from './eventos.js'

export function registrarNotificacionesSuscriber() {
  eventos.addEventListener(EVENTO_PEDIDO_CONFIRMADO, async (event) => {
    const { cliente } = event.detail
    await notificaciones.confirmar(cliente)
  })
}