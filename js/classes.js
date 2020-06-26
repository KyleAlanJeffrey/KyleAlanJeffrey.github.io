const NODE_RADIUS = 50;

function random(low, high, floor) {
    if (floor) {
        return (Math.floor((high - low) * Math.random())) + low;
    } else {
        return ((high - low) * Math.random()) + low;
    }
}
class Graph {
    constructor() {
        this.vertexSet = [];
        this.edgeSet = [];
        this.adjMatrix = [];
        this.size = 0;
    }
    addVertex() {
        this.vertexSet[this.size] = this.size;
        this.adjMatrix[this.size] = [];
        this.size += 1;
    } addEdge(n1, n2) {
        console.log(`Added edge: ${n1},${n2}`);
        this.adjMatrix[n1].push(n2);

    }
}

class Node {
    constructor(x, y, parentElement) {
        //make html element
        let nodeElement = document.createElement("div");
        let text = document.createElement("p");
        text.innerText = nodesArray.length;
        this.vertex = nodesArray.length;
        nodeElement.appendChild(text);
        nodeElement.classList.add("node");
        parentElement.appendChild(nodeElement);

        this.nodeElement = nodeElement;

        this.x = x;
        this.y = y;
        this.velx = random(-1, 1);
        this.vely = random(-1, 1);
    }
    update() {
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
    destroyHTMLElement() {
        this.nodeElement.parentNode.removeChild(this.nodeElement);
    }
    connect() {
        let body = document.getElementById("svg");
        nodesArray.forEach(node => {
            if (this == node) return;
            edgesArray.push(new Edge(0, 0, this, node, body));
            graph.addEdge(this.vertex, node.vertex);
        });

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
        edgeElement.setAttribute('y1', node1.y);
        edgeElement.setAttribute('x2', x2);
        edgeElement.setAttribute('y2', y2);
        edgeElement.setAttribute("marker-end", "url(#arrowhead)");
        edgeElement.classList = "edge";
        parentElement.appendChild(edgeElement);
        this.edgeElement = edgeElement;
    }
    updateWithMouse(x2, y2) {
        this.edgeElement.setAttribute('x1', this.node1.x + NODE_RADIUS);
        this.edgeElement.setAttribute('y1', this.node1.y);
        this.edgeElement.setAttribute('x2', x2);
        this.edgeElement.setAttribute('y2', y2);

    }
    update() {
        this.edgeElement.setAttribute('x1', this.node1.x + NODE_RADIUS);
        this.edgeElement.setAttribute('y1', this.node1.y);
        this.edgeElement.setAttribute('x2', this.node2.x + NODE_RADIUS);
        this.edgeElement.setAttribute('y2', this.node2.y);
    }
    destroyHTMLElement() {
        let edgeHTML = this.edgeElement;
        edgeHTML.parentNode.removeChild(edgeHTML);
    }


}


class Queue {
    constructor() {
        this.elements = [];
    }
    enqueue(e) {
        this.elements.push(e);
    }
    dequeue() {
        return this.elements.shift();
    }
    isEmpty() {
        return this.elements.length == 0;
    }
    length() {
        return this.elements.length;
    }
}
