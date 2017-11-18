import {getCenter, calculateCenter} from './operations'

class Sprite {
    constructor(src, { width, height }, { x, y }){
        // if(size.width === undefined || size.width === null || size.height === undefined || size.height === null) {
        //     throw 'size must be provided';
        // }
        this.src = src;
        this.size = { width, height };
        this.position = { x, y };
        this.updateCenter();
    }

    updateCenter() {
        this.center = calculateCenter(this.position.x, this.position.y, this.size.width, this.size.height);
    }
}

export default Sprite
