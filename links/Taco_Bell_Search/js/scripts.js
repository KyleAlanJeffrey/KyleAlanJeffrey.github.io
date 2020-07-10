let intervalObj = undefined;
let radialSlideInProgress = false;
const RADIAL_MAX_MILE = 25;
let MAX_RADIUS_SCREEN = undefined;

const RADIAL_MILE_SCALE = 11;
const SPACING = 30
let TacoBells = [];
let mouse = { x: undefined, y: undefined, };

let tacoBellHeader = {
    header1: undefined,
    header2: undefined,
    number: 0,
    visibleHeader: undefined,
    text: ' TACOBELLS',
};
let milesHeader = {
    header1: undefined,
    header2: undefined,
    number: 25,
    visibleHeader: undefined,
    text: ' Mile Radius',
};

let radialSlideElement = undefined;
let canvas = undefined;

let lat = 0;
let lon = 0;

$(document).ready(function () {
    document.onpointermove = pointerMove;
    document.onpointerup = pointerUp;
    tacoBellHeader.header1 = $('#number-1');
    tacoBellHeader.header2 = $('#number-2');
    milesHeader.header1 = $('#miles-header1');
    milesHeader.header2 = $('#miles-header2');
    radialSlideElement = $('#radial-slide');
    canvas = $('body');
    $('#radial-slide').on('pointerdown', function (e) { radialSlideDown(e) });
    $('#radial-slide').on('pointerup', function (e) { radialSlideUp(e) });

    MAX_RADIUS_SCREEN = Math.min(canvas.outerWidth() / 2, canvas.outerHeight() / 2);

    radialSlideElement.css('width', MAX_RADIUS_SCREEN * 2);
    radialSlideElement.css('height', MAX_RADIUS_SCREEN * 2);


    let headerWidth = tacoBellHeader.header1.width();
    $('.i1').width(headerWidth + SPACING);

    tacoBellHeader.visibleHeader = tacoBellHeader.header1;
    milesHeader.visibleHeader = milesHeader.header1;
    getTacoBells();

    window.requestAnimationFrame(animationLoop);
});

/*--------------------------------------
            EVENTS
---------------------------------------*/

function radialSlideDown(e) {
    radialSlideInProgress = true;
}
function radialSlideUp(e) {
    radialSlideInProgress = false;
}
function pointerUp(e) {
    radialSlideInProgress = false;
}


function pointerMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (radialSlideInProgress) {
        adjustRadialWidth();
    }
}

function adjustRadialWidth() {
    let centerx = canvas.outerWidth(true) / 2;
    let centery = canvas.outerHeight(true) / 2;
    let distFromCenter = distance(mouse, { x: centerx, y: centery });
    milesHeader.number = Math.floor(RADIAL_MAX_MILE * distFromCenter / MAX_RADIUS_SCREEN);

    if (milesHeader.number < 5) {
        milesHeader.number = 5;
        return;
    }
    if (milesHeader.number > 25) {
        milesHeader.number = 25;
        return;
    }

    if (distFromCenter < 0) distFromCenter *= -1;
    radialSlideElement.css('width', distFromCenter * 2);
    radialSlideElement.css('height', distFromCenter * 2);

}

/*--------------------------------------
            Main Loop
---------------------------------------*/
let prevMiles = undefined;
let tbDisplayCount = 0;
function animationLoop() {
    if (radialSlideInProgress) {
        // $('document').style.cursor='grabbing';
        let newMiles = milesHeader.number;
        tacoBellsWithinRadius(milesHeader.number, TacoBells);
        if (newMiles < prevMiles) {
            countDown(milesHeader);
        } else if (newMiles > prevMiles) {
            countUp(milesHeader);
        }
        prevMiles = newMiles;
    }
    if (tbDisplayCount < tacoBellHeader.number) {
        console.log('here')
        countUp(tacoBellHeader);
        tbDisplayCount++;
    } else if (tbDisplayCount > tacoBellHeader.number) {
        countDown(tacoBellHeader);
        tbDisplayCount--;
    }
    window.requestAnimationFrame(animationLoop);
}

function distance(p2, p1) {
    let x = p2.x - p1.x;
    let y = p2.y - p1.y;
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function tacoBellsWithinRadius(miles, tbArray) {
    let meters = miles * METERS_PER_MILE;
    // console.log(meters);
    let nearMeTB = tbArray.filter((tb) => { return tb.distance < meters });
    tacoBellHeader.number = nearMeTB.length;
}

/*--------------------------------------
            Up and Down Animation
---------------------------------------*/

function countDown(countObject) {
    const visibleElem = countObject.visibleHeader;
    const jqueryElem1 = countObject.header1;
    const jqueryElem2 = countObject.header2;
    const num = countObject.number;
    const text = countObject.text;
    //take visible number, set other number to num-- rotate up
    if (visibleElem == jqueryElem1) {
        countObject.visibleHeader = jqueryElem2;

        jqueryElem1.removeClass();
        jqueryElem2.removeClass();

        jqueryElem2.text(num + text);

        jqueryElem1.addClass('number-FtoT');
        jqueryElem2.addClass('number-BtoF');
    }
    else if (visibleElem == jqueryElem2) {
        countObject.visibleHeader = jqueryElem1;

        jqueryElem1.removeClass();
        jqueryElem2.removeClass();

        jqueryElem1.text(num + text);

        jqueryElem1.addClass('number-BtoF');
        jqueryElem2.addClass('number-FtoT');
    }
}
function countUp(countObject) {
    const visibleElem = countObject.visibleHeader;
    const jqueryElem1 = countObject.header1;
    const jqueryElem2 = countObject.header2;
    const num = countObject.number;
    const text = countObject.text;

    //take visible number, set other number to num-- rotate down
    if (visibleElem == jqueryElem1) {
        countObject.visibleHeader = jqueryElem2;

        jqueryElem1.removeClass();
        jqueryElem2.removeClass();

        jqueryElem2.text(num + text);

        jqueryElem1.addClass('number-FtoB');
        jqueryElem2.addClass('number-TtoF');
    }
    else if (visibleElem == jqueryElem2) {
        countObject.visibleHeader = jqueryElem1;

        jqueryElem1.removeClass();
        jqueryElem2.removeClass();

        jqueryElem1.text(num + text);

        jqueryElem1.addClass('number-TtoF');
        jqueryElem2.addClass('number-FtoB');
    }

}

/*--------------------------------------
            Yelp And Location
---------------------------------------*/
function getTacoBells() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            requestTacoBells(lon, lat, true);
            console.log(lat + ',' + lon);
        });
    } else {
        console.log('Location Services not supported');
    }
}
