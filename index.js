var app = new PIXI.Application();
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