class PerlinNoise {
    constructor(seed = 0) {
        this.p = new Uint8Array(512);
        this.grad3 = [
            [1,1,0], [-1,1,0], [1,-1,0], [-1,-1,0],
            [1,0,1], [-1,0,1], [1,0,-1], [-1,0,-1],
            [0,1,1], [0,-1,1], [0,1,-1], [0,-1,-1]
        ];
        
        let perm = [];
        for (let i = 0; i < 256; i++) perm.push(i);
        perm.sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < 512; i++) {
            this.p[i] = perm[i % 256];
        }
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(a, b, t) {
        return (1 - t) * a + t * b;
    }

    grad(hash, x, y) {
        let g = this.grad3[hash % 12];
        return g[0] * x + g[1] * y;
    }

    noise(x, y) {
        let X = Math.floor(x) & 255;
        let Y = Math.floor(y) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        let u = this.fade(x);
        let v = this.fade(y);

        let A = this.p[X] + Y;
        let B = this.p[X + 1] + Y;

        return this.lerp(
            this.lerp(this.grad(this.p[A], x, y), this.grad(this.p[B], x - 1, y), u),
            this.lerp(this.grad(this.p[A + 1], x, y - 1), this.grad(this.p[B + 1], x - 1, y - 1), u),
            v
        );
    }
}
