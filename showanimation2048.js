/*
* @Author: samcss
* @Date:   2017-01-10 17:19:39
* @Last Modified by:   samcss
* @Last Modified time: 2017-01-11 01:21:52
*/

'use strict';

function showNumberWithAnimation( i, j, randNumber ) {
	var numberCell = $( '#number-cell-'+ i + '-' + j );

	numberCell.css('background-color', getNumberBackgroundColor( randNumber ) );
	numberCell.css('color', getNumberColor( randNumber ) );
	numberCell.text( randNumber );

	numberCell.animate( {
		width: cellSideLength,
		height: cellSideLength,
		top: getPosTop( i, j ),
		left: getPosLeft( i, j )
	},50 );
}

function showMoveAnimation( fromX, fromY, toX, toY ) {
	var numberCell = $( '#number-cell-'+ fromX + '-' + fromY );
	numberCell.animate( {
		top: getPosTop( toX, toY ),
		left: getPosLeft( toX, toY )
	},200 );
}

function updateScore(score) {
	$('#score').text(score);
}