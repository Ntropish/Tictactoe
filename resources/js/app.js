/**
 * Created by Justin on 7/11/2015.
 */

/* global $: false, console: false */
$(document).ready(function(){
    'use strict';
    var game = 0;
    var turn = 0;
    var userMark = '';
    var npcMark = '';
    var board = [['','',''],['','',''],['','','']];
    var winSets =  [[[0,0],[0,1],[0,2]],
                    [[1,0],[1,1],[1,2]],
                    [[2,0],[2,1],[2,2]],
                    [[0,0],[1,0],[2,0]],
                    [[0,1],[1,1],[2,1]],
                    [[0,2],[1,2],[2,2]],
                    [[0,0],[1,1],[2,2]],
                    [[2,0],[1,1],[0,2]]];

    //single game session
    function play(){
        npcMark = userMark === 'o'?'x':'o';
        game += 1;
        turn = 0;
        board = [['','',''],['','',''],['','','']];
        clearDOMBoard();
        function applyMark(coords, mark) {
            var name = ['one','two','three','four','five','six','seven','eight','nine'][coords[0]*3 +coords[1]];
            $('#'+name).find('.cell-val').text(mark);
        }
        function clearDOMBoard() {
            var name;
            for (var i = 0; i<3; i++) {
                for (var j = 0; j<3; j++) {
                    name = ['one','two','three','four','five','six','seven','eight','nine'][i*3 + j];
                    var elt = $('#'+name);
                    elt.find('.cell-val').text('');
                    elt.removeClass('red-border');
                }
            }
        }
        function npcMove() {
            function makeMove(coord) {
                board[coord[0]][coord[1]] = npcMark;
                applyMark([coord[0],coord[1]],npcMark);
                turn += 1;
                finishCheck();
            }
            function userWinNextMove() {//Check if user can win next move
                for (var i = 0, l = winSets.length; i<l; i++) {
                    var winSet = winSets[i];

                    for (var o = 0; o<3; o++) {//o for offset
                        if (board[winSet[o][0]][winSet[o][1]] === '' &&
                            board[winSet[(o+1)%3][0]][winSet[(o+1)%3][1]] === userMark &&
                            board[winSet[(o+2)%3][0]][winSet[(o+2)%3][1]] === userMark
                        ) {
                            return winSet[o];
                        }
                    }

                }
            }
            function npcWinNextMove() {//Check if user can win next move
                for (var i = 0, l = winSets.length; i<l; i++) {
                    var winSet = winSets[i];

                    for (var o = 0; o<3; o++) {//o for offset
                        if (board[winSet[o][0]][winSet[o][1]] === '' &&
                            board[winSet[(o+1)%3][0]][winSet[(o+1)%3][1]] === npcMark &&
                            board[winSet[(o+2)%3][0]][winSet[(o+2)%3][1]] === npcMark
                        ) {
                            return winSet[o];
                        }
                    }

                }
            }
            if (board[1][1] === '') {
                makeMove([1,1]);
                return;
            }
            var npcNext = npcWinNextMove();
            if (npcNext) {
                makeMove([npcNext[0], npcNext[1]]);
                return;
            }
            var userNext = userWinNextMove();
            if (userNext) {
                makeMove([userNext[0], userNext[1]]);
                return;
            }
            for (var i = 0; i<3; i++) {
                for (var j = 0; j<3; j++) {
                    if (board[i][j] === '') {
                        makeMove([i,j]);
                        return;
                    }
                }
            }

        }
        function userMove(coordinates) {
            if (board[coordinates[0]][coordinates[1]] === '') {
                board[coordinates[0]][coordinates[1]] = userMark;
                applyMark(coordinates, userMark);
                turn += 1;
                if (!finishCheck()) {
                    npcMove();
                }

            }
        }
        function winCheck() {
            //just going to brute force this
            for (var i = 0, l = winSets.length; i<l; i++) {
                var mark = board[winSets[i][0][0]][winSets[i][0][1]];
                if (mark !== '' &&
                    mark === board[winSets[i][1][0]][winSets[i][1][1]] &&
                    mark === board[winSets[i][2][0]][winSets[i][2][1]]) {
                    for (var j = 0; j < 3; j++) {
                        var e = winSets[i][j];
                        var name = ['one','two','three','four','five','six','seven','eight','nine'][3 *e[0] + e[1]];
                        $('#' + name).addClass('red-border');
                    }
                    window.setTimeout(play, 500);
                    return true;
                }
            }
            return false;
        }
        function finishCheck() {
            if (winCheck()) {
                return true;
            }
            if (turn >= 9) {
                window.setTimeout(play, 500);
                return true;
            }

            return false;
        }
        if (game%2 === 1 && userMark === 'o') {
            npcMove();
        } else if (game%2 === 0 && userMark === 'x') {
            npcMove();
        }
        $('#one').on('click', function(){
            userMove([0,0]);
        });
        $('#two').on('click', function(){
            userMove([0,1]);
        });
        $('#three').on('click', function(){
            userMove([0,2]);
        });
        $('#four').on('click', function(){
            userMove([1,0]);
        });
        $('#five').on('click', function(){
            userMove([1,1]);
        });
        $('#six').on('click', function(){
            userMove([1,2]);
        });
        $('#seven').on('click', function(){
            userMove([2,0]);
        });
        $('#eight').on('click', function(){
            userMove([2,1]);
        });
        $('#nine').on('click', function(){
            userMove([2,2]);
        });
    }


    //Initial mark choice
    $('#x-choice').one('click', function(){
        userMark = 'x';
        $('#player-choose').remove();
        play();
    });
    $('#o-choice').one('click', function(){
        userMark = 'o';
        $('#player-choose').remove();
        play();
    });
});