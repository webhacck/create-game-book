import kaboom from "kaboom";

kaboom();

scene("start", () => {
  add([
    text("START"),
    pos(10,10),
    area(),
    "menu"
  ])

  onClick("menu", () => {
    go("game");     // テキストをクリックしたらgameシーンに遷移
  })
})


scene("game", () => {
  add([
    rect(50,50),
    pos(50,150),
    move(RIGHT, 100),
    area(),
    cleanup()
  ])
})

go('start');    // 最初に実行されるシーン
