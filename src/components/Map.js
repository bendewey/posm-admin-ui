import Leaflet from "leaflet";
import React, { Component } from "react";
import { Col } from "react-bootstrap";

import "leaflet/dist/leaflet.css";

const config = {
  backgroundTileLayer: "http://posm.io/tiles/mm/{z}/{x}/{y}.png"
};

const MEDIA_QUERY = `(-webkit-min-device-pixel-ratio: 1.5),
                     (min--moz-device-pixel-ratio: 1.5),
                     (-o-min-device-pixel-ratio: 3/2),
                     (min-resolution: 1.5dppx)`;

export default class Map extends Component {
  static defaultProps = {
    bounds: [[-85.05112877980659, -180], [85.0511287798066, 180]],
    maxzoom: 18,
    minHeight: "500px",
    minzoom: 0,
    showBackground: true,
    width: "100%"
  };

  static propTypes = {
    bounds: React.PropTypes.array,
    maxzoom: React.PropTypes.integer,
    minHeight: React.PropTypes.string,
    minzoom: React.PropTypes.integer,
    showBackground: React.PropTypes.boolean,
    tileJSON: React.PropTypes.string,
    url: React.PropTypes.string,
    width: React.PropTypes.string
  };

  state = {
    bounds: this.props.bounds,
    maxzoom: this.props.maxzoom,
    minzoom: this.props.minzoom,
    opacity: 100,
    url: this.props.url
  };

  componentDidMount() {
    const { showBackground, tileJSON } = this.props;
    const { bounds, maxzoom, minzoom } = this.state;
    let { url } = this.state;
    let { backgroundTileLayer } = config;

    if (tileJSON != null) {
      fetch(tileJSON)
        .then(rsp => rsp.json())
        .then(info => {
          const bounds = [
            info.bounds.slice(0, 2).reverse(),
            info.bounds.slice(2, 4).reverse()
          ];

          this.setState({
            bounds,
            maxzoom: info.maxzoom,
            minzoom: info.minzoom,
            url: info.tiles[0]
          });
        })
        .catch(err => console.warn(err.stack));
    }

    if (
      window.devicePixelRatio > 1 ||
      (window.matchMedia && window.matchMedia(MEDIA_QUERY).matches)
    ) {
      backgroundTileLayer = backgroundTileLayer.replace(/\.(?!.*\.)/, "@2x.");
      url = url.replace(/\.(?!.*\.)/, "@2x.");
    }

    const layers = [];

    if (showBackground) {
      layers.push(Leaflet.tileLayer(backgroundTileLayer));
    }

    if (url != null) {
      this.imageryLayer = Leaflet.tileLayer(url, {
        minZoom: minzoom,
        maxZoom: maxzoom
      });

      layers.push(this.imageryLayer);
    }

    this.leaflet = Leaflet.map(this.container, {
      scrollWheelZoom: false,
      layers
    });

    this.leaflet.fitBounds(bounds);

    Leaflet.control
      .scale({
        maxWidth: 250
      })
      .addTo(this.leaflet);
    this.leaflet.attributionControl.setPrefix("");
  }

  componentDidUpdate() {
    const { bounds, maxzoom, minzoom, opacity, url } = this.state;

    if (this.imageryLayer == null) {
      this.imageryLayer = Leaflet.tileLayer(url, {
        minZoom: minzoom,
        maxZoom: maxzoom
      }).addTo(this.leaflet);

      this.leaflet.fitBounds(bounds);
    }

    this.imageryLayer.setOpacity(opacity / 100);
  }

  componentWillUnmount() {
    this.leaflet.remove();
  }

  updateOpacity = evt => {
    this.setState({
      opacity: evt.target.value
    });
  };

  render() {
    const { minHeight, width } = this.props;
    const { opacity } = this.state;

    return (
      <div>
        <div ref={c => (this.container = c)} style={{ minHeight, width }} />
        <div className="row">
          <Col md={3}>
            <input
              type="range"
              step="10"
              value={opacity}
              onChange={this.updateOpacity}
            />
          </Col>
        </div>
      </div>
    );
  }
}
