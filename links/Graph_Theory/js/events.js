var mouseX = 0;
var mouseY = 0;

var currentNode = undefined;
var currentEdge = undefined;

var algorithmConfig = {
    algorithm: "",
    speed: 50,
    cssSpeed: "1s",
    startNode: 15,
    destNode: undefined
}
document.body.onmousemove = mouseMove;
var bfsObj;


function runAlgorithm() {
    if (algorithmConfig.algorithm == "bfs") {
        $("#visualize").toggleClass("visualize-active");
        bfsObj = new BFS_class(graph, algorithmConfig.startNode);
        bfsInterval = setInterval(() => { BFS(bfsObj) }, algorithmConfig.speed);
    } else {
        console.log("No Algorithm Selected!");
        $("#visualize").text("Select an Algorithm!");
    }
}
function mouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (toolbar.nodeMoveinProgress) {
        currentNode.x = mouseX - NODE_RADIUS;
        currentNode.y = mouseY - NODE_RADIUS;

    }
}

function canvasClicked() {
    if (toolbar.nodeCreateTool) {//Nodecreatetool must be active to make node
        nodeCreate(mouseX, mouseY);
    }
}

function nodeClicked(node) {
    /* Enable Moving NodeClicked */
    if (!toolbar.nodeCreateTool && !toolbar.edgeCreateTool) {
        toolbar.nodeMoveinProgress = !toolbar.nodeMoveinProgress;
        currentNode = node;
        /* Create Edge And Assign Second Node to Mouse Pointer */
    } else if (toolbar.edgeCreateTool && !toolbar.edgeCreateinProgress) {
        toolbar.edgeCreateinProgress = true;
        let edge = new Edge(node, undefined, svgElement);
        currentEdge = edge;
        edgesArray.push(edge);

        /* Assign Second Node of Current Edge to "this" node*/
    } else if (toolbar.edgeCreateinProgress) {
        toolbar.edgeCreateinProgress = false;

        // DELETE DUPLICATE EDGES
        let edgeWithSameTerminus = edgesArray.filter(edge => edge.node2 == node); //find edges with same node2
        let edgeWithSameOrigin = edgeWithSameTerminus.filter(edge => edge.node1 == currentEdge.node1);
        if (edgeWithSameOrigin[0]) {
            console.log("Can't make duplicate Edges")
            deleteLastEdge();
        } else {
            currentEdge.setNode2(node);
        }


    }
}



/*---------------------------
        GLOBAL FUNCTIONS
-----------------------------*/
function nodeCreate(x, y) {
    let body = document.getElementById("canvas");
    let node = new Node(x - NODE_RADIUS, y - NODE_RADIUS, body);
    node.nodeElement.onmousedown = function () { nodeClicked(node) }; //Cannot do this inside the constructor because can't pass "this" 
    nodesArray.push(node);
    graph.addVertex();
}
function resetNodes() {
    $(".node").removeClass("node-searched node-discovered")
}
function clearNodesandEdges() {
    edgesArray.forEach(edge => edge.destroyHTMLElement());
    nodesArray.forEach(node => node.destroyHTMLElement());
    edgesArray = [];
    nodesArray = [];
}
function deleteLastEdge() {
    if (edgesArray.length == 0) return;
    edgesArray[edgesArray.length - 1].destroyHTMLElement();
    edgesArray.pop();

}
