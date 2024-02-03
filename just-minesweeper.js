// just minesweeper 1.1
// 2024.2.3



// 0 = Covered
// 1 = Mine
// 2 = Flipped
// 3 = Flagged Correct
// 4 = Flagged Wrong



function flgchk(){
    if (!document.getElementById("allowflag").checked){
        document.getElementById("allowq").checked = false;
        document.getElementById("allowq").disabled = true;
    } else{
        document.getElementById("allowq").disabled = false;
    }
}


function getRandom(min, max) {  // get a random int between min(include) and max(exclude)
    return Math.floor(Math.random() * (max - min) ) + min;
}


let allow_start = false;
function custom_size_chk(){  // Get mines percentage
    let w = document.getElementById("w").value;
    let h = document.getElementById("h").value;
    let m = document.getElementById("m").value;
    let p = Math.round(m/(w*h)*100);
    if (p / 1 == p){
        document.getElementById("percentage").innerText = `(${p}%)`;
    }
    document.getElementById("mt").innerText = `地雷 (1~${w*h-9}): `;

    let err = 0;

    if (m < 1 || w*h-9 < m){
        document.getElementById("mt").style.color = "#ff0000";
        err++;
    } else{
        document.getElementById("mt").style.color = "#bbbbbb";
    }
    if (w < 3 || w > 100){
        document.getElementById("wt").style.color = "#ff0000";
        err++;
    } else{
        document.getElementById("wt").style.color = "#bbbbbb";
    }
    if (h < 3 || h > 100){
        document.getElementById("ht").style.color = "#ff0000";
        err++;
    }else{
        document.getElementById("ht").style.color = "#bbbbbb";
    }

    if (err == 0){
        allow_start = true;
    } else{
        allow_start = false;
    }
}

function show_menu(e){
    pause();
    switch (e){
        case 1:
            document.getElementById("popup").style.display = "block";
            break;
        case 2:
            document.getElementById("popup2").style.display = "block";

    }
    document.getElementById("overlay").style.display = "flex";
}

function close_menu(){
    pause();
    paused = false;
    document.getElementById("popup").style.display = "none";
    document.getElementById("popup2").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function new_b(option){
    switch (option){
        case 1:
            mkbrd(9,9,10);
            break;
        case 2:
            mkbrd(16,16,40);
            break;
        case 3:
            mkbrd(16,30,99);
            break;
        case 4:
        custom_size_chk();    
        if (allow_start){
                let w = document.getElementById("w").value;
                let h = document.getElementById("h").value;
                let m = document.getElementById("m").value;
                mkbrd(h, w, m);
            } else{
                return;
            }
    }
    close_menu();
}



let board = new Array(), started = false, ended = false, minescount, minesleft;
function mkbrd(rols, cols, mines){  // Creates the board
    
    // Creating the board (GUI)
    
    // Remove exsisting borad
    let rem = document.getElementsByClassName("block");
    [...rem].forEach(i => i.remove());
    rem = document.getElementsByClassName("row");
    [...rem].forEach(i => i.remove());
    board = new Array()
    document.getElementById("timer").innerText = "🕑00:00";

    for (let i=0; i<rols; i++){
        let r = document.createElement("div");
        r.classList.add("row");
        r.id = `row${i}`;
        document.getElementById("board").append(r);
        for (let j=0; j<cols; j++){
            let box = document.createElement("div");
            box.classList.add("hide");
            box.classList.add("block");
            box.id = `${i},${j}`;
            
            // Left Click
            box.onclick = function(){flip(i, j);};
            // Double Click
            box.ondblclick = function(){doubleclick(i, j);};
            // Left + Right
            box.addEventListener("mousedown", function(event){
                if ((event.buttons & 3) == 3){
                    doubleclick(i, j);
                }
            })
            // Right Click
            box.addEventListener("contextmenu", function(event){
                flag(i, j);
                event.preventDefault();
            });

            document.getElementById(r.id).append(box);
        }
    }

    // Creating the board (Inner 2D Array)
    started = false;
    ended = false;
    for (let i=0; i<rols; i++){
        let x = new Array();
        for (let j=0; j<cols; j++){
            x.push(0);
        }
        board.push(x);
    }
    
    // Mines will be placed after you flip the first one
    // GUARANTEED 0 ON FIRST OPENED
    minescount = mines;
    minesleft = minescount;
    document.getElementById("minescount").innerText = `💣${minesleft}`;
    document.getElementById("minescount").style.background = "#1d1d1d";
    document.getElementById("minescount").style.color = "#ababab";
    minutes = 0;
    seconds = 0;
    document.getElementById("timer").innerText = "🕑00:00";
    clearInterval(timer);
}

function flip(x, y){  // Filp and win/lose detection



    // Invalid flips
    if (x < 0 || x > board.length-1 || y < 0 || y > board[0].length-1){
        return;
    }
    if (board[x][y] == 2 || board[x][y] == 3 || board[x][y] == 4){  // Flipped or flagged
        return;
    }

    // Can't flip after end game
    if (ended || paused){
        return;
    }

    // First flip places mines
    if (!started){
        start(x, y);  // pass in (x, y) to avoid first click is mine
    }
    
    // Flips the block
    let target = document.getElementById(`${x},${y}`);

    if (board[x][y] == 1){  // Mines lol
        
        target.classList.remove("hide");
        target.classList.add("mine");

        // Reveal all mines
        for (let i=0; i<board.length; i++){
            for (let j=0; j<board[0].length; j++){
                switch (board[i][j]){
                    case 1:
                        target = document.getElementById(`${i},${j}`);
                        target.classList.remove("hide");
                        target.classList.add("mine");
                        target.innerText = "☀";
                        break;
                    case 3:
                        target = document.getElementById(`${i},${j}`);
                        target.style.background = "#75d97c";
                        target.style.borderRadius = "5px";
                        break;
                    case 4:
                        target = document.getElementById(`${i},${j}`);
                        target.innerText = "❌";
                        target.style.borderRadius = "5px";

                }         
            }
        }

        // Stop the timer
        ended = true;
        clearInterval(timer);

        // You lose
        document.getElementById("minescount").innerText = "你輸了!";
        document.getElementById("minescount").style.background = "#ff0000";

    } else{  // Not mine
        
        target.classList.remove("hide");
        target.classList.add("number");

        // Show number
        function i(x,y){
            if (!(x < 0 || x > board.length-1 || y < 0  || y > board[0].length-1)){
                switch (board[x][y]){
                    case 0: return 0; break;
                    case 1: return 1; break;
                    case 2: return 0; break;
                    case 3: return 1; break;
                    case 4: return 0;
                }
            } else{
                return 0;
            }
            
        }
        let adds = i(x-1,y-1) + i(x,y-1) + i(x+1,y-1)
                 + i(x-1,y)              + i(x+1,y)
                 + i(x-1,y+1) + i(x,y+1) + i(x+1,y+1);
        board[x][y] = 2;  // Flipped
        target.innerText = adds == 0 ? '' : adds;
        switch (adds){
            case 1: target.style.color = "#0908fb"; break;
            case 2: target.style.color = "#066306"; break;
            case 3: target.style.color = "#fe0808"; break;
            case 4: target.style.color = "#090884"; break;
            case 5: target.style.color = "#83090a"; break;
            case 6: target.style.color = "#0a8483"; break;
            case 7: target.style.color = "#080808"; break;
            case 8: target.style.color = "#848484";                
        }

        // Empty Spread
        if (adds == 0){
            flip(x-1,y-1);
            flip(x,y-1);
            flip(x+1,y-1);
            flip(x-1,y);
            flip(x+1,y);
            flip(x-1,y+1);
            flip(x,y+1);
            flip(x+1,y+1);
        }

        // Win detection
        for (let i=0; i<board.length; i++){
            for (let j=0; j<board[0].length; j++){
                if (board[i][j] == 0){  // All block must be flipped
                    return;
                }
            }
        }
        ended = true;
        clearInterval(timer);
        document.getElementById("minescount").innerText = "你贏了!";
        document.getElementById("minescount").style.background = "#75d97c";
        document.getElementById("minescount").style.color = "#1d1d1d";
        for (let i=0; i<board.length; i++){
            for (let j=0; j<board[0].length; j++){
                target = document.getElementById(`${i},${j}`);
                switch (board[i][j]){
                    case 1:
                        target.style.background = "#75d97c";
                        target.style.borderRadius = "5px";    
                        target.innerText = "☀";
                        break;
                    case 3:
                        target.style.background = "#75d97c";
                        target.style.borderRadius = "5px";    
                        target.innerText = "✔️";
                }
            }
        }
    }
}

function doubleclick(x, y){  // Double click auto flip
    
    if (ended || paused){
        return;
    }

    if (board[x][y] != 2){
        return;
    }

    function f(x, y){
        if (x < 0 || x > board.length-1 || y < 0  || y > board[0].length-1){
            return 0;
        }else {
            if (document.getElementById(`${x},${y}`).innerText == '?'){
                return 0;
            } else{
                return (board[x][y] == 3 || board[x][y] == 4) ? 1 : 0;
            }
            return (board[x][y] == 3 || board[x][y] == 4) ? 1 : 0;
        }
    }
    
    let adds = f(x-1,y-1) + f(x,y-1) + f(x+1,y-1)
             + f(x-1,y)              + f(x+1,y)
             + f(x-1,y+1) + f(x,y+1) + f(x+1,y+1);

    if (adds == document.getElementById(`${x},${y}`).innerText){
        flip(x-1,y-1);
        flip(x,y-1);
        flip(x+1,y-1);
        flip(x-1,y);
        flip(x+1,y);
        flip(x-1,y+1);
        flip(x,y+1);
        flip(x+1,y+1);
    }

}

function flag(x, y){  // Flags
    
    // No flag
    if (!document.getElementById("allowflag").checked){
        return;
    }


    if (ended || paused){
        return;
    }

    // Can't flag on flipped boxes
    if (board[x][y] == 2){
        return;
    }
    
    // Flag
    let target = document.getElementById(`${x},${y}`);
    if (target.innerText == ''){
        target.innerText = '🚩';
        minesleft--;
        board[x][y] = (board[x][y] == 1) ? 3 : 4;
    } else if (target.innerText == '🚩' && document.getElementById("allowq").checked){
        target.innerText = '?';
        minesleft++;
    } else{
        target.innerText = '';
        board[x][y] = (board[x][y] == 3) ? 1 : 0;
        if (!document.getElementById("allowq").checked){
            minesleft++;
        }
    }
    document.getElementById("minescount").innerText = `💣${minesleft}`


}


let minutes = 0, seconds = 0, timer, paused = false;
function start(){  // Set the mines and start the timer
    
    // Check if too many mines
    let max = board.length*board[0].length-8;
    if (minescount > max){ 
        console.error(`Too many mines (${minescount})! Should be lower than ${max}`);
        return;
    }
    
    // Place mines
    let combinations = [
        {dx:-1,dy:-1},{dx:0,dy:-1},{dx:1,dy:-1},
        {dx:-1,dy:0},{dx:0,dy:0},{dx:1,dy:0},
        {dx:-1,dy:1},{dx:0,dy:1},{dx:1,dy:1}
    ];
    
    for (let i=0; i<minescount; i++){
        let x, y;
        do{
            x = getRandom(0, board.length);
            y = getRandom(0, board[0].length);
        } while (board[x][y] == 1 || combinations.some(a => x+a.dx==arguments[0] && y+a.dy==arguments[1]));
        board[x][y] = 1;
    }

    // Start the timer
    started = true;
    minutes = 0;
    seconds = 0;
    document.getElementById("timer").innerText = "🕑00:00";
    clearInterval(timer);
    start_timer();
}

function start_timer(){  // Resume the timer
    paused = false;
    let display = document.getElementById("timer");
    display.innerText = `🕑${minutes<10?'0'+minutes:minutes}:${seconds<10?'0'+seconds:seconds}`;
    timer = setInterval(() => {
        seconds++;
        if (seconds == 60){
            seconds = 0;
            minutes++;
        }
        display.innerText = `🕑${minutes<10?'0'+minutes:minutes}:${seconds<10?'0'+seconds:seconds}`;
    }, 1000);

}

function pause(){  // Pause the timer
    if (!started || ended){
        return;
    }
    if (paused == false){
        paused = true;
        clearInterval(timer);
        document.getElementById("timer").innerText = `⏸️${minutes<10?'0'+minutes:minutes}:${seconds<10?'0'+seconds:seconds}`;
        document.getElementById("overlay").style.display = "flex";
    } else{
        paused = false;
        start_timer();
        document.getElementById("overlay").style.display = "none";
        document.getElementById("popup").style.display = "none";
    }
    
}


document.addEventListener('keydown', function(event){  // key binds
    // F2 -> new game menu
    if (event.key == "F2") {
        if (document.getElementById("popup").style.display == "none"){
            show_menu(1);
        } else{
            close_menu();
        }
    }
    
    // R -> new game with the same layout
    if (event.key == "r") {
        mkbrd(board.length, board[0].length, minescount);
        minutes = 0;
        seconds = 0;
        document.getElementById("timer").innerText = "🕑00:00";
        clearInterval(timer);
    }

    // p -> pause
    if (event.key == "p") {
        pause();
    }
});


mkbrd(9,9,10);  // Default