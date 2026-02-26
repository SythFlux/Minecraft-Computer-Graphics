// shader.js

const vertexShaderSource = `#version 300 es
in vec3 aPosition;
in vec2 aTexCoord;
in vec3 aNormal;
in vec3 aColor; 

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

out vec2 vTexCoord;
out vec3 vNormal;
out vec3 vPosition;
out vec3 vColor; 

void main(void) {
    vTexCoord = aTexCoord;
    vNormal = mat3(uModelViewMatrix) * aNormal;
    vPosition = vec3(uModelViewMatrix * vec4(aPosition, 1.0));
    vColor = aColor; // 
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0); //brengt vertex naar cameraruimte past perspectief toe gl_positie bepaalt waar de vertex wordt getekend op het scherm
}
`;


const fragmentShaderSource = `#version 300 es
precision highp float;

in vec2 vTexCoord;
in vec3 vNormal;
in vec3 vPosition;
in vec3 vColor; //  Ontvangt kleur vanuit vertex shader

uniform sampler2D uSampler;
uniform vec3 uLightPosition;

out vec4 fragColor;

void main(void) {
    //  Haal textuurkleur op
    vec4 texColor = texture(uSampler, vTexCoord);

    //  Meng textuur met de vertex-kleur (50% van elk, pas de factor aan indien nodig)
    vec3 mixedColor = mix(vColor, texColor.rgb, 0.5);

    //  Ambient lighting
    vec3 ambient = 0.8 * mixedColor;

    //  Diffuse lighting
    vec3 lightDir = normalize(uLightPosition - vPosition);
    float diff = max(dot(normalize(vNormal), lightDir), 0.0);
    float diffuseStrength = 1.5; // Verhoog de diffuse verlichting
    vec3 diffuse = diff * diffuseStrength * mixedColor;

    //  Uitvoer van de kleur
    fragColor = vec4(ambient + diffuse, 1.0);
}
`;
