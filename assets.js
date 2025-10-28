// Function to dynamically fit a skeleton inside an object
function addSkeletonToObject(object) {
    // Compute bounding box
    const bbox = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    bbox.getSize(size);

    const skeleton = {
        head: {
            position: new THREE.Vector3(0, size.y * 0.85, 0),
            rotation: new THREE.Euler(0, 0, 0)
        },
        leftArm: {
            position: new THREE.Vector3(-size.x * 0.4, size.y * 0.6, 0),
            rotation: new THREE.Euler(0, 0, Math.PI / 4)
        },
        rightArm: {
            position: new THREE.Vector3(size.x * 0.4, size.y * 0.6, 0),
            rotation: new THREE.Euler(0, 0, -Math.PI / 4)
        },
        leftLeg: {
            position: new THREE.Vector3(-size.x * 0.2, size.y * 0.15, 0),
            rotation: new THREE.Euler(0, 0, 0)
        },
        rightLeg: {
            position: new THREE.Vector3(size.x * 0.2, size.y * 0.15, 0),
            rotation: new THREE.Euler(0, 0, 0)
        }
    };

    object.userData.skeleton = skeleton;
}

// Apply the skeleton dynamically to all objects in the scene
function applySkeletonToAll(scene) {
    scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Group) {
            addSkeletonToObject(object);
        }
    });
}

// Example Usage (apply to the entire scene)
applySkeletonToAll(scene);

// Function to create a tree
function createTree(position) {
    // Create trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.copy(position);
    trunk.position.y += 1;

    // Create leaves
    const leavesGeometry = new THREE.ConeGeometry(1, 4, 8);
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.copy(position);
    leaves.position.y += 2;

    // Create tree group
    const tree = new THREE.Group();
    tree.add(trunk);
    tree.add(leaves);

    // Define interactability data once and apply to all parts
    const interactData = { interactability: true};

    tree.userData = interactData;
    trunk.userData = interactData;
    leaves.userData = interactData;

    return tree;
}



// Function to create a rock
function createRock(position) {
    const geometry = new THREE.DodecahedronGeometry(1);//creates geometry
    const material = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Gray rock
    const rock = new THREE.Mesh(geometry, material);//add gemoetry and material togehter
    rock.position.copy(position);

	   const interactData = { interactability: true};

    rock.userData = interactData;

    return rock;



}

// Function to create a building
function createBuilding(position) {
    const baseGeometry = new THREE.BoxGeometry(3, 10, 3); // Base dimensions
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(0, 5, 0); // ✅ Centered at (0,0,0) in the group

    const midGeometry = new THREE.BoxGeometry(2.5, 6, 2.5);
    const mid = new THREE.Mesh(midGeometry, baseMaterial);
    mid.position.set(0, 8, 0); // ✅ Relative to base

    const topGeometry = new THREE.BoxGeometry(2, 4, 2);
    const top = new THREE.Mesh(topGeometry, baseMaterial);
    top.position.set(0, 13, 0); // ✅ Relative to mid

    const spireGeometry = new THREE.CylinderGeometry(0.2, 0.5, 3, 8);
    const spireMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const spire = new THREE.Mesh(spireGeometry, spireMaterial);
    spire.position.set(0, 17, 0); // ✅ Relative to top

    // ✅ Group everything together
    const building = new THREE.Group();
    building.add(base);
    building.add(mid);
    building.add(top);
    building.add(spire);

	// Create bounding box
    const bbox = new THREE.Box3().setFromObject(building);
    building.userData.boundingBox = bbox; // Store bounding box in userData

    // ✅ Move the entire group instead of individual parts
    building.position.copy(position);

    return building;
}


// Function to create a house
function createHouse(position) {
    const baseWallGeometry = new THREE.BoxGeometry(4, 3, 4);
    const baseRoofGeometry = new THREE.ConeGeometry(3, 2, 4);
    const baseDoorGeometry = new THREE.BoxGeometry(1, 1.8, 0.1);

    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xb5651d });
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });

    const houseGroup = new THREE.Group();

    const walls = new THREE.Mesh(baseWallGeometry, wallMaterial);
    walls.position.set(0, 1.5, 0);
    houseGroup.add(walls);

    const roof = new THREE.Mesh(baseRoofGeometry, roofMaterial);
    roof.position.set(0, 4, 0);
    roof.rotation.y = Math.PI / 4;
    houseGroup.add(roof);

    const door = new THREE.Mesh(baseDoorGeometry, doorMaterial);
    door.position.set(0, 0.9, 2.01);
    houseGroup.add(door);

    houseGroup.position.copy(position);
    return houseGroup;
}

// Function to create a lake
function createLake(position) {
    const LakeGeometry = new THREE.BoxGeometry(6, 0.1, 12); // Thin box for water surface
    const LakeMaterial = new THREE.MeshStandardMaterial({ color: 0x0000FF }); // Correct color syntax

    const Lake = new THREE.Mesh(LakeGeometry, LakeMaterial); // Create mesh
    Lake.position.copy(position);
    Lake.position.y += 0.05; // Slightly raise to prevent z-fighting

    return Lake; // Return the correctly created lake
}

// Function to create a road
function createRoad(position) {
    const roadGeometry = new THREE.BoxGeometry(6, 0.1, 12); // Road dimensions
    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x2F2F2F }); // Asphalt color
    const road = new THREE.Mesh(roadGeometry, roadMaterial);

    road.position.y = 0.05; // Slightly raised above the ground

    // ✅ Create lane markings as a child of the road
    const markings = new THREE.Group();
    const lineMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });

    for (let i = -4; i <= 4; i += 2) {
        const lineGeometry = new THREE.BoxGeometry(0.2, 0.05, 1);
        const line = new THREE.Mesh(lineGeometry, lineMaterial);

        // ✅ Positioning relative to road, NOT world coordinates
        line.position.set(0, 0.1, i);
        markings.add(line);
    }

    // ✅ Group the road and markings correctly
    const roadGroup = new THREE.Group();
    roadGroup.add(road);
    roadGroup.add(markings);

    // ✅ Move the entire group to the correct position
    roadGroup.position.copy(position);

    // ✅ Rotate the road **90 degrees**
    roadGroup.rotation.y = Math.PI / 2;

    return roadGroup;
}



// Function to create a cube
function createCube(position) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.copy(position);
    return cube;
}

//Function to Create a car
function createCar(position) {
    const carGroup = new THREE.Group();


    // 🚗 Car Body
    const bodyGeometry = new THREE.BoxGeometry(2.5, 1, 5);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red body
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 0.6, 0); // Center body in group
    carGroup.add(body);

    // 🚕 Roof
    const roofGeometry = new THREE.BoxGeometry(1.8, 0.6, 2.5);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa }); // Grayish roof
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 1.2, 0);
    carGroup.add(roof);

    // 🚙 Wheels (Front & Rear)
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 12);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

    const wheelPositions = [
        [-1.2, -0.2, 2], [1.2, -0.2, 2], // Front Wheels
        [-1.2, -0.2, -2], [1.2, -0.2, -2] // Rear Wheels
    ];

    wheelPositions.forEach(([x, y, z]) => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2; // Rotate to align properly
        wheel.position.set(x, y, z);
        carGroup.add(wheel);

    });

    // 🚘 Windows (Front & Rear)
    const windowGeometry = new THREE.BoxGeometry(1.8, 0.6, 0.1);
    const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x00aaff, transparent: true, opacity: 0.6 });

    const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    frontWindow.position.set(0, 1.2, 1.3);
    carGroup.add(frontWindow);

    const backWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    backWindow.position.set(0, 1.2, -1.3);
    carGroup.add(backWindow);

	   const interactData = { interactability: true};
	   body.userData = interactData;
    // 📌 Move entire car group to the given position
    carGroup.position.copy(position);




    return carGroup;
}

function createAirplane(position) {
    const airplane = new THREE.Group(); // Group all airplane parts together

    // ✈️ **Fuselage (Main Body)**
    const fuselageGeometry = new THREE.CylinderGeometry(0.5, 0.5, 6, 16);
    const fuselageMaterial = new THREE.MeshStandardMaterial({ color: 0xCCCCCC });
    const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
    fuselage.rotation.z = Math.PI / 2; // Rotate to make it horizontal
    airplane.add(fuselage);

    // 🛩️ **Cockpit (Front of Plane)**
    const cockpitGeometry = new THREE.SphereGeometry(0.7, 16, 16);
    const cockpitMaterial = new THREE.MeshStandardMaterial({ color: 0xAAAAAA });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.position.set(3, 0, 0); // Move it to the front of the fuselage
    airplane.add(cockpit);

    // 🌍 **Left Wing**
    const wingGeometry = new THREE.BoxGeometry(5, 0.2, 2); // Large wing
    const wingMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });

    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(0, 0, -2); // Move to the left
    leftWing.rotation.y = Math.PI / 2; // Rotate 90 degrees
    airplane.add(leftWing);

    // 🌍 **Right Wing**
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0, 0, 2); // Move to the right
    rightWing.rotation.y = Math.PI / 2; // Rotate 90 degrees
    airplane.add(rightWing);

    // 🏁 **Tail Wing**
    const tailGeometry = new THREE.BoxGeometry(2, 0.2, 1);
    const tailMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const tailWing = new THREE.Mesh(tailGeometry, tailMaterial);
    tailWing.position.set(-2.8, -0.2, 0);
    airplane.add(tailWing);

    // 🏎 **Tail Fin (Vertical Stabilizer)**
    const finGeometry = new THREE.BoxGeometry(0.2, 1.5, 1);
    const finMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const tailFin = new THREE.Mesh(finGeometry, finMaterial);
    tailFin.position.set(-2.8, 0.7, 0);
    airplane.add(tailFin);

    // 🔘 **Wheels (Landing Gear)**
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 12);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

    const wheelPositions = [
        [1.5, -0.8, 1], // Left wheel (lowered slightly)
        [1.5, -0.8, -1], // Right wheel (lowered slightly)
        [-2.5, -0.8, 0] // Rear wheel (lowered slightly)
    ];

    wheelPositions.forEach(([x, y, z]) => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2; // Rotate to stand correctly
        wheel.position.set(x, y, z);
        airplane.add(wheel);
    });

    // 🚀 **Positioning**
    airplane.position.copy(position);
	   airplane.position.y += 2; // Lifts the entire airplane vertically
    airplane.scale.set(1.5, 2, 1.5); // Scale slightly larger

   const interactData = { interactability: true};
	   fuselage.userData = interactData;
    // 📌 Move entire car group to the given position



    return airplane;
}



function createSidewalk(position) {
    const sidewalkGroup = new THREE.Group(); // Group all sidewalk parts together

    // 🏙️ **Sidewalk Base (Main Walking Area)**
    const baseGeometry = new THREE.BoxGeometry(6, 0.1, 3); // Width, height, depth
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0xAAAAAA }); // Light gray concrete
    const sidewalkBase = new THREE.Mesh(baseGeometry, baseMaterial);
    sidewalkBase.position.set(0, 0, 0);
    sidewalkGroup.add(sidewalkBase);

    // 🚧 **Curb (Raised Edge Along Sidewalk)**
    const curbGeometry = new THREE.BoxGeometry(6, 0.2, 0.5);
    const curbMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 }); // Darker gray curb
    const curb = new THREE.Mesh(curbGeometry, curbMaterial);
    curb.position.set(0, 0.15, -1.25); // Raised slightly above the sidewalk base
    sidewalkGroup.add(curb);

    // 🏁 **Sidewalk Slabs (Divisions in Concrete)**
    for (let i = -2.5; i < 3; i += 2) { // Create slab divisions
        const slabGeometry = new THREE.BoxGeometry(0.1, 0.12, 3);
        const slabMaterial = new THREE.MeshStandardMaterial({ color: 0x777777 }); // Darker gray for the slab lines
        const slab = new THREE.Mesh(slabGeometry, slabMaterial);
        slab.position.set(i, 0.06, 0); // Slightly raised for visibility
        sidewalkGroup.add(slab);
    }

    // 🚀 **Positioning**
    sidewalkGroup.position.copy(position);
    return sidewalkGroup;
}

function createNPC(position) {
    const npcGroup = new THREE.Group(); // Group all NPC parts together

    // 😀 **Head (Sphere)**
    const headGeometry = new THREE.SphereGeometry(1, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 }); // Yellow color
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 2.5, 0);
    npcGroup.add(head);

    // 👀 **Eyes**
    const eyeGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black eyes

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.4, 2.8, 0.9);
    npcGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.4, 2.8, 0.9);
    npcGroup.add(rightEye);

    // 👃 **Nose**
    const noseGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const noseMaterial = new THREE.MeshStandardMaterial({ color: 0xFFA500 }); // Orange nose
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0, 2.6, 1);
    npcGroup.add(nose);

    // 😃 **Mouth**
    const mouthGeometry = new THREE.TorusGeometry(0.4, 0.1, 8, 16, Math.PI);
    const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 }); // Red mouth
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, 2.4, 0.95);
    mouth.rotation.x = Math.PI / 1.2;
    npcGroup.add(mouth);

    // 🤖 **Body (Cylinder)**
    const bodyGeometry = new THREE.CylinderGeometry(0.8, 1, 2, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 1, 0);
    npcGroup.add(body);

    // 🤲 **Arms (Cylinders)**
    const armGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 8);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });

    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-1.2, 1.5, 0);
    leftArm.rotation.z = Math.PI / 4;
    npcGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(1.2, 1.5, 0);
    rightArm.rotation.z = -Math.PI / 4;
    npcGroup.add(rightArm);

    // ✋ **Hands (Spheres)**
    const handGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const handMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });

    const leftHand = new THREE.Mesh(handGeometry, handMaterial);
    leftHand.position.set(-1.8, 2.2, 0);
    npcGroup.add(leftHand);

    const rightHand = new THREE.Mesh(handGeometry, handMaterial);
    rightHand.position.set(1.8, 2.2, 0);
    npcGroup.add(rightHand);


    // 🚀 **Positioning & Scaling**
    npcGroup.position.copy(position);
    npcGroup.scale.set(0.7, 0.7, 0.7); // Scale up slightly

    return npcGroup;
}

// Function to create a fence
function createFence(position, length = 6, height = 1.5, postSpacing = 2) {
    const fenceGroup = new THREE.Group(); // Group to hold fence parts

    // Material for the fence
    const fenceMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown wood color

    // Create vertical posts
    const postGeometry = new THREE.BoxGeometry(0.2, height, 0.2); // Thin vertical posts
    const numPosts = Math.ceil(length / postSpacing) + 1; // Number of posts needed

    for (let i = 0; i < numPosts; i++) {
        const post = new THREE.Mesh(postGeometry, fenceMaterial);
        post.position.set(i * postSpacing - length / 2, height / 2, 0); // Adjust position
        fenceGroup.add(post);
    }

    // Create horizontal rails
    const railGeometry = new THREE.BoxGeometry(length, 0.1, 0.1); // Thin horizontal rails
    const topRail = new THREE.Mesh(railGeometry, fenceMaterial);
    const bottomRail = new THREE.Mesh(railGeometry, fenceMaterial);

    topRail.position.set(0, height - 0.3, 0);
    bottomRail.position.set(0, height / 2 - 0.3, 0);

    fenceGroup.add(topRail);
    fenceGroup.add(bottomRail);

    // Set overall fence position
    fenceGroup.position.copy(position);

    return fenceGroup;
}
// Function to create a simplified AK-47
function createAK47(position) {
    const ak47Group = new THREE.Group(); // Group for AK-47 parts

    // Material for gun metal
    const metalMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

    // Material for wooden parts
    const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });

    // Barrel
    const barrelGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 16);
    const barrel = new THREE.Mesh(barrelGeometry, metalMaterial);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(0.6, 0.1, 0);

    // Stock (Wood)
    const stockGeometry = new THREE.BoxGeometry(0.5, 0.15, 0.3);
    const stock = new THREE.Mesh(stockGeometry, woodMaterial);
    stock.position.set(-0.7, 0, 0);

    // Receiver (Main Body)
    const receiverGeometry = new THREE.BoxGeometry(0.6, 0.15, 0.2);
    const receiver = new THREE.Mesh(receiverGeometry, metalMaterial);
    receiver.position.set(0, 0, 0);

    // Magazine
    const magazineGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.1);
    const magazine = new THREE.Mesh(magazineGeometry, metalMaterial);
    magazine.position.set(0.2, -0.15, 0);
    magazine.rotation.z = -Math.PI / 6; // Slight angle for realism

    // Grip
    const gripGeometry = new THREE.BoxGeometry(0.15, 0.25, 0.1);
    const grip = new THREE.Mesh(gripGeometry, woodMaterial);
    grip.position.set(0, -0.1, 0);
    grip.rotation.z = Math.PI / 6;

    // Add parts to group
    ak47Group.add(barrel);
    ak47Group.add(stock);
    ak47Group.add(receiver);
    ak47Group.add(magazine);
    ak47Group.add(grip);

    // Set position
    ak47Group.position.copy(position);

    return ak47Group;
}
// Function to create a warehouse asset
function createWarehouse(position) {
    const warehouseGroup = new THREE.Group(); // Group for warehouse components

    // Materials
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000 }); // Dark red bricks
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 }); // Gray metal
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 }); // Dark for doors

    // Warehouse Base (Walls)
    const baseGeometry = new THREE.BoxGeometry(8, 4, 12); // Large rectangular building
    const base = new THREE.Mesh(baseGeometry, wallMaterial);
    base.position.set(0, 2, 0); // Raise to align with the ground

    // Roof (Angled)
    const roofGeometry = new THREE.BoxGeometry(8.2, 0.3, 12.2); // Slight overhang
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 4.2, 0);

    // Large Entrance Door
    const doorGeometry = new THREE.BoxGeometry(3, 3, 0.1);
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 1.5, 6.05); // Front center

    // Windows (Small square windows)
    const windowMaterial = new THREE.MeshStandardMaterial({ color: 0xAAAAAA, transparent: true, opacity: 0.5 });
    const windowGeometry = new THREE.BoxGeometry(1, 1, 0.1);

    const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
    window1.position.set(-3, 2.5, 6.05); // Left side front

    const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
    window2.position.set(3, 2.5, 6.05); // Right side front

    // Adding all elements to the group
    warehouseGroup.add(base);
    warehouseGroup.add(roof);
    warehouseGroup.add(door);
    warehouseGroup.add(window1);
    warehouseGroup.add(window2);

    // Positioning the entire warehouse
    warehouseGroup.position.copy(position);

    return warehouseGroup;
}

// Function to create a simple wall
function createWall(position, width = 6, height = 3, depth = 0.3, color = 0x8B0000) {
    const wallGroup = new THREE.Group(); // Group for modular design

    // Wall Material
    const wallMaterial = new THREE.MeshStandardMaterial({ color: color });

    // Wall Geometry
    const wallGeometry = new THREE.BoxGeometry(width, height, depth);
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(0, height / 2, 0); // Center it above ground

    // Add the wall to the group
    wallGroup.add(wall);

    // Set the position of the whole wall group
    wallGroup.position.copy(position);

    return wallGroup;
}

function createTank(position) {
    // ✅ Create the tank body (chassis)
    const bodyGeometry = new THREE.BoxGeometry(6, 1.5, 8); // Tank base
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x2F2F2F }); // Dark color for tank
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 0.75, 0); // Centered in the group

    // ✅ Create the turret (rotating top part)
    const turretGeometry = new THREE.BoxGeometry(3, 1, 3.5);
    const turretMaterial = new THREE.MeshStandardMaterial({ color: 0x3F3F3F }); // Slightly lighter shade
    const turret = new THREE.Mesh(turretGeometry, turretMaterial);
    turret.position.set(0, 0.5, 0); // On top of the body

    // ✅ Create the tank barrel
    const barrelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 6, 16);
    const barrelMaterial = new THREE.MeshStandardMaterial({ color: 0x4F4F4F });
    const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
    barrel.rotation.z = Math.PI / 2; // Rotate to face forward
    barrel.position.set(1.5, 0.5, 0); // Attach to the front of the turret

    // ✅ Group the turret and barrel so they rotate together
    const turretGroup = new THREE.Group();
    turretGroup.add(turret);
    turretGroup.add(barrel);
    turretGroup.position.set(0, 1.5, 0); // Positioned correctly on the body

    // ✅ Group everything into a single tank object
    const tank = new THREE.Group();
    tank.add(body);
    tank.add(turretGroup);

    // ✅ Move the entire tank to the correct position
    tank.position.copy(position);

    return tank;
}

function createCastle(position) {
    if (!(position instanceof THREE.Vector3)) {
        console.error("Invalid position argument, setting default (0,0,0)");
        position = new THREE.Vector3(0, 0, 0);
    }

    const castleGroup = new THREE.Group();
    const wallThickness = 0.3;
    const wallHeight = 4;
    const towerSize = 2;
    const castleSize = 10; // Square castle size
    const halfSize = castleSize / 2;

    console.log("Creating castle at:", position);

    // Function to create walls
    function createWall(relativePosition, width, height, depth) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({ color: 0x7a7a7a });
        const wall = new THREE.Mesh(geometry, material);
        wall.position.copy(relativePosition);
        return wall;
    }

    // Walls (relative to castle center)
    const wallPositions = [
        new THREE.Vector3(0, wallHeight / 2, halfSize), // Front
        new THREE.Vector3(0, wallHeight / 2, -halfSize), // Back
        new THREE.Vector3(-halfSize, wallHeight / 2, 0), // Left
        new THREE.Vector3(halfSize, wallHeight / 2, 0) // Right
    ];

    const wallRotations = [0, 0, Math.PI / 2, Math.PI / 2];

    for (let i = 0; i < 4; i++) {
        const wall = createWall(wallPositions[i], castleSize, wallHeight, wallThickness);
        wall.rotation.y = wallRotations[i];
        castleGroup.add(wall);
    }

    // Towers (relative to castle center)
    const towerMaterial = new THREE.MeshStandardMaterial({ color: 0x5A5A5A });
    const towerGeometry = new THREE.CylinderGeometry(towerSize / 2, towerSize / 2, wallHeight + 2, 16);

    const towerPositions = [
        new THREE.Vector3(halfSize, (wallHeight + 2) / 2, halfSize),
        new THREE.Vector3(-halfSize, (wallHeight + 2) / 2, halfSize),
        new THREE.Vector3(halfSize, (wallHeight + 2) / 2, -halfSize),
        new THREE.Vector3(-halfSize, (wallHeight + 2) / 2, -halfSize)
    ];

    for (let pos of towerPositions) {
        const tower = new THREE.Mesh(towerGeometry, towerMaterial);
        tower.position.copy(pos);
        castleGroup.add(tower);
    }

    // Gate (relative to castle center)
    const gateGeometry = new THREE.BoxGeometry(3, 2, 0.3);
    const gateMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
    const gate = new THREE.Mesh(gateGeometry, gateMaterial);
    gate.position.set(0, 1, halfSize + wallThickness / 2);
    castleGroup.add(gate);

    // Set castle position
    castleGroup.position.copy(position);

    // Add castle to scene

    return castleGroup;
}



function createPlayer(position) {
    // Create a group to hold all body parts
    const player = new THREE.Group();

    // Common material (can be changed for a skin texture)
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Green like Steve's shirt

    // Head
    const headGeometry = new THREE.BoxGeometry(1, 1, 1);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.set(0, 2.75, 0); // Positioned above the body

    // Body
    const bodyGeometry = new THREE.BoxGeometry(1.4, 2, 0.8);
    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.set(0, 1.5, 0);

    // Arms
    const armGeometry = new THREE.BoxGeometry(0.6, 2, 0.6);
    const leftArm = new THREE.Mesh(armGeometry, material);
    leftArm.position.set(-1, 1.5, 0);

    const rightArm = new THREE.Mesh(armGeometry, material);
    rightArm.position.set(1, 1.5, 0);

    // Legs

    // Enable shadows

    // Add parts to the player group
    player.add(head, body, leftArm, rightArm);

    // Add player to the scene
player.position.copy(position);

    return player; // Return player for movement control
}



function createTruck(position) {
    // ✅ Create the truck chassis (base)
    const bodyGeometry = new THREE.BoxGeometry(8, 2, 4);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 }); // Dark gray
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 1, 0);

    // ✅ Create the cab (front part where the driver sits)
    const cabGeometry = new THREE.BoxGeometry(3, 2.5, 4);
    const cabMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 }); // Slightly lighter
    const cab = new THREE.Mesh(cabGeometry, cabMaterial);
    cab.position.set(-2.5, 2, 0); // Positioned at the front

    // ✅ Create the cargo bed (flat area behind the cab)
    const cargoGeometry = new THREE.BoxGeometry(5, 1.5, 4);
    const cargoMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 }); // Darkest part
    const cargo = new THREE.Mesh(cargoGeometry, cargoMaterial);
    cargo.position.set(1.5, 1, 0); // Positioned at the back

    // ✅ Create the front grille
    const grilleGeometry = new THREE.BoxGeometry(0.2, 1, 3.5);
    const grilleMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 }); // Lighter gray for contrast
    const grille = new THREE.Mesh(grilleGeometry, grilleMaterial);
    grille.position.set(-4, 1, 0); // Front of the cab

    // ✅ Create the wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.8, 0.8, 1, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x151515 }); // Black tires
    const wheels = [];

    for (let i = 0; i < 4; i++) {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        const xOffset = (i < 2) ? -2.5 : 2.5; // Front or back
        const zOffset = (i % 2 === 0) ? -1.8 : 1.8; // Left or right
        wheel.position.set(xOffset, 0.5, zOffset);
        wheels.push(wheel);
    }

    // ✅ Group everything into a single truck object
    const truck = new THREE.Group();
    truck.add(body);
    truck.add(cab);
    truck.add(cargo);
    truck.add(grille);
    wheels.forEach(wheel => truck.add(wheel));

    // ✅ Move the entire truck to the correct position
    truck.position.copy(position);

    return truck;
}

function createHedge(position, width = 6, height = 2, depth = 2) {
    // ✅ Create the main hedge body (block of leaves)
    const hedgeGeometry = new THREE.BoxGeometry(width, height, depth);
    const hedgeMaterial = new THREE.MeshStandardMaterial({ color: 0x2E8B57 }); // Dark green
    const hedgeBody = new THREE.Mesh(hedgeGeometry, hedgeMaterial);
    hedgeBody.position.set(0, height / 2, 0); // Raise it so it sits on the ground

    // ✅ Create small spheres to simulate leaf variation
    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x3CB371 }); // Lighter green
    const leaves = [];

    for (let i = 0; i < 6; i++) {
        const leafGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        const xOffset = (Math.random() - 0.5) * width;
        const yOffset = Math.random() * height;
        const zOffset = (Math.random() - 0.5) * depth;
        leaf.position.set(xOffset, yOffset, zOffset);
        leaves.push(leaf);
    }

    // ✅ Group everything into a single hedge object
    const hedge = new THREE.Group();
    hedge.add(hedgeBody);
    leaves.forEach(leaf => hedge.add(leaf));

    // ✅ Move the entire hedge to the correct position
    hedge.position.copy(position);

    return hedge;
}

function createStairs(position, stepCount = 5, stepWidth = 4, stepHeight = 1, stepDepth = 2) {
    const stairs = new THREE.Group();
    const stepMaterial = new THREE.MeshStandardMaterial({ color: 0x8B8B8B }); // Gray stone color

    for (let i = 0; i < stepCount; i++) {
        // Create each step
        const stepGeometry = new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth);
        const step = new THREE.Mesh(stepGeometry, stepMaterial);

        // Position each step in a stair formation
        step.position.set(0, i * stepHeight, i * stepDepth);

        // Add the step to the group
        stairs.add(step);
    }

    // ✅ Move the entire staircase to the correct position
    stairs.position.copy(position);

    return stairs;
}

function createTerrainBlock(position, width = 8, height = 3, depth = 8) {
    // ✅ Create the main terrain block geometry
    const terrainGeometry = new THREE.BoxGeometry(width, height, depth);

    // ✅ Define materials for different faces
    const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // Green for the top
    const dirtMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown for the sides and bottom

    // ✅ Assign materials to specific faces
    const materials = [
        dirtMaterial, // Right
        dirtMaterial, // Left
        grassMaterial, // Top
        dirtMaterial, // Bottom
        dirtMaterial, // Front
        dirtMaterial  // Back
    ];

    // ✅ Create the terrain block mesh
    const terrainBlock = new THREE.Mesh(terrainGeometry, materials);

    // ✅ Position the block in the scene
    terrainBlock.position.copy(position);

    return terrainBlock;
}

function createTerrainBlockTall(position, width = 8, height = 6, depth = 8) {
    // ✅ Create the main terrain block geometry
    const terrainGeometry = new THREE.BoxGeometry(width, height, depth);

    // ✅ Define materials for different faces
    const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // Green for the top
    const dirtMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown for the sides and bottom

    // ✅ Assign materials to specific faces
    const materials = [
        dirtMaterial, // Right
        dirtMaterial, // Left
        grassMaterial, // Top
        dirtMaterial, // Bottom
        dirtMaterial, // Front
        dirtMaterial  // Back
    ];

    // ✅ Create the terrain block mesh
    const terrainBlock = new THREE.Mesh(terrainGeometry, materials);

    // ✅ Position the block in the scene
    terrainBlock.position.copy(position);

    return terrainBlock;
}

function createTerrainBlockTallest(position, width = 10, height = 10, depth = 8) {
    // ✅ Create the main terrain block geometry
    const terrainGeometry = new THREE.BoxGeometry(width, height, depth);

    // ✅ Define materials for different faces
    const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // Green for the top
    const dirtMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown for the sides and bottom

    // ✅ Assign materials to specific faces
    const materials = [
        dirtMaterial, // Right
        dirtMaterial, // Left
        grassMaterial, // Top
        dirtMaterial, // Bottom
        dirtMaterial, // Front
        dirtMaterial  // Back
    ];

    // ✅ Create the terrain block mesh
    const terrainBlock = new THREE.Mesh(terrainGeometry, materials);

    // ✅ Position the block in the scene
    terrainBlock.position.copy(position);

    return terrainBlock;
}

function createMountain(position, baseSize = 40, height = 32) {
    // ✅ Create the mountain geometry (cone shape)
    const mountainGeometry = new THREE.ConeGeometry(baseSize, height, 6); // 6-sided for a low-poly look

    // ✅ Define materials
    const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x6B6B6B }); // Dark gray (rock)
    const snowMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF }); // White (snow)

    // ✅ Create the main mountain mesh
    const mountain = new THREE.Mesh(mountainGeometry, rockMaterial);

// ✅ Create the snowcap (small cone on top)
const snowGeometry = new THREE.ConeGeometry(baseSize * 0.3, height * 0.2, 6); // Smaller and thinner
const snow = new THREE.Mesh(snowGeometry, snowMaterial);
snow.position.set(0, height * 0.4, 0); // Higher up, fits better on top


    // ✅ Group everything together
    const mountainGroup = new THREE.Group();
    mountainGroup.add(mountain);
    mountainGroup.add(snow);

    // ✅ Move the entire mountain to the correct position
    mountainGroup.position.copy(position);

    return mountainGroup;
}

function createTable(position) {
    const table = new THREE.Group(); // Group to hold all table parts

    // Create table top
    const topGeometry = new THREE.BoxGeometry(3, 0.2, 2); // Rectangular top
    const topMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown wood
    const tableTop = new THREE.Mesh(topGeometry, topMaterial);
    tableTop.position.set(0, 1, 0); // Raise to proper height

    // Create table legs
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.0); // Thin cylinder legs
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 }); // Darker wood

    const legPositions = [
        new THREE.Vector3(-1.3, 0.5, -0.8),
        new THREE.Vector3(1.3, 0.5, -0.8),
        new THREE.Vector3(-1.3, 0.5, 0.8),
        new THREE.Vector3(1.3, 0.5, 0.8),
    ];

    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.copy(pos);
        table.add(leg);
    });

    // Add all parts to the table group
    table.add(tableTop);
    table.position.copy(position);

    return table;
}

function createZombie(position) {
    const zombie = new THREE.Group(); // Group all zombie parts together

    // 🧟‍♂️ Head
    const headGeometry = new THREE.BoxGeometry(1, 1, 1);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x556B2F });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 2.5, 0);
    zombie.add(head);

    // 👀 Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFF00, emissive: 0xFFFF00 });
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.3, 2.8, 0.5);
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.3, 2.8, 0.5);
    zombie.add(leftEye, rightEye);

    // 😨 Mouth
    const mouthGeometry = new THREE.BoxGeometry(0.6, 0.2, 0.1);
    const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000 });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, 2.3, 0.55);
    zombie.add(mouth);

    // 🦺 Body
    const bodyGeometry = new THREE.BoxGeometry(1.2, 2, 0.8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x2E8B57 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 1.5, 0);
    zombie.add(body);

    // 👕 Torn Shirt
    const shirtGeometry = new THREE.BoxGeometry(1.3, 1.2, 0.9);
    const shirtMaterial = new THREE.MeshStandardMaterial({ color: 0x006400 });
    const shirt = new THREE.Mesh(shirtGeometry, shirtMaterial);
    shirt.position.set(0, 1.8, 0);
    zombie.add(shirt);

    // 🦴 Arms (FORWARD EXTENDED POSITION)
    const armGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 8);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x556B2F });

    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.8, 1.5, 0);
    leftArm.rotation.x = Math.PI / 2; // Rotate forward
    zombie.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.8, 1.5, 0);
    rightArm.rotation.x = Math.PI / 2; // Rotate forward
    zombie.add(rightArm);

    // 👖 Legs
    const legGeometry = new THREE.BoxGeometry(0.5, 2, 0.5);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x191970 });

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.4, 0.5, 0);
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.4, 0.5, 0);
    zombie.add(leftLeg, rightLeg);

    // 🚶 Slight forward lean
    zombie.rotation.x = -Math.PI / 15;

    // 🚀 Positioning & Scaling
    zombie.position.copy(position);
    zombie.scale.set(0.9, 0.9, 0.9);

    return zombie;
}


function createPortal(position) {
    const portalGroup = new THREE.Group();

    // Base of the portal (glowing platform)
    const baseGeometry = new THREE.CylinderGeometry(3, 3.5, 0.3, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x4444FF, emissive: 0x2222FF, emissiveIntensity: 0.7 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(0, 0.15, 0);
    portalGroup.add(base);

    // Portal ring (outer frame)
    const ringGeometry = new THREE.TorusGeometry(2.5, 0.3, 16, 64);
    const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xAAAAFF, emissive: 0x6666FF, emissiveIntensity: 0.8 });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 2.5, 0);
    portalGroup.add(ring);

    // Energy field inside the portal
    const portalGeometry = new THREE.PlaneGeometry(4, 4);
    const portalMaterial = new THREE.MeshStandardMaterial({
        color: 0x0000FF,
        transparent: true,
        opacity: 0.7,
        emissive: 0x0011FF,
        emissiveIntensity: 1.2,
        side: THREE.DoubleSide
    });
    const portalField = new THREE.Mesh(portalGeometry, portalMaterial);
    portalField.rotation.y = Math.PI / 2;
    portalField.position.set(0, 2.5, 0);
    portalGroup.add(portalField);

    // Particle effect around the portal
    const particles = new THREE.Group();
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMaterial = new THREE.MeshStandardMaterial({ color: 0x88AAFF, emissive: 0x4488FF, emissiveIntensity: 1 });

    for (let i = 0; i < 50; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        const angle = Math.random() * Math.PI * 2;
        const radius = 3.5 + Math.random() * 0.5;
        const height = Math.random() * 4;
        particle.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
        particles.add(particle);
    }
    portalGroup.add(particles);

    // Animation function to create a swirling effect
    function animatePortal() {
        portalField.material.opacity = 0.7 + 0.3 * Math.sin(Date.now() * 0.002);
        portalField.rotation.y += 0.02;
        particles.children.forEach(particle => {
            particle.position.y += 0.02 * Math.sin(Date.now() * 0.005 + particle.position.x);
        });
        requestAnimationFrame(animatePortal);
    }
    animatePortal();

    // Interactivity - Portal can teleport objects
    portalGroup.userData = {
        interactability: true,
        teleport: function (object, newPosition) {
            object.position.copy(newPosition);
        }
    };

    // Positioning
    portalGroup.position.copy(position);

    return portalGroup;
}

// Function to create a signboard with a chalk outline of an AK-47
function createWallBuy(position) {
   const signGroup = new THREE.Group();

    // Signboard (acts as the background)
    const signGeometry = new THREE.BoxGeometry(3, 1.5, 0.1);
    const signMaterial = new THREE.MeshStandardMaterial({ color: 0x3B3B3B }); // Dark gray (chalkboard)
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 1.5, 0);
    signGroup.add(sign);

    // Chalk outline of AK-47 (2D lines on the board)
    const chalkMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF }); // White for chalk effect

    // Define points for the outline in local space
    const chalkPoints = [
        new THREE.Vector3(-1.0, 0.3, 0.05), new THREE.Vector3(1.0, 0.3, 0.05), // Barrel
        new THREE.Vector3(-0.8, 0.2, 0.05), new THREE.Vector3(-1.0, 0.3, 0.05), // Stock
        new THREE.Vector3(0.5, -0.1, 0.05), new THREE.Vector3(0.6, 0.2, 0.05), // Magazine
        new THREE.Vector3(-0.2, 0.2, 0.05), new THREE.Vector3(-0.4, -0.2, 0.05), // Trigger and Grip
    ];

    // Create the outline
    const chalkGeometry = new THREE.BufferGeometry().setFromPoints(chalkPoints);
    const chalkOutline = new THREE.Line(chalkGeometry, chalkMaterial);

    // Offset the outline so it aligns exactly on the front surface of the sign
    chalkOutline.position.set(0, 1.5, 0.051); // Slightly in front of the board to avoid Z-fighting
    signGroup.add(chalkOutline);

    // Position the whole sign
    signGroup.position.copy(position);

    return signGroup;
}

// Function to create a Minecraft-style fire effect
function createFire(position) {
    const fireGroup = new THREE.Group();

    // Define colors for the flames (hot core, mid flame, outer flame)
    const fireColors = [
        new THREE.MeshStandardMaterial({ color: 0xFF5500, emissive: 0xFF5500, emissiveIntensity: 1.2 }), // Deep Orange
        new THREE.MeshStandardMaterial({ color: 0xFFAA00, emissive: 0xFFAA00, emissiveIntensity: 1.4 }), // Bright Orange
        new THREE.MeshStandardMaterial({ color: 0xFFFF00, emissive: 0xFFFF00, emissiveIntensity: 1.6 })  // Yellow
    ];

    // Create multiple flames
    const flameGeometry = new THREE.PlaneGeometry(0.6, 1); // Tall, rectangular flames

    for (let i = 0; i < 6; i++) {
        const flame = new THREE.Mesh(flameGeometry, fireColors[i % 3]); // Cycle colors

        // Position flames in a circular pattern
        const angle = (i / 6) * Math.PI * 2;
        flame.position.set(Math.cos(angle) * 0.3, 0.7, Math.sin(angle) * 0.3);
        flame.rotation.y = angle;

        fireGroup.add(flame);
    }

    // Small center flames
    for (let i = 0; i < 3; i++) {
        const smallFlame = new THREE.Mesh(flameGeometry, fireColors[i]);
        smallFlame.scale.set(0.5, 0.7, 0.5);
        smallFlame.position.set((Math.random() - 0.5) * 0.3, 0.6, (Math.random() - 0.5) * 0.3);
        fireGroup.add(smallFlame);
    }

    // Fire flickering animation
    function animateFire() {
        fireGroup.children.forEach((flame, i) => {
            flame.scale.y = 1 + Math.sin(Date.now() * 0.005 + i) * 0.2; // Flickering height
            flame.material.emissiveIntensity = 1.2 + Math.sin(Date.now() * 0.003 + i) * 0.5; // Glow variation
            flame.position.y = 0.7 + Math.sin(Date.now() * 0.004 + i) * 0.1; // Slight vertical movement
        });
        requestAnimationFrame(animateFire);
    }
    animateFire();

    // Positioning
    fireGroup.position.copy(position);

    return fireGroup;
}
