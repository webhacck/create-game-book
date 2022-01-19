import kaboom from "kaboom";

kaboom();

function spawn() {
  add([
    pos(width(), height() - 40),
    origin("botleft"),
    rect(40, rand(30, 80)),    //障害物が生成されるたびに高さを変化させる
    color(255, 150, 100),
    move(LEFT, 400),
    area(),
    cleanup(),
    outline(2),
    "box"
  ])

  wait(rand(0.6, 1.5), spawn);  //ランダムに障害物を生成する
}


scene("game", () => {
  add([
    pos(80, 160),
    rect(25, 25),
    color(50,50,255),
    outline(2),
    area(),
    body({
      jumpForce: 800,  //ジャンプ力
      weight: 2        //重力の倍率
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
  
  
  onUpdate("player", p => {
    if(p.grounded() && isKeyPressed("space")) p.jump();
  })
  onCollide("player", 'box', (p, b) => {
    addKaboom(p.pos);
    go("gameover", get("score")[0].count);  //ゲームオーバーシーンにスコアをわたす
  })
  onUpdate("score", s => {
    s.text = s.count++;
  })

  spawn();
})



scene("gameover", count => {    //スコアを変数countに格納
  add([
    text("Game Over\n" + count),
    pos(center()),
    origin("center")
  ])

  onMousePress(() => {         //画面をクリックしてゲーム再開
    go("game");
  })
})

go("game");
