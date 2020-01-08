import Pubsub from 'pubsub-js';

export default class TimelineApi {

  constructor(fotos) {
    this.fotos = fotos;
  }
  
  static lista(urlPerfil){
    return dispatch => {
      fetch(urlPerfil)
      .then(response => response.json())
      .then(fotos => {
        dispatch({type:'LISTAGEM',fotos});
        return fotos;
      });
    }
  }

  subscribe(callback) {
    Pubsub.subscribe('timeline',(topico, fotos) => {
      callback(fotos);
    });
  }

  like(fotoId) {
    fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, {method: "POST"})
    .then(response =>{
      if(response.ok) {
        return response.json();
      } else {
        throw new Error("Não foi possivel dar like nessa foto");
      }
    })
    .then(liker => {
      const fotoAchada = this.fotos.find(foto => foto.id === fotoId);
      fotoAchada.likeada = !fotoAchada.likeada;

      const possivelLiker = fotoAchada.likers.find(likerAtual => likerAtual.login === liker.login);
      
      if(possivelLiker === undefined) {
        fotoAchada.likers.push(liker);
      } else {
        const novosLikers = fotoAchada.likers.filter(likerAtual => likerAtual.login !== liker.login);
        fotoAchada.likers = novosLikers; 
      }
      
      Pubsub.publish('timeline', this.fotos);

    });
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
        dispatch({type:'COMENTARIO',fotoId, novoComentario});
      }) 
    }
  }
}