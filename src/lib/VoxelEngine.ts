import * as THREE from 'three';
import { db } from './firebase';
import { doc, setDoc, deleteDoc, onSnapshot, collection } from 'firebase/firestore';

export type BlockType = 'grass' | 'dirt' | 'stone' | 'wood' | 'brick' | 'leaves' | 'water' | 'obsidian' | 'sand' | 'air';

const BLOCK_SIZE = 10;
const CHUNK_SIZE = 16;
const WORLD_HEIGHT = 128; // Height limit
const RENDER_DISTANCE = 4; // Chunks radius

const COLORS: Record<string, { r: number, g: number, b: number }> = {
    grass: { r: 0.34, g: 0.49, b: 0.27 },
    dirt: { r: 0.36, g: 0.25, b: 0.22 },
    stone: { r: 0.46, g: 0.46, b: 0.46 },
    wood: { r: 0.31, g: 0.20, b: 0.18 },
    brick: { r: 0.55, g: 0.43, b: 0.39 },
    leaves: { r: 0.18, g: 0.49, b: 0.20 },
    water: { r: 0.25, g: 0.64, b: 0.87 },
    obsidian: { r: 0.07, g: 0.07, b: 0.07 },
    sand: { r: 0.76, g: 0.70, b: 0.50 },
    air: { r: 0, g: 0, b: 0 }
};

// --- PERLIN NOISE (Simplified for performance) ---
class Perlin {
    private p: number[] = [];
    constructor(seed: number) {
        this.p = new Array(512);
        const p = new Array(256).fill(0).map((_, i) => i);
        let currentSeed = seed;
        const random = () => {
            const x = Math.sin(currentSeed++) * 10000;
            return x - Math.floor(x);
        };
        for(let i=255; i>0; i--) {
            const r = Math.floor(random() * (i + 1));
            [p[i], p[r]] = [p[r], p[i]];
        }
        for(let i=0; i<512; i++) this.p[i] = p[i & 255];
    }
    fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
    lerp(t: number, a: number, b: number) { return a + t * (b - a); }
    grad(hash: number, x: number, y: number, z: number) {
        const h = hash & 15;
        const u = h < 8 ? x : y, v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }
    noise(x: number, y: number, z: number) {
        const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
        x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
        const u = this.fade(x), v = this.fade(y), w = this.fade(z);
        const p = this.p;
        const A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z, B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;
        return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(p[AA], x, y, z), this.grad(p[BA], x - 1, y, z)),
            this.lerp(u, this.grad(p[AB], x, y - 1, z), this.grad(p[BB], x - 1, y - 1, z))),
            this.lerp(v, this.lerp(u, this.grad(p[AA + 1], x, y, z - 1), this.grad(p[BA + 1], x - 1, y, z - 1)),
            this.lerp(u, this.grad(p[AB + 1], x, y - 1, z - 1), this.grad(p[BB + 1], x - 1, y - 1, z - 1))));
    }
}

// --- CHUNK CLASS ---
class Chunk {
    public mesh: THREE.Mesh | null = null;
    public data: Map<string, string> = new Map(); // "x,y,z" -> type
    public isDirty = true;
    public cx: number;
    public cz: number;

    constructor(cx: number, cz: number) {
        this.cx = cx;
        this.cz = cz;
    }

    setBlock(x: number, y: number, z: number, type: string) {
        const key = `${x},${y},${z}`;
        if (type === 'air') this.data.delete(key);
        else this.data.set(key, type);
        this.isDirty = true;
    }

    getBlock(x: number, y: number, z: number): string | undefined {
        return this.data.get(`${x},${y},${z}`);
    }
}

export class VoxelEngine {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private raycaster: THREE.Raycaster;
    
    // Chunk Management
    private chunks: Map<string, Chunk> = new Map();
    private activeChunkIds: Set<string> = new Set();
    
    // Physics
    private velocity = new THREE.Vector3();
    private moveState = { fwd: false, bwd: false, left: false, right: false };
    private canJump = false;
    private onGround = false;
    private prevTime = performance.now();
    
    public isRunning = false;
    public isPaused = false;
    public sensitivity = 0.002;

    private container: HTMLElement;
    private worldPath: string;
    private updateHUD: (x: number, y: number, z: number) => void;
    
    private perlin: Perlin;
    private worldType: 'default' | 'superflat';
    private matOpaque: THREE.MeshStandardMaterial;
    private matTrans: THREE.MeshStandardMaterial;

    constructor(
        container: HTMLElement, 
        worldPath: string, 
        updateHUD: (x:number, y:number, z:number) => void,
        settings: { seed: number, type: 'default' | 'superflat' }
    ) {
        this.container = container;
        this.worldPath = worldPath;
        this.updateHUD = updateHUD;
        this.worldType = settings.type;
        this.perlin = new Perlin(settings.seed);

        // Setup Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.Fog(0x87CEEB, 50, 400); // Occlusion approximation

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 80, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(this.renderer.domElement);

        // Shared Materials (Vertex Colors)
        this.matOpaque = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8 });
        this.matTrans = new THREE.MeshStandardMaterial({ vertexColors: true, transparent: true, opacity: 0.7, roughness: 0.1 });

        this.setupLights();
        this.raycaster = new THREE.Raycaster();

        // Initial Generation
        this.updateChunks();

        // Listeners
        window.addEventListener('resize', this.onResize);
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
        document.body.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mousedown', this.onMouseDown);

        this.connectToFirebase();
        this.animate();
    }

    private setupLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambient);
        const sun = new THREE.DirectionalLight(0xffffff, 0.8);
        sun.position.set(50, 200, 100);
        this.scene.add(sun);
    }

    // --- CHUNK LOGIC ---

    private getChunkKey(cx: number, cz: number) { return `${cx},${cz}`; }

    private updateChunks() {
        const playerCX = Math.floor(this.camera.position.x / (CHUNK_SIZE * BLOCK_SIZE));
        const playerCZ = Math.floor(this.camera.position.z / (CHUNK_SIZE * BLOCK_SIZE));

        const neededChunks = new Set<string>();

        // 1. Identify needed chunks
        for (let x = -RENDER_DISTANCE; x <= RENDER_DISTANCE; x++) {
            for (let z = -RENDER_DISTANCE; z <= RENDER_DISTANCE; z++) {
                neededChunks.add(this.getChunkKey(playerCX + x, playerCZ + z));
            }
        }

        // 2. Remove far chunks
        for (const [key, chunk] of this.chunks) {
            if (!neededChunks.has(key)) {
                if (chunk.mesh) {
                    this.scene.remove(chunk.mesh);
                    chunk.mesh.geometry.dispose();
                }
                this.chunks.delete(key);
            }
        }

        // 3. Create/Gen new chunks
        neededChunks.forEach(key => {
            if (!this.chunks.has(key)) {
                const [cx, cz] = key.split(',').map(Number);
                const chunk = new Chunk(cx, cz);
                this.generateChunkData(chunk);
                this.chunks.set(key, chunk);
            }
        });

        // 4. Re-mesh dirty chunks (Max 2 per frame to prevent stutter)
        let updates = 0;
        for (const chunk of this.chunks.values()) {
            if (chunk.isDirty && updates < 2) {
                this.buildChunkMesh(chunk);
                updates++;
            }
        }
    }

    private generateChunkData(chunk: Chunk) {
        const startX = chunk.cx * CHUNK_SIZE;
        const startZ = chunk.cz * CHUNK_SIZE;

        for (let x = 0; x < CHUNK_SIZE; x++) {
            for (let z = 0; z < CHUNK_SIZE; z++) {
                const wx = startX + x;
                const wz = startZ + z;

                let h = 0;
                if (this.worldType === 'superflat') {
                    chunk.setBlock(x, 0, z, 'grass');
                    chunk.setBlock(x, -1, z, 'dirt');
                    chunk.setBlock(x, -2, z, 'dirt');
                    chunk.setBlock(x, -3, z, 'obsidian');
                } else {
                    // Simplex-like Noise
                    const n = this.perlin.noise(wx * 0.01, 0, wz * 0.01);
                    h = Math.floor(n * 20); // Height variation
                    
                    chunk.setBlock(x, h, z, 'grass');
                    for (let d = 1; d <= 3; d++) chunk.setBlock(x, h - d, z, 'dirt');
                    chunk.setBlock(x, h - 4, z, 'stone');

                    // Simple Tree
                    if (Math.random() < 0.01 && x > 2 && x < 13 && z > 2 && z < 13) {
                        const th = 4;
                        for(let i=1; i<=th; i++) chunk.setBlock(x, h+i, z, 'wood');
                        for(let lx=-1; lx<=1; lx++) 
                            for(let lz=-1; lz<=1; lz++) 
                                for(let ly=0; ly<=1; ly++) 
                                    if(lx!==0||lz!==0||ly!==0) chunk.setBlock(x+lx, h+th+ly-1, z+lz, 'leaves');
                        chunk.setBlock(x, h+th+1, z, 'leaves');
                    }
                }
            }
        }
    }

    private buildChunkMesh(chunk: Chunk) {
        if (chunk.mesh) {
            this.scene.remove(chunk.mesh);
            chunk.mesh.geometry.dispose();
            chunk.mesh = null;
        }

        const vertices: number[] = [];
        const colors: number[] = [];
        const normals: number[] = [];
        const indices: number[] = [];
        
        let vertCount = 0;

        // Neighbor check helper (local coords)
        const isSolid = (x: number, y: number, z: number) => {
            return chunk.getBlock(x, y, z) !== undefined && chunk.getBlock(x, y, z) !== 'water' && chunk.getBlock(x, y, z) !== 'leaves';
        };

        chunk.data.forEach((type, key) => {
            const [x, y, z] = key.split(',').map(Number);
            const wx = x * BLOCK_SIZE + chunk.cx * CHUNK_SIZE * BLOCK_SIZE;
            const wy = y * BLOCK_SIZE;
            const wz = z * BLOCK_SIZE + chunk.cz * CHUNK_SIZE * BLOCK_SIZE;
            
            const col = COLORS[type] || COLORS.dirt;
            const s = BLOCK_SIZE / 2;

            // Face generation data
            const faces = [
                { // Right (+x)
                    dir: [1, 0, 0], 
                    pos: [ [s, -s, s], [s, -s, -s], [s, s, -s], [s, s, s] ],
                    check: [x+1, y, z]
                },
                { // Left (-x)
                    dir: [-1, 0, 0], 
                    pos: [ [-s, -s, -s], [-s, -s, s], [-s, s, s], [-s, s, -s] ],
                    check: [x-1, y, z]
                },
                { // Top (+y)
                    dir: [0, 1, 0], 
                    pos: [ [-s, s, s], [s, s, s], [s, s, -s], [-s, s, -s] ],
                    check: [x, y+1, z]
                },
                { // Bottom (-y)
                    dir: [0, -1, 0], 
                    pos: [ [-s, -s, -s], [s, -s, -s], [s, -s, s], [-s, -s, s] ],
                    check: [x, y-1, z]
                },
                { // Front (+z)
                    dir: [0, 0, 1], 
                    pos: [ [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s] ],
                    check: [x, y, z+1]
                },
                { // Back (-z)
                    dir: [0, 0, -1], 
                    pos: [ [s, -s, -s], [-s, -s, -s], [-s, s, -s], [s, s, -s] ],
                    check: [x, y, z-1]
                }
            ];

            for (const face of faces) {
                // Face Culling: If neighbor exists and is solid, don't draw
                // Note: Only culling internal chunk faces for simplicity. 
                // Cross-chunk culling requires accessing neighbor chunks (possible optimization).
                if (isSolid(face.check[0], face.check[1], face.check[2])) continue;

                // Push Vertices
                for (const v of face.pos) {
                    vertices.push(wx + v[0], wy + v[1], wz + v[2]);
                    colors.push(col.r, col.g, col.b);
                    normals.push(face.dir[0], face.dir[1], face.dir[2]);
                }

                // Push Indices (2 triangles)
                const a = vertCount, b = vertCount + 1, c = vertCount + 2, d = vertCount + 3;
                indices.push(a, b, c, a, c, d);
                vertCount += 4;
            }
        });

        if (vertices.length === 0) return;

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setIndex(indices);

        // Separate material based on content? (Simplified: everything uses opaque mat for perf, water uses transparent if we split meshes)
        // For absolute speed: 1 mesh per chunk.
        chunk.mesh = new THREE.Mesh(geometry, this.matOpaque);
        this.scene.add(chunk.mesh);
        chunk.isDirty = false;
    }

    // --- INTERACTION ---

    private connectToFirebase() {
        const q = collection(db, `${this.worldPath}/blocks`);
        onSnapshot(q, (snap) => {
            snap.docChanges().forEach(change => {
                const d = change.doc.data();
                // Map global coords to chunk coords
                const x = d.x / BLOCK_SIZE;
                const y = d.y / BLOCK_SIZE;
                const z = d.z / BLOCK_SIZE;
                
                const cx = Math.floor(x / CHUNK_SIZE);
                const cz = Math.floor(z / CHUNK_SIZE);
                const lx = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
                const lz = ((z % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;

                const key = this.getChunkKey(cx, cz);
                let chunk = this.chunks.get(key);
                
                // If chunk exists in memory, update it
                if (chunk) {
                    if (change.type === 'removed') {
                        // Reverting to natural state not supported in this simplified version
                    } else {
                        chunk.setBlock(lx, y, lz, d.type);
                    }
                }
            });
        });
    }

    // --- LOOP ---

    private animate = () => {
        if (!this.renderer) return; 
        requestAnimationFrame(this.animate);

        if (this.isRunning && !this.isPaused) {
            const time = performance.now();
            const delta = Math.min((time - this.prevTime) / 1000, 0.1);
            
            this.physics(delta);
            this.updateChunks(); // Dynamic Loading
            
            this.prevTime = time;
            this.updateHUD(Math.round(this.camera.position.x), Math.round(this.camera.position.y), Math.round(this.camera.position.z));
        } else {
            this.prevTime = performance.now();
        }
        this.renderer.render(this.scene, this.camera);
    };

    private physics(delta: number) {
        // Simplified Physics
        this.velocity.x *= 0.9;
        this.velocity.z *= 0.9;
        this.velocity.y -= 400 * delta;

        const direction = new THREE.Vector3();
        direction.set(Number(this.moveState.right) - Number(this.moveState.left), 0, Number(this.moveState.bwd) - Number(this.moveState.fwd));
        direction.normalize();

        const camDir = new THREE.Vector3();
        this.camera.getWorldDirection(camDir); camDir.y = 0; camDir.normalize();
        const camRight = new THREE.Vector3();
        camRight.crossVectors(camDir, this.camera.up).normalize();

        if (direction.length() > 0) {
            const moveVec = new THREE.Vector3().addScaledVector(camDir, -direction.z).addScaledVector(camRight, direction.x);
            const speed = this.onGround ? 1500 : 500;
            this.velocity.addScaledVector(moveVec, speed * delta);
        }

        // Apply
        this.camera.position.x += this.velocity.x * delta;
        this.checkCol('x');
        this.camera.position.z += this.velocity.z * delta;
        this.checkCol('z');
        this.onGround = false;
        this.camera.position.y += this.velocity.y * delta;
        this.checkCol('y');

        if(this.camera.position.y < -200) this.camera.position.set(0,100,0);
    }

    private checkCol(axis: 'x' | 'y' | 'z') {
        // Raycast-based collision for chunk meshes is tricky.
        // BoundingBox check against virtual block map is faster.
        const r = 3; 
        const minX = Math.floor((this.camera.position.x - r) / BLOCK_SIZE);
        const maxX = Math.floor((this.camera.position.x + r) / BLOCK_SIZE);
        const minY = Math.floor((this.camera.position.y - 18) / BLOCK_SIZE); // feet
        const maxY = Math.floor((this.camera.position.y + 2) / BLOCK_SIZE); // head
        const minZ = Math.floor((this.camera.position.z - r) / BLOCK_SIZE);
        const maxZ = Math.floor((this.camera.position.z + r) / BLOCK_SIZE);

        for(let x=minX; x<=maxX; x++) {
            for(let y=minY; y<=maxY; y++) {
                for(let z=minZ; z<=maxZ; z++) {
                    const cx = Math.floor(x / CHUNK_SIZE);
                    const cz = Math.floor(z / CHUNK_SIZE);
                    const lx = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
                    const lz = ((z % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
                    
                    const chunk = this.chunks.get(this.getChunkKey(cx, cz));
                    if(chunk && chunk.getBlock(lx, y, lz)) {
                        // Collision detected
                        if(axis === 'y') {
                            if(this.velocity.y < 0) { this.onGround = true; this.canJump = true; }
                            this.velocity.y = 0;
                            // Snap out
                            this.camera.position.y = Math.round(this.camera.position.y); 
                        } else {
                            this.velocity[axis] = 0;
                            this.camera.position[axis] = Math.round(this.camera.position[axis]);
                        }
                        return;
                    }
                }
            }
        }
    }

    // --- EVENTS ---
    private onKeyDown = (e: KeyboardEvent) => {
        switch (e.code) {
            case 'KeyW': this.moveState.fwd = true; break;
            case 'KeyS': this.moveState.bwd = true; break;
            case 'KeyA': this.moveState.left = true; break;
            case 'KeyD': this.moveState.right = true; break;
            case 'Space': if (this.canJump) { this.velocity.y = 130; this.canJump = false; } break;
        }
    }
    private onKeyUp = (e: KeyboardEvent) => {
        switch (e.code) {
            case 'KeyW': this.moveState.fwd = false; break;
            case 'KeyS': this.moveState.bwd = false; break;
            case 'KeyA': this.moveState.left = false; break;
            case 'KeyD': this.moveState.right = false; break;
        }
    }
    private onMouseMove = (e: MouseEvent) => {
        if (!this.isRunning || this.isPaused) return;
        const euler = new THREE.Euler(0, 0, 0, 'YXZ');
        euler.setFromQuaternion(this.camera.quaternion);
        euler.y -= e.movementX * this.sensitivity;
        euler.x -= e.movementY * this.sensitivity;
        euler.x = Math.max(-1.5, Math.min(1.5, euler.x));
        this.camera.quaternion.setFromEuler(euler);
    }
    private onMouseDown = (e: MouseEvent) => {
        if (!this.isRunning || this.isPaused) return;
        this.raycaster.setFromCamera(new THREE.Vector2(0,0), this.camera);
        // Intersect against chunk meshes
        const meshes = Array.from(this.chunks.values()).map(c => c.mesh).filter((m): m is THREE.Mesh => m !== null);
        const hits = this.raycaster.intersectObjects(meshes);
        if(hits.length === 0 || hits[0].distance > 60) return;

        const p = hits[0].point;
        const n = hits[0].face!.normal;
        
        // Calculate block coord
        const hitX = Math.floor((p.x - n.x * 0.1) / BLOCK_SIZE);
        const hitY = Math.floor((p.y - n.y * 0.1) / BLOCK_SIZE);
        const hitZ = Math.floor((p.z - n.z * 0.1) / BLOCK_SIZE);

        if(e.button === 0) { // Break
            this.modifyBlock(hitX, hitY, hitZ, 'air');
        } else if(e.button === 2) { // Place
            const placeX = Math.floor((p.x + n.x * 0.1) / BLOCK_SIZE);
            const placeY = Math.floor((p.y + n.y * 0.1) / BLOCK_SIZE);
            const placeZ = Math.floor((p.z + n.z * 0.1) / BLOCK_SIZE);
            
            // Player collision check
            const px = this.camera.position.x / BLOCK_SIZE;
            const pz = this.camera.position.z / BLOCK_SIZE;
            if(Math.abs(placeX - px) < 1 && Math.abs(placeZ - pz) < 1 && placeY < (this.camera.position.y/BLOCK_SIZE)+1 && placeY > (this.camera.position.y/BLOCK_SIZE)-2) return;

            const selectedBlock = (window as any).__SELECTED_BLOCK__ || 'grass';
            this.modifyBlock(placeX, placeY, placeZ, selectedBlock);
        }
    }

    private modifyBlock(x: number, y: number, z: number, type: string) {
        // Save to DB
        const bid = `${x*BLOCK_SIZE}_${y*BLOCK_SIZE}_${z*BLOCK_SIZE}`;
        setDoc(doc(db, `${this.worldPath}/blocks`, bid), { 
            x: x*BLOCK_SIZE, y: y*BLOCK_SIZE, z: z*BLOCK_SIZE, type 
        });

        // Update local chunk immediately for responsiveness
        const cx = Math.floor(x / CHUNK_SIZE);
        const cz = Math.floor(z / CHUNK_SIZE);
        const lx = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
        const lz = ((z % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;

        const key = this.getChunkKey(cx, cz);
        const chunk = this.chunks.get(key);
        if(chunk) {
            chunk.setBlock(lx, y, lz, type);
            // Also update neighbor chunks if on border? (Skipped for brevity)
        }
    }

    private onResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public setSensitivity(val: number) { this.sensitivity = val; }

    public dispose() {
        // Cleanup
        this.chunks.forEach(c => {
            if(c.mesh) { this.scene.remove(c.mesh); c.mesh.geometry.dispose(); }
        });
        window.removeEventListener('resize', this.onResize);
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
        document.body.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mousedown', this.onMouseDown);
        if(this.renderer.domElement.parentNode) this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        this.renderer.dispose();
    }
}