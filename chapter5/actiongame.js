import kaboom from "kaboom"

kaboom({
  //ゲーム画面の拡大・縮小
  //  scale: 0.5,
  background:[200, 200, 240]
})

loadSound("coin", "/sounds/score.mp3");
loadSound("goal", "/sounds/computer.mp3");
loadSound("hit", "/sounds/bug.mp3");

loadSprite("sand", "sprites/sand.png");
loadSprite("ghosty", "sprites/ghosty.png");
loadSprite("coin", "sprites/coin.png");
loadSprite("portal", "sprites/portal.png");
loadSprite("player", "/sprites/dino.png", {
	sliceX: 9,
	anims: {
		"idle": {
			from: 0,
			to: 3,
			speed: 5,
			loop: true,
		},
		"run": {
			from: 4,
			to: 7,
			speed: 10,
			loop: true,
		},
		"jump": {
      from: 7,
      to:8,
      speed: 18
    }
	},
})

//ゲームステージのデザイン
const LEVELS = [
    "                  $                     ",
    "               =====     $= #  =$$      ",
    "          $  =          ==========      ",
    "         ===           =                ",
    "       =      = #   =                  G",
    "========================================",
]

//ゲームオブジェクトの紐づけ
const levelConf = {
  width: 64,
  height: 64,
  pos: {x:width()/2, y:0},
  "=": () => [
    sprite("sand"),
    area(),
    solid(),
    "block"
  ],
  "#": () => [
    sprite("ghosty"),
    area(),
    body(),
    enemyMove(),
    "enemy"
  ],
  "$": () => [
    sprite("coin"),
    area(),
    "coin"
  ],
  "G": () => [
    sprite("portal"),
    scale(0.6),
    area(),
    "portal"
  ]
}

//カスタムコンポーネント
function enemyMove() {
  let state = false;
  let dir = 1;
  
	return {
		require: ["pos", "area"],                    //必須コンポーネント
		add() {                                      //最初の1回だけ実行する処理
			this.onCollide("block", (b, c) => {
        if(c.isLeft() || c.isRight()) dir = -dir;
			})
      loop(0.4, () => state = !state);
		},
		update() {                                   //毎フレームごとに実行する処理
			this.move(60 * dir, 0);
      this.flipX(state);
		}
	}
}


scene('game', () => {
  addLevel(LEVELS, levelConf);                   //ゲームステージの生成

  const player = add([
    sprite("player",{anim:'idle'}),
    pos(width()/2,0),
    area({width:16, height:20}),
    body({
      jumpForce: 800,
      weight: 2
    }),
    scale(3),
    origin("botleft"),
    "player",
    {speed: 480}
  ])

  
  //当たり判定と落下処理
  onUpdate("player", p => {
    camPos(p.pos);　　　　　　　　　　　　　　　　　　 //カメラポジションをプレイヤーに追従する
    if(p.pos.y >= height()) go("gameover");      //ステージから落下するとゲームオーバー
  })
  onCollide("player", "enemy", (p,e) => {
    play("hit");
    addKaboom(e.pos);
    go('gameover');
  })
  onCollide("player", "coin", (p,c) => {
    destroy(c);
    play("coin");
  })
  onCollide("player", "portal", (p,pt) => {
    play("goal");
    go('win');
  })
  
  
  //プレイヤーの制御処理
  onKeyDown("left", () => {
    player.flipX(true);
    player.move(-player.speed, 0);    
  })
  onKeyDown("right", () => {
    player.flipX(false);
    player.move(player.speed, 0);    
  })
  onKeyDown(["left","right"], () => {
    if(player.curAnim() !== "run") {
      player.play("run");
    }
  })
  onKeyRelease(["left", "right", "space"], () => {
    player.play("idle");
  })
  onKeyDown("space", () => {
    if(player.isGrounded()) {
      player.jump();
      player.play("jump");
    }
  })
})


scene('gameover', () => {
  add([
    text("Game Over"),
    pos(width()/2, height()/2),
    origin("center")
  ])

  onMousePress(() => {
    go("game");
  })
})

scene("win", () => {
  add([
    text("CLEAR!!"),
    pos(width()/2, height()/2),
    origin('center'),
  ])
  onMousePress(() => {
    go("game");
  })
})

go("game");
