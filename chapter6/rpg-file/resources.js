export function getResources() {
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
}
