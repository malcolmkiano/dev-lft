import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Carousel.css';

export default class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: props.startSlide || 0
    };
    this.carousel = React.createRef();
  }

  goToFocused = e => {
    const nodes = Array.prototype.slice.call(
      document.querySelectorAll('.slide')
    );
    const focusedSlide = e.target.closest('.slide');
    const newIndex = nodes.indexOf(focusedSlide);

    this.carousel.current.scrollLeft = 0; // reset the scroll position
    this.goToSlide(newIndex); // go to focused slide
  };

  goToSlide(number) {
    const slideCount = this.props.children.length;
    this.setState({
      currentSlide: number % slideCount
    });
  }

  render() {
    const slides = this.props.children;
    const { currentSlide } = this.state;
    const style = {
      width: `${slides.length * 100}%`,
      transform: `translateX(-${(100 / slides.length) * currentSlide}%)`
    };
    return (
      <div className="carousel" ref={this.carousel}>
        <div className="carousel-slider" style={style}>
          {slides.map((slide, index) => (
            <div
              className="slide"
              onFocusCapture={this.goToFocused}
              key={index}
            >
              {slide}
            </div>
          ))}
        </div>
        <div className="dots">
          {slides.map((slide, index) => (
            <button
              onClick={() => this.goToSlide(index)}
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
            >
              <span className="hidden">Go to slide ${index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
}

Carousel.propTypes = {
  children: PropTypes.node.isRequired,
  startSlide: PropTypes.number
};
