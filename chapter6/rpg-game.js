import kaboom from "kaboom";

kaboom({
  scale: 0.6,
  background: [220,220,200]
})
volume(0.4);  //ゲーム内の音量を40%で再生

loadSound("death", "sounds/bug.mp3");
loadSound("goal", "sounds/computer.mp3");
loadSound("bullet", "sounds/danger.mp3");
loadSound("key", "sounds/bell.mp3");
loadSound("door", "sounds/mystic.mp3");

loadSprite("enemy", "/sprites/gigagantrum.png")
loadSprite("grass", "/sprites/grass.png")
loadSprite("sand", "/sprites/sand.png")
loadSprite("steel", "/sprites/steel.png")
loadSprite("door", "/sprites/door.png")
loadSprite("key", "/sprites/key.png")
loadSprite("player", "sprites/dino.png", {
  sliceX: 9,
  anims: {
    "idle": {
      from: 0,
      to: 3,
      speed: 5,
      loop: true
    },
    "run": {
      from: 4,
      to: 7,
      speed: 14,
      loop: true
    }
  }
});

//複数のステージを構成する
const LEVELS = [
  [
    "=====|===",
    "=       =",
    "=       =",
    "=  @    =",
    "=       =",
    "=    $  =",
    "=       =",
    "========="
  ],
  [
    "-------|-",
    "-  ---- -",
    "-       -",
    "- ----- -",
    "-    $- -",
    "------- -",
    "-@      -",
    "---------"
  ],
  [
    "#########",
    "#B  #   #",
    "#       #",
    "#  $#   #",
    "#   #   #",
    "#   #@  #",
    "#   #   #",
    "#|#######"
  ]
];

//ゲームオブジェクトの紐づけ
const levelConf = {
  width: 64,
  height: 64,
  pos: {x:20,y:20},
  "=": () => [
    sprite("grass"),
    area(),
    solid()
  ],
  "-": () => [
    sprite("sand"),
    area(),
    solid()
  ],
  "#": () => [
    sprite("steel"),
    area(),
    solid()
  ],
  "$": () => [
    sprite("key"),
    area(),
    "key"
  ],
  "|": () => [
    sprite("door"),
    area(),
    solid(),
    "door"
  ],
  "@": () => [
    sprite("player", {anim: 'idle'}),
    scale(3),
    area({width:16, height:18, offset:{x:0,y:30}}),
    solid(),
    "player",
    {
      dirs: {
        "left": LEFT,
        "right": RIGHT,
        "up": UP,
        "down": DOWN
      },
      speed: 320,
      hasKey: false
    }
  ],
  "B": () => [
    sprite("enemy"),
    scale(0.4),
    area(),
    origin('center'),
    state(["idle", "attack", "move"]),
    "enemy"
  ]
}

//ステートマシンの制御処理
function enemyState() {
  const [enemy] = get("enemy");
  const [player] = get("player");
  
  enemy.onStateEnter("move", () => {
    wait(1, () => enemy.enterState("idle"));
  });
  enemy.onStateUpdate("move", () => {
    enemy.move(player.pos.sub(enemy.pos));           //プレイヤーに向かって移動
  });
  enemy.onStateEnter("idle", () => {
    wait(0.5, () => enemy.enterState("attack"));
  });
  enemy.onStateEnter("attack", () => {
    spawnBullet(enemy, player.pos.sub(enemy.pos));  //プレイヤーの方向へ弾を発射
    play("bullet");
    wait(0.5, () => enemy.enterState("move"));
  });
  enemy.enterState("move");
}

function spawnBullet(enemy, dir) {
  add([
    pos(enemy.pos),
    move(dir, 600),
    rect(12, 12),
    area(),
    cleanup(),
    origin("center"),
    color(0, 0, 255),
    "bullet"
  ])
}



scene("game", index => {
  addLevel(LEVELS[index], levelConf);
  
  const [player] = get("player");
  const [enemy] = get("enemy");

  //カギを取得してドアを開けたら次のステージへ
  onCollide("player", "door", (p,d) => {
  	if (p.hasKey) {
      if(index < LEVELS.length - 1) {
        play("door");
  			go("game", index + 1);
      } else {
        play("goal");
				go("win");
      }
		}
	})
  
  //当たり判定
	onCollide("player", "key", (p,k) => {
		destroy(k);
    play("key");
		player.hasKey = true;
	})
  onCollide("player", "bullet", (p,b) => {
	  addKaboom(b.pos);
    play("death");
    go("gameover");
  })
  onCollide("player", "enemy", (p,e) => {
	  addKaboom(e.pos);
    play("death");
    go("gameover");
  })

  //プレイヤーの制御処理
	onUpdate("player", p => {
    if(isKeyDown("left")) {
      p.flipX(true);
      p.move(-p.speed, 0);
    }
    if(isKeyDown("right")) {
      p.flipX(false);
      p.move(p.speed, 0);
    }
    if(isKeyDown("up"))    p.move(0, -p.speed);
    if(isKeyDown("down"))  p.move(0, p.speed);
	})
  
  /*
  //制御処理を簡潔に記述するための書き方
	for(const dir in player.dirs) {
		onKeyDown(dir, () => {
      if(dir === "right") player.flipX(false);
      if(dir === "left")  player.flipX(true);
			player.move(player.dirs[dir].scale(player.speed));
		})
	}
  */
  onKeyPress(["left","right","up","down"], () => {
    player.play("run");
  })
  onKeyRelease(["left","right","up","down"], () => {
    player.play("idle");
  })

  //最終ステージでボスを出現させる
  if(index >= LEVELS.length - 1) enemyState();

})

scene("win", () => {
	add([
		text("Congratulations!", {size: 64}),
		pos(width() / 2, height() / 2),
		origin("center"),
	])

  onMousePress(() => {
    go("game", 0);
  })
})


scene("gameover", () => {
  add([
    text("Game Over", {size: 64}),
    pos(width()/2, height()/2),
    origin("center")
  ])

  onMousePress(() => {
    go("game", 0);
  })
})

go("game", 2);
