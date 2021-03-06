define(["jquery", "engine"], function ($, Engine) {
    'use strict';
    //        var firstCell1 = [[5, 3, 4], [6, 7, 2], [1, 9, 8]],
    //            secondCell1 = [[6, 7, 8], [1, 9, 5], [3, 4, 2]],
    //            thirdCell1 = [[9, 1, 2], [3, 4, 8], [5, 6, 7]],
    //            firstRow = [firstCell1, secondCell1, thirdCell1];
    //    
    //        var firstCell2 = [[8, 5, 9], [4, 2, 6], [7, 1, 3]],
    //            secondCell2 = [[7, 6, 1], [8, 5, 3], [9, 2, 4]],
    //            thirdCell2 = [[4, 2, 3], [7, 9, 1], [8, 5, 6]],
    //            secondRow = [firstCell2, secondCell2, thirdCell2];
    //    
    //        var firstCell3 = [[9, 6, 1], [2, 8, 7], [3, 4, 5]],
    //            secondCell3 = [[5, 3, 7], [4, 1, 9], [2, 8, 6]],
    //            thirdCell3 = [[2, 8, 4], [6, 3, 5], [0, 7, 9]],
    //            thirdRow = [firstCell3, secondCell3, thirdCell3];
    //        var defaultBoard = [firstRow, secondRow, thirdRow];

    var firstCell1 = [[5, 3, 0], [6, 0, 0], [0, 9, 8]],
        secondCell1 = [[0, 7, 0], [1, 9, 5], [0, 0, 0]],
        thirdCell1 = [[0, 0, 0], [0, 0, 0], [0, 6, 0]],
        firstRow = [firstCell1, secondCell1, thirdCell1],
        firstCell2 = [[8, 0, 0], [4, 0, 0], [7, 0, 0]],
        secondCell2 = [[0, 6, 0], [8, 0, 3], [0, 2, 0]],
        thirdCell2 = [[0, 0, 3], [0, 0, 1], [0, 0, 6]],
        secondRow = [firstCell2, secondCell2, thirdCell2],
        firstCell3 = [[0, 6, 0], [0, 0, 0], [0, 0, 0]],
        secondCell3 = [[0, 0, 0], [4, 1, 9], [0, 8, 0]],
        thirdCell3 = [[2, 8, 0], [0, 0, 5], [0, 7, 9]],
        thirdRow = [firstCell3, secondCell3, thirdCell3],
        defaultBoard = [firstRow, secondRow, thirdRow];

    function createTable(gameBoard) {
        var table = $('<table></table>');
        table.addClass('sudoku-table');
        table.attr("cellpadding", 0);
        table.attr("cellspacing", 0);
        table.attr("border", 0);
        for (var i = 0; i < 3; i++) {
            var row = $('<tr></tr>').addClass('sudoku-row');
            for (var j = 0; j < 3; j++) {
                var cell = $('<td></td>').addClass('sudoku-cell');
                var cellTable = $('<table></table>').addClass('sudoku-sub-stable');
                cellTable.attr("cellpadding", 0);
                cellTable.attr("cellspacing", 0);
                for (var k = 0; k < 3; k++) {
                    var innerRow = $('<tr></tr>').addClass('sudoku-sub-row');
                    for (var l = 0; l < 3; l++) {
                        var userCell = $('<td></td>');
                        userCell.addClass('sudoku-input');

                        if (gameBoard[i][j][k][l] !== 0) {
                            userCell.text(gameBoard[i][j][k][l]);
                            userCell.addClass('sudoku-fix-input');
                        }

                        userCell.attr("id", i.toString() + j.toString() + k.toString() + l.toString());
                        innerRow.append(userCell);
                    }
                    cellTable.append(innerRow);
                }
                cell.append(cellTable);
                row.append(cell);
            }
            table.append(row);
        }
        return table;
    }

    function bindInputEvents(gameEngine, gameState) {
        // bind click event for all sudoku-input
        $(".sudoku-input").bind("click", function () {
            if ($(this).hasClass('sudoku-fix-input')) {
                return;
            }
            var id = $(this).attr("id");
            var text = $(this).text();
            var newValue;
            if (!text) {
                newValue = 1;
                $(this).text(newValue);
            } else {
                newValue = parseInt(text);
                newValue++;
                if (newValue === 10) {
                    $(this).text("");
                } else {
                    $(this).text(newValue);
                }
            }
            gameEngine.makeAMove(parseInt(id.charAt(0)), parseInt(id.charAt(1)),
                parseInt(id.charAt(2)), parseInt(id.charAt(3)),
                newValue, makeAMoveCallBack);
            gameState[id] = newValue;
        });

        $(".sudoku-input").hover(function () {
            $(this).toggleClass("sudoku-input-hover");
        }, function () {
            $(this).toggleClass("sudoku-input-hover");
        });
    }

    function makeAMoveCallBack(i, j, k, l, isAlreadyValid, isValid) {
        if ((isAlreadyValid && !isValid) || (!isAlreadyValid && isValid)) {
            $('#' + i.toString() + j.toString() + k.toString() + l.toString())
                .toggleClass("sudoku-invalid-input");
        }
    }

    var Board = function () {
        this.gameBoard = $.extend(true, [], defaultBoard);
        this.gameState = {};
        this.gameEngine = new Engine(this.gameBoard);
        this.gameEngine.init();

        this.boardContainer = null;
    };

    Board.prototype.init = function (container, winningCallback) {
        this.boardContainer = container;
        $(container).append(createTable(this.gameBoard));
        bindInputEvents(this.gameEngine, this.gameState);
        this.gameEngine.onGameWinning = function () {
            $(".sudoku-input").unbind();
            winningCallback();
        };
    };

    Board.prototype.removeBoard = function () {
        $(this.boardContainer).empty();
    };

    Board.prototype.loadGame = function (state) {

        for (var id in state) {
            if (state.hasOwnProperty(id) && state[id] !== 0) {

                $('#' + id).text(state[id]);

                this.gameEngine.makeAMove(parseInt(id.charAt(0)), parseInt(id.charAt(1)),
                    parseInt(id.charAt(2)), parseInt(id.charAt(3)),
                    state[id], makeAMoveCallBack);
            }
        }
    };

    return Board;

});