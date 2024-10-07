const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
  },
};

const game = new Phaser.Game(config);

function preload() {}

let cursors;
let bullets;
let enemies;
let score = 0;
let lives = 3;
let scoreText;
let livesText;
let gameOverText;
const playerSpeed = 3; // Tripled player speed
const enemySpeed = 1.5; // 1.5 times enemy speed
let gameOver = false;

function create() {
  const graphics = this.add.graphics();
  const spaceship = { x: 375, y: 500 };
  const bulletSpeed = 10;
  bullets = this.physics.add.group();
  enemies = this.physics.add.group();

  scoreText = this.add.text(600, 10, `Score: ${score}`, {
    fontSize: "20px",
    fill: "#fff",
  });
  livesText = this.add.text(600, 40, "Lives: ", {
    fontSize: "20px",
    fill: "#fff",
  });
  gameOverText = this.add
    .text(300, 250, "Game Over!", { fontSize: "40px", fill: "#ff0000" })
    .setOrigin(0.5)
    .setVisible(false);

  for (let i = 0; i < lives; i++) {
    livesText.text += " ✔";
  }

  cursors = this.input.keyboard.createCursorKeys();

  this.input.keyboard.on("keydown-SPACE", () => {
    const bullet = bullets.create(spaceship.x + 20, spaceship.y, null);
    bullet.setVelocityY(-bulletSpeed);
  });

  this.physics.add.overlap(bullets, enemies, destroyEnemy, null, this);

  this.time.addEvent({
    delay: 3000,
    callback: spawnEnemy,
    callbackScope: this,
    loop: true,
  });

  this.events.on("update", () => {
    if (gameOver) return;

    if (cursors.left.isDown) {
      spaceship.x -= playerSpeed; // Updated player speed
    }
    if (cursors.right.isDown) {
      spaceship.x += playerSpeed; // Updated player speed
    }

    graphics.clear();
    graphics.fillStyle(0x00ff00, 1);
    graphics.fillRect(spaceship.x, spaceship.y, 50, 50);

    bullets.children.iterate((bullet) => {
      if (bullet) {
        bullet.y -= bulletSpeed;
        if (bullet.y < 0) {
          bullet.destroy();
        }
      }
    });

    enemies.children.iterate((enemy) => {
      if (enemy) {
        enemy.y += enemySpeed; // Updated enemy speed
        if (enemy.y > 600) {
          enemy.destroy();
          loseLife();
        }
      }
    });
  });
}

function spawnEnemy() {
  const x = Phaser.Math.Between(0, 800);
  enemies.create(x, 0, null).setSize(40, 40);
}

function destroyEnemy(bullet, enemy) {
  bullet.destroy();
  enemy.destroy();
  score += 1;
  scoreText.setText(`Score: ${score}`);
}

function loseLife() {
  lives -= 1;
  livesText.setText("Lives: " + " ✔".repeat(lives));
  if (lives <= 0) {
    gameOver = true;
    gameOverText.setVisible(true);
    enemies.clear(true, true);
    bullets.clear(true, true);
  }
}
