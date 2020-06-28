class basicGrid {
    constructor() {
        this.i = 0;
        this.j = 0;
        this.finished = false;
        this.interval = undefined;
        let padding = 20;
        this.nodeSpace = NODE_RADIUS * 2 + padding;
        this.w = (WIDTH - NODE_RADIUS) / this.nodeSpace;
        this.h = (HEIGHT - NAVBAR_HEIGHT - NODE_RADIUS) / this.nodeSpace;
    }
    iterateInnerLoop() {
        if (this.j < this.w) {
            nodeCreate(this.nodeSpace * this.j + NODE_RADIUS, this.nodeSpace * this.i + NAVBAR_HEIGHT + NODE_RADIUS);
            nodesArray[nodesArray.length-1].edgetoPrev();
            this.j++;
        } else {
            this.j = 0;
        }
    }
    iterateOuterLoop() {
        if (this.i < this.h - 1) {
            this.i++;
        } else {
            this.finished = true;
        }
    }
    iterate() {
        if (this.finished == true) {
            clearInterval(this.interval);
            return;
        }
        this.iterateInnerLoop();
        if (this.j == 0) {
            this.iterateOuterLoop();
        }
    }
    animate() {
        var self = this;
        this.interval = setInterval(function () { self.iterate(); }, 10);
    }
}

function createBasicGrid() {
    clearNodesandEdges();
    var basicGridObj = new basicGrid();
    basicGridObj.animate();
    // setTimeout(function(){nodesArray[0].connect();},2000)
}