import { Resultado } from './IPago.js'
import { SdkPasarelaY } from './SdkPasarelaY.js'

/**
 * EJERCICIO 1 — Adapter
 *
 * Completa este adaptador para que SdkPasarelaY cumpla la misma
 * interfaz IPago que AdapterPasarelaX (ábrelo como referencia: es el
 * mismo ejemplo que vimos en clase).
 *
 * Pistas:
 * - SdkPasarelaY.charge() recibe CENTAVOS, no la unidad monetaria
 *   completa: hay que convertir `monto`.
 * - SdkPasarelaY.charge() puede rechazar la promesa: usa try/catch.
 * - Debes devolver siempre un Resultado(exito, idTransaccion), nunca
 *   el objeto crudo que devuelve el SDK.
 */
export class AdapterPasarelaY {
  constructor(sdk = new SdkPasarelaY()) {
    this.sdk = sdk
  }

  async procesar(monto) {
    // TODO(Ejercicio 1): implementar usando this.sdk.charge(...)
    try {
      const amountCents = Math.round(monto * 100) // Convertir a centavos
      const resultado = await this.sdk.charge(amountCents)
      return new Resultado(true, resultado.txId)
    } catch (error) {
      return new Resultado(false, null)
    }
  }
}
