

function createCubeBuffers(gl) {
  const positions = [
      // Voorzijde
      -0.5, -0.5,  0.5,
       0.5, -0.5,  0.5,
       0.5,  0.5,  0.5,
      -0.5,  0.5,  0.5,
      // Achterzijde
      -0.5, -0.5, -0.5,
      -0.5,  0.5, -0.5,
       0.5,  0.5, -0.5,
       0.5, -0.5, -0.5,
      // Boven
      -0.5,  0.5, -0.5,
      -0.5,  0.5,  0.5,
       0.5,  0.5,  0.5,
       0.5,  0.5, -0.5,
      // Onder
      -0.5, -0.5, -0.5,
       0.5, -0.5, -0.5,
       0.5, -0.5,  0.5,
      -0.5, -0.5,  0.5,
      // Rechts
       0.5, -0.5, -0.5,
       0.5,  0.5, -0.5,
       0.5,  0.5,  0.5,
       0.5, -0.5,  0.5,
      // Links
      -0.5, -0.5, -0.5,
      -0.5, -0.5,  0.5,
      -0.5,  0.5,  0.5,
      -0.5,  0.5, -0.5,
  ];

  // Normale voor elke hoek
  const normals = [
      // Voorzijde
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
      // Achterzijde
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,
      // Boven
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,
      // Onder
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
      // Rechts
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,
      // Links
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
  ];

  // Textuurcoördinaten
  const texCoords = [
      // Voorzijde
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Achterzijde
      1.0,  0.0,  
      1.0,  1.0, 
      0.0,  1.0, 
      0.0,  0.0, 
      // Boven
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Onder
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Rechts
      1.0,  0.0,  // Rechtsonder → Linksonder
      1.0,  1.0,  // Rechtsboven → Rechtsonder
      0.0,  1.0,  // Linksboven → Rechtsboven
      0.0,  0.0,  // Linksonder → Linksboven
      // Links
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
  ];

  const colors = [
    // Voorzijde 
    0.0, 0.0, 0.2,  // Blauw
    0.0, 0.0, 0.2,
    0.0, 0.0, 0.2,
    0.0, 0.0, 0.2,

    // Achterzijde
    0, 0, 0,  
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,

    // Bovenkant 
    0, 0, 0, 
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,

    // Onderkant (Grijs)
    0, 0, 0,  
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,

    // Rechts (Grijs)
    0, 0, 0,  
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,

    // Links (Grijs)
    0, 0, 0,  
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
];

  // Indices voor de kubus (2 driehoeken per zijde)
  const indices = [
      0, 1, 2,    0, 2, 3,    // Voorzijde
      4, 5, 6,    4, 6, 7,    // Achterzijde
      8, 9,10,    8,10,11,    // Boven
     12,13,14,   12,14,15,    // Onder
     16,17,18,   16,18,19,    // Rechts
     20,21,22,   20,22,23,    // Links
  ];

  // maak en vul de bufferobjecten
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    normal: normalBuffer,
    texCoord: texCoordBuffer,
    indices: indexBuffer,
    color: colorBuffer,
    vertexCount: indices.length,
  };
}
