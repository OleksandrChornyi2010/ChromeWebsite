let speed = 10000; // 1000 milliseconds = 1 Second
let enemySpawnInterval = 1000;// 5000 milliseconds = 5 Seconds
const transitionDelay = 150; // 5000 milliseconds = 5 Seconds
let lives = 3;
const collisionCheckInterval = 60
let hasGameStarted = false;
let bullet = null;
enemies = {
    clipchamp: {
        health: 100,
        damage: 1,
        sprite: "images/textures/enemies/clipchamp.svg",

    },
    copilot: {
        health: 100,
        damage: 1,
        sprite: "images/textures/enemies/copilot.svg",

    },
    edge: {
        health: 100,
        damage: 1,
        sprite: "images/textures/enemies/edge.svg",

    },
    teams: {
        health: 100,
        damage: 1,
        sprite: "images/textures/enemies/teams.svg",

    },
    onedrive: {
        health: 100,
        damage: 1,
        sprite: "images/textures/enemies/onedrive.svg",

    },
    win11: {
        health: 100,
        damage: 1,
        sprite: "images/textures/enemies/windows-11.svg",

    },
    windows_defender: {
        health: 100,
        damage: 1,
        sprite: "images/textures/enemies/windows-defender.svg",

    },
    word: {
        health: 100,
        damage: 1,
        sprite: "images/textures/enemies/word.svg",

    },
}
let addedEnemies = []

const keys = Object.keys(enemies)
let enemyInterval;
function showBubble(e, text = "Want a new browser? Beat me in this game first!") {
    const bubble = document.querySelector('.bubble-wrapper');
    document.querySelector(".bubble-message p").textContent = text;
    if (hasGameStarted) { // Here we check if the game has ended. hasGameStarted is set to true after the execution of this function, so it should work fine.
        buttonStart = document.querySelector("#start")
        buttonStart.textContent = "Try again";
        buttonStart.removeEventListener("click", showBubble);
        buttonStart.addEventListener("click", () => {
            window.location.reload();// Or location.href = location.href;
        })
    }
    const darkness = document.getElementById('edge-darkness');

    // Reset position and show
    bubble.style.animation = "slideIn 0.5s forwards ease-out";
    darkness.classList.add("visible");
}
// Start the game
function hideBubble() {
    const bubble = document.querySelector('.bubble-wrapper');
    const darkness = document.getElementById('edge-darkness');
    document.querySelector(".game").classList.remove("d-none")

    // Animate out
    bubble.style.animation = 'slideOut 0.5s forwards ease-in';
    darkness.classList.remove('visible');
    hasGameStarted = true;
    enemyInterval = setInterval(spawnAndMoveEnemy, enemySpawnInterval);
    setInterval(() => {
        document.body.addEventListener('click', (e) => {
            console.log("Call");
            if (hasGameStarted) {
                shoot(e.clientX, e.clientY);
            }
        })
    }, enemySpawnInterval);
    window.addEventListener('resize', onWindowSizeChange);
    //spawnAndMoveEnemy()

}

// Example: start bubble and darkness on page load
window.addEventListener('DOMContentLoaded', showBubble);

// Button hides bubble
document.querySelector("#start").addEventListener("click", hideBubble);


// Получаем элементы
const pipImage = document.querySelector('.pip-image');
const cannonImage = document.querySelector('.cannon-image');

window.addEventListener('mousemove', (e) => {
    if (hasGameStarted) {
        // Позиция центра pipImage на странице
        const rect = pipImage.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Координаты курсора мыши
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Вычисляем угол в радианах между вектором (center->mouse) и осью X
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;
        const angleRad = Math.atan2(deltaY, deltaX);

        // Переводим угол в градусы
        const angleDeg = angleRad * (180 / Math.PI) + 90;

        // Rotate the gun pipImage
        // Т.к. у .cannon-image стоит transform-origin по умолчанию (центр), этого достаточно
        cannonImage.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
    }
});


function spawnAndMoveEnemy() {
    if (hasGameStarted) {
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const enemy = enemies[randomKey];
        // 1. Создаём элемент <img>
        const img = document.createElement('img');
        const { x, y } = getRandomEdgePosition();
        img.src = enemy["sprite"]; // Image path
        img.classList.add('spawned-img'); // используем для стилизации
        addedEnemies.push(img)
        // 2. Добавляем в контейнер игры
        document.querySelector('.game').appendChild(img);

        // 3. Start position
        img.style.position = 'fixed';
        // img.style.left = `${x}px`; // фиксируем, например, в (0,0)
        // img.style.top = `${y}0px`;
        img.style.left = '0px';
        img.style.top = '0px';
        img.style.transform = `translate(${x}px, ${y}px)`;
        img.style.width = '32px'; // Make sure all enemies are the same size
        img.style.height = '32px';
        img.style.transition = `transform ${speed / 1000}s linear`;

        // 4. Позиция цели
        let target = document.querySelector('.game-image');
        let targetRect = target.getBoundingClientRect();

        // 5. Спустя немного времени — двигаем туда
        setTimeout(() => {
            // Listen transition end. This is a precaution case if the enemy has stopped but still exists in the game
            img.addEventListener('transitionend', function onTransitionEnd() {
                img.removeEventListener('transitionend', onTransitionEnd);
                // Remove it
                console.log("No collision on animation end!");
                img.remove();

            });
            img.style.transform = `translate(${targetRect.left + targetRect.width / 2.5}px, ${targetRect.top + targetRect.height / 2.5}px)`;

        }, transitionDelay); // Delay so that transition would have enought time 
        // Copy to check for bullet colision
        const character = document.querySelector('.game-image');

        const collisionCheck = setInterval(() => {
            const enemyRect = img.getBoundingClientRect();
            const characterRect = character.getBoundingClientRect();

            const isColliding =
                enemyRect.left < characterRect.right &&
                enemyRect.right > characterRect.left &&
                enemyRect.top < characterRect.bottom &&
                enemyRect.bottom > characterRect.top;

            if (isColliding) {
                clearInterval(collisionCheck); // Stop check
                img.remove(); // Remove enemy
                lives -= 1;
                if (lives <= 0) {
                    document.querySelector(".game").remove()
                    showBubble(undefined, "You lost! You are not getting a new browser!");
                    hasGameStarted = false;
                    return;
                }
                document.querySelector(`#heart_${lives + 1}`).remove() // Remove one heart

            }

        }, 1000 / collisionCheckInterval); // 60 кадров в секунду
    }

}

function onWindowSizeChange() {
    if (hasGameStarted) {
        target = document.querySelector('.game-image');
        targetRect = target.getBoundingClientRect();
        for (let i = 0; i < addedEnemies.length; i++) {
            let img = addedEnemies[i]
            if (img) {
                img.style.transform = `translate(${targetRect.left + targetRect.width / 2.5}px, ${targetRect.top + targetRect.height / 2.5}px)`;
            }
        }
    }
}

function getRandomEdgePosition() {
    const side = Math.floor(Math.random() * 4); // 0-3
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let x = 0, y = 0;

    switch (side) {
        case 0: // Up
            x = Math.random() * vw;
            y = -32;
            break;
        case 1: // Right
            x = vw + 32;
            y = Math.random() * vh;
            break;
        case 2: // Bottom
            x = Math.random() * vw;
            y = vh + 32;
            break;
        case 3: // Left
            x = -32;
            y = Math.random() * vh;
            break;
    }
    return { x, y };
}



function shoot(mouseX, mouseY) {
    if (!bullet) {
        const currentBullet = document.createElement('img');
        currentBullet.src = 'images/textures/Bullet.png';
        currentBullet.style.position = 'fixed';
        // currentBullet.style.width = '16px';
        // currentBullet.style.height = '16px';
        currentBullet.style.pointerEvents = 'none';
        currentBullet.style.userSelect = 'none';
        currentBullet.classList.add('bullet');

        // Cannon center
        const cannonRect = cannonImage.getBoundingClientRect();
        const startX = cannonRect.left + cannonRect.width;
        const startY = cannonRect.top;// + cannonRect.height / 2;

        // Vector
        const dx = mouseX - startX;
        const dy = mouseY - startY;
        const angleRad = Math.atan2(dy, dx);
        const angleDeg = angleRad * (180 / Math.PI) + 90;

        currentBullet.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
        currentBullet.style.transformOrigin = 'center center';
        currentBullet.style.left = `${startX}px`;
        currentBullet.style.top = `${startY}px`;

        document.body.appendChild(currentBullet);
        bullet = currentBullet;

        // Скорость полета
        const speed = 8;

        // Обновление позиции
        const moveInterval = setInterval(() => {
            const rect = currentBullet.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            // Обновление позиции
            const vx = Math.cos(angleRad) * speed;
            const vy = Math.sin(angleRad) * speed;

            currentBullet.style.left = `${x + vx}px`;
            currentBullet.style.top = `${y + vy}px`;

            // Удалить пулю, если она вышла за границы экрана
            if (
                x < 0 || x > window.innerWidth ||
                y < 0 || y > window.innerHeight
            ) {
                currentBullet.remove();
                clearInterval(moveInterval);
                bullet = null;
            }
        }, 1000 / 60); // 60 FPS
    }
}

