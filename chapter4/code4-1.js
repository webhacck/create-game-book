import kaboom from "kaboom";

kaboom();

loadSprite("enemy", "sprites/ghosty.png");

add([
    sprite("enemy"),
    pos(30, 30),
    "enemy"
])

onUpdate("enemy", e => {
    e.pos = mousePos();    // マウスカーソルに追従する
})
