class Controls {
    constructor(canvas) {
        this.canvas = canvas;
        this.dragging = false;
        this.lastX = 0;
        this.lastY = 0;
        this.rotationX = 0;
        this.rotationY = 0;
        this.zoom = -20;
        this.offsetY = 0;  
        this.movementSpeed = 0.2; 

        this.keys = {}; // Houdt ingedrukte toetsen bij

        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.onMouseUp());
        this.canvas.addEventListener('wheel', (e) => this.onWheel(e));

        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));

        this.update(); // Start bewegingsupdate
    }

    onMouseDown(e) {
        this.dragging = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
    }

    onMouseMove(e) {
        if (this.dragging) {
            const deltaX = e.clientX - this.lastX;
            const deltaY = e.clientY - this.lastY;
            this.rotationY += deltaX * 0.01;
            this.rotationX += deltaY * 0.01;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
        }
    }

    onMouseUp() {
        this.dragging = false;
    }

    onWheel(e) {
        this.zoom += e.deltaY * 0.1;
        if (this.zoom > -5) this.zoom = -5;
        if (this.zoom < -50) this.zoom = -50;
    }

    onKeyDown(e) {
        this.keys[e.key.toLowerCase()] = true; // true ingedrukt 
    }

    onKeyUp(e) {
        this.keys[e.key.toLowerCase()] = false; // false ingedrukt
    }

    update() {
        // Beweeg de camera omhoog of omlaag als Q of E ingedrukt is
        if (this.keys['q']) this.offsetY += this.movementSpeed;
        if (this.keys['e']) this.offsetY -= this.movementSpeed;

        requestAnimationFrame(() => this.update()); // Voer update constant uit
    }

    getViewMatrix() {
        const viewMatrix = mat4.create();
        mat4.translate(viewMatrix, viewMatrix, [0, -this.offsetY, this.zoom]); // Zorg dat Y-beweging correct is
        mat4.rotate(viewMatrix, viewMatrix, this.rotationX, [1, 0, 0]);
        mat4.rotate(viewMatrix, viewMatrix, this.rotationY, [0, 1, 0]);
        return viewMatrix;
    }
}
