function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const inventario = {
  async reservar(items) {
    await delay(500)
    simularFalla()
    return { reservado: true, items }
  },
}

function simularFalla(){
  if(Math.random() < 0.3) {
    throw new Error("Inventario no disponible")
  }
}