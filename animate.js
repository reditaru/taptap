var colorSet = [
	13430510,
	8965324,
	9099756,
	961181,
	1089457,
	34969,
	13934238,
	16110792,
	15488645,
	16531063,
	5853015,
	3222317,
];

function Background() {
	var _this = this;
	var forwardColor;
	var backColor;
	var container;
	var forward;
	var back;
	var mask;
	var flag;
	var flashPane;
	_this.init = function() {
		_this.forwardColor = _this.backColor = colorSet[Math.floor(Math.random() * colorSet.length)];
		while (_this.forwardColor === _this.backColor) {
			_this.backColor = colorSet[Math.floor(Math.random() * colorSet.length)];
		}
		_this.forward = new PIXI.Graphics();
		_this.drawRect(_this.forward, _this.forwardColor);
		_this.back = new PIXI.Graphics();
		_this.drawRect(_this.back, _this.backColor);
		_this.mask = new PIXI.Graphics();
		_this.mask.points = [];
		_this.mask.points.push({ y: 0, x: 0 });
		_this.mask.points.push({ y: 0, x: window.innerWidth });
		_this.mask.points.push({ y: window.innerHeight, x: window.innerWidth });
		_this.mask.points.push({ y: window.innerHeight, x: 0 });
		_this.updateMask();
		_this.forward.mask = _this.mask;
		_this.container = new PIXI.Container();
		_this.flashPane = new PIXI.Graphics();
		_this.container.addChild(_this.back);
		_this.container.addChild(_this.forward);
		_this.container.addChild(_this.flashPane);
		_this.flag = true;
	};
	_this.getContainer = function() {
		return _this.container;
	};
	_this.updateMask = function() {
		_this.mask.clear();
		var points = _this.mask.points;
		_this.mask.beginFill();
		_this.mask.moveTo(points[0].x, points[0].y);
		for (var i = 1; i < points.length; i++) {
			_this.mask.lineTo(points[i].x, points[i].y);
		}
	};
	_this.flash = function() {
		var tl = new TimelineMax();
		_this.flashPane.clear();
		_this.flashPane.beginFill(0xffffff, 0.8);
		_this.flashPane.alpha = 0.9;
		_this.flashPane.drawRect(0, 0, window.innerWidth, window.innerHeight);
		tl
			.to(_this.flashPane, 0.1, { alpha: 0 })
			.set(_this.flashPane, { alpha: 0.9 })
			.to(_this.flashPane, 0.1, { alpha: 0 });
	};
	_this.slide = function() {
		var tl = new TimelineMax({
			pause: true,
			onComplete: function() {
				_this.forwardColor = _this.backColor;
			},
			onUpdate: background.updateMask,
		});
		if (_this.flag) {
			while (_this.forwardColor === _this.backColor) {
				_this.backColor = colorSet[Math.floor(Math.random() * colorSet.length)];
			}
			_this.drawRect(_this.back, _this.backColor);
		} else {
			while (_this.forwardColor === _this.backColor) {
				_this.forwardColor = colorSet[Math.floor(Math.random() * colorSet.length)];
			}
			_this.drawRect(_this.forward, _this.forwardColor);
		}
		var direction = Math.floor(Math.random() * 4),
			points = _this.generatePoints(direction),
			num = 0,
			target =
				direction % 2 === 0
					? { y: direction === 0 ? window.innerHeight : 0, ease: Power3.easeOut }
					: { x: direction === 1 ? 0 : window.innerWidth, ease: Power3.easeOut },
			preNum = (direction + 3) % 4 === 0 ? 4 : (direction + 3) % 4;
		_this.mask.points.length = 0;
		while (num < 4 + points.length) {
			if (_this.flag) {
				if (num < direction + 1)
					_this.mask.points.push({
						y: num > 1 ? window.innerHeight : 0,
						x: num % 3 === 0 ? 0 : window.innerWidth,
					});
				else if (num >= direction + 1 && num < direction + 1 + points.length)
					_this.mask.points.push(points[num - direction - 1]);
				else
					_this.mask.points.push({
						y: num - points.length > 1 ? window.innerHeight : 0,
						x: (num - points.length) % 3 === 0 ? 0 : window.innerWidth,
					});
			} else {
				if (num < preNum) _this.addMaskPoint(_this.mask, direction, num);
				else if (num >= preNum && num < preNum + points.length) _this.mask.points.push(points[num - preNum]);
				else _this.addMaskPoint(_this.mask, direction, num - points.length);
			}
			num++;
		}
		var delay = 0;
		tl.add(TweenMax.to(_this.mask.points[_this.flag ? direction : preNum - 1], 1, target), 0);
		for (var point of points) {
			delay += 0.15;
			tl.add(TweenMax.to(point, 1 - delay, target), 0);
		}
		tl.add(
			TweenMax.to(
				_this.mask.points[
					(_this.flag ? direction + points.length + 1 : preNum + points.length) % _this.mask.points.length
				],
				1,
				target
			),
			0
		);
		_this.flag = !_this.flag;
	};
	_this.generatePoints = function(direction, num) {
		var minY = direction === 2 ? window.innerHeight : 0,
			maxY = direction === 0 ? 0 : window.innerHeight,
			minX = direction === 1 ? window.innerWidth : 0,
			maxX = direction === 3 ? 0 : window.innerWidth,
			num = num || Math.floor(Math.random() * 2 + 1),
			points = [],
			flag = (_this.flag ? 1 : -1) * (direction > 1 ? -1 : 1);
		while (points.length < num) {
			var x = random(minX, maxX),
				y = random(minY, maxY);
			points.push({ x: x, y: y });
		}
		points = points.sort(function(a, b) {
			return flag * (a.x === b.x ? a.y - b.y : a.x - b.x);
		});
		return points;
	};
	_this.drawRect = function(elem, color) {
		elem.clear();
		elem.beginFill(color);
		elem.drawRect(0, 0, window.innerWidth, window.innerHeight);
		elem.endFill();
	};
	_this.addMaskPoint = function(mask, direction, index) {
		var arr = [
			[0, 0, window.innerWidth, 0, window.innerWidth, 0, 0, 0],
			[
				window.innerWidth,
				0,
				window.innerWidth,
				0,
				window.innerWidth,
				window.innerHeight,
				window.innerWidth,
				window.innerHeight,
			],
			[
				0,
				window.innerHeight,
				window.innerWidth,
				window.innerHeight,
				window.innerWidth,
				window.innerHeight,
				0,
				window.innerHeight,
			],
			[0, 0, 0, 0, 0, window.innerHeight, 0, window.innerHeight],
		];
		mask.points.push({ x: arr[direction][index * 2], y: arr[direction][index * 2 + 1] });
	};
	_this.init();
	return _this;
}
function Block() {
	var _this = this;
	var container;
	var blockPane;
	var lastBlock;
	var dragging;
	var blocks;
	var click;
	var slideTarget;
	var flashTarget;
	_this.init = function() {
		_this.container = new PIXI.Container();
		_this.blockPane = new PIXI.Graphics();
		_this.blockPane.beginFill(0, 0);
		_this.blockPane.drawRect(0, 0, window.innerWidth, window.innerHeight);
		_this.blockPane.interactive = true;
		_this.blockPane.on('pointerdown', _this.dragStart);
		_this.blockPane.on('pointermove', _this.dragMove);
		_this.blockPane.on('pointerup', _this.dragEnd);
		_this.blocks = [];
		for (var index = 0; index < 32; index++) {
			var block = new PIXI.Graphics();
			block.beginFill(0, 0);
			_this.blocks.push(block);
			_this.blockPane.addChild(block);
		}
		_this.container.addChild(_this.blockPane);
		_this.lastBlock = -1;
		_this.dragging = false;
		_this.click = 0;
		_this.slideTarget = Math.floor(Math.random() * 10 + 10);
		_this.flashTarget = Math.floor(Math.random() * 5 + 25);
	};
	_this.dragStart = function(e) {
		_this.handleAnime(e);
		_this.dragging = true;
	};
	_this.dragMove = function(e) {
		if (_this.dragging) {
			_this.handleAnime(e);
		}
	};
	_this.handleAnime = function(e) {
		var point = e.data.global,
			x = Math.floor(point.x / (window.innerWidth / 8)),
			y = Math.floor(point.y / (window.innerHeight / 4)),
			block = x + y * 8;
		if (e.type === 'pointerdown' || (e.type === 'pointermove' && block !== _this.lastBlock)) {
			_this.flash(block);
			_this.click++;
			if (_this.click % _this.slideTarget === 0) {
				_this.slideTarget = Math.floor(Math.random() * 10 + 10);
				background.slide();
			}
			if (_this.click % _this.flashTarget === 0) {
				_this.flashTarget = Math.floor(Math.random() * 5 + 25);
				background.flash();
			}
			_this.lastBlock = block;
			var anime = animes[block];
			if (anime) anime.play();
		}
	};
	_this.dragEnd = function(e) {
		_this.dragging = false;
	};
	_this.flash = function(block) {
		var x = block % 8,
			y = Math.floor(block / 8),
			width = window.innerWidth / 8,
			height = window.innerHeight / 4,
			drawBlock = _this.blocks[block];
		if (drawBlock) {
			drawBlock.clear();
			drawBlock.beginFill(0xffffff, 0.6);
			drawBlock.alpha = 0.6;
			drawBlock.drawRect(x * width, y * height, width, height);
			TweenMax.to(drawBlock, 0.4, { alpha: 0 });
		}
	};
	_this.getContainer = function() {
		return _this.container;
	};
	_this.init();
}
function RandomShape(line) {
	var _this = this,
		container,
		pane,
		flag;
	_this.init = function() {
		_this.container = new PIXI.Container();
		_this.pane = new PIXI.Graphics();
		_this.pane.beginFill(0, 0);
		_this.pane.drawRect(0, 0, window.innerWidth, window.innerHeight);
		_this.container.addChild(_this.pane);
		_this.flag = line || false;
	};
	_this.update = function(shape, color, lineWidth) {
		shape.clear();
		var points = shape.points;
		if (!_this.flag) {
			shape.beginFill(color);
		} else shape.lineStyle(lineWidth, color);
		shape.moveTo(points[0].x, points[0].y);
		for (var i = 1; i < points.length; i++) {
			shape.lineTo(points[i].x, points[i].y);
		}
		shape.closePath();
	};
	_this.play = function() {
		var num = Math.floor(Math.random() * 3 + 3),
			points = _this.generatePoints(num),
			shape = new PIXI.Graphics(),
			color = colorSet[Math.floor(Math.random() * colorSet.length)],
			lineWidth = random(2, 4);
		tl = new TimelineMax({
			onComplete: function() {
				_this.pane.removeChild(shape);
			},
			onUpdate: _this.update,
			onUpdateParams: [shape, color, lineWidth],
		});
		shape.points = points;
		_this.update(shape, color, lineWidth);
		_this.pane.addChild(shape);
		var newPoints = _this.generatePoints(num);
		for (var i = 0; i < num; i++) {
			tl.add(TweenMax.to(shape.points[i], 1, { x: newPoints[i].x, y: newPoints[i].y, ease: Power3.easeOut }), 0);
		}
	};
	_this.generatePoints = function(n, minX, minY, maxX, maxY) {
		var num = n || 3,
			minX = minX || 0,
			maxX = maxX || window.innerWidth,
			minY = minY || 0,
			maxY = maxY || window.innerHeight,
			points = [];
		for (var i = 0; i < num; i++) {
			var x = random(minX, maxX),
				y = random(minY, maxY);
			points.push({ x: x, y: y });
		}
		return points;
	};
	_this.getContainer = function() {
		return _this.container;
	};
	_this.init();
}
function ExplodeCircle() {
	var _this = this,
		pane,
		container;
	_this.init = function() {
		_this.container = new PIXI.Container();
		_this.pane = new PIXI.Graphics();
		_this.pane.beginFill(0, 0);
		_this.pane.drawRect(0, 0, window.innerWidth, window.innerHeight);
		_this.container.addChild(_this.pane);
	};
	_this.play = function() {
		var tl = new TimelineMax({
			onComplete: function() {
				for (var circle of circles) _this.pane.removeChild(circle);
			},
		});
		var num = Math.floor(Math.random() * 4 + 8),
			color = colorSet[Math.floor(Math.random() * colorSet.length)],
			circles = [];
		for (var i = 0; i < num; i++) {
			var circle = new PIXI.Graphics(),
				x = random(0, window.innerWidth),
				y = random(0, window.innerHeight),
				radius = random(10, 25);
			circles.push(circle);
			_this.update(circle, color, 0, 0, radius);
			_this.pane.addChild(circle);
			tl.add(
				TweenMax.fromTo(
					circle,
					0.5,
					{ x: window.innerWidth / 2, y: window.innerHeight / 2, radius: 0 },
					{ x: x, y: y, ease: Power3.easeOut, radius: radius }
				),
				0
			);
			tl.set(circle, { alpha: 0 });
		}
	};
	_this.update = function(circle, color, x, y, radius) {
		circle.clear();
		circle.lineStyle(5, color);
		circle.drawCircle(x, y, radius);
	};
	_this.getContainer = function() {
		return _this.container;
	};
	_this.init();
}
function ExplodeRectangle() {
	var _this = this,
		pane,
		container;
	_this.init = function() {
		_this.container = new PIXI.Container();
		_this.pane = new PIXI.Graphics();
		_this.pane.beginFill(0, 0);
		_this.pane.drawRect(0, 0, window.innerWidth, window.innerHeight);
		_this.container.addChild(_this.pane);
	};
	_this.play = function() {
		var tl = new TimelineMax({
			onComplete: function() {
				for (var rect of rectangles) _this.pane.removeChild(rect);
			},
		});
		var num = Math.floor(Math.random() * 4 + 8),
			color = colorSet[Math.floor(Math.random() * colorSet.length)],
			rectangles = [];
		for (var i = 0; i < num; i++) {
			var rect = new PIXI.Graphics(),
				x = random(0, window.innerWidth),
				y = random(0, window.innerHeight),
				rotation = random(0, 360),
				width = random(20, 50);
			rectangles.push(rect);
			_this.update(rect, color, 0, 0, width, width, rotation);
			_this.pane.addChild(rect);
			tl.add(
				TweenMax.fromTo(
					rect,
					0.5,
					{ x: window.innerWidth / 2, y: window.innerHeight / 2, width: 0, height: 0 },
					{ x: x, y: y, ease: Power3.easeOut, width: width, height: width }
				),
				0
			);
			tl.set(rect, { alpha: 0 });
		}
	};
	_this.update = function(rect, color, x, y, w, h, rotation) {
		rect.clear();
		rect.beginFill(color);
		rect.drawRect(x, y, w, h);
		rect.rotation = rotation;
		rect.endFill();
	};
	_this.getContainer = function() {
		return _this.container;
	};
	_this.init();
}
function FillCircle() {
	var _this = this,
		pane,
		container;
	_this.init = function() {
		_this.container = new PIXI.Container();
		_this.pane = new PIXI.Graphics();
		_this.pane.beginFill(0, 0);
		_this.pane.drawRect(0, 0, window.innerWidth, window.innerHeight);
		_this.container.addChild(_this.pane);
	};
	_this.play = function() {
		var tl = new TimelineMax({
			onComplete: function() {
				_this.pane.removeChild(circle);
			},
		});
		var color = colorSet[Math.floor(Math.random() * colorSet.length)],
			startAngle = random(0, 2 * Math.PI),
			radius = random(100, window.innerHeight / 3),
			direction = Math.random() > 0.5 ? true : false,
			circle = new PIXI.Graphics();
		circle.startAngle = circle.endAngle = startAngle;
		_this.updateCircle(circle, color, radius, direction);
		_this.pane.addChild(circle);
		tl
			.to(circle, 0.8, {
				endAngle: startAngle + (direction ? -2 : 2) * Math.PI,
				onUpdateParams: [circle, color, radius, direction],
				onUpdate: _this.updateCircle,
				ease: Power3.easeOut,
			})
			.to(circle, 0.8, {
				startAngle: startAngle + (direction ? -2 : 2) * Math.PI,
				onUpdateParams: [circle, color, radius, direction],
				onUpdate: _this.updateCircle,
				ease: Power3.easeOut,
			})
			.set(circle, { alpha: 0 });
	};
	_this.updateCircle = function(circle, color, radius, direction) {
		circle.clear();
		circle.beginFill(color);
		circle.moveTo(0, 0);
		circle.arc(0, 0, radius, circle.startAngle, circle.endAngle, direction);
		circle.position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
	};
	_this.getContainer = function() {
		return _this.container;
	};
	_this.init();
}
function RandomPolyline() {
	var _this = this,
		pane,
		container,
		mask;
	_this.init = function() {
		_this.container = new PIXI.Container();
		_this.pane = new PIXI.Graphics();
		_this.pane.beginFill(0, 0);
		_this.pane.drawRect(0, 0, window.innerWidth, window.innerHeight);
		_this.container.addChild(_this.pane);
	};
	_this.play = function() {
		var direction = Math.floor(Math.random() * 4),
			num = Math.floor(Math.random() * 2 + 2),
			points = _this.generatePoints(direction, num),
			lineWidth = Math.random() * 4 + 2,
			color = colorSet[Math.floor(Math.random() * colorSet.length)],
			polyline = new PIXI.Graphics(),
			time = 0,
			delta = 0.5,
			mask = new PIXI.Graphics(),
			arr = [
				[0, 0, window.innerWidth, 0, window.innerWidth, 0, 0, 0],
				[
					window.innerWidth,
					0,
					window.innerWidth,
					0,
					window.innerWidth,
					window.innerHeight,
					window.innerWidth,
					window.innerHeight,
				],
				[
					0,
					window.innerHeight,
					window.innerWidth,
					window.innerHeight,
					window.innerWidth,
					window.innerHeight,
					0,
					window.innerHeight,
				],
				[0, 0, 0, 0, 0, window.innerHeight, 0, window.innerHeight],
			];
		(tl = new TimelineMax({
			onComplete: function() {
				_this.pane.removeChild(polyline);
			},
			onUpdate: _this.update,
			onUpdateParams: [mask],
		})),
			(target =
				direction % 2 === 0
					? { y: direction === 0 ? window.innerHeight : 0, ease: Power3.easeOut }
					: { x: direction === 1 ? 0 : window.innerWidth, ease: Power3.easeOut }),
			(startPoint = (direction + 2) % 4);
		mask.beginFill(0, 0);
		mask.points = [];
		for (var index = 0; index < 4; index++)
			mask.points.push({ x: arr[direction][index * 2], y: arr[direction][index * 2 + 1] });
		polyline.points = points;
		_this.drawLine(polyline, lineWidth, color);
		polyline.mask = mask;
		_this.pane.addChild(polyline);
		tl.add(TweenMax.to(mask.points[startPoint], 0.7, target), 0);
		tl.add(TweenMax.to(mask.points[(startPoint + 1) % 4], 0.7, target), 0);
		tl.add(TweenMax.to(mask.points[(startPoint + 2) % 4], 0.7, target), 0.7);
		tl.add(TweenMax.to(mask.points[(startPoint + 3) % 4], 0.7, target), 0.7);
	};
	_this.update = function(mask) {
		mask.clear();
		mask.beginFill(0, 0);
		var points = mask.points;
		mask.moveTo(points[0].x, points[0].y);
		for (var index = 1; index < points.length; index++) mask.lineTo(points[index].x, points[index].y);
		mask.endFill();
	};
	_this.drawLine = function(polyline, width, color) {
		polyline.clear();
		polyline.lineStyle(width, color);
		var points = polyline.points;
		polyline.moveTo(points[0].x, points[0].y);
		for (var index = 1; index < points.length; index++) polyline.lineTo(points[index].x, points[index].y);
		polyline.endFill();
	};
	_this.generatePoints = function(direction, num) {
		var points = [];
		if (direction % 2 === 0) {
			var minX = 0,
				maxX = window.innerWidth,
				delta = window.innerHeight / num;
			points.push({ x: random(minX, maxX), y: 0 });
			for (var i = 0; i < num; i++) {
				var x = random(minX, maxX),
					y = random(i * delta, (i + 1) * delta);
				points.push({ x: x, y: y });
			}
			points.push({ x: random(minX, maxX), y: window.innerHeight });
			if (direction === 2)
				points = points.sort(function(a, b) {
					return b.y - a.y;
				});
		} else {
			var minY = 0,
				maxY = window.innerHeight,
				delta = window.innerWidth / num;
			points.push({ x: 0, y: random(minY, maxY) });
			for (var i = 0; i < num; i++) {
				var y = random(minY, maxY),
					x = random(i * delta, (i + 1) * delta);
				points.push({ x: x, y: y });
			}
			points.push({ x: window.innerWidth, y: random(minY, maxY) });
			if (direction === 1)
				points = points.sort(function(a, b) {
					return b.x - a.x;
				});
		}
		return points;
	};
	_this.getContainer = function() {
		return _this.container;
	};
	_this.init();
}
function RotationRect() {
	var _this = this,
		pane,
		container;
	_this.init = function() {
		_this.container = new PIXI.Container();
		_this.pane = new PIXI.Graphics();
		_this.pane.beginFill(0, 0);
		_this.pane.drawRect(0, 0, window.innerWidth, window.innerHeight);
		_this.container.addChild(_this.pane);
	};
	_this.play = function() {
		var num = Math.floor(Math.random() * 6 + 6),
			radius = random(window.innerHeight / 6, window.innerHeight / 2),
			width = random(10, 40),
			color = colorSet[Math.floor(Math.random() * colorSet.length)],
			rects = [],
			time = 0,
			delta = 0.15,
			positionDelta = Math.PI * 2 / num,
			selfRotation = random(0, Math.PI),
			rotation = random(Math.PI / 5, Math.PI * 2 / 3),
			container = new PIXI.Graphics(),
			backRotation = random(Math.PI, Math.PI * 3),
			tl = new TimelineMax({
				onComplete: function() {
					_this.pane.removeChild(container);
				},
			});
		container.beginFill(0, 0);
		container.drawRect(0, 0, window.innerWidth, window.innerHeight);
		container.pivot.x = window.innerWidth / 2;
		container.pivot.y = window.innerHeight / 2;
		container.position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
		_this.pane.addChild(container);
		for (var index = 0; index < num; index++) {
			var rect = new PIXI.Graphics(),
				x = Math.sin(positionDelta * index) * radius + window.innerWidth / 2,
				y = Math.cos(positionDelta * index) * radius + window.innerHeight / 2;
			_this.drawRect(rect, color, 0, x, y);
			container.addChild(rect);
			rects.push(rect);
			tl.add(
				TweenMax.to(rect, delta, {
					width: width,
					rotation: selfRotation,
					onUpdate: _this.drawRect,
					onUpdateParams: [rect, color, width, x, y],
				}),
				time
			);
			time += delta / 3;
		}
		tl.add(TweenMax.to(container, 0.8, { rotation: rotation, ease: Bounce.easeOut }));
		time = 0.8 + (num - 1) * delta / 3 + delta;
		for (var rect of rects) {
			tl.add(TweenMax.to(rect, delta, { width: 0, rotation: backRotation }), time);
			time += delta / 3;
		}
	};
	_this.drawRect = function(rect, color, width, x, y) {
		rect.clear();
		rect.beginFill(color);
		rect.drawRect(0, 0, width, width);
		rect.position = { x: x, y: y };
		rect.pivot.x = rect.pivot.y = width / 2;
		rect.endFill();
	};
	_this.getContainer = function() {
		return _this.container;
	};
	_this.init();
}
function CircleCircle() {
	var _this = this,
		pane,
		container;
	_this.init = function() {
		_this.container = new PIXI.Container();
		_this.pane = new PIXI.Graphics();
		_this.pane.beginFill(0, 0);
		_this.pane.drawRect(0, 0, window.innerWidth, window.innerHeight);
		_this.container.addChild(_this.pane);
	};
	_this.play = function() {
		var num = Math.floor(Math.random() * 6 + 6),
			radius = random(window.innerHeight / 6, window.innerHeight / 2),
			width = random(10, 30),
			color = colorSet[Math.floor(Math.random() * colorSet.length)],
			circles = [],
			time = 0,
			delta = 0.6,
			container = new PIXI.Graphics(),
			positionDelta = Math.PI * 2 / num,
			time = 0,
			delta = 0.15,
			tl = new TimelineMax({
				onComplete: function() {
					_this.pane.removeChild(container);
				},
			});
		container.beginFill(0, 0);
		container.drawRect(0, 0, window.innerWidth, window.innerHeight);
		_this.pane.addChild(container);
		for (var index = 0; index < num; index++) {
			var circle = new PIXI.Graphics(),
				x = Math.sin(positionDelta * index) * radius + window.innerWidth / 2,
				y = Math.cos(positionDelta * index) * radius + window.innerHeight / 2;
			circle._radius = 0;
			circle.pX = x;
			circle.pY = y;
			_this.drawCircle(circle, color);
			container.addChild(circle);
			circles.push(circle);
			tl.add(
				TweenMax.to(circle, delta, {
					_radius: width,
					onUpdate: _this.drawCircle,
					onUpdateParams: [circle, color],
					ease: Bounce.easeOut,
				}),
				time
			);
			time += delta / 3;
		}
		time = (num - 1) * delta / 3 + delta;
		for (var circle of circles) {
			var newX = random(0, container.width),
				newY = random(0, container.height);
			tl.add(
				TweenMax.to(circle, 0.3, {
					_radius: 0,
					pX: newX,
					pY: newY,
					onUpdate: _this.drawCircle,
					onUpdateParams: [circle, color],
				}),
				time
			);
			time += 0.3 / 3;
		}
	};
	_this.drawCircle = function(circle, color) {
		circle.clear();
		circle.beginFill(color);
		circle.drawCircle(0, 0, circle._radius);
		circle.position = { x: circle.pX, y: circle.pY };
		circle.endFill();
	};
	_this.getContainer = function() {
		return _this.container;
	};
	_this.init();
}
function RandomCircle() {
	var _this = this,
		pane,
		container;
	_this.init = function() {
		_this.container = new PIXI.Container();
		_this.pane = new PIXI.Graphics();
		_this.pane.beginFill(0, 0);
		_this.pane.drawRect(0, 0, window.innerWidth, window.innerHeight);
		_this.container.addChild(_this.pane);
	};
	_this.play = function() {
		var num = Math.floor(Math.random() * 5 + 5),
			circles = [],
			time = 0,
			delta = 0.6,
			container = new PIXI.Graphics(),
			time = 0,
			delta = 0.3,
			tl = new TimelineMax({
				onComplete: function() {
					_this.pane.removeChild(container);
				},
			});
		container.beginFill(0, 0);
		container.drawRect(0, 0, window.innerWidth, window.innerHeight);
		_this.pane.addChild(container);
		for (var index = 0; index < num; index++) {
			var circle = new PIXI.Graphics(),
				radius = random(15, 45),
				color = colorSet[Math.floor(Math.random() * colorSet.length)],
				x = random(0, window.innerWidth),
				y = random(0, window.innerHeight);
			circle._radius = 0;
			circle.pX = x;
			circle.pY = y;
			_this.drawCircle(circle, color);
			container.addChild(circle);
			circles.push(circle);
			tl.add(
				TweenMax.to(circle, delta, {
					_radius: radius,
					onUpdate: _this.drawCircle,
					onUpdateParams: [circle, color],
					ease: Bounce.easeOut,
				}),
				time
			);
			time += delta / 3;
		}
		time = (num - 1) * delta / 3 + delta + 0.2;
		for (var circle of circles) {
			tl.add(
				TweenMax.to(circle, delta, {
					_radius: 0,
					onUpdate: _this.drawCircle,
					onUpdateParams: [circle, color],
					ease: Bounce.easeOut,
				}),
				time
			);
			time += delta / 3;
		}
	};
	_this.drawCircle = function(circle, color) {
		circle.clear();
		circle.beginFill(color);
		circle.drawCircle(0, 0, circle._radius);
		circle.position = { x: circle.pX, y: circle.pY };
		circle.endFill();
	};
	_this.getContainer = function() {
		return _this.container;
	};
	_this.init();
}
function RandomRectangle() {
	var _this = this,
		pane,
		container;
	_this.init = function() {
		_this.container = new PIXI.Container();
		_this.pane = new PIXI.Graphics();
		_this.pane.beginFill(0, 0);
		_this.pane.drawRect(0, 0, window.innerWidth, window.innerHeight);
		_this.container.addChild(_this.pane);
	};
	_this.play = function() {
		var num = Math.floor(Math.random() * 5 + 5),
			rects = [],
			time = 0,
			delta = 0.6,
			container = new PIXI.Graphics(),
			time = 0,
			delta = 0.3,
			tl = new TimelineMax({
				onComplete: function() {
					_this.pane.removeChild(container);
				},
			});
		container.beginFill(0, 0);
		container.drawRect(0, 0, window.innerWidth, window.innerHeight);
		_this.pane.addChild(container);
		for (var index = 0; index < num; index++) {
			var rect = new PIXI.Graphics(),
				width = random(30, 80),
				color = colorSet[Math.floor(Math.random() * colorSet.length)],
				x = random(0, window.innerWidth),
				y = random(0, window.innerHeight),
				newX = (random(0, 1) > 0.5 ? -1 : 1) * 100 + x,
				newY = (random(0, 1) > 0.5 ? -1 : 1) * 100 + y;
			rect._width = 0;
			rect.pX = x;
			rect.pY = y;
			rect.color = color;
			rect.lastX = (random(0, 1) > 0.5 ? -1 : 1) * 100 + newX;
			rect.lastY = (random(0, 1) > 0.5 ? -1 : 1) * 100 + newY;
			_this.drawRect(rect, color);
			container.addChild(rect);
			rects.push(rect);
			tl.add(
				TweenMax.to(rect, delta, {
					_width: width,
					pX: newX,
					pY: newY,
					rotation: Math.PI,
					onUpdate: _this.drawRect,
					onUpdateParams: [rect],
					ease: Power2.easeOut,
				}),
				time
			);

			time += delta / 3;
		}
		time = (num - 1) * delta / 3 + delta + 0.2;
		for (var rect of rects) {
			tl.add(
				TweenMax.to(rect, delta, {
					_width: 0,
					pX: rect.lastX,
					pY: rect.lastY,
					rotation: 0,
					onUpdate: _this.drawRect,
					onUpdateParams: [rect],
					ease: Power2.easeIn,
				}),
				time
			);
			time += delta / 3;
		}
	};
	_this.drawRect = function(rect) {
		rect.clear();
		rect.lineStyle(4, rect.color);
		rect.drawRect(0, 0, rect._width, rect._width);
		rect.position = { x: rect.pX, y: rect.pY };
		rect.pivot.x = rect.pivot.y = rect._width / 2;
		rect.endFill();
	};
	_this.getContainer = function() {
		return _this.container;
	};
	_this.init();
}
function RotationPolygon() {
	var _this = this,
		pane,
		container;
	_this.init = function() {
		_this.container = new PIXI.Container();
		_this.pane = new PIXI.Graphics();
		_this.pane.beginFill(0, 0);
		_this.pane.drawRect(0, 0, window.innerWidth, window.innerHeight);
		_this.container.addChild(_this.pane);
	};
	_this.play = function() {
		var num = Math.floor(random(3, 10)),
			radius = random(60, 80),
			points = _this.generatePolygonPoints(radius, num),
			color = colorSet[Math.floor(Math.random() * colorSet.length)],
			lineWidth = 3,
			startAngle = random(0, Math.PI),
			scale = random(2, 4),
			direction = random(0, 1) > 0.5 ? true : false,
			polygon = new PIXI.Graphics(),
			mask = new PIXI.Graphics(),
			tl = new TimelineMax({
				onComplete: function() {
					_this.pane.removeChild(mask);
				},
			});
		mask._radius = radius;
		mask.startAngle = mask.endAngle = startAngle;
		_this.updateMask(mask);
		polygon.lineStyle(lineWidth, color);
		polygon.drawPolygon(points);
		polygon.closePath();
		polygon.position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
		polygon.pivot.x = window.innerWidth / 2;
		polygon.pivot.y = window.innerHeight / 2;
		polygon.mask = mask;
		polygon.rotation = 0;
		_this.pane.addChild(polygon);
		_this.pane.addChild(mask);
		tl
			.add(
				TweenMax.to(mask, 0.8, {
					endAngle: startAngle + (direction ? -2 : 2) * Math.PI,
					onUpdate: _this.updateMask,
					onUpdateParams: [mask, direction],
				})
			)
			.add(
				TweenMax.to(mask, 0.8, {
					startAngle: startAngle + (direction ? -2 : 2) * Math.PI,
					onUpdate: _this.updateMask,
					onUpdateParams: [mask, direction],
				})
			);
		tl.add(
			TweenMax.to(polygon.scale, 1, { x: scale, y: scale, rotation: Math.PI * 4 / 5, ease: Bounce.easeOut }),
			0
		);
		tl.add(TweenMax.to(mask.scale, 1, { x: scale, y: scale, ease: Bounce.easeOut }), 0);
	};
	_this.updateMask = function(mask, direction) {
		mask.clear();
		mask.beginFill(0xffffff);
		mask.moveTo(0, 0);
		mask.arc(0, 0, mask._radius, mask.startAngle, mask.endAngle, direction);
		mask.position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
	};
	_this.generatePolygonPoints = function(radius, num) {
		var deltaRad = Math.PI * 2 / num,
			points = [];
		for (var index = 0; index < num; index++) {
			var x = Math.sin(index * deltaRad) * radius + window.innerWidth / 2,
				y = Math.cos(index * deltaRad) * radius + window.innerHeight / 2;
			points.push(new PIXI.Point(x, y));
		}
		return points;
	};
	_this.getContainer = function() {
		return _this.container;
	};
	_this.init();
}
function ZoomOutPolygon() {
	var _this = this,
		pane,
		container;
	_this.init = function() {
		_this.container = new PIXI.Container();
		_this.pane = new PIXI.Graphics();
		_this.pane.beginFill(0, 0);
		_this.pane.drawRect(0, 0, window.innerWidth, window.innerHeight);
		_this.container.addChild(_this.pane);
	};
	_this.play = function() {
		var num = Math.floor(random(3, 10)),
			radius = 100,
			points = _this.generatePolygonPoints(radius, num),
			lineWidth = 2,
			color = colorSet[Math.floor(Math.random() * colorSet.length)],
			polygon = new PIXI.Graphics(),
			tl = new TimelineMax({
				onComplete: function() {
					_this.pane.removeChild(polygon);
				},
			});
		polygon
			.lineStyle(lineWidth, color)
			.drawPolygon(points)
			.closePath();
		polygon.position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
		polygon.pivot.x = window.innerWidth / 2;
		polygon.pivot.y = window.innerHeight / 2;
		_this.pane.addChild(polygon);
		tl.to(polygon.scale, 0.8, { x: 15, y: 15, rotation: Math.PI / 3, ease: Power2.easeOut });
	};
	_this.generatePolygonPoints = function(radius, num) {
		var deltaRad = Math.PI * 2 / num,
			points = [];
		for (var index = 0; index < num; index++) {
			var x = Math.sin(index * deltaRad) * radius + window.innerWidth / 2,
				y = Math.cos(index * deltaRad) * radius + window.innerHeight / 2;
			points.push(new PIXI.Point(x, y));
		}
		return points;
	};
	_this.getContainer = function() {
		return _this.container;
	};
	_this.init();
}
function Helix() {
	var _this = this,
		pane,
		container;
	_this.init = function() {
		_this.container = new PIXI.Container();
		_this.pane = new PIXI.Graphics();
		_this.pane.beginFill(0, 0);
		_this.pane.drawRect(0, 0, window.innerWidth, window.innerHeight);
		_this.container.addChild(_this.pane);
	};
	_this.play = function() {
		var rad = random(Math.PI / 8, Math.PI / 6),
			circles = [],
			color = colorSet[Math.floor(random(0, colorSet.length))],
			radius = 10,
			num = 0,
			container = new PIXI.Graphics(),
			circleRadius = 0,
			time = 0,
			delay = 0.1,
			indicate = Math.ceil(num * rad / Math.PI),
			tl = new TimelineMax({
				onComplete: function() {
					_this.pane.removeChild(container);
				},
			});
		container.beginFill(0, 0);
		container.drawRect(0, 0, window.innerWidth, window.innerHeight);
		_this.pane.addChild(container);
		while (indicate < 8) {
			radius += indicate * 3;
			var circle = new PIXI.Graphics(),
				circleRadius = indicate,
				x = Math.sin(num * rad) * radius + window.innerWidth / 2,
				y = Math.cos(num * rad) * radius + window.innerHeight / 2;
			circle._radius = 0;
			circle.pX = x;
			circle.pY = y;
			_this.drawCircle(circle, color, circleRadius, x, y);
			container.addChild(circle);
			circles.push(circle);
			tl.add(
				TweenMax.to(circle, delay, {
					_radius: circleRadius,
					ease: Bounce.easeOut,
					onUpdate: _this.drawCircle,
					onUpdateParams: [circle, color],
				}),
				time
			);
			time += delay / 3;
			num++;
			indicate = Math.ceil(num * rad / Math.PI);
		}
		time = delay / 3 * (num - 1) / 2 + delay;
		for (var circle of circles) {
			tl.add(
				TweenMax.to(circle, delay, {
					_radius: 0,
					ease: Bounce.easeOut,
					onUpdate: _this.drawCircle,
					onUpdateParams: [circle, color],
				}),
				time
			);
			time += delay / 3;
		}
	};
	_this.drawCircle = function(circle, color) {
		circle.clear();
		circle.beginFill(color);
		circle.drawCircle(0, 0, circle._radius);
		circle.position = { x: circle.pX, y: circle.pY };
	};
	_this.getContainer = function() {
		return _this.container;
	};
	_this.init();
}
function Cross() {
	var _this = this,
		pane,
		container;
	_this.init = function() {
		_this.container = new PIXI.Container();
		_this.pane = new PIXI.Graphics();
		_this.pane.beginFill(0, 0);
		_this.pane.drawRect(0, 0, window.innerWidth, window.innerHeight);
		_this.container.addChild(_this.pane);
	};
	_this.play = function() {
		var color = colorSet[Math.floor(random(0, colorSet.length))],
			width = 700,
			height = random(30, 80),
			x = random(250, window.innerWidth - 250),
			y = random(250, window.innerHeight - 250),
			container = new PIXI.Graphics(),
			shape1 = new PIXI.Graphics(),
			shape2 = new PIXI.Graphics(),
			tl = new TimelineMax({
				onComplete: function() {
					_this.pane.removeChild(container);
				},
			});
		shape1._width = shape2._width = height;
		shape1.color = shape2.color = color;
		shape1.points = [{ x: x - width / 2, y: y }, { x: x - width / 2, y: y }];
		shape2.points = [{ x: x, y: y - width / 2 }, { x: x, y: y - width / 2 }];
		_this.drawShape(shape1);
		_this.drawShape(shape2);
		container.beginFill(0, 0);
		container.drawRect(0, 0, window.innerWidth, window.innerHeight);
		container.addChild(shape1);
		container.addChild(shape2);
		container.position = { x: x, y: y };
		container.pivot.x = x;
		container.pivot.y = y;
		container.rotation = Math.PI;
		_this.pane.addChild(container);
		tl.to(
			shape1.points[1],
			0.5,
			{ x: x + width / 2, onUpdate: _this.drawShape, onUpdateParams: [shape1], ease: Power2.easeOut },
			0
		);
		tl.to(
			shape2.points[1],
			0.5,
			{ y: y + width / 2, onUpdate: _this.drawShape, onUpdateParams: [shape2], ease: Power2.easeOut },
			0
		);
		tl.add(
			TweenMax.to(container, 0.5, {
				rotation: (random(0, 1) > 0.5 ? -1 : 1) * Math.PI / 4 + random(0, 1) * Math.PI / 5,
				ease: Back.easeOut,
			}),
			0
		);
		tl.to(
			shape1.points[0],
			0.3,
			{ x: x + width / 2, onUpdate: _this.drawShape, onUpdateParams: [shape1], ease: Power2.easeOut },
			0.6
		);
		tl.to(
			shape2.points[0],
			0.3,
			{ y: y + width / 2, onUpdate: _this.drawShape, onUpdateParams: [shape2], ease: Power2.easeOut },
			0.6
		);
	};
	_this.drawShape = function(shape) {
		shape.clear();
		shape.lineStyle(shape._width, shape.color);
		shape.moveTo(shape.points[0].x, shape.points[0].y);
		shape.lineTo(shape.points[1].x, shape.points[1].y);
	};
	_this.getContainer = function() {
		return _this.container;
	};
	_this.init();
}
function CircleLine() {
	var _this = this,
		pane,
		container;
	_this.init = function() {
		_this.container = new PIXI.Container();
		_this.pane = new PIXI.Graphics();
		_this.pane.beginFill(0, 0);
		_this.pane.drawRect(0, 0, window.innerWidth, window.innerHeight);
		_this.container.addChild(_this.pane);
	};
	_this.play = function() {
		var color = colorSet[Math.floor(random(0, colorSet.length))],
			num = Math.floor(random(3, 7));
		(lineWidth = random(20, 80)),
			(radius = random(250, 350)),
			(direction = random(0, 1) > 0.5 ? true : false),
			(startAngle = random(0, Math.PI)),
			(width = 2 * radius / num - lineWidth),
			(container = new PIXI.Graphics()),
			(lines = []),
			(index = 0),
			(mask = new PIXI.Graphics()),
			(tl = new TimelineMax({
				onComplete: function() {
					_this.pane.removeChild();
				},
			}));
		container.beginFill(0, 0);
		container.drawRect(0, 0, window.innerWidth, window.innerHeight);
		mask.beginFill(0xffffff);
		mask.drawCircle(window.innerWidth / 2, window.innerHeight / 2, radius);
		container.mask = mask;
		container.pivot.x = window.innerWidth / 2;
		container.pivot.y = window.innerHeight / 2;
		container.position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
		container.rotation = startAngle;
		while (index <= num) {
			var line = new PIXI.Graphics(),
				xBounds = window.innerWidth / 2 - radius,
				yBounds = window.innerHeight / 2 - radius;
			line._width = lineWidth;
			line.color = color;
			line.points = [
				{
					x: direction ? xBounds : xBounds + index * (width + lineWidth),
					y: direction ? index * (width + lineWidth) + yBounds : yBounds,
				},
				{
					x: direction ? xBounds + 2 * radius : xBounds + index * (width + lineWidth),
					y: direction ? index * (width + lineWidth) + yBounds : yBounds + 2 * radius,
				},
			];
			_this.drawShape(line);
			lines.push(line);
			container.addChild(line);
			tl.to(
				line.points[0],
				random(0.6, 0.8),
				{
					x: direction ? xBounds + 2 * radius : xBounds + index * (width + lineWidth),
					y: direction ? index * (width + lineWidth) + yBounds : yBounds + 2 * radius,
					onUpdate: _this.drawShape,
					onUpdateParams: [line],
					ease: Power2.easeOut,
				},
				random(0, 1) > 0.6 ? 0.5 : 0.3
			);
			index++;
		}
		_this.pane.addChild(container);
		tl.add(
			TweenMax.to(container, 0.8, {
				rotation: startAngle + (random(0, 1) > 0.5 ? -1 : 1) * Math.PI / 2,
				ease: Back.easeOut,
			}),
			0
		);
	};
	_this.drawShape = function(shape) {
		shape.clear();
		shape.lineStyle(shape._width, shape.color);
		shape.moveTo(shape.points[0].x, shape.points[0].y);
		shape.lineTo(shape.points[1].x, shape.points[1].y);
	};
	_this.getContainer = function() {
		return _this.container;
	};
	_this.init();
}
function RectangleLine() {
	var _this = this,
		pane,
		container;
	_this.init = function() {
		_this.container = new PIXI.Container();
		_this.pane = new PIXI.Graphics();
		_this.pane.beginFill(0, 0);
		_this.pane.drawRect(0, 0, window.innerWidth, window.innerHeight);
		_this.container.addChild(_this.pane);
	};
	_this.play = function() {
		var color = colorSet[Math.floor(random(0, colorSet.length))],
			num = Math.floor(random(3, 7));
		(lineWidth = random(20, 80)),
			(radius = random(250, 350)),
			(direction = random(0, 1) > 0.5 ? true : false),
			(width = 2 * radius / num - lineWidth),
			(container = new PIXI.Graphics()),
			(time = 0),
			(lines = []),
			(index = 0),
			(tl = new TimelineMax({
				onComplete: function() {
					_this.pane.removeChild(container);
				},
			}));
		container.beginFill(0, 0);
		container.drawRect(0, 0, window.innerWidth, window.innerHeight);
		container.pivot.x = window.innerWidth / 2;
		container.pivot.y = window.innerHeight / 2;
		container.position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
		while (index <= num) {
			var line = new PIXI.Graphics(),
				xBounds = window.innerWidth / 2 - radius,
				yBounds = window.innerHeight / 2 - radius,
				delay = random(0.2, 0.4),
				start = random(0.1, 0.2);
			line._width = lineWidth;
			line.color = color;
			line.points = [
				{
					x: direction ? xBounds : xBounds + index * (width + lineWidth),
					y: direction ? index * (width + lineWidth) + yBounds : yBounds,
				},
				{
					x: direction ? xBounds : xBounds + index * (width + lineWidth),
					y: direction ? index * (width + lineWidth) + yBounds : yBounds,
				},
			];
			line.end = {
				x: direction ? xBounds + 2 * radius : xBounds + index * (width + lineWidth),
				y: direction ? index * (width + lineWidth) + yBounds : yBounds + 2 * radius,
			};
			_this.drawShape(line);
			lines.push(line);
			container.addChild(line);
			tl
				.to(
					line.points[1],
					delay,
					{
						x: direction ? xBounds + 2 * radius : xBounds + index * (width + lineWidth),
						y: direction ? index * (width + lineWidth) + yBounds : yBounds + 2 * radius,
						onUpdate: _this.drawShape,
						onUpdateParams: [line],
						ease: Power2.easeOut,
					},
					start
				)
				.to(
					line.points[0],
					0.2,
					{
						x: line.end.x,
						y: line.end.y,
						onUpdate: _this.drawShape,
						onUpdateParams: [line],
						ease: Power2.easeOut,
					},
					start + delay
				);
			index++;
		}
		_this.pane.addChild(container);
	};
	_this.drawShape = function(shape) {
		shape.clear();
		shape.lineStyle(shape._width, shape.color);
		shape.moveTo(shape.points[0].x, shape.points[0].y);
		shape.lineTo(shape.points[1].x, shape.points[1].y);
	};
	_this.getContainer = function() {
		return _this.container;
	};
	_this.init();
}
function random(min, max) {
	return Math.random() * (max - min) + min;
}
