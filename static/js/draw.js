
let points = [];
let ctx;
let canvas;
let W, H;
const point_rad = 1;
let random_points = [];

document.addEventListener("DOMContentLoaded",

    function () {
        canvas = document.getElementById("myCanvas");
        ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        W = canvas.width;
        H = canvas.height;
        setDPI(1000);
        console.log(W);
});


function setDPI(dpi) {
    // Set up CSS size.
    //canvas.style.width = canvas.style.width || canvas.width + 'px';
    //canvas.style.height = canvas.style.height || canvas.height + 'px';

    // Resize canvas and scale future draws.
    var scaleFactor = dpi / 96;
    canvas.width = Math.ceil(canvas.width * scaleFactor);
    canvas.height = Math.ceil(canvas.height * scaleFactor);
    ctx = canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);
}
  


function draw_random_points(n) {
    //const canvas = document.getElementById("myCanvas");
    //const ctx = canvas.getContext("2d");
    for(let i=0; i<n; i++) {
        //let x = randInt(point_rad, canvas.width-point_rad);
        //let y = randInt(point_rad, canvas.height-point_rad);
        let x = randInt(point_rad, W-point_rad);
        let y = randInt(point_rad, H-point_rad);
        points.push({x:x, y:y});
        ctx.beginPath();
        ctx.arc(x, y, point_rad, 0, 2*Math.PI);
        ctx.fillStyle = '#2F52DF';
        //ctx.strokeStyle = '#2F52DF';
        ctx.fill();
        ctx.closePath();
    }
}

function clear1() {
    //const canvas = document.getElementById("myCanvas");
    //const context = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
    random_points = [];
    var but = document.getElementById("conv");
    but.setAttribute("onclick", "draw_convex_hull()");
    but.innerHTML = "Convex Hull";
    var but2 = document.getElementById("rand_p");
    but2.innerHTML = "Random Points";
    but2.setAttribute("onclick", "draw_random_points(10)");
}

function draw_convex_hull() {
    //const url = 'http://localhost:8989/hello'
    const url = window.origin + '/convex_hull';
    fetch(url, {
        method: 'post',
        credentials: 'include',
        body: JSON.stringify({
            'points': points  
        }),
        cache: 'no-cache',
        headers: new Headers({
            'content-type': "application/json"
        })
    })
    .then(response => response.json())  
    .then(convex_points => {
        let n = convex_points.length;
        //console.log(convex_points);
        //const canvas = document.getElementById("myCanvas");
        //const ctx = canvas.getContext("2d");
        ctx.lineWidth = 1;
        ctx.lineHeight = 1;
        ctx.strokeStyle = 'green';
        ctx.beginPath();
        ctx.moveTo(convex_points[0].x, convex_points[0].y);
        for(let i=0; i<n; i++) {
            let next_i = (i+1) % n;
            ctx.lineTo(convex_points[next_i].x, convex_points[next_i].y);
        }
        ctx.stroke();
        var but = document.getElementById("conv");
        but.setAttribute("onclick", "clear_last()");
        but.innerHTML = "Clear Last";
    })
}


function randInt(low, high) { 
    return Math.floor(Math.random() * (high - low + 1) + low);
}


function inside_test_point() {
    const url = window.origin + '/inside';
    let x = randInt(point_rad, W-point_rad);
    let y = randInt(point_rad, H-point_rad);
    random_points.push({x:x, y:y});
    ctx.beginPath();
    ctx.arc(x, y, point_rad, 0, 2*Math.PI);
    ctx.fillStyle = '#ffff66';
    //ctx.strokeStyle = '#2F52DF';
    ctx.fill();
    ctx.closePath();
    fetch(url, {
        method: 'post',
        credentials: 'include',
        body: JSON.stringify({
            'x': x,
            'y': y   
        }),
        cache: 'no-cache',
        headers: new Headers({
            'content-type': "application/json"
        })
    })
    .then(response => response.json())  
    .then(resp_data => {
        if(resp_data['poly'] == false) {
            console.log("You need to first build convex hull");
            return;
        }
        inside = resp_data['inside'];
        // ctx.font = "15px Arial";
        // ctx.fillStyle = "black";
        var but = document.getElementById("rand_p");
        let res = "";
        if(inside==1) {
            res = "Inside";
        } else if(inside==-1) {
            res = "Outside";
        } else {
            res = "On the border";
        }
        but.innerHTML = res;
        but.onclick = "";
    })
}


function clear_last() {
    if(random_points.length>0) {
        let p = random_points.pop();
        ctx.clearRect(p.x-point_rad, p.y-point_rad, 2*point_rad, 2*point_rad);
    }
}
