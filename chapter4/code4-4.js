import kaboom from "kaboom";

kaboom();

loadSprite("player", "sprites/dino.png", {
	sliceX: 9,
	anims: {
		"run": {
			from: 4,
			to: 7,
			speed: 14,
			loop: true,
		},
    "jump": 8
	}
});
loadSprite("enemy", "sprites/ghosty.png");

function spawn() {
  add([
    sprite("enemy"),
    pos(width(), height() - 40),
    origin("botleft"),
    scale(rand(0.3, 0.8)),   //スプライトのサイズをランダムに変化させる
    move(LEFT, 400),
    area(),
    cleanup(),
    "enemy"
  ])

  wait(rand(0.6, 1.5), spawn);
}


scene("game", () => {

  add([
    sprite("player", {anim:"run"}),  //ゲーム開始時の初期アニメーションをrunに設定
    pos(80, 160),
    scale(3),
    area({width:16, height:20, offset:{x:0,y:20}}),  //当たり判定を調整
    body({
      jumpForce: 800,
      weight: 2
    }),
    "player"
  ]);
  add([
    rect(width(), 40),
    pos(0, height() - 40),
    color(150, 100, 50),
    area(),
    solid()
  ])
  add([
    text(0),
    pos(24,24),
    "score",
    {count: 0},
  ])


  onUpdate("player", p => {  //スペースキーを押したとき、離したときでアニメーションを変更する
    if(p.grounded() && isKeyPressed("space")) {
      p.jump();
      p.play("jump");
    }
    if(isKeyReleased("space")) p.play("run");
  })

  onCollide("player", "enemy", (p, b) => {
    addKaboom(p.pos);
    go("gameover", get("score")[0].count);
  })

  onUpdate("score", s => {
    s.text = s.count++;
  })

  spawn()

})



scene("gameover", count => {
  add([
    text("Game Over\n" + count),
    pos(center()),
    origin("center")
  ])

  onMousePress(() => {
    go("game");
  })
})

go("game");
