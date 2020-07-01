var mouseX = 0;
var mouseY = 0;

var currentNode = undefined;
var currentEdge = undefined;


/* DOM Events */
document.body.onmousemove = mouseMove;
document.body.onmouseup = mouseUpOnCanvas;

function runAlgorithm() {
    if (nodesArray.length == 0) {
        console.log("Can't run algorithm on empty set.");
        return;
    }
    if (algorithmConfig.algorithm == "bfs") {
        console.log("here")
        resetNodes();
        bfsObj = new BFS_class(graph);
        algorithmConfig.intervalObj = setInterval(() => { BFS(bfsObj) }, algorithmConfig.speed);
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
        /* MOVE START AND END NODE MOVE ELEMENT IF GRABBED */
    } else if (toolbar.moveDestNode || toolbar.moveStartNode) {
        if (toolbar.moveStartNode) {
            algorithmConfig.startNodeMoveElement.style.display = "block";
            algorithmConfig.startNodeMoveElement.style.top = mouseY - NODE_RADIUS + "px";
            algorithmConfig.startNodeMoveElement.style.left = mouseX - NODE_RADIUS + "px";
        } else {
            algorithmConfig.destNodeMoveElement.style.display = "block";
            algorithmConfig.destNodeMoveElement.style.top = mouseY - NODE_RADIUS + "px";
            algorithmConfig.destNodeMoveElement.style.left = mouseX - NODE_RADIUS + "px";
        }
    }
}

function mouseUpOnCanvas(e) {

    if (toolbar.edgeCreateinProgress && edgesArray.length > 0) {
        deleteLastEdge();
        /* RESET START OR END NODE TO PREVIOUS NODE IF RELEASED ON CANVAS*/
    } else if (toolbar.moveStartNode || toolbar.moveDestNode) {
        if (toolbar.moveStartNode) {
            setStartNode(nodesArray[graph.source]);
        } else {
            setDestNode(nodesArray[graph.dest]);
        }
    }
}
function canvasClicked() {
    if (toolbar.nodeCreateTool) {//Nodecreatetool must be active to make node
        nodeCreate(mouseX, mouseY);
    }
}
function nodeClickedUp(node) {
    /* Move current node actiong */
    if (!toolbar.nodeCreateTool && !toolbar.edgeCreateTool && !(toolbar.moveStartNode || toolbar.moveDestNode)) {
        toolbar.nodeMoveinProgress = false;

        /* Assign Second Node of Current Edge to "this" node unless duplicate*/
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
        /* If currently moving the start or end node, set to this current node */
    } else if (toolbar.moveStartNode || toolbar.moveDestNode) {
        if (toolbar.moveStartNode) {
            nodesArray[graph.source].startNode = false; //Remove last node as start node
            setStartNode(node);
        } else {
            nodesArray[graph.dest].destNode = false; //Remove last node as dest node
            setDestNode(node);
        }
    }
}
function nodeClickedDown(node) {
    let importantNode = node.startNode || node.destNode;
    /* Enable Moving NodeClicked */
    if (!toolbar.nodeCreateTool && !toolbar.edgeCreateTool && !importantNode) {
        toolbar.nodeMoveinProgress = true;
        currentNode = node;

        /* Create Edge And Assign Second Node to Mouse Pointer */
    } else if (toolbar.edgeCreateTool && !toolbar.edgeCreateinProgress) {
        toolbar.edgeCreateinProgress = true;
        let edge = new Edge(node, undefined, svgElement);
        currentEdge = edge;
        edgesArray.push(edge);

    } else if (importantNode && !toolbar.nodeCreateTool) {
        if (node.startNode) {
            node.nodeElement.classList.remove("start-node");
            toolbar.moveStartNode = true;
        } else {
            node.nodeElement.classList.remove("dest-node");
            toolbar.moveDestNode = true;
        }

    }


}



/*---------------------------
        GLOBAL FUNCTIONS
-----------------------------*/
function nodeCreate(x, y) {
    let body = document.getElementById("canvas");
    let node = new Node(x - NODE_RADIUS, y - NODE_RADIUS, body);
    node.nodeElement.onmousedown = function () { nodeClickedDown(node) }; //Cannot do this inside the constructor because can't pass "this" 
    node.nodeElement.onmouseup = function () { nodeClickedUp(node) }; //Cannot do this inside the constructor because can't pass "this" 
    nodesArray.push(node);
    if (nodesArray.length == 1) {
        setStartNode(node);
        node.startNode = true;
    }
    if (nodesArray.length == 2) {
        setDestNode(node);
        node.destNode = true;
    }
    graph.addVertex();
}
function setStartNode(node) {
    console.log("Changed start node to " + node.vertex);

    $("#start-node-move").hide();
    node.startNode = true;
    node.nodeElement.classList += " start-node";
    graph.source = node.vertex;
    toolbar.moveStartNode = false;
}
function setDestNode(node) {
    console.log("Changed destination node to " + node.vertex);

    node.destNode = true;
    $("#dest-node-move").hide();
    node.nodeElement.classList += " dest-node";
    graph.dest = node.vertex;
    toolbar.moveDestNode = false;
}
function resetNodes() {
    $(".node").removeClass("node-searched node-animater-discovered path-found");
    $(".node-animater").removeClass("node-searched node-animater-discovered");

}
function clearNodesandEdges() {
    edgesArray.forEach(edge => edge.destroyHTMLElement());
    nodesArray.forEach(node => node.destroyHTMLElement());
    edgesArray = [];
    nodesArray = [];
    graph = new Graph();
}
function deleteLastEdge() {
    if (edgesArray.length == 0) return;
    edgesArray[edgesArray.length - 1].destroyHTMLElement();
    edgesArray.pop();
    toolbar.edgeCreateinProgress = false;
}
