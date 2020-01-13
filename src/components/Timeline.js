import React, { Component } from "react";
import FotoItem from "./Foto";
import TimelineApi from "../logicas/TimelineApi";

export default class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = { fotos: [] };
    this.login = this.props.login;
  }

  componentWillMount() {
    this.props.store.subscribe(() => {
      this.setState({fotos: this.props.store.getState().timeline});
    });
  }

  componentDidMount() {
    this.carregaFotos();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.login !== undefined) {
      this.login = nextProps.login;
      this.carregaFotos();
    }
  }

  carregaFotos() {
    let urlPerfil;

    if (this.login === undefined) {
      urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem(
        "auth-token"
      )}`;
    } else {
      urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${this.login}`;
    }
    this.props.store.dispatch(TimelineApi.lista(urlPerfil));
  }

  like(fotoId) {
    this.props.store.dispatch(TimelineApi.like(fotoId));
  }

  comenta(fotoId, textoComentario) {
    this.props.store.dispatch(TimelineApi.comenta(fotoId, textoComentario));
  }

  render() {
    return (
      <div className="fotos container">
        {this.state.fotos.map(foto => (
          <FotoItem
            key={foto.id}
            foto={foto}
            like={this.like.bind(this)}
            comenta={this.comenta.bind(this)}
          />
        ))}
      </div>
    );
  }
}
