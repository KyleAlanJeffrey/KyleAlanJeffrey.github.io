var nodeCreateTool = false;
var edgeCreateTool = false;
var createGridTool = false;
var nodeMoveInProgress = false;
var currentNode = undefined;

var mouseX = 0;
var mouseY = 0;
var mouseDownVar = false;

const NAVBAR_HEIGHT = document.getElementById("navbar").clientHeight;
const NAVBAR_WIDTH = document.getElementById("navbar").clientWidth;
document.body.onmouseup = mouseUp;
document.body.onmousedown = mouseDown;
document.body.onmousemove = mouseMove;

function mouseDown(e) {
    mouseDownVar = true;
    mouseUpVar = false;
}
function mouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY - NAVBAR_HEIGHT;
    if (nodeMoveInProgress) {
        if (edgeCreateTool) return;
        currentNode.x = mouseX - NODE_RADIUS;
        currentNode.y = mouseY - NODE_RADIUS;
    }
}
function mouseUp(e) {
    mouseDownVar = false;
    mouseUpVar = true;
    if (nodeCreateTool) {//Nodecreatetool must be active to make node
        if (e.clientY < NAVBAR_HEIGHT) return; //If clicked in navbar don't create node
        nodeCreate(e.offsetX, e.offsetY);
    } else if (edgeCreateTool) {

    }
}
function nodeCreate(x, y) {
    let body = document.getElementById("canvas");
    let node = new Node(mouseX - NODE_RADIUS, mouseY - NODE_RADIUS, body);
    node.nodeElement.onmousedown = function () { nodeClicked(node) }; //Cannot do this inside the constructor because can't pass "this" 
    nodesArray.push(node);
}

function nodeClicked(node) {
    if (edgeCreateInProgress) {
        let currentEdge = edgesArray[edgesArray.length - 1];
        edgeCreateInProgress = false;

        // DELETE DUPLICATE EDGES
        let matchNodes = edgesArray.filter(edge => edge.node2 == node); //find edges with same node2
        if (matchNodes[0]) {
            if (matchNodes[0].node1 == currentEdge.node1) { //delete edge if same  node1
                currentEdge.destroyHTMLElement();
                edgesArray.pop();
                return;
            }
        }
        currentEdge.node2 = node;

    } else if (edgeCreateTool) {
        edgeCreateInProgress = true;
        let svg = document.getElementById("svg");
        let edge = new Edge(mouseX, mouseY, node, undefined, svg); //creates html element as well as abstract edge
        edgesArray.push(edge);
    } else if(!nodeCreateTool){
        nodeMoveInProgress = !nodeMoveInProgress;
        currentNode = node;
    }
}

function createGrid() {
    let body = document.getElementById("canvas");
    let padding = 20;
    let nodeSpace = NODE_RADIUS * 2 + padding;
    let w = WIDTH / nodeSpace;
    let h = HEIGHT / nodeSpace;
    for (let i = 0; i < h - 1; i++) {
        for (let j = 0; j < w - 1; j++) {
            nodeCreate(nodeSpace * j, nodeSpace * i, body);
        }
    }
}
function destroyGrid() {
    let n = nodesArray.length;
    for (let index = 0; index < n; index++) {
        let node = nodesArray.pop();
        node.destroyHTMLElement();
    }
}





// Button interactions
function nodeCreateToolClicked() { //Node Creation tool
    if (edgeCreateTool || createGridTool) return; //If other tools are active
    nodeCreateTool = !nodeCreateTool;
    let nodeButton = document.getElementById("nodeCreate");
    if (nodeButton.classList.contains("active")) {
        nodeButton.classList = ""
    } else {
        nodeButton.classList.add("active")
    }
}

function edgeCreateToolClicked() { //edge Creation tool
    if (nodeCreateTool || createGridTool) return;
    if (edgeCreateInProgress) { //If I click the edgecreatetool while im currently creating an edge, remove that edge
        let edge = edgesArray.pop();
        edge.destroyHTMLElement();
        edgeCreateInProgress = false;
    }
    edgeCreateTool = !edgeCreateTool;
    let edgeButton = document.getElementById("edgeCreate");
    if (edgeButton.classList.contains("active")) {
        edgeButton.classList = ""
    } else {
        edgeButton.classList.add("active")
    }
}

function createGridToolClicked() {
    if (nodeCreateTool || edgeCreateTool) return;
    let createGridButton = document.getElementById("createGrid");
    createGridTool = !createGridTool;
    if (createGridTool) {
        createGridButton.classList = "";
        createGridButton.classList.add("destroy");
        createGridButton.innerHTML = "Destroy Grid";
        createGridButton.id = "createGrid";
        createGrid();
    } else {
        createGridButton.classList = "";
        createGridButton.classList.add("active");
        createGridButton.innerHTML = "Create Grid";
        createGridButton.id = "createGrid"
        destroyGrid();
    }

}