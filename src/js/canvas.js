
//init consts
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
const gravitationalStrenght = 1.01;
const friction_object = 0.8;
const friction_edge = 0.7;
const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};
const color_planets = ['#A57BEB', '#67D972', '#FF5A56', '#F5B841', '#75E0D2'];
const color_enemies = ['#710D00', '#712B22', '#BE1500', '#F11B00'];

let score = 0;
let bestScore = 0;

//tools
// random int from min and max
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
//random color in this array
function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
}
//give distance between 2 points
function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1;
    const yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}
// Newton's equation to resolve a collision
function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = {x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y};
        const v2 = {x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y};

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x * friction_object;
        particle.velocity.y = vFinal1.y * friction_object;

        otherParticle.velocity.x = vFinal2.x * friction_object;
        otherParticle.velocity.y = vFinal2.y * friction_object;
    }
}
// used in resolveCollision
function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

// Event Listeners
addEventListener('mousemove', (event) => {
    mouse.x = event.clientX
    mouse.y = event.clientY
});
addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    init()
});
addEventListener('click', () => {
    init()
});


// Objects

//player <=> mouse point . A basic circle fill
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath()
    }

    update() {

        this.draw()
    }
}

// Circle turning around player
class Planet {
    constructor(x, y, radius, color, planet, enemy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.enemy = enemy;
        this.velocity = {
            x: 1,
            y: 1
        };
        this.planet = planet;
        this.mass = radius;
        this.killed = false
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
    }

    update() {

        //prevent dispawn at start
        if ((!this.x || !this.y) && !this.killed) {
            init();
        }

        //following
        if (this.x !== this.planet.x && this.y !== this.planet.y) {

            let xDiff = this.planet.x - this.x;
            let yDiff = this.planet.y - this.y;
            //prendre que les valeurs : passe en positif si negatif, ou bien reste en positif
            let additionDistance = Math.sign(xDiff) * xDiff + Math.sign(yDiff) * yDiff

            let xWanted = xDiff / additionDistance;
            let yWanted = yDiff / additionDistance;

            let xDeplacement = xWanted;
            let yDeplacement = yWanted;
            if (this.x - this.radius < 0 || this.x + this.radius > innerWidth) {
                delete this.x;
                this.killed = true;

            }
            if (this.y - this.radius < 0 || this.y + this.radius > innerHeight) {
                delete this.x;
                this.killed = true;
            }
            this.velocity.x += xDeplacement;
            this.velocity.y += yDeplacement;


        }

        //si y'a un choc avec l'ennemi, on met des degats

        if (distance(this.x, this.y, this.enemy.x, this.enemy.y) < this.enemy.radius + this.radius) {
            resolveCollision(this, this.enemy);
            // Damages = cube de la velocité lors du choc / 10. Les degats sont exponentiels avec la vitesse
            let damagesX = this.velocity.x - this.enemy.velocity.x;
            let damagesY = this.velocity.y - this.enemy.velocity.y;
            let damages = Math.pow(Math.abs(damagesX) + Math.abs(damagesY), 3) / 1000;


            this.enemy.life -= damages;
            console.log(damages);
        }
        //sinon, ca se deplace normalement
        else {
            this.x += this.velocity.x;
            this.velocity.x = this.velocity.x / gravitationalStrenght;
            this.velocity.y = this.velocity.y / gravitationalStrenght;
            this.y += this.velocity.y;
        }


        this.draw()
    }
}

class Enemy {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.velocity = {
            x: 0,
            y: 0
        };
        this.radius = radius;
        this.color = color;
        this.mass = radius;
        this.life = this.mass * 1;
        this.killed = false
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath()
    }

    update() {

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        //detection des bords pour changer la direction
        if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
            this.velocity.x = -this.velocity.x * friction_edge;
            this.x += this.velocity.x;

        }
        if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
            this.velocity.y = -this.velocity.y * friction_edge;

            this.y += this.velocity.y;
        }
        if (this.life <= .0) {
            //kill enemy
            delete this.x;
            this.killed = true;
            //annimation when kiled ?
        }
        this.draw()
    }
}

// Implementation
let planets = [];
let enemies = [];

function init() {
    //player will follow mouse's player
    player = new Player(undefined, undefined, 20, 'white');
    let enemyX = innerWidth / 5;
    let enemyY = randomIntFromRange(innerHeight / 6, innerHeight * 5 / 6);
    enemies.push(new Enemy(enemyX, enemyY, 20, randomColor(color_enemies)));

    //create planets
    for (let i = 0; i < 1; i++) {
        let radius = randomIntFromRange(4, 10);
        let x = randomIntFromRange(radius, innerWidth - radius);
        let y = randomIntFromRange(radius, innerHeight - radius);
        let color = randomColor(color_planets);
        planets.push(new Planet(x, y, radius, color, player))

    }

}

// Animation Loop
function animate() {
    //loop
    requestAnimationFrame(animate);
    //clear page
    c.clearRect(0, 0, canvas.width, canvas.height);

    score = 0;

    //update score with current planets
    planets.forEach(planet => {

        if (planet && !planet.killed) {
            score++;
        }
      //update enemy's planet with last one
        planet.enemy = enemies[enemies.length - 1];
        planet.update(player)
    });
    //scoring text
    c.font = '15px Arial';
    c.fillStyle = 'white';
    c.textAlign = "center";
    c.fillText("Score actuel : " + score, canvas.width / 10, canvas.height / 12);
    c.fillText("Meilleur score : " + bestScore, 3 * canvas.width / 10, canvas.height / 12);

    //update player with mouse
    player.x = mouse.x;
    player.y = mouse.y;
    player.update();

    //update only last enemy
    enemies[enemies.length - 1].update();

    //if last enemy is killed
    if (enemies[enemies.length - 1].killed) {
        //scoring
        score++;
        if (score > bestScore) {
            bestScore = score;
        }
        //spawning a new enemy
        let enemyX = innerWidth / 5;
        let enemyY = randomIntFromRange(innerHeight / 6, innerHeight * 5 / 6);

        enemies.push(new Enemy(enemyX, enemyY, 20, randomColor(color_enemies)));

        //spawning a new planet
        let radius = randomIntFromRange(4, 10);
        let x = randomIntFromRange(radius, innerWidth - radius);
        let y = randomIntFromRange(radius, innerHeight - radius);
        let color = randomColor(color_planets);
        planets.push(new Planet(x, y, radius, color, player))
    }
}

init()
animate()
