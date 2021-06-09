
//Global Variabales
let nodesArray = [];
let edgesArray = [];
let graph = new Graph();
var edgeCreateInProgress = false;

let canvas = document.getElementById("canvas");
const WIDTH = canvas.clientWidth;
const HEIGHT = canvas.clientHeight;
const NAVBAR_HEIGHT = document.getElementById("navbar").clientHeight;
const NAVBAR_WIDTH = document.getElementById("navbar").clientWidth;

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

    nodesArray.forEach(node => node.updateVel(WIDTH,HEIGHT));     //updade html node elements
    nodesArray.forEach(node => node.update());     //updade html node elements

    window.requestAnimationFrame(loop)
}
