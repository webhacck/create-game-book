export const LEVELS = [
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

export const levelConf = {
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
    state("move", ["idle", "attack", "move"]),
    "enemy"
  ]
}
