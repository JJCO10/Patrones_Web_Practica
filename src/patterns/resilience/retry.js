export async function retry(fn, {intentos = 3, esperaMs = 300} = {}) {
  let intento = 0  
  let lastError
    while (intento < intentos) {
      try {
        return await fn()
      } catch (error) {
        lastError = error
        intento++
        if (intento < intentos) {
          const espera = esperaMs * intento
          console.log(`Fallo ${intento}. Reintentando en ${espera}ms...`)
          await new Promise((resolve) => setTimeout(resolve, espera)) // Incrementa el tiempo de espera con cada intento
        }
      }
    }
    throw lastError
}