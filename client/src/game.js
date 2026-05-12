import archBoosterUrl from "./assets/textures/arch.png"
import debianBoosterUrl from "./assets/textures/debian.png"
import opensuseBoosterUrl from "./assets/textures/opensuse.png"
import clipchampSpriteUrl from "./assets/textures/enemies/clipchamp.svg"
import copilotSpriteUrl from "./assets/textures/enemies/copilot.svg"
import edgeSpriteUrl from "./assets/textures/enemies/edge.svg"
import teamsSpriteUrl from "./assets/textures/enemies/teams.svg"
import onedriveSpriteUrl from "./assets/textures/enemies/onedrive.svg"
import win11SpriteUrl from "./assets/textures/enemies/windows-11.svg"
import windowsDefenderSpriteUrl from "./assets/textures/enemies/windows-defender.svg"
import wordSpriteUrl from "./assets/textures/enemies/word.svg"
import bulletSpriteUrl from "./assets/textures/Bullet.png"

let initialSpeed = 80
let speed = initialSpeed
let enemySpawnInterval = 1500 // Every 1.5 seconds
const transitionDelay = 150
let lives = 3
const maxScore = 100
const collisionCheckInterval = 60
const bulletSpeed = 10
let hasGameStarted = true
let bullets = []
const defaultMaxBullets = 1
let maxBullets = defaultMaxBullets
let bulletDamage = 25
let score = 0
let enemyInterval
let boosters = [
    archBoosterUrl,
    debianBoosterUrl,
    opensuseBoosterUrl,
]
const enemies = {
    clipchamp: {
        health: 100,
        damage: 1, // Don't change
        sprite: clipchampSpriteUrl,
    },
    copilot: {
        health: 100,
        damage: 1, // Don't change
        sprite: copilotSpriteUrl,
    },
    edge: {
        health: 100,
        damage: 1, // Don't change
        sprite: edgeSpriteUrl,
    },
    teams: {
        health: 100,
        damage: 1, // Don't change
        sprite: teamsSpriteUrl,
    },
    onedrive: {
        health: 100,
        damage: 1, // Don't change
        sprite: onedriveSpriteUrl,
    },
    win11: {
        health: 100,
        damage: 1, // Don't change
        sprite: win11SpriteUrl,
    },
    windowsDefender: {
        health: 200,
        damage: 1, // Don't change
        sprite: windowsDefenderSpriteUrl,
    },
    word: {
        health: 100,
        damage: 1, // Don't change
        sprite: wordSpriteUrl,
    },
}
let addedEnemies = []
let pauseEnemies = false
const keys = Object.keys(enemies)
const urlParams = new URLSearchParams(window.location.search)
const platform = urlParams.get("platform")
let boostersMenuDisplayed = false

// Start bubble and darkness on page load
window.addEventListener("DOMContentLoaded", showBubble)
const penguin = document.getElementById("penguin")
const menu = document.getElementById("penguin-menu")

penguin.addEventListener("click", (event) => {
    event.stopPropagation()
    menu.classList.toggle("active")
    boostersMenuDisplayed = !boostersMenuDisplayed
})

document.addEventListener("keydown", function (event) {
    const key = event.key
    if (key == 1) {
        booster_1_click()
    } else if (key == 2) {
        booster_2_click()
    } else if (key == 3) {
        booster_3_click()
    }
})

const booster_1 = document.getElementById("booster-1") // Arch
const booster_2 = document.getElementById("booster-2") // Debian
const booster_3 = document.getElementById("booster-3") // openSUSE

let booster_1_count = 0
let booster_2_count = 0
let booster_3_count = 0

let booster_1_active = false
let booster_2_active = false
let booster_3_active = false

let booster_1_time = 5000 // 5 seconds
let booster_2_time = 5000 // 5 seconds
let booster_3_time = 3000 // 3 seconds

booster_1.addEventListener("click", (event) => {
    event.stopPropagation()
    booster_1_click()
})
booster_2.addEventListener("click", (event) => {
    event.stopPropagation()
    booster_2_click()
})
booster_3.addEventListener("click", (event) => {
    event.stopPropagation()
    booster_3_click()
})

// Button hides bubble
document.querySelector("#start").addEventListener("click", hideBubble)
let scoreText = document.querySelector("#score-text")
const pipImage = document.querySelector(".pip-image")
const cannonImage = document.querySelector(".cannon-image")

function showBubble(
    e,
    text = "Want a new browser? Beat me in this game first!",
    win = false,
) {
    const bubble = document.querySelector(".bubble-wrapper")
    document.querySelector(".bubble-message p").textContent = text

    let buttonStart = document.querySelector("#start")
    if (!hasGameStarted) {
        // Here we check if the game has ended. hasGameStarted is set to true after the execution of this function, so it should work fine.
        buttonStart.textContent = "Try again"
        buttonStart.removeEventListener("click", hideBubble)
        buttonStart.addEventListener("click", () => {
            window.location.reload() // Or location.href = location.href;
        })
    }
    if (win) {
        document.querySelector(".bubble-message strong").remove()
        buttonStart.textContent = "Yes!"
        buttonStart.addEventListener("click", () => {
            const params = new URLSearchParams({
                type: "download",
                platform: platform
            })
            window.location.href = "info.html?" + params.toString()
        })
    }
    const darkness = document.getElementById("edge-darkness")

    // Reset position and show
    bubble.style.animation = "slideIn 0.5s forwards ease-out"
    darkness.classList.add("visible")
}

// Start the game
function hideBubble() {
    document.documentElement.requestFullscreen()
    const bubble = document.querySelector(".bubble-wrapper")
    const darkness = document.getElementById("edge-darkness")
    document.querySelector(".game").classList.remove("d-none")

    // Animate out
    bubble.style.animation = "slideOut 0.5s forwards ease-in"
    darkness.classList.remove("visible")
    hasGameStarted = true
    enemyInterval = setInterval(processEnemy, enemySpawnInterval)
    setTimeout(() => {
        document.body.addEventListener("click", (e) => {
            if (hasGameStarted) {
                shoot(e.clientX, e.clientY)
            }
        })
    }, enemySpawnInterval)
    window.addEventListener("resize", onWindowSizeChange)
}

function booster_1_click() {
    if (booster_1_count > 0 && !booster_1_active) {
        //Use booster here
        booster_1_active = true
        animateUseBooster(1)
        maxBullets = 2
        setTimeout(() => {
            maxBullets = 1
            booster_1_active = false
        }, booster_1_time)
        booster_1_count -= 1
        document.querySelector("#booster-1 ~ .booster-badge").textContent =
            booster_1_count // Update text
        runLoader(document.querySelector("#booster-1 ~ .loader"), booster_1_time / 1000)
    }
}
function booster_2_click() {
    if (booster_2_count > 0 && !booster_2_active) {
        // Use booster here
        booster_2_active = true
        animateUseBooster(2)
        let initialDamage = bulletDamage
        bulletDamage = bulletDamage * 2
        setTimeout(() => {
            bulletDamage = initialDamage
            booster_2_active = false
        }, booster_2_time)
        booster_2_count -= 1
        document.querySelector("#booster-2 ~ .booster-badge").textContent =
            booster_2_count // Update text
        runLoader(document.querySelector("#booster-2 ~ .loader"), booster_2_time / 1000)
    }
}
function booster_3_click() {
    if (booster_3_count > 0 && !booster_3_active) {
        // Use booster here
        booster_3_active = true
        animateUseBooster(3)
        processEnemy()
        processEnemy()
        addedEnemies.forEach((wrapper) => {
            pauseEnemies = true
            pauseEnemy(wrapper)
        })
        setTimeout(() => {
            addedEnemies.forEach((wrapper) => {
                pauseEnemies = false
                resumeEnemy(wrapper)
            })
            booster_3_active = false
        }, booster_3_time) // 3 seconds

        booster_3_count -= 1
        document.querySelector("#booster-3 ~ .booster-badge").textContent =
            booster_3_count // Update text
        runLoader(document.querySelector("#booster-3 ~ .loader"), booster_3_time / 1000)
    }
}

/**
 * @param {HTMLElement} loaderElement - Loader element
 * @param {number} durationSeconds - Time in seconds
 */
function runLoader(loaderElement, durationSeconds) {
    // Set duration
    loaderElement.style.setProperty('--duration', `${durationSeconds}s`);

    // Show loader
    loaderElement.classList.add('active');

    // Listen animation finish
    loaderElement.addEventListener('animationend', () => {
        loaderElement.classList.remove('active');
    }, { once: true });
}

function animateUseBooster(boosterNumber) {
    const boosterSizeX = 32
    const boosterSizeY = 32
    // Booster use animation
    const pipRect = pipImage.getBoundingClientRect()
    const centerX = pipRect.left + pipRect.width / 2 - boosterSizeX / 2
    const centerY = pipRect.top + pipRect.height / 2 - boosterSizeY * 2.5
    let spawnX;
    let spawnY;
    if (boostersMenuDisplayed) {
        const boosterRect = document
            .querySelector(`#booster-${boosterNumber}`)
            .getBoundingClientRect()
        spawnX = boosterRect.left + boosterRect.width / 2 - boosterSizeX / 2
        spawnY = boosterRect.top + boosterRect.height / 2 - boosterSizeY * 2.5
    }
    else {
        const tuxRect = document.getElementById("penguin").getBoundingClientRect()
        spawnX = tuxRect.left + tuxRect.width / 2 - boosterSizeX / 2
        spawnY = tuxRect.top + tuxRect.height / 2 - boosterSizeY * 2.5
    }
    const img = document.createElement("img")
    img.src = boosters[boosterNumber - 1] // List indexes start from 0
    img.style.width = `${boosterSizeX}px`
    img.style.height = `${boosterSizeY}px`
    img.style.position = "fixed"
    // img.style.transition = `transform 0.3s linear`
    img.style.transform = `translate(${spawnX}px, ${spawnY}px)`
    img.style.webkitUserDrag = "none"
    img.style.pointerEvents = "none"

    document.querySelector(".game").appendChild(img)
    const flyAnimation = img.animate([
        { transform: `translate(${spawnX}px, ${spawnY}px)` },
        { transform: `translate(${centerX}px, ${centerY}px)` }
    ], {
        duration: 300,
        delay: transitionDelay,
        easing: "linear",
        fill: "forwards"
    })

    flyAnimation.onfinish = () => {
        const scaleAnimation = img.animate([
            { transform: `translate(${centerX}px, ${centerY}px) scale(0)`, opacity: 1 },
            { transform: `translate(${centerX}px, ${centerY}px) scale(15)`, opacity: 0 }
        ], {
            duration: 300,
            easing: "ease",
            fill: "forwards"
        })
    }
}
window.addEventListener("mousemove", (e) => {
    if (hasGameStarted) {
        const rect = pipImage.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const mouseX = e.clientX
        const mouseY = e.clientY

        const deltaX = mouseX - centerX
        const deltaY = mouseY - centerY
        const angleRad = Math.atan2(deltaY, deltaX)

        const angleDeg = angleRad * (180 / Math.PI) + 90

        // Rotate the gun
        cannonImage.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`
    }
})

function updateEnemySpeed(wrapper) {
    const rect = wrapper.getBoundingClientRect()
    const currentX = rect.left
    const currentY = rect.top

    const target = document.querySelector(".game-image")
    const targetRect = target.getBoundingClientRect()
    const targetX = targetRect.left + targetRect.width / 2.5
    const targetY = targetRect.top + targetRect.height / 2.5

    wrapper.style.transform = `translate(${currentX}px, ${currentY}px)`
    wrapper.getAnimations().forEach(anim => anim.cancel());

    animateEnemy(wrapper, currentX, currentY, targetX, targetY, 0)
}

function pauseEnemy(wrapper) {
    const animations = wrapper.getAnimations();

    animations.forEach(anim => {
        anim.pause();
    });
}

function resumeEnemy(wrapper) {
    const animations = wrapper.getAnimations();

    animations.forEach(anim => {
        anim.play();
    });
}
function animateEnemy(wrapper, initX, initY, targetX, targetY, delay = transitionDelay) {
    if (!pauseEnemies) {
        const dx = targetX - initX;
        const dy = targetY - initY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const calculatedDuration = (distance / speed) * 1000;

        const animation = wrapper.animate([
            { transform: `translate(${initX}px, ${initY}px)` },
            { transform: `translate(${targetX}px, ${targetY}px)` }
        ], {
            duration: calculatedDuration,
            delay: delay,
            easing: "linear",
            fill: "forwards"
        })

        animation.onfinish = () => {
            console.log("No collision on animation end!")
            removeEnemy(wrapper)
        }
    }
}

function removeEnemy(wrapper) {
    wrapper.getAnimations().forEach(anim => anim.cancel());
    wrapper.remove()
    const index = addedEnemies.indexOf(wrapper);
    if (index !== -1) {
        addedEnemies.splice(index, 1);
    }
}

function processEnemy() {
    if (hasGameStarted) {
        const randomKey = keys[Math.floor(Math.random() * keys.length)]
        const enemy = enemies[randomKey]
        const { x, y } = getRandomEdgePosition()

        const wrapper = document.createElement("div")
        wrapper.style.position = "fixed"
        wrapper.style.left = "0px"
        wrapper.style.top = "0px"
        wrapper.style.transform = `translate(${x}px, ${y}px)`
        wrapper.style.width = "32px"
        wrapper.style.height = "40px"
        wrapper.style.pointerEvents = "none"

        const img = document.createElement("img")
        img.src = enemy["sprite"]
        img.classList.add("spawned-img")
        img.style.width = "32px"
        img.style.height = "32px"
        img.style.display = "block"

        let health = enemy["health"]
        let damage = enemy["damage"]
        const healthBar = document.createElement("div")
        healthBar.style.height = "4px"
        healthBar.style.width = `${health}%`
        healthBar.style.background = "red"
        healthBar.style.marginBottom = "4px"
        healthBar.style.borderRadius = "2px"

        healthBar.style.position = "absolute"
        healthBar.style.left = "50%"
        healthBar.style.bottom = "100%" // Above enemy
        healthBar.style.transform = "translateX(-50%)"

        wrapper.appendChild(healthBar)
        wrapper.appendChild(img)

        document.querySelector(".game").appendChild(wrapper)
        addedEnemies.push(wrapper)

        const target = document.querySelector(".game-image")
        const targetRect = target.getBoundingClientRect()
        const targetX = targetRect.left + targetRect.width / 2.5
        const targetY = targetRect.top + targetRect.height / 2.5

        animateEnemy(wrapper, x, y, targetX, targetY)

        const character = document.querySelector(".game-image")

        const collisionCheck = setInterval(() => {
            const enemyRect = img.getBoundingClientRect()
            const characterRect = character.getBoundingClientRect()

            const isColliding =
                enemyRect.left < characterRect.right &&
                enemyRect.right > characterRect.left &&
                enemyRect.top < characterRect.bottom &&
                enemyRect.bottom > characterRect.top

            if (isColliding) {
                clearInterval(collisionCheck)
                removeEnemy(wrapper)
                lives -= damage
                if (lives <= 0) {
                    document.querySelector(".game").remove()
                    hasGameStarted = false
                    showBubble(
                        undefined,
                        "You lost! You are not getting a new browser!",
                    )
                    return
                }
                document.querySelector(`#heart_${lives + 1}`).remove()
            }

            // Bullet colision
            bullets.forEach((bullet) => {
                if (typeof bullet !== "undefined" && bullet) {
                    const bulletRect = bullet.getBoundingClientRect()
                    const isHit =
                        enemyRect.left < bulletRect.right &&
                        enemyRect.right > bulletRect.left &&
                        enemyRect.top < bulletRect.bottom &&
                        enemyRect.bottom > bulletRect.top

                    if (isHit) {
                        removeBullet(bullet)
                        health -= bulletDamage
                        if (health <= 0) {
                            // Enemy dies here
                            health = 0
                            const randomBoosterIndex =
                                getRandomIndexFromList(boosters)
                            const index = addedEnemies.indexOf(wrapper)
                            addedEnemies.splice(index, 1)

                            switch (randomBoosterIndex) {
                                case 0:
                                    booster_1_count++
                                    document.querySelector(
                                        "#booster-1 ~ .booster-badge",
                                    ).textContent = booster_1_count // Update text
                                    animateAddBooster(
                                        randomBoosterIndex,
                                        wrapper.getBoundingClientRect(),
                                    )
                                    break
                                case 1:
                                    booster_2_count++
                                    document.querySelector(
                                        "#booster-2 ~ .booster-badge",
                                    ).textContent = booster_2_count // Update text
                                    animateAddBooster(
                                        randomBoosterIndex,
                                        wrapper.getBoundingClientRect(),
                                    )
                                    break
                                case 2:
                                    booster_3_count++
                                    document.querySelector(
                                        "#booster-3 ~ .booster-badge",
                                    ).textContent = booster_3_count // Update text
                                    animateAddBooster(
                                        randomBoosterIndex,
                                        wrapper.getBoundingClientRect(),
                                    )
                                    break
                                default:
                                    break
                            }
                            removeEnemy(wrapper)
                            score += 1
                            // Update score text
                            scoreText.innerHTML = `Score: ${score}/${maxScore}`
                            if (score >= maxScore) {
                                // Win here
                                document.querySelector(".game").remove()
                                showBubble(
                                    undefined,
                                    "No! You won! But I'll be back in the next windows update!",
                                    true,
                                )
                                hasGameStarted = false
                            }
                        }
                        healthBar.style.width = `${health}%` // Visual update;
                    }
                }
            })
        }, 1000 / collisionCheckInterval)
    }
}

function animateAddBooster(boosterIndex, rect) {
    const boosterWidth = 32
    const boosterHeight = 32

    const spawnX = rect.left + rect.width / 2 - boosterWidth / 2
    const spawnY = rect.top + rect.height / 2 - boosterHeight * 2.5
    const img = document.createElement("img")
    img.src = boosters[boosterIndex]
    img.style.width = "32px"
    img.style.height = "32px"
    img.style.position = "fixed"
    img.style.transform = `translate(${spawnX}px, ${spawnY}px)`
    document.querySelector(".game").appendChild(img)
    const tuxRect = document.getElementById("penguin").getBoundingClientRect()
    const tuxCenterX = tuxRect.left + tuxRect.width / 2
    const tuxCenterY = tuxRect.top + tuxRect.height / 2

    let targetX;
    let targetY;
    if (boostersMenuDisplayed) {
        const boosterRect = document
            .querySelector(`#booster-${boosterIndex + 1}`)
            .getBoundingClientRect()
        targetX = boosterRect.left + boosterRect.width / 2 - boosterWidth / 2
        targetY = boosterRect.top + boosterRect.height / 2 - boosterHeight * 2.5
    }
    else {
        const tuxRect = document.getElementById("penguin").getBoundingClientRect()
        targetX = tuxCenterX - boosterWidth / 2
        targetY = tuxCenterY - boosterHeight * 2.5
    }

    const animation = img.animate(
        [
            { transform: `translate(${spawnX}px, ${spawnY}px)` },
            { transform: `translate(${targetX}px, ${targetY}px)` }
        ],
        {
            duration: 300,
            delay: transitionDelay,
            easing: "linear",
            fill: "forwards"
        }
    )

    animation.onfinish = () => {
        img.remove()
    }
}

function onWindowSizeChange() {
    if (hasGameStarted) {
        const target = document.querySelector(".game-image")
        const targetRect = target.getBoundingClientRect()
        for (let i = 0; i < addedEnemies.length; i++) {
            let wrapper = addedEnemies[i]
            if (wrapper) {
                updateEnemySpeed(wrapper)
            }
        }
    }
}

function getRandomEdgePosition() {
    const side = Math.floor(Math.random() * 4) // 0-3
    const vw = window.innerWidth
    const vh = window.innerHeight

    let x = 0,
        y = 0

    switch (side) {
        case 0: // Up
            x = Math.random() * vw
            y = -32
            break
        case 1: // Right
            x = vw + 32
            y = Math.random() * vh
            break
        case 2: // Bottom
            x = Math.random() * vw
            y = vh + 32
            break
        case 3: // Left
            x = -32
            y = Math.random() * vh
            break
    }
    return { x, y }
}

function shoot(mouseX, mouseY) {
    if (bullets.length < maxBullets) {
        const currentBullet = document.createElement("img")
        currentBullet.src = bulletSpriteUrl
        currentBullet.style.position = "fixed"
        currentBullet.style.pointerEvents = "none"
        currentBullet.style.userSelect = "none"
        currentBullet.classList.add("bullet")
        let currentBulletRect = currentBullet.getBoundingClientRect()
        // Cannon center
        const cannonRect = cannonImage.getBoundingClientRect()
        const startX =
            cannonRect.left + cannonRect.width / 2 - currentBulletRect.width
        const startY =
            cannonRect.top + cannonRect.height / 2 - currentBulletRect.height

        // Vector
        const dx = mouseX - startX
        const dy = mouseY - startY
        const angleRad = Math.atan2(dy, dx)
        const angleDeg = angleRad * (180 / Math.PI) + 90

        currentBullet.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`
        currentBullet.style.transformOrigin = "center center"
        currentBullet.style.left = `${startX}px`
        currentBullet.style.top = `${startY}px`

        document.body.appendChild(currentBullet)
        bullets.push(currentBullet)
        // Update position
        const moveInterval = setInterval(() => {
            const rect = currentBullet.getBoundingClientRect()
            const x = rect.left + rect.width / 2
            const y = rect.top + rect.height / 2

            const vx = Math.cos(angleRad) * bulletSpeed
            const vy = Math.sin(angleRad) * bulletSpeed

            currentBullet.style.left = `${x + vx}px`
            currentBullet.style.top = `${y + vy}px`

            // Remove the bullet if it's out of screen
            if (
                x < 0 ||
                x > window.innerWidth ||
                y < 0 ||
                y > window.innerHeight
            ) {
                removeBullet(currentBullet)
                clearInterval(moveInterval)
            }
        }, 1000 / 60) // 60 FPS
    }
}

function removeBullet(bullet) {
    bullet.remove()
    const index = bullets.indexOf(bullet);
    if (index !== -1) {
        bullets.splice(index, 1);
    }
}

function getRandomIndexFromList(list) {
    if (list.length === 0) return null
    const randomIndex = Math.floor(Math.random() * list.length)
    return randomIndex
}
