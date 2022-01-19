import kaboom from "kaboom";

kaboom();

add([
    rect(50,50),
    pos(150,100),
    color(0,0,0),

    area(),    // 当たり判定
    body()     // 物理演算
]);

add([
    rect(width(), 40),
    pos(0, height() - 40),
    color(100, 100, 100),

    area(),    // 当たり判定
    solid()    // 他のゲームオブジェクトを通さない
]);
