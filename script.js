    const boardDiv = document.getElementById("board");
    const game = new Chess();

    let selectedSquare = null;
    let legalMoves = [];

    const pieces = {
        p: "assets/bP.svg",
        r: "assets/bR.svg",
        n: "assets/bN.svg",
        b: "assets/bB.svg",
        q: "assets/bQ.svg",
        k: "assets/bK.svg",

        P: "assets/wP.svg",
        R: "assets/wR.svg",
        N: "assets/wN.svg",
        B: "assets/wB.svg",
        Q: "assets/wQ.svg",
        K: "assets/wK.svg",
        };

    function showWinPopup(text) {
        document.getElementById("winnerText").innerText = text;
        document.getElementById("popup").classList.remove("hidden");
    }

    function restartGame(){
        game.reset();
        selectedSquare = null;
        legalMoves = [];
        document.getElementById("popup").classList.add("hidden");
        drawBoard();
    }


    function drawBoard() {
        boardDiv.innerHTML = "";

        const board = game.board();

        for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const square = document.createElement("div");

            const isWhite = (r + c) % 2 === 0;

            square.classList.add("square");

            if (isWhite) {
            square.classList.add("white");
            } else {
            square.classList.add("black");
            }

            square.className = "square " + (isWhite ? "white" : "black");

            const piece = board[r][c];
            const squareName = "abcdefgh"[c] + (8 - r);

            if (squareName === selectedSquare) {
            square.classList.add("selected");
            }

            if (legalMoves.includes(squareName)) {
            square.classList.add("highlight");
            }

            if (piece) {
            const img = document.createElement("img");

            img.src =
                piece.color === "w"
                ? pieces[piece.type.toUpperCase()]
                : pieces[piece.type];

            square.appendChild(img);
            }

            square.onclick = () => handleClick(squareName);

            boardDiv.appendChild(square);
        }
        }
    }

    function handleClick(square) {
        const piece = game.get(square);

        if (piece && piece.color === game.turn()) {
        selectedSquare = square;

        const moves = game.moves({
            square: square,
            verbose: true,
        });

        legalMoves = moves.map((m) => m.to);

        drawBoard();
        return;
        }

        if (selectedSquare) {
        const move = game.move({
            from: selectedSquare,
            to: square,
            promotion: "q",
        });

        selectedSquare = null;
        legalMoves = [];

        drawBoard();

        if (game.isCheckmate()) {
            const winner = game.turn() === "w" ? "Black" : "White";
            showWinPopup(winner + " wins by checkmate!");
        }
        return;
    }
    }

    drawBoard();
    