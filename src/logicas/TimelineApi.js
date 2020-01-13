import { listagem, comentario, like } from '../actions/actionCreator';
export default class TimelineApi {
  
  static lista(urlPerfil){
    return dispatch => {
      fetch(urlPerfil)
      .then(response => response.json())
      .then(fotos => {
        dispatch(listagem(fotos));
        return fotos;
      });
    }
  }

  static like(fotoId) {
    return dispatch => {
      fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, {method: "POST"})
      .then(response =>{
        if(response.ok) {
          return response.json();
        } else {
          throw new Error("Não foi possivel dar like nessa foto");
        }
      })
      .then(liker => {
        dispatch(like(fotoId, liker));
        return liker;
      });
    }
  }

  static comenta(fotoId, textoComentario) {
    return dispatch => {
      fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, {
        method: "POST",
        body: JSON.stringify({texto: textoComentario}),
        headers: new Headers({
          'Content-type': 'application/json'
        })
      })
      .then(response => {
        if(response.ok) {
          return response.json();
        } else {
          throw new Error("Não foi possível comentar essa foto");
        }
      })
      .then(novoComentario => {
        dispatch(comentario(fotoId, novoComentario));
        return novoComentario;
      }) 
    }
  }
}