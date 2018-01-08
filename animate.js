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
        _this.container.addChild(_this.back);
        _this.container.addChild(_this.forward);
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
        _this.mask.endFill();
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
        tl.add(TweenMax.to(_this.mask.points[_this.flag? direction:preNum-1],Math.random() + 1, target),0)
        tl.add(TweenMax.to(_this.mask.points[(_this.flag? (direction+points.length+1):(preNum+points.length))% _this.mask.points.length],Math.random() + 1, target),0) 
        for(var point of points){
            tl.add(TweenMax.to(point, Math.random() + 1, target),0);
        }
        _this.flag = !_this.flag;
    }
    _this.generatePoints = function(direction,num){
        var minY = direction === 2? window.innerHeight:0,
            maxY = direction === 0? 0:window.innerHeight,
            minX = direction === 1? window.innerWidth:0,
            maxX = direction === 3? 0:window.innerWidth,
            num = num || Math.floor(Math.random()*2 + 1),
            points = [];
            while(points.length<num){
                var x = random(minX,maxX),
                    y = random(minY,maxY);
                points.push({x:x,y:y});    
            }
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
function random(min,max){
    return Math.random()*(max-min) + (min);
}