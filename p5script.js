let particles = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    background(0); 
    for (let particle of particles) {
        particle.update();
        particle.display();
    }
}

class Particle {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = createVector(0.1, 0.1); 
        this.size = random(20, 40); 
        this.color = color(150);
    }

    update() {
        this.position.add(this.velocity);
        if (this.position.x < 0 || this.position.x > width) {
            this.velocity.x *= -1;
        }
        if (this.position.y < 0 || this.position.y > height) {
            this.velocity.y *= -1;
        }
        let attraction = createVector(mouseX, mouseY).sub(this.position);
        attraction.mult(0.000005); 
        this.velocity.add(attraction);
    }

    display() {
        noStroke();
        fill(this.color);
        textSize(this.size);
        text("?", this.position.x, this.position.y);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
