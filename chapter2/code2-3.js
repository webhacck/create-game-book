import kaboom from "kaboom";

kaboom();

const player = add([
  rect(50,50),
  pos(150,100)
]);


player.onUpdate(() => {
	player.pos = mousePos()
})

/*
// タグを利用する場合
add([
  rect(50,50),
  pos(150,100),
  "player"
]);


onUpdate("player", p => {
  p.pos = mousePos()
})
*/
