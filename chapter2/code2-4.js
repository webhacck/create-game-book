import kaboom from "kaboom";

kaboom();

// move()コンポーネントを利用した移動
add([
  rect(50,50),
  pos(50,100),

  move(RIGHT, 100),
  area(),
  cleanup()
]);


/*
// ゲームオブジェクトを取得して移動する
const player = add([
  rect(50, 50),
  pos(50,100)
])

player.onUpdate(() => {
  player.move(100, 0)
})
*/
