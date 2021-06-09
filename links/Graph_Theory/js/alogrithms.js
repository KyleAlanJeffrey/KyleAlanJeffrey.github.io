// Algorithm variables
let pathObj;
let algorithmConfig = {
    algorithm: "",
    speed: 50,
    cssSpeed: "1s",
    startNodeMoveElement: document.getElementById("start-node-move"),
    destNodeMoveElement: document.getElementById("dest-node-move"),
    intervalObj: undefined,
    algorithmObj: undefined,
}


function BFS(bfsObject) {
    if (bfsObject.finished) {
        clearInterval(algorithmConfig.intervalObj);
        console.log("BFS Finished");
        return;
    }
    if (bfsObject.allNeighborsDiscovered) {
        bfsObject.pullOffQ();
    }
    bfsObject.findNeighbor();
    algorithmFunctions.animateNodesCSS(bfsObject.color);
}
function DFS() {
    let dfsObj = algorithmConfig.algorithmObj;
    if (dfsObj.finished) {
        clearInterval(algorithmConfig.intervalObj);
        console.log("DFS Finished");
        return;
    }
    dfsObj.visit();
    algorithmFunctions.animateNodesCSS(dfsObj.color);
}

class BFS_class {
    constructor(graph) {
        let s = graph.source;
        this.s = graph.source;
        this.d = graph.dest;
        this.n = graph.size;
        this.adj = graph.createAdjMatrix();//makes a clone of the adjacency matrix
        this.color = algorithmFunctions.createColorArray(this.n);
        this.parent = algorithmFunctions.createParentArray(this.n);
        this.distance = algorithmFunctions.createDistanceArray(this.n)

        this.q = new Queue();
        this.allNeighborsDiscovered = true;
        this.finished = false;

        /*Queue, set distance to 0 and discover source node*/
        this.q.enqueue(s);
        this.color[s] = "grey";
        this.distance[s] = 0;
        this.parent[s] = undefined;

        this.x = undefined; //Current vertex;
        this.y = undefined; //Neighbor of current vertex;
    }
    pullOffQ() {
        if (!this.q.isEmpty()) {
            this.x = this.q.dequeue();
            this.allNeighborsDiscovered = false;
        } else {
            this.finished = true;
        }
    }
    findNeighbor() {
        if (this.adj[this.x].length != 0) {
            this.y = this.adj[this.x].shift();
            // console.log(`searching ${this.y}, looking for ${graph.dest}`);
            if (this.color[this.y] == "white") {
                this.color[this.y] = "grey";
                this.distance[this.y] = this.distance[this.x] + 1;
                this.parent[this.y] = this.x;
                this.q.enqueue(this.y);
            }
            if (this.y == this.d) {
                this.finished = true;
                createDestinationPath(this.parent, this.s, this.d);
            }
            return;
        }
        this.allNeighborsDiscovered = true;
        this.color[this.x] = "black";
    }
}

// DFS only has visited and unvisited and doesn't track distance 
class DFSClass {
    constructor(G) {
        this.source = G.source;
        this.dest = G.dest;
        this.n = G.size;
        this.S = [];
        this.color = algorithmFunctions.createColorArray(this.n);
        this.parent = algorithmFunctions.createColorArray(this.n);
        this.adj = graph.createAdjMatrix();//makes a clone of the adjacency matrix
        this.finished = false;

        this.S.push(G.source);

        //     DFS(G,v)   ( v is the vertex where the search starts )
        //      Stack S := {};   ( start with an empty stack )
        //      for each vertex u, set visited[u] := false;
        //      push S, v;
        //      while (S is not empty) do
        //        u := pop S;
        //        if (not visited[u]) then
        //           visited[u] := true;
        //           for each unvisited neighbour w of u
        //              push S, w;
        //        end if
        //      end while
        //     END DFS()

    }
    visit() {
        if (this.S.length != 0) {
            let x = this.S.pop();
            if (x == this.dest) {
                this.finished = true;
                console.log(this.parent);
                createDestinationPath(this.parent, this.source, this.dest);
            }
            if (this.color[x] == 'white') {
                this.color[x] = 'grey';
                this.adj[x].forEach(neighbor => {
                    this.S.push(neighbor);
                    if (this.color[neighbor] == 'white') this.parent[neighbor] = x;
                });
            }
        } else {
            this.finished = true;
        }
    }
}

function createDestinationPath(parent, source, dest) {
    console.log("Found Destination Node!");
    pathObj = new pathBuilder(parent);
    pathObj.buildPath(source, dest);
    pathObj.animate(algorithmConfig.speed);
}

class pathBuilder {
    constructor(parentArray) {
        this.parentArray = parentArray;
        this.path = [];
        this.animationElement = undefined;
        this.animateFinished = false;
    }
    buildPath(s, d) {
        while (d != s) {
            this.path.unshift(nodesArray[d]); // Add d to path at front
            d = this.parentArray[d]; // d = parentofD
        }
        this.path.unshift(nodesArray[s]);
    }
    animatePath() {
        if (this.animateFinished) {
            clearInterval(this.animationElement);
            return;
        }
        let node = this.path.shift();
        node.nodeElement.firstChild.classList.remove("node-animater-discovered")
        node.nodeElement.firstChild.classList.remove("node-searched")
        node.nodeElement.classList += " path-found";
        if (this.path.length == 0) this.animateFinished = true;
    }
    animate(intervalSpeed) {
        var self = this;
        this.animationElement = setInterval(function () { self.animatePath() }, intervalSpeed);
    }

}

class algorithmFunctions {
    static createParentArray(n) {
        let parent = [];
        for (let i = 0; i < n; i++) {
            parent.push(undefined);
        }
        return parent;
    }
    static createColorArray(n) {
        let color = [];
        for (let i = 0; i < n; i++) {
            color.push('white');
        }
        return color;
    }
    static createDistanceArray(n) {
        let dist = [];
        for (let i = 0; i < n; i++) {
            dist.push(Infinity);
        }
        return dist;
    }
    static animateNodesCSS(colorArray) {
        colorArray.forEach((value, index, array) => {
            if (value == 'grey') {
                nodesArray[index].nodeElement.firstChild.classList.remove('node-animater-discovered');
                nodesArray[index].nodeElement.firstChild.classList += " node-animater-discovered";
            }
            if (value == 'black') {
                nodesArray[index].nodeElement.firstChild.classList.remove('node-searched');
                nodesArray[index].nodeElement.firstChild.classList += " node-searched";
            }
        });
    }

}

function forceQuitAlgorithm() {
    clearInterval(algorithmConfig.intervalObj);
}