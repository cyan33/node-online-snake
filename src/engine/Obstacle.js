import Sprite from './Sprite'
import { getDistance, calculateCenter } from './operations'
const NUM_SECTIONS = [9, 16, 25]; // small, medium, and large boundary divisions

class Obstacle extends Sprite {
    constructor(src, size, { x, y }, divisionType) {
        super(src, size, { x, y });
        if(divisionType < 0 || divisionType > 2) {
            throw Error("Invalid division type");
        }
        this.divisionType = divisionType;
        this.calculateBoundaries();
    }

    // subdivides this obstacle into boundaries for collision detection
    calculateBoundaries() {
        this.boundaries = new Array();
        this.sections_rc = Math.sqrt(NUM_SECTIONS[this.divisionType]);
        let width = this.size.width / this.sections_rc;
        let height = this.size.height / this.sections_rc;
        let x = this.position.x, y = this.position.y;
        // Define boundaries based on number of sections
        for(let i = 0; i < this.sections_rc; i++) {
            for(let j = 0; j < this.sections_rc; j++) {
                this.boundaries.push(calculateCenter(x, y, width, height));
                x += width;
            }
            x = this.position.x;
            y += height;
        }
    }

    // Gets the collision for this obstacle and the given object
    getCollision(obj, objOffset, boundsOffset) {
        // check if we're near this obstacle
        // Let prox be the distance between the centers of the object and obstacle at neutral positions
        let prox = getDistance(obj.size.width / 2, obj.size.height / 2, this.size.width / 2, this.size.height / 2);
        if(this.nearObstacle(obj.center.x, obj.center.y, prox + objOffset)) {
            for(let i = 0; i < this.boundaries.length; i++) {
                let boundary = this.boundaries[i];
                let bound_prox;
                // Determine side of approach
                if(obj.center.x <= boundary.x) { // approaching from left
                    if(obj.center.y < boundary.y) { // approaching from top-left
                        bound_prox = getDistance(boundary.x - (this.size.width / this.sections_rc) - obj.size.width / 2, 
                                    boundary.y - (this.size.height / this.sections_rc) - obj.size.height / 2,
                                    boundary.x, boundary.y);
                    } else if(obj.center.y > boundary.y){ // approaching from bottom-left
                        bound_prox = getDistance(boundary.x - (this.size.width / this.sections_rc) - obj.size.width / 2, 
                                    boundary.y + (this.size.height / this.sections_rc) + obj.size.height / 2,
                                    boundary.x, boundary.y);
                    } else { // directly left
                        bound_prox = getDistance(boundary.x - (this.size.width / this.sections_rc) - obj.size.width / 2, 
                                    boundary.y, boundary.x, boundary.y);
                    }
                } else if(obj.center.x > boundary.x){ // approaching from right
                    if(obj.center.y < boundary.y){ // approaching from bottom-right
                        bound_prox = bound_prox = getDistance(boundary.x + (this.size.width / this.sections_rc) + obj.size.width / 2,
                                                boundary.y - (this.size.height / this.sections_rc) - obj.size.height / 2,
                                                boundary.x, boundary.y);
                    } else if(obj.center.y > boundary.y){ // approaching from top-right
                        bound_prox = bound_prox = getDistance(boundary.x + (this.size.width / this.sections_rc) + obj.size.width / 2,
                                                boundary.y + (this.size.height / this.sections_rc) + obj.size.height / 2,
                                                boundary.x, boundary.y);
                    } else { // directly right
                        bound_prox = getDistance(boundary.x - (this.size.width / this.sections_rc) - obj.size.width / 2,
                                    boundary.y, boundary.x, boundary.y);
                    }
                } else { // same x
                    if(obj.center.y < boundary.y){ // below boundary
                        bound_prox = getDistance(boundary.x, boundary.y - (this.size.height / this.sections_rc) - obj.size.height / 2,
                                    boundary.x, boundary.y);          
                    } else { // above boundary
                        bound_prox = getDistance(boundary.x, boundary.y + (this.size.height / this.sections_rc) + obj.size.height / 2,
                                    boundary.x, boundary.y);
                    }
                }
                if(this.nearBoundary(obj.center.x, obj.center.y, boundary.x, boundary.y, bound_prox + boundsOffset)) {
                    return true;
                }
            }
        }
        return false;
    }

    nearObstacle(objX, objY, prox) {
        let distance = getDistance(objX, objY, this.center.x, this.center.y);
        return (distance <= prox)? true : false;
    }

    // Checks if an object is near this boundary
    nearBoundary(objX, objY, boundX, boundY, prox) {
        let distance = getDistance(objX, objY, boundX, boundY);
        return distance <= prox;
    }

    updatePosition({x, y}) {
        this.position = { x, y };
        this.updateCenter();
        this.calculateBoundaries();
    }

    drawBoundariesDebug(context) {
        for(let i = 0; i < this.boundaries.length; i++) {
            let boundary = this.boundaries[i];
            context.fillStyle = 'red';
            context.fillRect(boundary.x, boundary.y, 5, 5);
        }
    }

    getDetails() {
        let details = `src: ${this.src},
            size: ${this.size.width} x ${this.size.height},
            position: (${this.position.x},${this.position.y}),
            divisionType: ${this.divisionType}
            boundaries:`;
        for(let i = 0; i < this.boundaries.length; i++) {
            let bound = this.boundaries[i];
            details += `\nboundary ${i}: (${bound.x},${bound.y})`;
        }
        return details;
    }
}

export default Obstacle;