// Movement Variables
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let speed = 0.1;
let sprinting = false;
const normalSpeed = 0.1;
const sprintSpeed = 0.2; // Faster speed when sprinting

// Camera Movement
let yaw = 0, pitch = 0;
const euler = new THREE.Euler(0, 0, 0, 'YXZ');

// Jump Variables
let isJumping = false;
let velocityY = 0;
const gravity = -0.005;
const jumpStrength = 0.15;
const groundLevel = 2; // Player should stay at y = 2 when on the ground

// Handle Key Press (Movement, Sprint, Jump)
document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyW') moveForward = true;
    if (event.code === 'KeyS') moveBackward = true;
    if (event.code === 'KeyA') moveLeft = true;
    if (event.code === 'KeyD') moveRight = true;
    if (event.code === 'ShiftLeft') {
        sprinting = true;
        speed = sprintSpeed;
    }
    if (event.code === 'Space' && !isJumping) {
        isJumping = true;
        velocityY = jumpStrength; // Apply jump force
    }
});

// Handle Key Release (Stopping Movement, Sprint)
document.addEventListener('keyup', (event) => {
    if (event.code === 'KeyW') moveForward = false;
    if (event.code === 'KeyS') moveBackward = false;
    if (event.code === 'KeyA') moveLeft = false;
    if (event.code === 'KeyD') moveRight = false;
    if (event.code === 'ShiftLeft') {
        sprinting = false;
        speed = normalSpeed;
    }
});

// Handle Mouse Movement (Look Around)
document.addEventListener('mousemove', (event) => {
    yaw -= event.movementX * 0.002;
    pitch -= event.movementY * 0.002;
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
    euler.set(pitch, yaw, 0);
    camera.quaternion.setFromEuler(euler);
});

// Lock Mouse to Screen on Click
document.addEventListener('click', () => {
    document.body.requestPointerLock();
});

// Update Camera Position (Called in Animate Loop)
function updatePlayerMovement() {
    let direction = new THREE.Vector3();
    if (moveForward) direction.z -= speed;
    if (moveBackward) direction.z += speed;
    if (moveLeft) direction.x -= speed;
    if (moveRight) direction.x += speed;

    direction.applyQuaternion(camera.quaternion);
    direction.y = 0; // Prevent floating
    camera.position.add(direction);

    // Apply Gravity and Jump Logic
    if (isJumping) {
        velocityY += gravity; // Apply gravity
        camera.position.y += velocityY; // Move camera

        // Check if player hits the ground
        if (camera.position.y <= groundLevel) {
            camera.position.y = groundLevel;
            isJumping = false;
            velocityY = 0;
        }
    } else {
        camera.position.y = groundLevel; // Ensure player stays on ground when not jumping
    }
}
