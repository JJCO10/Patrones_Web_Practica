/**
 * EJERCICIO 3 — MVVM: ViewModel
 *
 * Extrae aquí TODA la lógica que hoy vive en OrdersApp.jsx: el estado
 * del formulario, la lista de pedidos, loading, error, y la función
 * que arma el pedido y llama a FachadaPedidos.
 *
 * Debe devolver un objeto con esta forma (es el "contrato" que
 * OrdersView.jsx va a consumir):
 *
 * {
 *   pedidos,         // array de pedidos ya procesados
 *   loading,         // boolean
 *   error,           // string | null
 *   form: { cliente, direccion, itemsText, total, pasarela },
 *   setField,        // (campo, valor) => void — actualiza un campo del form
 *   enviarPedido,    // (evento) => Promise<void> — comando del submit
 * }
 *
 * La Vista (OrdersView) NO debe importar FachadaPedidos ni los
 * Adapters directamente: solo debe hablar con este hook. Eso es lo
 * que hace que Vista y lógica queden desacopladas (a diferencia de
 * OrdersApp.jsx, donde estaban mezcladas).
 */
import { useState } from 'react'
import { FachadaPedidos } from '../patterns/FachadaPedidos.js'
import { AdapterPasarelaX } from '../services/pagos/AdapterPasarelaX.js'
import { AdapterPasarelaY } from '../services/pagos/AdapterPasarelaY.js'

export default function usePedidosViewModel() {
  // --- LÓGICA (esto debería vivir en el ViewModel) ---
  const [pedidos, setPedidos] = useState([])
  const [cliente, setCliente] = useState('')
  const [direccion, setDireccion] = useState('')
  const [itemsText, setItemsText] = useState('')
  const [total, setTotal] = useState('')
  const [pasarela, setPasarela] = useState('X')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const adapter = pasarela === 'X' ? new AdapterPasarelaX() : new AdapterPasarelaY()
      const facade = new FachadaPedidos(adapter)
      const pedido = {
        cliente,
        direccion,
        items: itemsText.split(',').map((s) => s.trim()).filter(Boolean),
        total: Number(total),
      }
      await facade.procesarPedido(pedido)
      setPedidos((prev) => [
        { ...pedido, pasarela, procesadoEn: new Date().toLocaleTimeString() },
        ...prev,
      ])
      setCliente('')
      setDireccion('')
      setItemsText('')
      setTotal('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    pedidos,
    loading,
    error,
    form: { cliente, direccion, itemsText, total, pasarela },
    setField: (campo, valor) => {
      switch (campo) {
        case 'cliente':
          setCliente(valor)
          break
        case 'direccion':
          setDireccion(valor)
          break
        case 'itemsText':
          setItemsText(valor)
          break
        case 'total':
          setTotal(valor)
          break
        case 'pasarela':
          setPasarela(valor)
          break
      }
    },
    enviarPedido: handleSubmit
  }
}
