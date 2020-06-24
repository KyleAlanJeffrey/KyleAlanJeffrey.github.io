
//Global Variabales
// let nodes = document.getElementsByClassName("node");
let nodesArray = [];
let edgesArray = [];
var edgeCreateInProgress = false;

let canvas = document.getElementById("canvas");
const WIDTH = canvas.clientWidth;
const HEIGHT = canvas.clientHeight;

// Start Animation Loop
window.requestAnimationFrame(loop)

function loop() {
    
    if (edgeCreateInProgress) { //If current edge is being used
        let currentEdge = edgesArray.pop();
        edgesArray.forEach(edge => edge.update());
        currentEdge.updateWithMouse(mouseX, mouseY);
        edgesArray.push(currentEdge);
    } else {
        edgesArray.forEach(edge => edge.update());
    }

    nodesArray.forEach(node => node.updateVel(WIDTH, HEIGHT)); //update positions from velocities
    nodesArray.forEach(node => node.updateHTMLElement());     //updade html node elements

    window.requestAnimationFrame(loop)
}
