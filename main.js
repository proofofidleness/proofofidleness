console.log("Proof of Idleness");



var lp = {};

function initialize() {
        
    var Web3 = require('web3');

    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        console.log("Connecting to local node.");
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    var inst = web3.eth.contract([{"constant":false,"inputs":[{"name":"a","type":"address"}],"name":"eliminate","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"idle","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"lastPing","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"countRemaining","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"organizer","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"join","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[],"name":"claimReward","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"a","type":"address"}],"name":"Eliminated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"a","type":"address"},{"indexed":false,"name":"time","type":"uint256"}],"name":"Pinged","type":"event"}]).at("0x019d7e5ae8d2ba9a292244311dc7355058ab1b08")
    var events = inst.allEvents({fromBlock: 0, toBlock: 'latest'});

    web3.eth.getBalance(inst.address, function(error, result) {
        document.getElementById("balance").innerHTML = web3.fromWei( result, "ether" );
    });

    console.log("Start watching.");

    events.watch(function(error, e){  
        if (e.event == "Pinged") {
            console.log("Pinged " + e.args.a + " " + e.args.time)
            lp[e.args.a] = e.args.time;
        }
        else {
            console.log("Eliminated " + e.args.a)
            lp[e.args.a] = 0;
        }
        refresh();
    });

}

function interpolate(v, rgb1, rgb2) {
    var rgb = [0,0,0];
    var p = v; 
    p = Math.max(0,p);
    p = Math.min(1,p);
    for (var i = 0; i < 3; i++) {
        rgb[i] = Math.floor(rgb1[i] * (1.0 - p) + rgb2[i] * p);
    }
    return rgb;
}

function color(hoursAgo) {
    var red = [255,60,60]
    var green = [60,255,60]
    var rgb = interpolate(hoursAgo / 27, green, red)
    return "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
}

function refresh() {
    $("#data-table tbody tr").remove(); 
    var now = new Date().getTime() / 1000

    var addresses = Object.keys(lp);
    addresses.sort(function(a,b) { lp[a] - lp[b] }).reverse();

    for (var i=0; i < addresses.length; i++) {
        var acc = addresses[i];
        if (lp[acc] != 0) {
            var hoursAgo = ((now-lp[acc]) / 3600).toFixed(2)
            console.log(acc + " \t" + lp[acc] + " \t(" + hoursAgo + " hours ago)" );
            $('#data-table > tbody:last-child').append(
                '<tr style="background-color: ' + color(hoursAgo) + '"><td>' + acc + '</td><td>' + lp[acc] + '</td><td>' + (new Date(lp[acc] * 1000)) + '</td><td>' + ((now-lp[acc]) / 3600).toFixed(2) + '</td></tr>'
            );
        }
    }
}
