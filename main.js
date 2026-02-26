

// init WebGL2
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');

if (!gl) {
    alert('WebGL2 wordt niet ondersteund door je browser.');
}

// Pas de grootte van de canvas aan
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Compile shader
function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilatie mislukt:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Link shaders tot een programma
function createProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = compileShader(gl, vertexSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentSource, gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link fout:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

// Maak shader programma
const shaderProgram = createProgram(gl, vertexShaderSource, fragmentShaderSource);

// Zoek attribuut en uniform locaties
const programInfo = {
    program: shaderProgram,
    attribLocations: {
        position: gl.getAttribLocation(shaderProgram, 'aPosition'),
        texCoord: gl.getAttribLocation(shaderProgram, 'aTexCoord'),
        normal: gl.getAttribLocation(shaderProgram, 'aNormal'),
    },
    uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
        lightPosition: gl.getUniformLocation(shaderProgram, 'uLightPosition'),
    },
};

// Maak buffers
const buffers = createCubeBuffers(gl);

// Laad texturen
const textures = {
    // grasblok
    grassside: loadTexture(gl, 'textures/grassside.png'),
    grasstop: loadTexture(gl, 'textures/grasstop.png'),
    grassbottom: loadTexture(gl, 'textures/grass.png'), 

    // Normale blokken
    wood: loadTexture(gl, 'textures/wood.png'), 
    leaves: loadTexture(gl, 'textures/leaves.png'), 
    grass: loadTexture(gl, 'textures/grass.png'), 
    cobblestone: loadTexture(gl, 'textures/cobblestone.png'),
    diamond: loadTexture(gl, 'textures/diamond.png'),
    coal: loadTexture(gl, 'textures/coal.png'),
    redstone: loadTexture(gl, 'textures/redstone.png'),
    iron: loadTexture(gl, 'textures/iron.png'),
    gold: loadTexture(gl, 'textures/gold.png'),
};

// Initialiseer controls
const controls = new Controls(canvas);

// Genereer chunk data (eenvoudig random hoogte)
const CHUNK_SIZE = 20;
const MAX_HEIGHT = 50; // Maximale hoogte van het terrein
const noiseScale = 0.05; // Basis noise voor heuvels
const detailScale = 0.1; // Extra detail voor kleine heuveltjes
const caveDensity = 0.01; // Hoeveel wormen per chunk
const caveLength = 30; // Hoe lang elke worm is
const caveRadius = 2; // Hoe breed grotten zijn
const MAX_TREES = 1;
let treeCount = 0;
const perlin = new PerlinNoise();
const cubes = [];

// Functie om een worm-achtige grot te maken
function createCave(x, y, z) {
    let cave = [];
    let angle = Math.random() * Math.PI * 2;
    let pitch = (Math.random() - 0.5) * 0.5; // Zorgt voor omhoog/omlaag beweging

    for (let i = 0; i < caveLength; i++) {
        // Verplaats de grot naar een nieuwe positie
        x += Math.cos(angle) * 1.5;
        z += Math.sin(angle) * 1.5;
        y += pitch * 2;

        // Zorg dat de grot binnen de wereld blijft
        x = Math.max(1, Math.min(CHUNK_SIZE - 2, x));
        z = Math.max(1, Math.min(CHUNK_SIZE - 2, z));
        y = Math.max(5, Math.min(MAX_HEIGHT - 5, y));

        // Voeg alle blokken toe die binnen het caveRadius zitten
        for (let dx = -caveRadius; dx <= caveRadius; dx++) {
            for (let dy = -caveRadius; dy <= caveRadius; dy++) {
                for (let dz = -caveRadius; dz <= caveRadius; dz++) {
                    if (dx * dx + dy * dy + dz * dz <= caveRadius * caveRadius) {
                        cave.push({ x: Math.floor(x + dx), y: Math.floor(y + dy), z: Math.floor(z + dz) });
                    }
                }
            }
        }

        // Verander de richting van de worm
        angle += (Math.random() - 0.5) * 0.5;
        pitch += (Math.random() - 0.5) * 0.1;
    }
    return cave;
}

// Chunk genereren
const terrainMap = {}; // Houdt bij welke blokken er zijn, zodat we kunnen checken voor grotten

for (let x = 0; x < CHUNK_SIZE; x++) {
    for (let z = 0; z < CHUNK_SIZE; z++) {
        let baseHeight = Math.abs(perlin.noise(x * noiseScale, z * noiseScale)) * MAX_HEIGHT;
        let detail = perlin.noise(x * detailScale, z * detailScale) * 5;
        let height = Math.floor(baseHeight + detail);
        height = Math.max(height, 5);

        for (let y = 0; y < height; y++) {
            let type = 'cobblestone'; // Default stone

            if (y === height - 1) {
                type = 'grass'; // Grass at the top
            } else if (y > height - 4) {
                type = 'cobblestone';
            } else if (y < height * 0.50 && Math.random() < 0.10) type = 'coal';
            else if (y < height * 0.40 && Math.random() < 0.07) type = 'iron';
            else if (y < height * 0.25 && Math.random() < 0.05) type = 'gold';
            else if (y < height * 0.20 && Math.random() < 0.04) type = 'redstone';
            else if (y < height * 0.125 && Math.random() < 0.02) type = 'diamond';

            let key = `${x},${y},${z}`;
            terrainMap[key] = { x, y, z, type };
        }

        //  **Place the top grass block**
        let grassTopKey = `${x},${height},${z}`;
        terrainMap[grassTopKey] = { x, y: height, z, type: 'grass_block' };

        //  **Try to place a tree**
        if (treeCount < MAX_TREES && Math.random() < 0.02) { // 2% chance per grass block
            treeCount++;
            let treeHeight = Math.floor(Math.random() * 3) + 4; // 5-7 blocks tall

            // Check if there's enough space
            let canPlaceTree = true;
            for (let i = 1; i <= treeHeight + 4; i++) { // Needs extra space above for leaves
                if (terrainMap[`${x},${height + i},${z}`]) {
                    canPlaceTree = false;
                    break;
                }
            }

            if (canPlaceTree) {
                //  **1. Create the trunk**
                for (let i = 0; i < treeHeight; i++) {
                    terrainMap[`${x},${height + i},${z}`] = { x, y: height + i, z, type: 'wood' };
                }

                //  **2. Add first layer of leaves (directly around the trunk)**
                let baseLeaves = height + treeHeight - 2;
                for (let dx = -2; dx <= 2; dx++) {
                    for (let dz = -1; dz <= 1; dz++) {
                        let leafKey = `${x + dx},${baseLeaves},${z + dz}`;
                        terrainMap[leafKey] = { x: x + dx, y: baseLeaves, z: z + dz, type: 'leaves' };
                    }
                }

                //  **3. Add the expanded leaf layer (5×5)**
                let midLeaves = baseLeaves + 1;
                for (let dx = -2; dx <= 2; dx++) {
                    for (let dz = -2; dz <= 2; dz++) {
                        if (Math.abs(dx) !== 2 || Math.abs(dz) !== 2) { // Rounded edges
                            let leafKey = `${x + dx},${midLeaves},${z + dz}`;
                            terrainMap[leafKey] = { x: x + dx, y: midLeaves, z: z + dz, type: 'leaves' };
                        }
                    }
                }

                //  **4. Add the top rounded leaf layer (3×3)**
                let topLeaves = midLeaves + 1;
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dz = -1; dz <= 1; dz++) {
                        let leafKey = `${x + dx},${topLeaves},${z + dz}`;
                        terrainMap[leafKey] = { x: x + dx, y: topLeaves, z: z + dz, type: 'leaves' };
                    }
                }

                //  **5. Place a single topmost leaf**
                terrainMap[`${x},${topLeaves + 1},${z}`] = { x, y: topLeaves + 1, z, type: 'leaves' };
            }
        }
    }
}

// Voeg grotten toe door blokken te verwijderen
for (let i = 0; i < CHUNK_SIZE * CHUNK_SIZE * caveDensity; i++) {
    let startX = Math.random() * CHUNK_SIZE;
    let startY = Math.random() * (MAX_HEIGHT * 0.6) + (MAX_HEIGHT * 0.2); // Grotten tussen 20%-80% van de hoogte
    let startZ = Math.random() * CHUNK_SIZE;

    let cave = createCave(startX, startY, startZ);
    for (let block of cave) {
        let key = `${block.x},${block.y},${block.z}`;
        delete terrainMap[key]; // Verwijder blokken voor grotten
    }
}

// Zet terrainMap om naar een cubes array
cubes.length = 0;
for (let key in terrainMap) {
    cubes.push(terrainMap[key]);
}


// Maak een VAO
const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

// Positie attribuut
gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
gl.enableVertexAttribArray(programInfo.attribLocations.position);
gl.vertexAttribPointer(programInfo.attribLocations.position, 3, gl.FLOAT, false, 0, 0);

// Textuurcoördinaat attribuut
gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoord);
gl.enableVertexAttribArray(programInfo.attribLocations.texCoord);
gl.vertexAttribPointer(programInfo.attribLocations.texCoord, 2, gl.FLOAT, false, 0, 0);

// Normale attribuut
gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
gl.enableVertexAttribArray(programInfo.attribLocations.normal);
gl.vertexAttribPointer(programInfo.attribLocations.normal, 3, gl.FLOAT, false, 0, 0);

// kleur toepassing
const colorLocation = gl.getAttribLocation(programInfo.program, "aColor");
gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color); 
gl.enableVertexAttribArray(colorLocation);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);


// Bind indices
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

// Gebruik het shader programma
gl.useProgram(programInfo.program);

// Enable depth testing
gl.enable(gl.DEPTH_TEST);

// Render loop
function render() {
    gl.clearColor(0.5, 0.7, 1.0, 1.0); // Luchtblauw
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Projection matrix
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, 0.1, 100.0);

    // View matrix vanuit controls
    const viewMatrix = controls.getViewMatrix();

    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, viewMatrix);

    // Lichtpositie
    gl.uniform3fv(programInfo.uniformLocations.lightPosition, [0, 20, 0]);

    // Bind VAO
    gl.bindVertexArray(vao);

    // Render elke kubus
   for (const cube of cubes) {
    const modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [cube.x - CHUNK_SIZE / 2, cube.y, cube.z - CHUNK_SIZE / 2]);

    const modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);

    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

    if (cube.type === 'grass_block') {
        // **Bind de texturen per zijde**
        const textureArray = [
            textures.grassside, // Voor
            textures.grassside, // Achter
            textures.grasstop,  // Boven
            textures.grassbottom, // Onder (dirt)
            textures.grassside, // Rechts
            textures.grassside  // Links
        ];

        for (let i = 0; i < 6; i++) { // Loop over zes zijden
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, textureArray[i]);
            gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, i * 6 * 2);
        }
    } else {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textures[cube.type]);
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
        gl.drawElements(gl.TRIANGLES, buffers.vertexCount, gl.UNSIGNED_SHORT, 0);
    }
}

    requestAnimationFrame(render);
}
requestAnimationFrame(render);