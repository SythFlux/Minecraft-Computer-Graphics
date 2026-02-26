# Demo: Minecraft-Style Terrain (WebGL)

A small WebGL demo that generates Minecraft-like voxel terrain in the browser using Perlin noise. This repository contains a compact renderer and terrain generator written in JavaScript.

## Live Preview

- Open `index.html` with Live Server (VS Code) or serve the folder with any static server.
- Each page refresh generates a new terrain.

## Quick Setup

1. Open the project folder in Visual Studio Code.
2. Install the **Live Server** extension (or use any static file server).
3. Right-click `index.html` → Open with Live Server, or run a static server from the project root.

Example (Node):

```bash
npx serve .
# then open http://localhost:5000 (port may vary)
```

## What You'll Find

- `buffer.js` — vertex positions, texture coordinates, and normals for a cube.
- `shader.js` — vertex and fragment shaders for positioning, texturing, and lighting.
- `texture.js` — loads and configures textures used on cube faces.
- `perlinnoise.js` — Perlin noise implementation used to compute smooth terrain heights.
- `main.js` — initialization (WebGL, shaders, buffers, textures) and world generation logic.

## Features

- Procedural terrain from Perlin noise (hills and valleys).
- Per-column height generation and block type assignment by depth.
- Simple tree placement on grass blocks (trunk + leaf crown).
- Cave/tunnel carving to create hollow spaces inside the terrain.

## Controls and Configuration

- Camera and controls are handled by the demo scripts in `main.js` and related files.
- You can tweak generation parameters (chunk size, noise scale, seed) directly in `main.js`.

Note: very large chunk sizes (e.g., > 60) can be slow or cause rendering issues in some browsers.

## Development Notes

- The renderer is intentionally small and educational: it demonstrates buffer setup, shader use, texture mapping, and simple lighting for voxels.
- If you want to extend the project, consider separating generation and rendering logic into modules and adding a simple UI for parameters.

## Screenshots

![Terrain 1](https://github.com/user-attachments/assets/ac1781fb-431e-43e0-8655-ac7e61a36ba0)

![Terrain 2](https://github.com/user-attachments/assets/b37e1085-0b42-4ec9-87e7-4c1415775c8d)

![Chunk size example](https://github.com/user-attachments/assets/12983071-cc37-4893-b52c-4ce0d1e1c4eb)

## Credits

Created as a demo project to explore procedural terrain generation and WebGL basics.

## License

See the repository root for license details, or add a `LICENSE` file if you want to set one.



