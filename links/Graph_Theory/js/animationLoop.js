
//Global Variabales
let nodesArray = [];
let edgesArray = [];
let graph = new Graph();
var toolbar = new Toolbar();

const svgElement = document.getElementById("svg");
const canvas = document.getElementById("canvas");
const jumbotron = document.getElementsByClassName('jumbotron');
const infoPanel = document.getElementById('info-panel');
const Navbar = document.getElementById("navbar");
const root = document.documentElement;
const KEYS = { W: 119, E: 101 }

let WIDTH = canvas.clientWidth;
let HEIGHT = canvas.clientHeight;
let NAVBAR_HEIGHT = Navbar.clientHeight;
let NAVBAR_WIDTH = Navbar.clientWidth;

$(document).ready(() => {
    // Start Animation Loop
    window.requestAnimationFrame(loop);
    setInterval(() => {
        NAVBAR_HEIGHT = Navbar.clientHeight;
        HEIGHT = window.innerHeight - NAVBAR_HEIGHT;
        WIDTH = window.innerWidth;
        infoPanel.style.setProperty('height', HEIGHT);
        jumbotron[0].style.setProperty('height', HEIGHT);
        svgElement.style.setProperty('height', HEIGHT)
    }, 500);
});

function loop() {

    // Edge updating
    if (toolbar.edgeCreateinProgress) {
        let currentEdge = edgesArray.pop();
        edgesArray.forEach(edge => edge.update());
        currentEdge.updateWithMouse(mouseX, mouseY);
        edgesArray.push(currentEdge);
    } else {
        edgesArray.forEach(edge => edge.update());
    }

    // updade html node elements from node object properties
    nodesArray.forEach(node => node.update(WIDTH, HEIGHT));
    window.requestAnimationFrame(loop)
}
