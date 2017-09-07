import React, { Component } from 'react';
class Analyser extends Component {
  canvas = document.querySelector('canvas');

  componentDidMount() {
    this.showAnalyser();
  }

  showAnalyser() {
    const { canvas } = this;
    if (!canvas) return;
    const canvasContext = canvas.getContext('2d');
    const { source, audioCtx } = this.props;
    try {
      let { mediaElement } = source;
      const WIDTH = canvas.width,
        HEIGHT = canvas.height;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;

      const dataArray = new Uint8Array(bufferLength);
      canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

      source.connect(analyser);
      source.connect(audioCtx.destination);

      mediaElement.play();

      mediaElement.addEventListener('playing', draw);
      function draw() {
        // const drawVisual = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);
        canvasContext.fillStyle = 'black';
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

        const barWidth = WIDTH / bufferLength * 2.5;
        let barHeight,
          x = 0;

        dataArray.forEach(data => {
          barHeight = data;
          canvasContext.fillStyle = `rgb(${barHeight + 100}, 50, 80)`;
          canvasContext.fillRect(
            x,
            HEIGHT - barHeight / 2,
            barWidth,
            barHeight / 2
          );
          x += barWidth + 1;
        });
        let { mediaElement: { currentTime, duration } } = source;
        if (currentTime < duration) {
          requestAnimationFrame(draw);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <canvas
        style={{
          width: '30%',
          height: '300px',
          position: 'fixed',
          right: 20,
          top: 20
        }}
      />
    );
  }
};

export default Analyser;