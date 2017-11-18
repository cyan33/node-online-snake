export function clearCanvas(canvas, context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

export function coordinateConversion(canvas, x, y) {
    let box = canvas.getBoundingRect();
    return {
        x: Math.round(x - box.left),
        y: Math.round(y - box.right)
    }
}

export function getBoundaries(pos, size) {
    const { x, y } = pos;
    const { width, height } = size;

    return {
        top: y,
        left: x,
        bottom: y + height,
        right: x + width,
    }
}

// TODO: should dnd the emoji from the sidebar into the canvas
export function generateRandomPosition(canvas, middle = false, size) {
    let x, y;
    const getRandomNumBetween = (min, max) => Math.random() * (max - min) + min; 
    const { width, height } = size;

    if (middle) {
        x = Math.round(getRandomNumBetween(canvas.width * 0.2, canvas.width * 0.8 - width));
        y = Math.round(getRandomNumBetween(canvas.height * 0.2, canvas.height * 0.8 - height));
    } else {
        x = Math.round(getRandomNumBetween(0, canvas.width - width));
        y = Math.round(getRandomNumBetween(0, canvas.height - height));
    }
    return { x, y };
}

export function createImageCache() {
    let images = [];
    let imgPromises = [];
  
    function loadImage(name, src) {
        imgPromises.push(new Promise((resolve, reject) => {
            let img = new Image();
            img.src = src;
  
            try {
                img.onload = () => {
                    resolve({
                        name,
                        img
                    });
                }
            } catch (err) {
               reject(err);
            }
        }));
    }
    
    function imagesOnLoad(callback) {
        Promise.all(imgPromises).then(imgArrays => {
            images = imgArrays;
        }).then(callback);
    }

    function getImages() {
        return images;
    }

    return {
      images,
      loadImage,
      getImages,
      imagesOnLoad
    }
}

export function drawLoadedImage(img, x, y, width, height) {
    this.drawImage(img, x, y, width, height);
}


// todo: replace this function with drawLoadedImage
export function drawImageByUrl(url, x, y, width, height) {
    // this refers to the canvas CONTEXT
    let img = new Image();
    img.onload = () => {
        this.drawImage(img, x, y, width, height);
    }
    img.src = url;
}

export function drawRotate(context, img, x, y, degrees, effect) {
    context.save();
    context.translate(x + img.width / 2, y + img.height / 2);
    context.rotate(degrees * Math.PI / 180);
    context.drawImage(img, 0, 0, img.width, img.height,
      -img.width / 2, -img.height / 2, img.width, img.height);
    if(effect !== undefined) {
        let row = Math.floor(effect.currentFrame / effect.numFrames);
        let col = Math.floor(effect.currentFrame % effect.numFrames);
        context.drawImage(effect.img, col*effect.frameWidth, row*effect.frameHeight, effect.frameWidth, effect.frameHeight,
            (-img.width / 2) + effect.offset.x, (-img.height / 2) + effect.offset.y, effect.frameWidth, effect.frameHeight);
    }
    context.restore();
}

export function insertText(context, options = { }) {
    const { text, font, position: { x, y }, color } = options;

    context.fillStyle = color;
    context.font = font;

    context.fillText(text, x, y);
}
