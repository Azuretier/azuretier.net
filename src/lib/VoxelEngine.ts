import * as THREE from 'three';
import { db } from './firebase';
import { doc, setDoc, deleteDoc, onSnapshot, collection } from 'firebase/firestore';

export type BlockType = 'grass' | 'dirt' | 'stone' | 'wood' | 'brick' | 'leaves' | 'water' | 'obsidian' | 'sand';

const BLOCK_SIZE = 10;
const COLORS: Record<string, number> = {
    grass: 0x567d46, dirt: 0x5d4037, stone: 0x757575,
    wood: 0x4e342e, brick: 0x8d6e63, leaves: 0x2e7d32,
    water: 0x40a4df, obsidian: 0x121212, sand: 0xc2b280
};

export class VoxelEngine {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private raycaster: THREE.Raycaster;
    
    private objects: THREE.Object3D[] = [];
    private blockMeshes: Map<string, THREE.Mesh> = new Map();
    private unsubscribeWorld: (() => void) | null = null;
    
    private velocity = new THREE.Vector3();
    private moveState = { fwd: false, bwd: false, left: false, right: false };
    private canJump = false;
    private onGround = false;
    private prevTime = performance.now();
    
    public isRunning = false;
    public isPaused = false;
    
    private container: HTMLElement;
    private worldPath: string;
    private updateHUD: (x: number, y: number, z: number) => void;

    constructor(container: HTMLElement, worldPath: string, updateHUD: (x:number, y:number, z:number) => void) {
        this.container = container;
        this.worldPath = worldPath;
        this.updateHUD = updateHUD;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.Fog(0x87CEEB, 20, 400);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 50, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);

        this.setupLights();
        this.raycaster = new THREE.Raycaster();

        // Bind events
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
        sun.position.set(50, 100, 50);
        this.scene.add(sun);
    }

    private connectToFirebase() {
        const q = collection(db, `${this.worldPath}/blocks`);
        this.unsubscribeWorld = onSnapshot(q, (snap) => {
            snap.docChanges().forEach(change => {
                const d = change.doc.data();
                const key = `${d.x}_${d.y}_${d.z}`;
                if (change.type === 'removed') {
                    const m = this.blockMeshes.get(key);
                    if (m) {
                        this.scene.remove(m);
                        this.objects.splice(this.objects.indexOf(m), 1);
                        this.blockMeshes.delete(key);
                    }
                } else {
                    if (!this.blockMeshes.has(key)) {
                        const mat = new THREE.MeshLambertMaterial({ 
                            color: COLORS[d.type] || COLORS.dirt,
                            transparent: d.type === 'water' || d.type === 'leaves',
                            opacity: d.type === 'water' ? 0.6 : 1.0
                        });
                        const mesh = new THREE.Mesh(new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE), mat);
                        mesh.position.set(d.x, d.y, d.z);
                        mesh.userData = { id: change.doc.id };
                        this.scene.add(mesh);
                        this.objects.push(mesh);
                        this.blockMeshes.set(key, mesh);
                    }
                }
            });
        });
    }

    private animate = () => {
        if (!this.renderer) return; // Disposed
        requestAnimationFrame(this.animate);

        if (this.isRunning && !this.isPaused) {
            const time = performance.now();
            const delta = Math.min((time - this.prevTime) / 1000, 0.1);
            this.physics(delta);
            this.prevTime = time;
            this.updateHUD(Math.round(this.camera.position.x), Math.round(this.camera.position.y), Math.round(this.camera.position.z));
        } else {
            this.prevTime = performance.now();
        }
        this.renderer.render(this.scene, this.camera);
    };

    private physics(delta: number) {
        const damping = Math.exp(-(this.onGround ? 10.0 : 2.0) * delta);
        this.velocity.x *= damping;
        this.velocity.z *= damping;
        this.velocity.y -= 500 * delta;

        const direction = new THREE.Vector3();
        direction.set(Number(this.moveState.right) - Number(this.moveState.left), 0, Number(this.moveState.bwd) - Number(this.moveState.fwd));
        direction.normalize();

        if (this.moveState.fwd || this.moveState.bwd || this.moveState.left || this.moveState.right) {
            const camDir = new THREE.Vector3();
            this.camera.getWorldDirection(camDir); camDir.y = 0; camDir.normalize();
            const camRight = new THREE.Vector3();
            camRight.crossVectors(camDir, this.camera.up).normalize();
            const moveVec = new THREE.Vector3().addScaledVector(camDir, -direction.z).addScaledVector(camRight, direction.x);
            moveVec.normalize();
            const speed = this.onGround ? 2000 : 500;
            this.velocity.addScaledVector(moveVec, speed * delta);
        }

        this.camera.position.x += this.velocity.x * delta;
        if (this.checkCollide()) { this.camera.position.x -= this.velocity.x * delta; this.velocity.x = 0; }

        this.camera.position.z += this.velocity.z * delta;
        if (this.checkCollide()) { this.camera.position.z -= this.velocity.z * delta; this.velocity.z = 0; }

        this.onGround = false;
        this.camera.position.y += this.velocity.y * delta;
        if (this.checkCollide()) {
            this.camera.position.y -= this.velocity.y * delta;
            if (this.velocity.y < 0) { this.onGround = true; this.canJump = true; }
            this.velocity.y = 0;
        }

        if (this.camera.position.y < -100) {
            this.velocity.set(0, 0, 0);
            this.camera.position.set(0, 100, 0);
        }
    }

    private checkCollide() {
        const playerR = 3;
        const headY = this.camera.position.y;
        const footY = this.camera.position.y - 18;

        for (const o of this.objects) {
            if (Math.abs(o.position.x - this.camera.position.x) > 15) continue;
            if (Math.abs(o.position.z - this.camera.position.z) > 15) continue;
            if (Math.abs(o.position.y - this.camera.position.y) > 25) continue;

            const bMinX = o.position.x - 5, bMaxX = o.position.x + 5;
            const bMinY = o.position.y - 5, bMaxY = o.position.y + 5;
            const bMinZ = o.position.z - 5, bMaxZ = o.position.z + 5;

            const pMinX = this.camera.position.x - playerR, pMaxX = this.camera.position.x + playerR;
            const pMinZ = this.camera.position.z - playerR, pMaxZ = this.camera.position.z + playerR;

            if (pMinX < bMaxX && pMaxX > bMinX && footY < bMaxY && headY > bMinY && pMinZ < bMaxZ && pMaxZ > bMinZ) {
                return true;
            }
        }
        return false;
    }

    // --- Input Handlers ---
    private onKeyDown = (e: KeyboardEvent) => {
        if (!this.isRunning) return;
        switch (e.code) {
            case 'KeyW': this.moveState.fwd = true; break;
            case 'KeyS': this.moveState.bwd = true; break;
            case 'KeyA': this.moveState.left = true; break;
            case 'KeyD': this.moveState.right = true; break;
            case 'Space': if (this.canJump) { this.velocity.y = 150; this.canJump = false; } break;
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
        // Access a global or static sensitivity if needed, or pass it in
        const sensitivity = 0.002; 
        const euler = new THREE.Euler(0, 0, 0, 'YXZ');
        euler.setFromQuaternion(this.camera.quaternion);
        euler.y -= e.movementX * sensitivity;
        euler.x -= e.movementY * sensitivity;
        euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
        this.camera.quaternion.setFromEuler(euler);
    }

    private onMouseDown = (e: MouseEvent) => {
        if (!this.isRunning || this.isPaused) return;
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        const hits = this.raycaster.intersectObjects(this.objects);
        if (hits.length === 0 || hits[0].distance > 60) return;

        const hit = hits[0];
        const pos = hit.object.position;

        if (e.button === 0) { // Break
            if (hit.object.userData.id) {
                deleteDoc(doc(db, `${this.worldPath}/blocks`, hit.object.userData.id));
            }
        } else if (e.button === 2) { // Place
            const n = hit.face!.normal;
            const bx = pos.x + n.x * BLOCK_SIZE;
            const by = pos.y + n.y * BLOCK_SIZE;
            const bz = pos.z + n.z * BLOCK_SIZE;

            if (Math.abs(bx - this.camera.position.x) < 5 && Math.abs(bz - this.camera.position.z) < 5 && by > this.camera.position.y - 20 && by < this.camera.position.y + 5) return;

            const newKey = `${bx}_${by}_${bz}`;
            const selectedBlock = (window as any).__SELECTED_BLOCK__ || 'grass'; // Quick hack for bridge
            setDoc(doc(db, `${this.worldPath}/blocks`, newKey), {
                x: bx, y: by, z: bz, type: selectedBlock
            });
        }
    }

    private onResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public dispose() {
        if (this.unsubscribeWorld) this.unsubscribeWorld();
        window.removeEventListener('resize', this.onResize);
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
        document.body.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mousedown', this.onMouseDown);
        this.container.removeChild(this.renderer.domElement);
        this.renderer.dispose();
    }
}