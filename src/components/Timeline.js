import React, {Component} from 'react';
import FotoItem from './Foto';
import Pubsub from 'pubsub-js';
import LogicaTimeline from '../logicas/LogicaTimeline';

export default class Timeline extends Component {

  constructor(props) {
    super(props);
    this.state = {fotos: []};
    this.login = this.props.login;
    this.logicaTimeline = new LogicaTimeline([]);
  }

  componentWillMount(){
    Pubsub.subscribe('timeline',(topico, fotos) => {
      this.setState({fotos: fotos});
    });
    
    Pubsub.subscribe('novos-comentarios', (topico, infoComentario) => {
      const fotoAchada = this.state.fotos.find(foto => foto.id === infoComentario.fotoId);
      
      fotoAchada.comentarios.push(infoComentario.novoComentario);
      this.setState({fotos: this.state.fotos});

    });
  }

  carregaFotos() {
    let urlPerfil;
    
    if(this.login === undefined) {
      urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
    } else {
      urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${this.login}`;
    }
    
    fetch(urlPerfil)
    .then(response => response.json())
    .then(fotos => {
      this.setState({ ...this.state, fotos: fotos.status ? [] : fotos });
      this.logicaTimeline = new LogicaTimeline(fotos);
    });
  }

  componentDidMount() {
    this.carregaFotos();
  }
  
  componentWillReceiveProps(nextProps) {
    if(nextProps.login !== undefined) {
      this.login = nextProps.login;
      this.carregaFotos();
    }
  }

  like(fotoId) {
    this.logicaTimeline.like(fotoId);
  }

  comenta(fotoId, textoComentario) {
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
      Pubsub.publish('novos-comentarios', {fotoId, novoComentario});
    });
  }

  render() {
    return(
      <div className="fotos container">
        {this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.like.bind(this)} comenta={this.comenta}/>)}  
      </div>
    );
  }
}