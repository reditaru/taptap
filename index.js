var app = new PIXI.Application();
document.body.appendChild(app.view);
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
window.onresize = function (event){
    app.view.style.width = window.innerWidth + "px";
    app.view.style.height = window.innerHeight + "px";
}
var background = new Background();
app.stage.addChild(background.getContainer());
setInterval(background.slide,4000);