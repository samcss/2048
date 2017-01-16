var board = new Array();

var score = 0;

var hasConflicted = new Array();

//声明滑动事件变量
var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

$(document).ready(function() {
	prepareForMobile();
	newgame();
});

function prepareForMobile() {

	if( documentWidth > 500 ) {
		gridContainerWidth = 500;
		cellSpace = 20;
		cellSideLength = 100;
	} else {
		$('#grid-container').css('width', gridContainerWidth - 2*cellSpace);
		$('#grid-container').css('height', gridContainerWidth - 2*cellSpace);
		$('#grid-container').css('padding', cellSpace);
		$('#grid-container').css('border-radius', 0.02*gridContainerWidth);

		$('.grid-cell').css('width', cellSideLength);
		$('.grid-cell').css('height', cellSideLength);
		$('.grid-cell').css('border-radius', 0.02*cellSideLength);
	}
}

function newgame() {
	//初始化棋盘
	init();
	//随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init() {
	for( var i = 0; i < 4; i++ ){

		board[i] = new Array();
		hasConflicted[i] = new Array();
		for( var j = 0; j < 4; j++ ){

			board[i][j] = 0;
			hasConflicted[i][j] = false;

			var gridCell = $( '#grid-cell-'+ i +'-'+ j );
			gridCell.css( 'top', getPosTop( i, j ) );
			gridCell.css( 'left', getPosLeft( i, j ) );
		}
	}
	score = 0;
	updateBoardView();
}

function updateBoardView() {
	$('.number-cell').remove();

	for( var i = 0; i < 4; i++ ) {
		for( var j = 0; j < 4; j++ ) {
			$('#grid-container').append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
			var theNumberCell = $( '#number-cell-'+ i + '-' + j );

			if ( board[i][j] === 0 ) {
				theNumberCell.css( 'width', '0px' );
				theNumberCell.css( 'height', '0px' );
				theNumberCell.css( 'top', getPosTop( i, j ) + cellSideLength/2 );
				theNumberCell.css( 'left', getPosLeft( i, j ) + cellSideLength/2 );
			} else {
				theNumberCell.css( 'width', cellSideLength );
				theNumberCell.css( 'height', cellSideLength );
				theNumberCell.css( 'top', getPosTop( i, j ) );
				theNumberCell.css( 'left', getPosLeft( i, j ) );
				theNumberCell.css( 'background-color', getNumberBackgroundColor( board[i][j] ) );
				theNumberCell.text( board[i][j] );
			}
			hasConflicted[i][j] = false;
		}
	} 

	$('.number-cell').css('line-height', cellSideLength + 'px');
	$('.number-cell').css('font-size', 0.6*cellSideLength + 'px');
}

function generateOneNumber() {
	//首先判断	
	if( nospace( board ) ) {
		return false;
	}
	//随机一个位置
	var randX = parseInt( Math.floor( Math.random() * 4 ) );
	var randY = parseInt( Math.floor( Math.random() * 4 ) );


	//添加一个计数器，当while随机超过50次的仍无法找到空位置，就人为寻找，以达到优化，防止无限循环
	var times = 0;
	while( times < 50 ) {
		if( board[randX][randY] === 0)
			break;
		randX = parseInt( Math.floor( Math.random() * 4 ) );
		randY = parseInt( Math.floor( Math.random() * 4 ) );

		times++;
	}
	if( times === 50 ) {
		for( var i = 0; i < 4; i++ ) {
			for( var j = 0; j < 4; j++ ) {
				if( board[i][j] === 0 ) {
					randX = i;
					randY = j;
				}
			}
		}
	}
	//随机一个数字
	var randNumber = Math.random() < 0.5 ? 2 : 4;

	//渲染随机的数字
	
	board[randX][randY] = randNumber;
	showNumberWithAnimation( randX, randY, randNumber );

	return true;
}

$(document).keydown( function( event ) {
	//阻止默认行为，网页端出现互动条时，阻止滑动条滑动行为,放在这边时，也会阻止其他键盘事件
	//event.preventDefault();

	switch( event.keyCode ) {
		case 37:   //left
			//阻止默认行为，网页端出现互动条时，阻止滑动条滑动行为
			event.preventDefault();
			if( moveLeft() ) {
				setTimeout('generateOneNumber()',210);
				setTimeout('isgameover()',300);
			}
			break;
		case 38:   //up
			event.preventDefault();
			if( moveUp() ) {
				setTimeout('generateOneNumber()',210);
				setTimeout('isgameover()',300);
			}
			break;
		case 39:   //ritgh
			event.preventDefault();
			if( moveRight() ) {
				setTimeout('generateOneNumber()',210);
				setTimeout('isgameover()',300);
			}
			break;
		case 40:  //down
			event.preventDefault();
			if( moveDown() ) {
				setTimeout('generateOneNumber()',210);
				setTimeout('isgameover()',300);
			}
			break;
		default:
			break;
	}
});

//监听触摸滑动事件
document.addEventListener('touchstart', function(event) {
	
	startX = event.touches[0].pageX;
	startY = event.touches[0].pageY;
});

document.addEventListener('touchend', function(event) {
	//当用户点击屏幕时，也会触发这个函数
	endX = event.changedTouches[0].pageX;
	endY = event.changedTouches[0].pageY;

	var deltaX = endX - startX;
	var deltaY = endY - startY;

	//添加判断，排除用户点击或误操作
	if( Math.abs( deltaX ) < 0.3*documentWidth && Math.abs( deltaY ) < 0.3*documentWidth ) {
		return;
	}

	if( Math.abs( deltaX ) >= Math.abs( deltaY ) ) {
		if ( deltaX < 0) {
			// move left
			if( moveLeft() ) {
				setTimeout('generateOneNumber()',210);
				setTimeout('isgameover()',300);
			}
		} else {
			// move right
			if( moveRight() ) {
				setTimeout('generateOneNumber()',210);
				setTimeout('isgameover()',300);
			}
		}
	} else {
		if( deltaY > 0 ) {
			// move down
			if( moveDown() ) {
				setTimeout('generateOneNumber()',210);
				setTimeout('isgameover()',300);
			}
		} else {
			// move up
			if( moveUp() ) {
				setTimeout('generateOneNumber()',210);
				setTimeout('isgameover()',300);
			}
		}
	}
});	

//判断游戏是否结束
function isgameover() {
	if( nospace( board ) && nomove( board ) ) {
		gameover();
	}
}

function gameover() {
	alert('游戏结束');
}

function moveLeft() {

	if( !canMoveLeft( board ) ) 
		return false;
	//move
	for( var i = 0; i < 4; i++ ) {
		for( var j = 1; j < 4; j++ ) {
			if( board[i][j] != 0 ) {
				for( var k = 0; k < j; k++ ) {
					if( board[i][k] === 0 && noBlockHorizontal( i, k, j, board ) ) {
						//move
						showMoveAnimation( i, j, i, k );
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if(board[i][k] === board[i][j] && noBlockHorizontal( i, k, j, board ) && !hasConflicted[i][k] ) {
						//move  add
						showMoveAnimation( i, j, i, k );
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScore(score);

						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);
	return true;
}

function moveRight() {
	if( !canMoveRight( board ) )
		return false;
	//Move
	for( var i = 0; i < 4; i++ ) {
		for( var j = 2; j >= 0; j-- ) {
			if( board[i][j] != 0 ) {
				for( var k = 3; k > j; k-- ) {
					if( board[i][k] === 0 && noBlockHorizontal( i, j, k, board ) ) {
						showMoveAnimation( i, j, i, k );
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if ( board[i][k] === board[i][j] && noBlockHorizontal( i, j, k, board ) && !hasConflicted[i][k] ) {
						showMoveAnimation( i, j, i, k );
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScore(score);

						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);
	return true;
}

function moveUp() {
	if( !canMoveUp( board ) )
		return false;
	//move
	for( var j = 0; j < 4; j++ ) {
		for( var i = 1; i < 4; i++ ) {
			if( board[i][j] != 0 ) {
				for( var k = 0; k < i; k++ ) {
					if( board[k][j] === 0 && noBlockVertical( j, k, i, board ) ) {
						showMoveAnimation ( i, j, k, j );
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if( board[k][j] === board[i][j] && noBlockVertical( j, k, i, board ) && !hasConflicted[k][j] ) {
						showMoveAnimation( i, j, k, j );
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[k][j];
						updateScore(score);

						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);
	return true;
}

function moveDown() {
	if( !canMoveDown( board ) )
		return false;
	for( var j = 0; j < 4; j++ ) {
		for( var i = 2; i >=0; i-- ) {
			if( board[i][j] != 0) {
				for( var k = 3; k > i; k-- ) {
					if( board[k][j] === 0 && noBlockVertical( j, i, k, board ) ) {
						showMoveAnimation( i, j, k, j );
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if( board[k][j] === board[i][j] && noBlockVertical( j, i, k, board ) && !hasConflicted[k][j] ) {
						showMoveAnimation( i, j, k, j );
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[k][j];
						updateScore(score);

						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);
	return true;
}


























