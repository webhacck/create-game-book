import kaboom from "kaboom";
import {getResources} from "./resources.js";
import {LEVELS, levelConf} from "./stage.js";

kaboom({
  scale: 0.6,
  background: [220,220,200]
})

getResources();  //リソースファイルの読み込み

volume(0.4);


function enemyState() {
  const [enemy] = get("enemy");
  const [player] = get("player");
  
  enemy.onStateEnter("move", () => {
    wait(1, () => enemy.enterState("idle"));
  });
  enemy.onStateUpdate("move", () => {
    enemy.move(player.pos.sub(enemy.pos));
  });
  enemy.onStateEnter("idle", () => {
    wait(0.5, () => enemy.enterState("attack"));
  });
  enemy.onStateEnter("attack", () => {
    spawnBullet(enemy, player.pos.sub(enemy.pos));
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

go("game", 0);
