var backgorundColorSet = [0x58D68D,0xE67F22,0x3598DB,0xE84C3D,0x9A59B5,0x27AE61,0xD25400,0xBEC3C7,0x297FB8];
var colorSet = [0x58D68D,0xE67F22,0x3598DB,0xE84C3D,0x9A59B5,0x27AE61,0xD25400,0xBEC3C7,0x297FB8];

function Background(){
    var _this = this;
    var forwardColor;
    var backColor;
    var container;
    var forward;
    var back;
    var mask;
    var flag;
    var flashPane;
    _this.init = function(){
        _this.forwardColor = _this.backColor = colorSet[Math.floor(Math.random()*colorSet.length)];
        while(_this.forwardColor===_this.backColor){
            _this.backColor = colorSet[Math.floor(Math.random()*colorSet.length)];
        }
        _this.forward = new PIXI.Graphics();
        _this.drawRect(_this.forward,_this.forwardColor);
        _this.back = new PIXI.Graphics();
        _this.drawRect(_this.back,_this.backColor);
        _this.mask = new PIXI.Graphics();
        _this.mask.points = [];
        _this.mask.points.push({y:0,x:0});
        _this.mask.points.push({y:0,x:window.innerWidth});
        _this.mask.points.push({y:window.innerHeight,x:window.innerWidth});
        _this.mask.points.push({y:window.innerHeight,x:0});
        _this.updateMask();
        _this.forward.mask = _this.mask;
        _this.container = new PIXI.Container();
        _this.flashPane = new PIXI.Graphics();
        _this.container.addChild(_this.back);
        _this.container.addChild(_this.forward);
        _this.container.addChild(_this.flashPane);
        _this.flag = true;
    }
    _this.getContainer = function(){
        return _this.container;
    }
    _this.updateMask = function(){
        _this.mask.clear();
        var points = _this.mask.points;
        _this.mask.beginFill();
        _this.mask.moveTo(points[0].x,points[0].y);
        for(var i=1;i<points.length;i++){
            _this.mask.lineTo(points[i].x,points[i].y);
        }
    }
    _this.flash = function (){
        var tl = new TimelineMax();
        _this.flashPane.clear();
        _this.flashPane.beginFill(0xFFFFFF,0.8);
        _this.flashPane.alpha = 0.9;
        _this.flashPane.drawRect(0,0,window.innerWidth,window.innerHeight);
        tl.to(_this.flashPane,0.1,{alpha:0})
            .set(_this.flashPane,{alpha:0.9})
            .to(_this.flashPane,0.1,{alpha:0})
    }
    _this.slide = function (){
        var tl = new TimelineMax({
            pause:true,
            onComplete:function(){ _this.forwardColor = _this.backColor; },
            onUpdate:background.updateMask
        });
        if(_this.flag){
            while(_this.forwardColor===_this.backColor){
                _this.backColor = colorSet[Math.floor(Math.random()*colorSet.length)];
            }
            _this.drawRect(_this.back,_this.backColor);
        }else{
            while(_this.forwardColor===_this.backColor){
                _this.forwardColor = colorSet[Math.floor(Math.random()*colorSet.length)];
            }
            _this.drawRect(_this.forward,_this.forwardColor);
        }
        var direction = Math.floor(Math.random()*4),
            points = _this.generatePoints(direction),
            num = 0,
            target = direction % 2 === 0? {y:direction ===0? window.innerHeight:0,ease:Power3.easeOut}:
            {x:direction===1? 0:window.innerWidth,ease:Power3.easeOut},
            preNum = (direction + 3) % 4 ===0? 4:(direction+3)%4;
            _this.mask.points.length = 0;
        while(num<4+points.length){
            if(_this.flag){
                if(num<direction+1)
                    _this.mask.points.push({y:num>1? window.innerHeight:0,x:num % 3 ===0? 0:window.innerWidth});
                else if (num>=direction+1&&num<direction+1+points.length)
                    _this.mask.points.push(points[num-direction-1]);
                else
                    _this.mask.points.push({y:(num-points.length)>1? window.innerHeight:0,x:(num-points.length) % 3 ===0? 0:window.innerWidth});
            }else{
                if(num<preNum)
                    _this.addMaskPoint(_this.mask,direction,num);
                else if (num>=preNum&&num<preNum+points.length)
                    _this.mask.points.push(points[num-preNum]);
                else
                    _this.addMaskPoint(_this.mask,direction,num-points.length);
            }
            num++;
        }
        var delay = 0;
        tl.add(TweenMax.to(_this.mask.points[_this.flag? direction:preNum-1],1, target),0)
        for(var point of points){
            delay+= 0.15;
            tl.add(TweenMax.to(point, 1-delay, target),0);
        }
        tl.add(TweenMax.to(_this.mask.points[(_this.flag? (direction+points.length+1):(preNum+points.length)) % _this.mask.points.length],1, target),0)
        _this.flag = !_this.flag;
    }
    _this.generatePoints = function(direction,num){
        var minY = direction === 2? window.innerHeight:0,
            maxY = direction === 0? 0:window.innerHeight,
            minX = direction === 1? window.innerWidth:0,
            maxX = direction === 3? 0:window.innerWidth,
            num = num || Math.floor(Math.random()*2 + 1),
            points = [],
            flag = (_this.flag? 1:-1)*(direction>1? -1:1);
            while(points.length<num){
                var x = random(minX,maxX),
                    y = random(minY,maxY);
                points.push({x:x,y:y});    
            }
            points = points.sort(function(a,b){return flag*(a.x===b.x? a.y-b.y:a.x-b.x)});
            return points;
    }
    _this.drawRect = function(elem,color){
        elem.clear();
        elem.beginFill(color);
        elem.drawRect(0,0,window.innerWidth,window.innerHeight);
        elem.endFill();
    }
    _this.addMaskPoint = function(mask,direction,index){
        var arr = [[0,0,window.innerWidth,0,window.innerWidth,0,0,0],
        [window.innerWidth,0,window.innerWidth,0,window.innerWidth,window.innerHeight,window.innerWidth,window.innerHeight],
        [0,window.innerHeight,window.innerWidth,window.innerHeight,window.innerWidth,window.innerHeight,0,window.innerHeight],
        [0,0,0,0,0,window.innerHeight,0,window.innerHeight]];
        mask.points.push({x:arr[direction][index*2],y:arr[direction][index*2+1]});
    }
    _this.init();
    return _this;
}
function Block(){
    var _this = this;
    var container;
    var blockPane;
    var lastBlock;
    var dragging;
    var blocks;
    var click;
    var slideTarget;
    var flashTarget;
    _this.init = function(){
        _this.container = new PIXI.Container();
        _this.blockPane = new PIXI.Graphics();
        _this.blockPane.beginFill(0,0);
        _this.blockPane.drawRect(0,0,window.innerWidth,window.innerHeight);
        _this.blockPane.interactive = true;
        _this.blockPane.on('pointerdown',_this.dragStart);
        _this.blockPane.on('pointermove',_this.dragMove);
        _this.blockPane.on('pointerup',_this.dragEnd);
        _this.blocks = [];
        for(var index = 0;index<32;index++){
            var block =  new PIXI.Graphics();
            block.beginFill(0,0);
            _this.blocks.push(block);
            _this.blockPane.addChild(block);
        }
        _this.container.addChild(_this.blockPane);
        _this.lastBlock = -1;
        _this.dragging = false;
        _this.click = 0;
        _this.slideTarget = Math.floor(Math.random()*10 + 10);
        _this.flashTarget = Math.floor(Math.random()*5 + 25);
    }
    _this.dragStart = function(e){
        _this.handleAnime(e);
        _this.dragging = true;
    }
    _this.dragMove = function(e){
        if(_this.dragging){
            _this.handleAnime(e);
        }
    }
    _this.handleAnime = function(e){
        var point = e.data.global,
        x = Math.floor(point.x/(window.innerWidth / 8)),
        y = Math.floor(point.y/(window.innerHeight / 4)),
        block = x + y*8;
        if(e.type==='pointerdown' || (e.type === 'pointermove' && block !== _this.lastBlock)){
            _this.flash(block);
            _this.click++;
            if(_this.click % _this.slideTarget ===0){
                _this.slideTarget = Math.floor(Math.random()*10 + 10);
                background.slide();
            }
            if(_this.click % _this.flashTarget ===0){
                _this.flashTarget = Math.floor(Math.random()*5 + 25);
                background.flash();
            }
            _this.lastBlock = block;
            var anime = animes[block];
            if(anime)
                anime.play();
        }
    }
    _this.dragEnd = function(e){
        _this.dragging = false;
    }
    _this.flash = function(block){
        var x = block % 8,
            y = Math.floor(block / 8),
            width = window.innerWidth / 8,
            height = window.innerHeight / 4,
            drawBlock = _this.blocks[block];
            if(drawBlock){
                drawBlock.clear();
                drawBlock.beginFill(0xFFFFFF,0.6);
                drawBlock.alpha = 0.6;
                drawBlock.drawRect(x*width,y*height,width,height);
                TweenMax.to(drawBlock,0.4,{alpha:0});
            }
    }
    _this.getContainer = function(){
        return _this.container;
    }
    _this.init();
}
function RandomShape(){
    var _this = this,
        container,
        shape,
        pane,
        color;
    _this.init = function(){
        _this.container = new PIXI.Container();
        _this.shape = new PIXI.Graphics();
        _this.shape.beginFill(0,0);
        _this.shape.points = [];
        _this.pane = new PIXI.Graphics();
        _this.pane.beginFill(0,0);
        _this.pane.drawRect(0,0,window.innerWidth,window.innerHeight);
        _this.container.addChild(_this.pane);
        _this.container.addChild(_this.shape);
    }
    _this.update = function(){
        _this.shape.clear();
        var points = _this.shape.points;
        _this.shape.beginFill(_this.color);
        _this.shape.alpha = 1;
        _this.shape.moveTo(points[0].x,points[0].y);
        for(var i=1;i<points.length;i++){
            _this.shape.lineTo(points[i].x,points[i].y);
        }
    }
    _this.play = function(){
        var tl = new TimelineMax({
            onComplete:function(){tl.set(_this.shape,{alpha:0})},
            onUpdate:_this.update
        });
        var num = Math.floor(Math.random()*5 +3),
            points = _this.generatePoints(num);
        _this.shape.points.length = 0;
        _this.color = colorSet[Math.floor(Math.random()*colorSet.length)];
        _this.shape.points = points;
        var newPoints = _this.generatePoints(num);
        for(var i=0;i<num;i++){
            tl.add(TweenMax.to(_this.shape.points[i],1,{x:newPoints[i].x,y:newPoints[i].y,ease:Power3.easeOut}),0);
        }
        
    }
    _this.generatePoints = function(n,minX,minY,maxX,maxY){
        var num = n || 3,
            minX = minX || 0,
            maxX = maxX || window.innerWidth,
            minY = minY || 0,
            maxY = maxY || window.innerHeight,
            points = [];
        for(var i=0;i<num;i++){
            var x = random(minX,maxX),
                y = random(minY,maxY);
            points.push({x:x,y:y})
        }
        return points;    
    }
    _this.getContainer = function(){
        return _this.container;
    }  
    _this.init();  
}
function ExplodeCircle(){
    var _this = this,
        pane,
        container;
    _this.init = function(){
        _this.container = new PIXI.Container();
        _this.pane = new PIXI.Graphics();
        _this.pane.beginFill(0,0);
        _this.pane.drawRect(0,0,window.innerWidth,window.innerHeight);
        _this.container.addChild(_this.pane);
    }
    _this.play = function(){
        var tl = new TimelineMax({
            onComplete:function(){for(var circle of circles) _this.pane.removeChild(circle);}
        });
        var num = Math.floor(Math.random()*4 + 8),
            color = colorSet[Math.floor(Math.random()*colorSet.length)],
            circles = [];
        for(var i=0;i<num;i++){
            var circle = new PIXI.Graphics(),
                x = random(0,window.innerWidth),
                y = random(0,window.innerHeight),
                radius = random(10,25);
            circles.push(circle);
            _this.update(circle,color,0,0,radius);    
            _this.pane.addChild(circle);
            tl.add(TweenMax.fromTo(circle,0.5,{x:window.innerWidth/2,y:window.innerHeight/2,radius:0},{x:x,y:y,ease:Power3.easeOut,radius:radius}),0);
            tl.set(circle,{alpha:0});
        }
    }
    _this.update = function(circle,color,x,y,radius){
        circle.clear();
        circle.lineStyle(5,color);
        circle.drawCircle(x,y,radius);
    }
    _this.getContainer = function(){
        return _this.container;
    }  
    _this.init(); 
}
function ExplodeRectangle(){
    var _this = this,
        pane,
        container;
    _this.init = function(){
        _this.container = new PIXI.Container();
        _this.pane = new PIXI.Graphics();
        _this.pane.beginFill(0,0);
        _this.pane.drawRect(0,0,window.innerWidth,window.innerHeight);
        _this.container.addChild(_this.pane);
    }
    _this.play = function(){
        var tl = new TimelineMax({
            onComplete:function(){for(var rect of rectangles) _this.pane.removeChild(rect);}
        });
        var num = Math.floor(Math.random()*4 + 8),
            color = colorSet[Math.floor(Math.random()*colorSet.length)],
            rectangles = [];
        for(var i=0;i<num;i++){
            var rect = new PIXI.Graphics(),
                x = random(0,window.innerWidth),
                y = random(0,window.innerHeight),
                rotation = random(0,360),
                width = random(20,50);
                rectangles.push(rect);
            _this.update(rect,color,0,0,width,width,rotation);    
            _this.pane.addChild(rect);
            tl.add(TweenMax.fromTo(rect,0.5,{x:window.innerWidth/2,y:window.innerHeight/2,width:0,height:0},{x:x,y:y,ease:Power3.easeOut,width:width,height:width}),0);
            tl.set(rect,{alpha:0});
        }
    }
    _this.update = function(rect,color,x,y,w,h,rotation){
        rect.clear();
        rect.beginFill(color);
        rect.drawRect(x,y,w,h);
        rect.rotation = rotation;
        rect.endFill();
    }
    _this.getContainer = function(){
        return _this.container;
    }  
    _this.init(); 
}
function FillCircle(){
    var _this = this,
        pane,container;
    _this.init = function(){
        _this.container = new PIXI.Container();
        _this.pane = new PIXI.Graphics();
        _this.pane.beginFill(0,0);
        _this.pane.drawRect(0,0,window.innerWidth,window.innerHeight);
        _this.container.addChild(_this.pane);
    }
    _this.play = function(){
        var tl = new TimelineMax({
            onComplete:function(){_this.pane.removeChild(circle)}
        });
        var color = colorSet[Math.floor(Math.random()*colorSet.length)],
            startAngle = random(0,2*Math.PI),
            radius = random(100,window.innerHeight/3),
            direction = Math.random()>0.5? true:false,
            circle = new PIXI.Graphics();
        circle.startAngle = circle.endAngle = startAngle;
        _this.updateCircle(circle,color,radius,direction);
        _this.pane.addChild(circle);
        tl.to(circle,0.8,{endAngle:startAngle + (direction? -2:2) * Math.PI,onUpdateParams:[circle,color,radius,direction],onUpdate:_this.updateCircle,ease:Power3.easeOut})
            .to(circle,0.8,{startAngle:startAngle + (direction? -2:2) * Math.PI,onUpdateParams:[circle,color,radius,direction],onUpdate:_this.updateCircle,ease:Power3.easeOut})
            .set(circle,{alpha:0})
    }
    _this.updateCircle = function(circle,color,radius,direction){
        circle.clear();
        circle.beginFill(color);
        circle.moveTo(0,0);
        circle.arc(0,0,radius,circle.startAngle,circle.endAngle,direction);
        circle.position = {x:window.innerWidth/2,y:window.innerHeight/2};
    }
    _this.getContainer = function(){
        return _this.container;
    }
    _this.init();
}

function random(min,max){
    return Math.random()*(max-min) + (min);
}