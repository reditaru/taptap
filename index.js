var app = new PIXI.Application({antialias:false});
document.body.appendChild(app.view);
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
window.onresize = function (event){
    app.view.style.width = window.innerWidth + "px";
    app.view.style.height = window.innerHeight + "px";
    app.renderer.resize(window.innerWidth,window.innerHeight);
}
var background = new Background();
var block = new Block();
app.stage.addChild(background.getContainer());
app.stage.addChild(block.getContainer());
var animes = [new RandomShape(),new ExplodeCircle(),new ExplodeRectangle(),new FillCircle(),
    new RandomPolyline(),new RandomShape(true),new RotationRect(),new CircleCircle(),
    new RandomCircle(),new RandomRectangle(),new ZoomOutPolygon(),new RotationPolygon(),
    new Helix(),new Cross(),new CircleLine(),new RectangleLine(),
    new RandomShape(),new ExplodeCircle(),new ExplodeRectangle(),new FillCircle(),
    new RandomPolyline(),new RandomShape(true),new RotationRect(),new CircleCircle(),
    new RandomCircle(),new RandomRectangle(),new ZoomOutPolygon(),new RotationPolygon(),
    new Helix(),new Cross(),new CircleLine(),new RectangleLine()];
for(var anime of animes){
    app.stage.addChild(anime.getContainer());
}