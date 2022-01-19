import kaboom from "kaboom";

kaboom();

loadSpriteAtlas("sprites/dungeon.png", {
	"monster": {
		"x": 16,            //画像のX座標
		"y": 320,           //画像のY座標
		"width": 256,       //取得する画像の幅
		"height": 32,       //取得する画像の高さ
		"sliceX": 8,        //X方向に8個の画像に分割する
		"anims": {
			"walk": {
				"from": 4,
				"to": 7,
				"speed": 10,
				"loop": true
			}
		}
	},
  "chest": {
    "x": 304,
    "y": 304,
    "width": 48,
    "height": 16,
    "sliceX": 3,
    "anims": {
      "open": {
        "from": 0,
        "to": 2,
        "speed": 20
      },
    }
  }
})

add([
  sprite("monster", {anim:"walk"}),
  pos(30, 30),
  area(),
  scale(3),
  move(RIGHT, 50),
  cleanup(),
  "monster"
])

add([
  sprite("chest"),
  pos(300, 80),
  area(),
  scale(3),
  "chest"
])

onCollide("monster", "chest", (m,c) => {  //monsterとcehstが接触したときの処理
  c.play("open");
})
