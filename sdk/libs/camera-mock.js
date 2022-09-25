export const mockWithVideo = (path) => {
  var retVideo = null;

  const video = document.createElement("video");

  video.crossOrigin = "anonymous";
  retVideo = video;

  navigator.mediaDevices.getUserMedia = () => {
      return new Promise((resolve, reject) => {        
          video.oncanplay = () => {
              const startButton = document.createElement("button");
              startButton.innerHTML = "start";
              startButton.style.position = 'fixed';
              startButton.style.zIndex = 10000;
              document.body.appendChild(startButton);

              startButton.addEventListener('click', () => {
                const stream = video.captureStream();
                video.play();
                console.log("video duration=" + video.duration)
                document.body.removeChild(startButton);
                resolve(stream);
              });
            /*
              const stream = video.captureStream();
              //video.play();
              //document.body.removeChild(startButton);
              resolve(stream);
              */
          };
          video.setAttribute('loop', '');
          //video.autoplay = true;
          video.setAttribute("src", path);
      });
  };

  return retVideo;
}

export const mockWithImage = (path) => {
    navigator.mediaDevices.getUserMedia = () => {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext('2d');

        const image = new Image();
        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0, image.width, image.height);
          const stream = canvas.captureStream();
          resolve(stream);
        }
        image.src = path;
      });
    };
  }
