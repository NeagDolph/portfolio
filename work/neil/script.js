var physicsWorld = "";
var lights = []
var boxes = []
var vx = 0;
var vy = 0;
var storedx = 0
var velocityx = 0
var storedy = 0
var velocityy = 0
var tempso
var tempsi
var tempdis
var selectedobj = "mango"
var mousex
var mousey
var bodies = []
var objectmasses = 1.3
var groundBody
var frames = []
var walls = []
var loader = new THREE.OBJLoader();
var bodywidth = document.getElementById('page').offsetWidth
var bodyheight = document.getElementById('page').offsetHeight
var maxstretch = (bodywidth / bodyheight) / 0.01998171607679248;
var boxMaterial
var groundMaterial
var placeboxes = []
var selectedplacebox
var sticks = []
var placenum
var placedboxes = []
var time = 0;
var easables = []
var complete = false;

var cubesize = 10
var blocklength = 5

var scene
var camera
var renderer
var loader
var multiplier = 0.1487;
var mousedown = false
var projector
var INTERSECTED
var intersects
var ray
var vector
var mouseselected
var time = 0 

function distanceVector( v1, v2 ) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return {x: dx, y: dy, z: dz}
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
  
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
  
	  // Pick a remaining element...
	  randomIndex = Math.floor(Math.random() * currentIndex);
	  currentIndex -= 1;
  
	  // And swap it with the current element.
	  temporaryValue = array[currentIndex];
	  array[currentIndex] = array[randomIndex];
	  array[randomIndex] = temporaryValue;
	}
  
	return array;
  }

window.onload = function() {
	// > Load initial stuff like the engines and renderers

		// > > Load scene and camera in THREE.js
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 9000 );

	camera.position.x = 0;
	camera.position.y = 45;
	camera.position.z = -150;
	camera.lookAt(new THREE.Vector3(0, 20, 0));

		// > > Load physics world in Cannon.js
	world = new CANNON.World();
	world.gravity.set(0,-350,0);
	world.broadphase = new CANNON.NaiveBroadphase();


		// > > Load THREE.js renderer
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize( window.innerWidth, window.innerHeight - 10 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;



	document.body.appendChild( renderer.domElement );

		// > > .OBJ object loader
	loader = new THREE.OBJLoader();




	// > Make materials and different settings about their interaction in cannon.js

	var boxMaterial = new CANNON.Material("slipperyMaterial");
	var groundMaterial = new CANNON.Material("groundMaterial");

    box_ground_cm = new CANNON.ContactMaterial(boxMaterial, groundMaterial, {
        friction: 110e99,
        restitution: 100,
        contactEquationStiffness: 0,
        contactEquationRelaxation: 0
    });

    world.addContactMaterial(box_ground_cm);

    box_box_cm = new CANNON.ContactMaterial(boxMaterial, boxMaterial, {
        friction: 1,
        restitution: 0.3,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 30
    });

    world.addContactMaterial(box_box_cm);


    // > Make all objects

    	// > > Build ground in THREE.js
	floor = makeplane(600, 300, 'images/brick.jpg', -180, 0, 20, 10);


    	// > > build Ground in Cannon.js
	groundBody = new CANNON.Body({
		mass: 0,
		material: groundMaterial
	});
	var groundShape = new CANNON.Plane();
	groundBody.addShape(groundShape);
	world.addBody(groundBody);
	groundBody.quaternion.copy(floor.quaternion)
	groundBody.position.copy(floor.position)
	groundBody.position.y = 0


		// > > Build walls in Cannon.js
	walls[0] = makewall(-0.5, -0.5, 0.5, 0.5)
	walls[1] = makewall(-0.5, 0.5, -0.5, 0.5)


		// > > Build Boxes in Cannon.js and THREE.js
	mapwidth = 3
	mapheight = 3

	// colors = [0x9400D3, 0x4B0082, 0x0000FF, 0x00FF00, 0xFFFF00, 0xFF7F00, 0xFF0000, 0x9400D3, 0x4B0082, 0x0000FF, 0x00FF00, 0xFFFF00, 0xFF7F00, 0xFF0000, 0x9400D3, 0x4B0082, 0x0000FF, 0x00FF00, 0xFFFF00, 0xFF7F00, 0xFF0000, 0x9400D3, 0x4B0082, 0x0000FF, 0x00FF00, 0xFFFF00, 0xFF7F00, 0xFF0000, 0x9400D3, 0x4B0082, 0x0000FF, 0x00FF00, 0xFFFF00, 0xFF7F00, 0xFF0000]
	colors = [0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff]
	
	itemnum = 0
	
	randomnum = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])

			// > > > build boxes one by one with specified colors
	for (var heighti = 0; heighti < mapheight; heighti++) {
		var xplace = 0
		for (var widthi = 0; widthi < mapwidth; widthi++) {
			if (((((widthi % 2) - 2) * 2) + 3) == 1 ) {
				xplace += cubesize
			}


			makebox(cubesize, cubesize, cubesize, colors[widthi], "images/spongebob" + randomnum[itemnum] + ".jpg", ((heighti + 1) * cubesize) - cubesize / 2, ((((widthi % 2) - 2) * 2) + 3) * xplace)
			boxes[itemnum].movable = true;
			boxes[itemnum].body = itemnum;
			bodies[itemnum].piece = randomnum[itemnum];
			frames[itemnum] = makeframe(boxes[itemnum], 0xFFFFE0)

			itemnum++
		}
	}

		// > > Build lights in THREE.j, s
	// var ambient	= new THREE.AmbientLight( 0xffffff, 0.2 );
	// scene.add(ambient);

	

		// > > Build placement arrangements

	
	sky = makeplane(4096 * 0.6, 1028 * 0.6, "images/skybox.png", 180, 0, 1, 1)
	sky.rotation.x = -359 * ((3.14) / 360)
	sky.position.z = 1200
			// > > > Build sticks
	var stick;
	var sticky = 2;
	var stickx = 2;

	for (var x = 0; x < stickx; x++) {
		stick = makecuboid(45, 1, 1, 0xffffff, 'images/wood.png');
		stick.position.y = 48;
		stick.position.x = (x * 15) - 7.5;
		stick.position.z = 0

		sticks.push(stick)

		stick = makecuboid(1, 45, 1, 0xffffff, 'images/wood.png');
		stick.position.y = 40.5 + x * 15;
		stick.position.x = 0;
		stick.position.z = 0
		sticks.push(stick)
	}

	placenum = 0

		// > > > Build invisible object to place the items on
	for (var y = 2; y >= 0; y--) {
		for (var x = 2; x >= 0; x--) {
			placenum++
			placeboxes.push(makeplacebox(15, 15, 1, 0xffffff, true, 0))
			placeboxes[placeboxes.length - 1].position.y = 33 + y * 14.76
			placeboxes[placeboxes.length - 1].position.x = x * 14.76 - 15;
			placeboxes[placeboxes.length - 1].position.z = 0.1
			placeboxes[placeboxes.length - 1].number = placenum
		}
	}


		// > > Set walls to correct place
	genwalls();


	var amlight = new THREE.AmbientLight(0xFFFFFF, 0.25);
	scene.add(amlight)

	var light = new THREE.DirectionalLight(0xFFFFFF, 2.75);
	light.position.y = 80
	light.position.z = -40
    light.position.multiplyScalar(1.3);
	light.castShadow = true;
	// light.shadow = THREE.LightShadow(camera);
	light.shadow.bias = 0.0001
	light.shadow.mapSize.width = 2048 * 2;
	light.shadow.mapSize.height = 2048 * 2;
	light.shadow.camera.far = 3000;
	
	var d = 300;

    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;


	lights.push(light)

	scene.add(light);

	animate();
}

function animate() {
	requestAnimationFrame(animate);

	// if (!mousedown && tempsi) {
	// 	bodies[tempsi.body].velocity.set(velocityx * 6, velocityy * 6, 0)
	// }

	for (var i = 0; i < boxes.length; i++) {
		if (bodies[i].placed) {
			bodies[i].velocity.x = 0
			bodies[i].velocity.y = 0
			bodies[i].velocity.z = 0
		}


		if (boxes[i]["movable"]) {
			if (selectedobj != "mango" && mousedown) {
				if (i == selectedobj["body"]) {
					bodies[i].mass = 0;
					bodies[i].velocity.set(0, 0, 0)
					bodies[i].inertia.set(0, 0, 0)
				} else if (!boxes[i]["placed"]) {
					bodies[i].mass = 1;
				}
			} else if (!boxes[i]["placed"]) {
				bodies[i].mass = 1;
			}
			boxes[i].position.copy(bodies[i].position);
			boxes[i].quaternion.copy(bodies[i].quaternion);
			boxes[i].position.z = 0;
			bodies[i].position.z = 0;
			// bodies[i].quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),mPlayer.yawObject.rotation.y)
			bodies[i].angularVelocity.x = 0;
			bodies[i].angularVelocity.y = 0;
			bodies[i].angularVelocity.z = bodies[i].angularVelocity.z * 0.98

		}
	}

	if (time % 100 == 0 && !complete) {
		let alltrue = []
		for (var i in bodies) {
			alltrue.push(bodies[i].area == bodies[i].piece)
		}

		if (!alltrue.includes(false)) {
			complete = true
			alert("Complete!")
		}
	}

	if (mousedown == false) {
		selectedobj == "mango"
	}

	world.step(1/75);
	renderer.render( scene, camera );
	velocityx *= 0.94

	time++;
}


$("body").on("mousemove", function(event) {
	// Mouse Selected object relative to mouse relative to an fov of 40
	if (mousedown && mouseselected) {
		pageheight = $("body").height()
		pagewidth = $("body").width()

		multiplier = (pagewidth / pageheight) / (pagewidth / 102.8083)

		if (selectedobj["movable"]) {
			bodies[selectedobj["body"]].position.x = (0 - ((event.clientX - (pagewidth / 2)) * multiplier))
			velocityx = -((storedx - bodies[selectedobj["body"]].position.x) * 3)
			velocityy = -((storedy - bodies[selectedobj["body"]].position.y) * 3)
			storedx = bodies[selectedobj["body"]].position.x
			storedy = bodies[selectedobj["body"]].position.y
			if (event.clientY < (pageheight / 1.5148148148148148)) {
				bodies[selectedobj["body"]].position.y =  ((0 - ((event.clientY - (pageheight * 0.64)) * multiplier)) + 5)
			} else {
				bodies[selectedobj["body"]].position.y =  (0 + cubesize / 2)
			}
		}
	}

	// Item selection
	mousex = (event.clientX / window.innerWidth) * 2 - 1;
  	mousey = -(event.clientY / window.innerHeight) * 2 + 1;

  	select(mousex, mousey);

});

function select(pagex, pagey) {
	vector = new THREE.Vector3(pagex, pagey, 1);
	vector.unproject(camera);
	ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
	intersects = ray.intersectObjects(scene.children);

	for (var i in intersects) {
		if (intersects[i].object.movable === true) {
			tempsi = intersects[i].object;
		}
	}
	if (intersects.length > 0) {
		if (intersects[0].object != floor && !placeboxes[intersects[0].object]) {
			if ((!mousedown && INTERSECTED != intersects[0].object) || (mousedown && INTERSECTED == intersects[0].object)) {
				INTERSECTED = intersects[0].object;
				selectedobj = INTERSECTED;
			}
			tempso = intersects[0].object;
			tempdis = distanceVector(intersects[0].object.position, intersects[0].point)
		} else {
			tempso = null
		}

		if (intersects[1] && !sticks.includes(intersects[0].object)) { 
			if (placeboxes.includes(intersects[1].object)) {
				selectedplacebox = intersects[1].object
			} else if (selectedplacebox) {
				selectedplacebox = null;
			}
		} else if (selectedplacebox) {
			selectedplacebox = null;
		}
	} else {
		tempso = null
		selectedplacebox = null
	}
}

$("body").on('mousedown', function() {
	velocityx = 0
	velocityy = 0
	if (tempso != null) {
		mouseselected = true
	} else {
		mouseselected = false
	}
	mousedown = true;

	if (tempso.placed === true) {
		abc = selectedobj

		tempso.placed = false
		tempso.castShadow = true;
		bodies[tempso["body"]].type = 1;
		bodies[tempso["body"]].collisionResponse = true;
		// console.log(((1 / 57.295779513) / 57.295779513) * (Number(((abc.rotation.z * 57.295779513) / 90).toFixed(0.1)) * 90))
		// bodies[abc["body"]].quaternion.setFromAxisAngle(new THREE.Vector3( 0, 0, 1 ), ((1 / 57.295779513) / 57.295779513) * (Number(((abc.rotation.z * 57.295779513) / 90).toFixed(0.1)) * 90))
		// bodies[abc["body"]].quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), 0 )
		bodies[tempso["body"]].position.z = 0;
		bodies[tempso["body"]].placed = false
		bodies[tempso["body"]].shapes[0].halfExtents.set(5, 5, 5)
		bodies[tempso["body"]].shapes[0].updateConvexPolyhedronRepresentation()
		ease(0.3, 24, 0.011, "easeInOutCubic", function(a) {
			abc.scale.x -= a;
			abc.scale.y -= a;
			abc.scale.z -= a;
		}, "for (var i in boxes) {if (!boxes[i].placed) {boxes[i].scale.set(1, 1, 1)}}")
	}
})

$(window).on('mouseup', function() {
	vy = 0;
	if (mousedown && mouseselected && selectedobj) {
		try {
		bodies[tempsi["body"]].velocity.set(velocityx * 10, velocityy * 10, 0);
		} catch {

		}
	}
	mousedown = false;
	mouseselected = false;
	console.log(velocityx * 6, velocityy * 6)
	if (selectedplacebox && tempso) {
		if (tempso.scale.y === 1) {
			abc = tempso

			tempso.placed = true
			tempso.castShadow = false
			bodies[tempso["body"]].type = CANNON.Body.KINEMATIC;
			bodies[tempso["body"]].collisionResponse = false;
			bodies[tempso["body"]].angularVelocity.set(0, 0, 0);
			bodies[tempso["body"]].position.copy(selectedplacebox.position)
			bodies[tempso["body"]].position.z = -0.1
			bodies[tempso["body"]].quaternion.setFromAxisAngle(new THREE.Vector3( 0, 0, 1 ), (1 / 57.295779513) * (Number(((tempso.rotation.z * 57.295779513) / 90).toFixed(0.1)) * 90))
			bodies[tempso["body"]].shapes[0].halfExtents.set(7.5, 7.5, 7.5)
			bodies[tempso["body"]].shapes[0].updateConvexPolyhedronRepresentation()
			bodies[tempso["body"]].placed = true
			bodies[tempso["body"]].area = selectedplacebox.number
			ease(0.3, 24, 0.011, "easeInOutCubic", function(a) {
				abc.scale.x += a;
				abc.scale.y += a;
				abc.scale.z += a;
			}, "abc.scale.x=1.47916;abc.scale.y=1.47916;abc.scale.z=1.47916")
		}
	} else {
		selectedobj = "mango";
	}
	tempso = null;
})

function makeplane(width, height, imagefile=false, rot=-180, y=0, xrep=1, yrep=1) {
	var geometry = new THREE.PlaneGeometry( width, height );
	if (imagefile) {
		var texture = new THREE.TextureLoader().load(imagefile);
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

		texture.wrapS = THREE.RepeatWrapping; 
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( xrep, yrep );
	}
	material = new THREE.MeshStandardMaterial( {
		map: texture,
		metalness: 0.5,
		roughness: 0.5,
	});

	var mesh = new THREE.Mesh( geometry, material ) ;
	mesh.rotation.x = Math.PI / (360 / rot);
	mesh.position.y = y;
	mesh.receiveShadow = true;
	scene.add( mesh );
	return mesh;
}

function makeground(width, height, imagefile=false, rot=-180, y=0, xrep=1, yrep=1) {
	loader.load(
		'models/' + chairname,
		function ( object ) {
			chair = object;
			chair.scale.set(chairscale, chairscale, chairscale)
			scene.add( chair );
			chairs.push(chair);
			ready = true;
			animate();
		}
	);
}

function makelight(color, intensity, range, x, y, z) {
	var light = new THREE.PointLight(color, intensity, range);
	light.position.set( x, y, z );
	scene.add( light );

	return light
}

function makeplacebox(width, height, length, color, transparent=true, opacity=0) {
	var material = new THREE.MeshPhongMaterial({
		color: color,
		transparent: transparent,
		opacity: 0
	});

	var threeObject = new THREE.Mesh( new THREE.BoxGeometry(height, width, length), material);

	scene.add(threeObject);

	return threeObject;
}

function makecuboid(width, height, length, color, img) {
	let materials
	let textures

	if (img) {
		textures = new THREE.TextureLoader().load("images/-wood.png");
		materials = new THREE.MeshPhongMaterial({
			specular: 0xffffff,
			map: textures
		});
	} else { 
		materials = new THREE.MeshPhongMaterial({
			color: color
		});
	}


	let threeObject = new THREE.Mesh( new THREE.BoxGeometry(height, width, length), materials);

	threeObject.castShadow = true

	scene.add(threeObject);

	return threeObject;
}

function makebox(width, height, length, setcolor, img, y=10, x=0) {
	shape = new CANNON.Box(new CANNON.Vec3(width / 2,height / 2,length / 2));
	body = new CANNON.Body({
		mass: 5,
		material: boxMaterial
	});
	body.addShape(shape);

	body.position.set(x, y, 0)

	bodies.push(body)

	world.addBody(body);

	// var texture	= THREE.ImageUtils.loadTexture( "images/spongebob.jpg" );

	let texture = new THREE.TextureLoader().load(img);	

	var material = new THREE.MeshPhongMaterial({
		shininess: 300, 
		specular: 0x33AA33,
		map: texture
	});

	material.flatShading = false;

	var threeObject = new THREE.Mesh( new THREE.BoxGeometry(height, width, length), material);

	
	threeObject.castShadow = true;
	threeObject.receiveShadow = true;

	boxes.push(threeObject)

	scene.add(threeObject)

	return threeObject;
}

function makeframe(box, wirecolor) {
	var geo = new THREE.WireframeGeometry( box ); // or EdgesGeometry( geometry )

	var mat = new THREE.LineBasicMaterial( { color: wirecolor, linewidth: 2 } );

	var wireframe = new THREE.LineSegments( geo, mat );

	scene.add( wireframe );

	return wireframe;
}

function makewall(quatx, quaty, quatz, quatw) {
	wallBody = new CANNON.Body({
		mass: 0
	});
	var wallShape = new CANNON.Plane();

	wallBody.addShape(wallShape);
	world.addBody(wallBody);
	wallBody.quaternion.set(quatx, quaty, quatz, quatw);

	return wallBody;
}


function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight - 10 );
	genwalls()
}
window.addEventListener( 'resize', onWindowResize, false );

// Set position for invis walls on window resize
function genwalls() {
	bodywidth = document.getElementById('page').offsetWidth;
    bodyheight = document.getElementById('page').offsetHeight;
    maxstretch = (bodywidth / bodyheight) / 0.01998171607679248
	walls[0].position.x = maxstretch + 10
	walls[1].position.x = -(maxstretch + 10)
}