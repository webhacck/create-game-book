import kaboom from "kaboom";

kaboom();

loadSprite("player", "sprites/dino.png", {
	sliceX: 9,        //X方向に9つの画像に分割する
	anims: {          //アニメーションの設定
    "idle": {
      from: 0,      //0フレームから
      to: 3,        //3フレームまで
      speed: 5,     //繰り返しの速度
      loop: true    //ループON
    },
		"run": {
			from: 4,
			to: 7,
			loop: true
		},
    "jump": {
      from: 7,
      to: 8
    }
	}
});


add([
  pos(80, 160),
  sprite('player', {anim: 'idle'}),    //開始時のアニメーションをidleに設定
  scale(3),
  "player"
]);

onUpdate("player", p => {
  if(isKeyPressed("right")) p.play("run");
  if(isKeyPressed("down"))  p.play("idle");
  if(isKeyPressed("up"))    p.play("jump");
})
