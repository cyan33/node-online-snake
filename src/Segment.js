import Sprite from './engine/Sprite'

class Segment extends Sprite {
    constructor(size, { x, y }) {
        super('', size, { x, y });
    }
}

export default Segment
