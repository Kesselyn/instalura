//REDUCER -> devolve uma nova versão do estado que entrou
export function timeline(state=[], action) {
  if(action.type === 'LISTAGEM') {
    return action.fotos;
  }

  return state;
}