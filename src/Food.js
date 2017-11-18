import Sprite from './engine/Sprite'

class Food extends Sprite {
    constructor(size, { x, y }) {
        super('', size, { x, y });
    }
}

export default Food