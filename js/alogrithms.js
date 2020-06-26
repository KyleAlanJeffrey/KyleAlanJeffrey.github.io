
function BFS(bfsObject) {
    if (bfsObject.finished) {
        clearInterval(bfsInterval);
        console.log("BFS Finished");
        return;
    }

    if (bfsObject.allNeighborsDiscovered) {
        bfsObject.pullOffQ();
    }
    bfsObject.findNeighbor();
}

// function BFS(Graph, s) {
//     /*-------------------------------------
//     white -undiscovered
//     grey  -discovered,but not it's neighbors
//     black -discovered and neighbors have been discovered
//     --------------------------------------*/
//     let n = Graph.size;
//     let adj = Graph.adjMatrix;

//     /*Initialize queue*/
//     let q = new Queue();

//     /* initialize discovery, parent, and distance node */
//     let color = [], parent = [], distance = [];
//     for (i = 0; i < n; i++) {
//         color.push("white");
//         parent.push(undefined);
//         distance.push(Infinity);
//     }

//     /*Queue, set distance to 0 and discover source node*/
//     q.enqueue(s);
//     color[s] = "grey";
//     distance[s] = 0;
//     parent[s] = undefined;

//     /*iterate through all neighbors of current vertex*/
//     while (!q.isEmpty()) {
//         let x = q.dequeue();
//         while (adj[x].length != 0) {
//             let y = adj[x].shift();
//             if (color[y] == "white") {
//                 color[y] = "grey";
//                 distance[y] = distance[x] + 1;
//                 parent[y] = x;
//                 q.enqueue(y);
//                 nodesArray[y].nodeElement.classList += " node-discovered";
//             }
//         }
//         color[x] = "black";
//     }
//     return {
//         "distance": distance,
//         "parent": parent
//     }
// }

class BFS_class {
    constructor(graph, s) {
        this.s = s;
        this.n = graph.size;
        this.adj = graph.adjMatrix;
        this.color = [];
        this.parent = [];
        this.distance = [];
        for (let i = 0; i < this.n; i++) {
            this.color.push("white");
            this.parent.push(undefined);
            this.distance.push(Infinity);
        }
        this.q = new Queue();
        this.allNeighborsDiscovered = true;
        this.finished = false;
        /*Queue, set distance to 0 and discover source node*/
        this.q.enqueue(s);
        this.color[s] = "grey";
        nodesArray[s].nodeElement.classList += " node-discovered"
        this.distance[s] = 0;
        this.parent[s] = undefined;

        this.x = undefined; //Current vertex;
        this.y = undefined; //Neighbor of current vertex;
    }
    pullOffQ() {
        if (!this.q.isEmpty()) {
            this.x = this.q.dequeue();
            this.allNeighborsDiscovered = false;
            return;
        }
        this.finished = true;
    }
    findNeighbor() {
        if (this.adj[this.x].length != 0) {
            this.y = this.adj[this.x].shift();
            if (this.color[this.y] == "white") {
                this.color[this.y] = "grey";
                nodesArray[this.y].nodeElement.classList += " node-discovered";

                this.distance[this.y] = this.distance[this.x] + 1;

                this.parent[this.y] = this.x;

                this.q.enqueue(this.y);
            }
            return;
        }
        this.allNeighborsDiscovered = true;
        this.color[this.x] = "black";
        nodesArray[this.y].nodeElement.classList += " node-searched";
    }
}