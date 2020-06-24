const NODE_RADIUS = 50;

function random(low, high, floor) {
    if (floor) {
        return (Math.floor((high - low) * Math.random())) + low;
    } else {
        return ((high - low) * Math.random()) + low;
    }
}
class Node {
    constructor(x, y, parentElement) {
        //make html element
        let nodeElement = document.createElement("div");
        let text = document.createElement("p");
        text.innerText = nodesArray.length + 1;
        this.vertex = nodesArray.length + 1;
        nodeElement.appendChild(text);
        nodeElement.classList.add("node");
        parentElement.appendChild(nodeElement);

        this.nodeElement = nodeElement;
        this.x = x;
        this.y = y;
        this.velx = 0;
        this.vely = 0;
    }
    updateHTMLElement() {
        this.nodeElement.style.top = this.y + 'px'
        this.nodeElement.style.left = this.x + 'px'
    }
    updateVel(boundX, boundY) {
        this.x += this.velx;
        this.y += this.vely;
        if (this.x + NODE_RADIUS * 2 > boundX || this.x < 0) {
            this.velx *= -1;
        }
        if (this.y + NODE_RADIUS * 2 > boundY || this.y < 0) {
            this.vely *= -1;
        }
    }
    getDistance(node) {
        let a = Math.pow((this.x + NODE_RADIUS) - (node.x + NODE_RADIUS), 2)
        let b = Math.pow((this.y + NODE_RADIUS) - (node.y + NODE_RADIUS), 2);
        return Math.sqrt(a, b)
    }
    destroyHTMLElement() {
        this.nodeElement.parentNode.removeChild(this.nodeElement);
    }
}

class Edge {
    constructor(x2, y2, node1, node2, parentElement) {
        this.x2 = x2;
        this.y2 = y2;
        this.node1 = node1;
        this.node2 = node2;
        var edgeElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        edgeElement.setAttribute('x1', node1.x + NODE_RADIUS);
        edgeElement.setAttribute('y1', node1.y + NODE_RADIUS);
        edgeElement.setAttribute('x2', x2);
        edgeElement.setAttribute('y2', y2);
        edgeElement.classList = "edge";
        parentElement.appendChild(edgeElement);
        this.edgeElement = edgeElement;
    }
    updateWithMouse(x2, y2) {
        // this.x1 = x1;
        // this.x2 = x2;
        // this.y1 = y1;
        // this.y2 = y2;
        this.edgeElement.setAttribute('x1', this.node1.x + NODE_RADIUS);
        this.edgeElement.setAttribute('y1', this.node1.y + NODE_RADIUS);
        this.edgeElement.setAttribute('x2', x2);
        this.edgeElement.setAttribute('y2', y2);

    }
    update() {
        this.edgeElement.setAttribute('x1', this.node1.x + NODE_RADIUS);
        this.edgeElement.setAttribute('y1', this.node1.y + NODE_RADIUS);
        this.edgeElement.setAttribute('x2', this.node2.x + NODE_RADIUS);
        this.edgeElement.setAttribute('y2', this.node2.y + NODE_RADIUS);
    }
    destroyHTMLElement() {
        let edgeHTML = this.edgeElement;
        edgeHTML.parentNode.removeChild(edgeHTML);
    }


}