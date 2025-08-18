let initialSpeed = 10000;
let speed = initialSpeed;
let enemySpawnInterval = 1500; // Every 1.5 seconds
const transitionDelay = 150;
let lives = 3;
const maxScore = 100;
const collisionCheckInterval = 60
const bulletSpeed = 10;
let hasGameStarted = true;
let bullet = null;
let bulletDamage = 25;
let score = 0;
let enemyInterval;
let fileName;
let boosters = ["/client/images//textures/arch.png", "/client/images//textures/debian.png", "/client/images//textures/mint.png"]
enemies = {
    clipchamp: {
        health: 100,
        damage: 1, // Don't change
        sprite: "/client/images//textures/enemies/clipchamp.svg",

    },
    copilot: {
        health: 100,
        damage: 1, // Don't change
        sprite: "/client/images//textures/enemies/copilot.svg",

    },
    edge: {
        health: 100,
        damage: 1, // Don't change
        sprite: "/client/images//textures/enemies/edge.svg",

    },
    teams: {
        health: 100,
        damage: 1, // Don't change
        sprite: "/client/images//textures/enemies/teams.svg",

    },
    onedrive: {
        health: 100,
        damage: 1, // Don't change
        sprite: "/client/images//textures/enemies/onedrive.svg",

    },
    win11: {
        health: 100,
        damage: 1, // Don't change
        sprite: "/client/images//textures/enemies/windows-11.svg",

    },
    windowsDefender: {
        health: 200,
        damage: 1, // Don't change
        sprite: "/client/images//textures/enemies/windows-defender.svg",

    },
    word: {
        health: 100,
        damage: 1, // Don't change
        sprite: "/client/images//textures/enemies/word.svg",

    },
}
let addedEnemies = []
const keys = Object.keys(enemies)
const urlParams = new URLSearchParams(window.location.search);
const platform = urlParams.get("platform");
if (platform == "win") {
    fileName = "chrome.exe";
}
else if (platform == "linux") {
    fileName = "chrome.deb";
}
else if (platform == "mac") {
    fileName = "chrome.dmg";
}
else if (platform == "android") {
    fileName = "chrome.apk"
}
else if (platform == "ios") {
    fileName = "chrome.amd64"
}
else {
    fileName = "chrome.deb";
}
let boostersMenuDisplayed = false

// Start bubble and darkness on page load
window.addEventListener('DOMContentLoaded', showBubble);
const penguin = document.getElementById("penguin");
const menu = document.getElementById("penguin-menu");

penguin.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!boostersMenuDisplayed) {
        menu.classList.toggle("active");
    }
    else {
        menu.classList.remove("active");
    }
});

document.addEventListener("keydown", function (event) {
    const key = event.key;
    if (key == 1) {
        booster_1_click();
    }
    else if (key == 2) {
        booster_2_click();
    }
    else if (key == 3) {
        booster_3_click();
    }
});

const booster_1 = document.getElementById("booster-1") // Arch
const booster_2 = document.getElementById("booster-2") // Debian
const booster_3 = document.getElementById("booster-3") // Mint

let booster_1_count = 0;
let booster_2_count = 0;
let booster_3_count = 0;

let booster_1_active = false
let booster_2_active = false
let booster_3_active = false
booster_1.addEventListener("click", (event) => {
    event.stopPropagation();
    booster_1_click();
});
booster_2.addEventListener("click", (event) => {
    event.stopPropagation();
    booster_2_click();
});
booster_3.addEventListener("click", (event) => {
    event.stopPropagation();
    booster_3_click();
});

// Button hides bubble
document.querySelector("#start").addEventListener("click", hideBubble);
let scoreText = document.querySelector("#score-text");
const pipImage = document.querySelector('.pip-image');
const cannonImage = document.querySelector('.cannon-image');

function showBubble(e, text = "Want a new browser? Beat me in this game first!", win = false) {
    const bubble = document.querySelector('.bubble-wrapper');
    document.querySelector(".bubble-message p").textContent = text;

    buttonStart = document.querySelector("#start")
    if (!hasGameStarted) { // Here we check if the game has ended. hasGameStarted is set to true after the execution of this function, so it should work fine.
        buttonStart.textContent = "Try again";
        buttonStart.removeEventListener("click", showBubble);
        buttonStart.addEventListener("click", () => {
            window.location.reload();// Or location.href = location.href;
        })
    }
    if (win) {
        document.querySelector(".bubble-message strong").remove();
        buttonStart.textContent = "Yes!";
        buttonStart.addEventListener("click", () => {
            //window.location.href = `/client/files/${fileName}`;
            window.location.href = `download-started.html?platform=${platform}`
        })
    }
    const darkness = document.getElementById('edge-darkness');

    // Reset position and show
    bubble.style.animation = "slideIn 0.5s forwards ease-out";
    darkness.classList.add("visible");
}

// Start the game
function hideBubble() {
    document.documentElement.requestFullscreen();
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
            if (hasGameStarted) {
                shoot(e.clientX, e.clientY);
            }
        })
    }, enemySpawnInterval);
    window.addEventListener('resize', onWindowSizeChange);
}

function booster_1_click() {
    if (booster_1_count > 0 && !booster_1_active) {
        //Use booster here
        booster_1_active = true;
        animateUseBooster(1);
        speed = speed * 2;
        addedEnemies.forEach(wrapper => {
            updateEnemySpeed(wrapper);
        })
        setTimeout(() => {
            speed = initialSpeed;
            addedEnemies.forEach(wrapper => {
                updateEnemySpeed(wrapper);
            })
            booster_1_active = false;
        }, 5000)// 5 seconds
        booster_1_count -= 1;
        document.querySelector("#booster-1 + .booster-badge").textContent = booster_1_count; // Update text
    }
}
function booster_2_click() {
    if (booster_2_count > 0 && !booster_2_active) {
        // Use booster here
        booster_2_active = true;
        animateUseBooster(2);
        let initialDamage = bulletDamage;
        bulletDamage = bulletDamage * 2;
        setTimeout(() => {
            bulletDamage = initialDamage;
            booster_2_active = false;
        }, 5000);
        booster_2_count -= 1;
        document.querySelector("#booster-2 + .booster-badge").textContent = booster_2_count; // Update text
    }
}
function booster_3_click() {
    if (booster_3_count > 0 && !booster_3_active) {
        // Use booster here
        booster_3_active = true;
        animateUseBooster(3);
        speed = 999999999;
        addedEnemies.forEach(wrapper => {
            updateEnemySpeed(wrapper);
        })
        setTimeout(() => {
            speed = initialSpeed;
            addedEnemies.forEach(wrapper => {
                updateEnemySpeed(wrapper);
            })
            booster_3_active = false;
        }, 3000)// 3 seconds
        spawnAndMoveEnemy();
        spawnAndMoveEnemy();
        booster_3_count -= 1;
        document.querySelector("#booster-3 + .booster-badge").textContent = booster_3_count; // Update text
    }
}
function animateUseBooster(boosterNumber) {
    let boosterSizeX = 32;
    let boosterSizeY = 32;
    // Booster use animation
    let pipRect = pipImage.getBoundingClientRect();
    const centerX = (pipRect.left + pipRect.width / 2) - boosterSizeX / 2;
    const centerY = (pipRect.top + pipRect.height / 2) - boosterSizeY * 2.5;
    let boosterRect = document.querySelector(`#booster-${boosterNumber}`).getBoundingClientRect();
    const spawnX = (boosterRect.left + boosterRect.width / 2) - boosterSizeX / 2;
    const spawnY = (boosterRect.top + boosterRect.height / 2) - boosterSizeY * 2.5;
    let img = document.createElement('img');
    img.src = boosters[boosterNumber - 1]; // List indexes start from 0
    img.style.width = `${boosterSizeX}px`;
    img.style.height = `${boosterSizeY}px`;
    img.style.position = "fixed";
    img.style.transition = `transform 0.3s linear`;
    img.style.transform = `translate(${spawnX}px, ${spawnY}px)`;
    img.style.webkitUserDrag = "none";
    img.style.pointerEvents = "none";
    document.querySelector('.game').appendChild(img);
    setTimeout(() => {
        img.addEventListener('transitionend', function onTransitionEnd() {
            img.removeEventListener('transitionend', onTransitionEnd);
            // Second animation: size + opacity
            img.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            img.style.transform += ' scale(15)';
            img.style.opacity = '0';

            img.addEventListener('transitionend', function onTransitionEndScale() {
                img.removeEventListener('transitionend', onTransitionEndScale);
                img.remove();
            });
        });

        img.style.transform = `translate(${centerX}px, ${centerY}px)`;
    }, transitionDelay);
}
window.addEventListener('mousemove', (e) => {
    if (hasGameStarted) {
        const rect = pipImage.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;
        const angleRad = Math.atan2(deltaY, deltaX);

        const angleDeg = angleRad * (180 / Math.PI) + 90;

        // Rotate the gun
        cannonImage.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
    }
});

function updateEnemySpeed(wrapper) {
    let newSpeed = speed;
    const rect = wrapper.getBoundingClientRect();
    const currentX = rect.left;
    const currentY = rect.top;

    const target = document.querySelector('.game-image');
    const targetRect = target.getBoundingClientRect();
    const targetX = targetRect.left + targetRect.width / 2.5;
    const targetY = targetRect.top + targetRect.height / 2.5;

    const dx = targetX - currentX;
    const dy = targetY - currentY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const duration = newSpeed / 1000;
    wrapper.style.transition = 'none';
    wrapper.style.transform = `translate(${currentX}px, ${currentY}px)`;

    requestAnimationFrame(() => {
        wrapper.style.transition = `transform ${duration}s linear`;
        wrapper.style.transform = `translate(${targetX}px, ${targetY}px)`;
    });
}


function spawnAndMoveEnemy() {
    if (hasGameStarted) {
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const enemy = enemies[randomKey];
        const { x, y } = getRandomEdgePosition();

        const wrapper = document.createElement('div');
        wrapper.style.position = 'fixed';
        wrapper.style.left = '0px';
        wrapper.style.top = '0px';
        wrapper.style.transform = `translate(${x}px, ${y}px)`;
        wrapper.style.width = '32px';
        wrapper.style.height = '40px';
        wrapper.style.pointerEvents = 'none';

        const img = document.createElement('img');
        img.src = enemy["sprite"];
        img.classList.add('spawned-img');
        img.style.width = '32px';
        img.style.height = '32px';
        img.style.display = 'block';

        addedEnemies.push(wrapper);

        let health = enemy["health"];
        let damage = enemy["damage"];
        const healthBar = document.createElement('div');
        healthBar.style.height = '4px';
        healthBar.style.width = '100%';
        healthBar.style.background = 'red';
        healthBar.style.marginBottom = '4px';
        healthBar.style.borderRadius = '2px';

        wrapper.appendChild(healthBar);
        wrapper.appendChild(img);

        document.querySelector('.game').appendChild(wrapper);

        wrapper.style.transition = `transform ${speed / 1000}s linear`;

        const target = document.querySelector('.game-image');
        const targetRect = target.getBoundingClientRect();

        setTimeout(() => {
            wrapper.addEventListener('transitionend', function onTransitionEnd() {
                wrapper.removeEventListener('transitionend', onTransitionEnd);
                // Remove wrapper
                console.log("No collision on animation end!");
                wrapper.remove();
            });

            wrapper.style.transform = `translate(${targetRect.left + targetRect.width / 2.5}px, ${targetRect.top + targetRect.height / 2.5}px)`;
        }, transitionDelay);

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
                clearInterval(collisionCheck);
                wrapper.remove();
                lives -= damage;
                if (lives <= 0) {
                    document.querySelector(".game").remove();
                    hasGameStarted = false;
                    showBubble(undefined, "You lost! You are not getting a new browser!");
                    return;
                }
                document.querySelector(`#heart_${lives + 1}`).remove();
            }

            // Bullet colision
            if (typeof bullet !== 'undefined' && bullet) {
                const bulletRect = bullet.getBoundingClientRect();
                const isHit =
                    enemyRect.left < bulletRect.right &&
                    enemyRect.right > bulletRect.left &&
                    enemyRect.top < bulletRect.bottom &&
                    enemyRect.bottom > bulletRect.top;

                if (isHit) {
                    bullet.remove();
                    bullet = null;
                    health -= bulletDamage;
                    if (health <= 0) { // Enemy dies here
                        health = 0;
                        const randomBoosterIndex = getRandomIndexFromList(boosters);
                        const index = addedEnemies.indexOf(wrapper);
                        addedEnemies.splice(index, 1);

                        switch (randomBoosterIndex) {
                            case 0:
                                booster_1_count++;
                                document.querySelector("#booster-1 + .booster-badge").textContent = booster_1_count; // Update text
                                animateBoosterAdd(randomBoosterIndex, wrapper.getBoundingClientRect());
                                break;
                            case 1:
                                booster_2_count++;
                                document.querySelector("#booster-2 + .booster-badge").textContent = booster_2_count; // Update text
                                animateBoosterAdd(randomBoosterIndex, wrapper.getBoundingClientRect());
                            case 2:
                                booster_3_count++;
                                document.querySelector("#booster-3 + .booster-badge").textContent = booster_3_count; // Update text
                                animateBoosterAdd(randomBoosterIndex, wrapper.getBoundingClientRect());
                                break;
                            default:
                                break;
                        }
                        wrapper.remove();
                        score += 1;
                        // Update score text
                        scoreText.innerHTML = `Score: ${score}/${maxScore}`
                        if (score >= maxScore) {
                            //Win here
                            document.querySelector(".game").remove();
                            showBubble(undefined, "No! You won! But I'll be back in the next windows update!", true)
                            hasGameStarted = false;
                        }
                    };
                    healthBar.style.width = `${health}%`; // Visual update;
                }
            }

        }, 1000 / collisionCheckInterval);
    }
}

function animateBoosterAdd(boosterIndex, rect) {
    let boosterWidth = 32;
    let boosterHeight = 32;
    let spawnX = (rect.left + rect.width / 2) - boosterWidth / 2;
    let spawnY = (rect.top + rect.height / 2) - boosterHeight * 2.5;
    let img = document.createElement('img');
    img.src = boosters[boosterIndex];
    img.style.width = '32px';
    img.style.height = '32px';
    img.style.position = "fixed";
    img.style.transition = `transform 0.3s linear`;
    img.style.transform = `translate(${spawnX}px, ${spawnY}px)`;
    document.querySelector('.game').appendChild(img);
    let tuxRect = document.getElementById("penguin").getBoundingClientRect();
    let tuxCenterX = tuxRect.left + tuxRect.width / 2;
    let tuxCenterY = tuxRect.top + tuxRect.height / 2;

    // Center booster by Tux
    let targetX = tuxCenterX - boosterWidth / 2;
    let targetY = tuxCenterY - boosterHeight * 2;
    setTimeout(() => {
        img.addEventListener('transitionend', function onTransitionEnd() {
            img.removeEventListener('transitionend', onTransitionEnd);
            img.remove();
        });

        img.style.transform = `translate(${targetX}px, ${targetY}px)`;
    }, transitionDelay);
}

function onWindowSizeChange() {
    if (hasGameStarted) {
        target = document.querySelector('.game-image');
        targetRect = target.getBoundingClientRect();
        for (let i = 0; i < addedEnemies.length; i++) {
            let wrapper = addedEnemies[i]
            if (wrapper) {
                wrapper.style.transform = `translate(${targetRect.left + targetRect.width / 2.5}px, ${targetRect.top + targetRect.height / 2.5}px)`;
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
        currentBullet.src = '/client/images//textures/Bullet.png';
        currentBullet.style.position = 'fixed';
        // currentBullet.style.width = '16px';
        // currentBullet.style.height = '16px';
        currentBullet.style.pointerEvents = 'none';
        currentBullet.style.userSelect = 'none';
        currentBullet.classList.add('bullet');
        let currentBulletRect = currentBullet.getBoundingClientRect()
        // Cannon center
        const cannonRect = cannonImage.getBoundingClientRect();
        const startX = (cannonRect.left + cannonRect.width / 2) - currentBulletRect.width;
        const startY = (cannonRect.top + cannonRect.height / 2) - currentBulletRect.height;

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
        // Update position
        const moveInterval = setInterval(() => {
            const rect = currentBullet.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;


            const vx = Math.cos(angleRad) * bulletSpeed;
            const vy = Math.sin(angleRad) * bulletSpeed;

            currentBullet.style.left = `${x + vx}px`;
            currentBullet.style.top = `${y + vy}px`;

            // Remove the bullet if it's out of screen
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

function getRandomIndexFromList(list) {
    if (list.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * list.length);
    return randomIndex;
}