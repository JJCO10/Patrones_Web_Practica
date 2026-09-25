const ESTADOS = {
  CERRADO: 'CERRADO',
  ABIERTO: 'ABIERTO',
  SEMI_ABIERTO: 'SEMI_ABIERTO',
}

export class CircuitBreaker {
  constructor(fn, { umbralErrores = 3, tiempoEsperaMs = 5000 } = {}) {
    this.fn = fn
    this.umbralErrores = umbralErrores
    this.tiempoEsperaMs = tiempoEsperaMs

    this.estado = ESTADOS.CERRADO
    this.contadorErrores = 0
    this.proximoIntento = null
  }

  async ejecutar(...args) {
    if (this.estado === ESTADOS.ABIERTO) {
      if (Date.now() < this.proximoIntento) {
        // Fail-fast: ni siquiera llama al servicio
        throw new Error('Circuito ABIERTO: servicio no disponible temporalmente')
      }
      this.estado = ESTADOS.SEMI_ABIERTO
    }

    try {
      const resultado = await this.fn(...args)
      this._onExito()
      return resultado
    } catch (err) {
      this._onFallo()
      throw err
    }
  }

  _onExito() {
    this.contadorErrores = 0
    this.estado = ESTADOS.CERRADO
  }

  _onFallo() {
    this.contadorErrores++

    if (this.estado === ESTADOS.SEMI_ABIERTO) {
      // la llamada de prueba falló → vuelve a ABIERTO
      this._abrir()
      return
    }

    if (this.contadorErrores >= this.umbralErrores) {
      this._abrir()
    }
  }

  _abrir() {
    this.estado = ESTADOS.ABIERTO
    this.proximoIntento = Date.now() + this.tiempoEsperaMs
    this.contadorErrores = 0
  }

  get estadoActual() {
    return this.estado
  }
}