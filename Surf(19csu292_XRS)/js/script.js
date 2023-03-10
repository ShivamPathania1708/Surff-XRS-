 
if ( ! Detector.webgl ) {
        Detector.addGetWebGLMessage();
        document.getElementById( 'container' ).innerHTML = "";
}
 
 
 
var textureCube;
var keyboard = new THREEx.KeyboardState();
var container, stats;
var camera, controls, scene, renderer, water, randomX, randomY;
var mesh, texture, cube, coin, coin2, score, object, objectTmp;
var worldWidth = 512, worldDepth = 512,
worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2
var clock = new THREE.Clock();
var allCrates = []; //tabela v katero shranis vse objekte, za collision
var allCoins = []; //tabela kovanckov
var started = false;
var score = 0;
var maxScore = 0;
var divScore;
var cube1;
var colided = false;
var finished = true;
var finishTmp = [];
var collisionSpecCoin;
var objSpeed;
var scoreCounter = false;
var first;

init();
animate();


//Loop for baground music
var loopMusic = new Audio('sounds/bagroundmusic.mp3');
loopMusic.loop = true;
loopMusic.play();

var ship = new Audio('sounds/watersound.wav');
ship.loop = true;
ship.play();


 
function init() {
        container = document.getElementById( 'container' );
        score = 0;
        objSpeed = -4;
        allCoins = [];
        console.log(maxScore);
        console.log(score);

        maxScore = calculateMaxScore(maxScore,score);

 
        //camera
        camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 110000 );
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0125 );
        data = generateHeight( worldWidth, worldDepth );        
        camera.position.set(15, 4, 0);
        scene.add(camera);
        
        //Plane
        var geometry = new THREE.PlaneBufferGeometry( 2000, 50000, worldWidth - 1, worldDepth - 1 );
        geometry.rotateX( - Math.PI / 2 );
 
        var vertices = geometry.attributes.position.array;
 
        for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 )
                vertices[ j + 1 ] = data[ i ] * 10;
 
       
        //texture Import
        var urls = [
                'textures/sky/graycloud_rt.jpg',
                'textures/sky/graycloud_lf.jpg',
                'textures/sky/graycloud_up.jpg',         
                'textures/sky/graycloud_dn.jpg',
                'textures/sky/graycloud_bk.jpg',         
                'textures/sky/graycloud_ft.jpg'
        ];
 
        textureCube = THREE.ImageUtils.loadTextureCube(urls);
        var shader = THREE.ShaderLib['cube'];
        var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
        uniforms['tCube'].value = textureCube;
        var skyboxmaterial = new THREE.ShaderMaterial({
                fragmentShader : shader.fragmentShader,
                vertexShader   : shader.vertexShader,
                uniforms       : shader.uniforms,
                depthWrite: false,
                side: THREE.BackSide
        });
 
        var skyGeometry = new THREE.CubeGeometry( 100000, 100000, 100000 );    
        var materialArray = [];
        for (var i = 0; i < 6; i++)
                materialArray.push( new THREE.MeshBasicMaterial({
                        map: THREE.ImageUtils.loadTexture(urls[i]),
                        side: THREE.BackSide
                }));
        var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
        var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
        scene.add( skyBox );
 
 
        //Water
        var waterTexture = new THREE.ImageUtils.loadTexture( 'textures/water.jpg' );
        waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping;
        waterTexture.repeat.set( 5, 5 );
        var waterMaterial = new THREE.MeshBasicMaterial( { map: waterTexture, side: THREE.DoubleSide } );
        var waterGeometry = new THREE.PlaneGeometry(3000, 50000);
        water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.position.y = 360;
        water.rotation.x = Math.PI / 2;
        water.doubleSided = true;
        scene.add(water);     
        

        //Loading the objects
		var loader = new THREE.ObjectLoader();
			loader.load( 'models/ladja2.json', 
			function ( objectTmp) {
				objectTmp.scale.x = objectTmp.scale.y = objectTmp.scale.z = 15.5;
				objectTmp.position.y = water.position.y + Math.round(cube.geometry.parameters.height/2)-13;	//voda je na 250 torej more bit objekt na 250+polovica vi??ine objekta
				objectTmp.position.x = 250;
				objectTmp.position.z = 24800;
				camera.rotateOnAxis( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2);
				objectTmp.add(camera);
				objectTmp.rotateOnAxis( new THREE.Vector3( 0, 1, 0 ), -Math.PI / 2);
			    
			    scene.add( objectTmp );
			   	object = objectTmp;
			} );

        //Setting Up the boxes
        var geometryCube = new THREE.BoxGeometry(25, 25, 25);        
        var materialCube = new THREE.MeshBasicMaterial({transparent: true, opacity: 0});
        cube = new THREE.Mesh(geometryCube, materialCube);
        
        cube.position.y = water.position.y + Math.round(cube.geometry.parameters.height/2);     
        cube.position.x = 250;
        cube.position.z = 24800;        
        scene.add(cube);
       

       //Lights
       	var ambientLight = new THREE.AmbientLight(0x404040);
		scene.add(ambientLight);

		var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
		scene.add( light );


        
		
        
        createCilj(140, 360, -19030);
        createCilj(140, 385, -19030);
        createCilj(140, 405, -19030);
        createCilj(140, 430, -19030);
        createCilj(140, 455, -19030);
        createCilj(140, 480, -19030);
        
        createCilj(340, 360, -19030);
        createCilj(340, 385, -19030);
        createCilj(340, 405, -19030);
        createCilj(340, 430, -19030);
        createCilj(340, 455, -19030);
        createCilj(340, 480, -19030);
        
        createCilj(165, 480, -19030);
        createCilj(190, 480, -19030);
        createCilj(215, 480, -19030);
        createCilj(240, 480, -19030);
        createCilj(265, 480, -19030);
        createCilj(290, 480, -19030);
        createCilj(315, 480, -19030);

        var geometryCube1 = new THREE.BoxGeometry(25, 25, 25);
        var materialCube1 = new THREE.MeshBasicMaterial({color: 0xffd700});
        finish = new THREE.Mesh(geometryCube1, materialCube1);
        finish.position.y = water.position.y + Math.round(finish.geometry.parameters.height/2);     
        finish.position.x = 250;
        finish.position.z = -19000;
        finishTmp.push(finish);
        scene.add(finish);

       
	//Colllision detection
        var y = water.position.y + Math.round(cube.geometry.parameters.height/2);
 
        var pot = new THREE.SplineCurve3( [
                new THREE.Vector3(373, y, 24840 ),
                new THREE.Vector3(209, y, 22050 ),
                new THREE.Vector3(197, y, 21408 ),
                new THREE.Vector3(120, y, 21005 ),
                new THREE.Vector3(93, y, 19689 ),
                new THREE.Vector3(148, y, 18802 ),
                new THREE.Vector3(140, y, 18282 ),
                new THREE.Vector3(102, y, 17363 ),
                new THREE.Vector3(115, y, 16535 ),
                new THREE.Vector3(137, y, 14476 ),
                new THREE.Vector3(114, y, 13331 ),
                new THREE.Vector3(75, y, 12368 ),
                new THREE.Vector3(17, y, 10905 ),
                new THREE.Vector3(-19, y, 9597 ),
                new THREE.Vector3(-18, y, 8562 ),
                new THREE.Vector3(4, y, 7206 ),
                new THREE.Vector3(-10, y, 6500 ),
                new THREE.Vector3(41, y, 6958 ),
                new THREE.Vector3(192, y, 5188 ),
                new THREE.Vector3(-3, y, 3944 ),
                new THREE.Vector3(-32, y, 3142 ),
                new THREE.Vector3(-2, y, 1351 ),
                new THREE.Vector3(41, y, -501 ),
                new THREE.Vector3(87, y, -1690 ),
                new THREE.Vector3(239, y, -1719 ),
                new THREE.Vector3(197, y, -3715 ),
                new THREE.Vector3(270, y, -6216 ),
                new THREE.Vector3(337, y, -7206 ),
                new THREE.Vector3(445, y, -8604 ),
                new THREE.Vector3(531, y, -10415 ),
                new THREE.Vector3(520, y, -12552 ),
                new THREE.Vector3(552, y, -13973 ),
                new THREE.Vector3(514, y, -14921 ),
                new THREE.Vector3(453, y, -17007 ),
                new THREE.Vector3(417, y, -17926 ),
                new THREE.Vector3(376, y, -18430 ),
                new THREE.Vector3(338, y, -19429 ),
                new THREE.Vector3(205, y, -19943 ),
                new THREE.Vector3(97, y, -19334 ),
                new THREE.Vector3(23, y, -17685 ),
                new THREE.Vector3(-9, y, -16203 ),
                new THREE.Vector3(-62, y, -15608 ),
                new THREE.Vector3(-81, y, -13808 ),
                new THREE.Vector3(-103, y, -13050 ),
                new THREE.Vector3(-70, y, -11672 ),
                new THREE.Vector3(-51, y, -10525 ),
                new THREE.Vector3(-49, y, -9143 ),
                new THREE.Vector3(-10, y, -8224 ),
                new THREE.Vector3(27, y, -7476 ),
                new THREE.Vector3(57, y, -7018 ),
                new THREE.Vector3(60, y, -6171 ),
                new THREE.Vector3(66, y, -4724 ),
                new THREE.Vector3(6, y, -2842 ),
                new THREE.Vector3(-24, y, -1417 ),
                new THREE.Vector3(-60, y, -1257 ),
                new THREE.Vector3(-112, y, 1151 ),
                new THREE.Vector3(-148, y, 2713 ),
                new THREE.Vector3(-168, y, 4759 ),
                new THREE.Vector3(-218, y, 4954 ),
                new THREE.Vector3(-292, y, 5962 ),
                new THREE.Vector3(-341, y, 6163 ),
                new THREE.Vector3(-356, y, 6692 ),
                new THREE.Vector3(-396, y, 6878 ),
                new THREE.Vector3(-232, y, 7814 ),
                new THREE.Vector3(-143, y, 9437 ),
                new THREE.Vector3(-49, y, 12744 ),
                new THREE.Vector3(-31, y, 13939 ),
                new THREE.Vector3(28, y, 14856 ),
                new THREE.Vector3(46, y, 15454 ),
                new THREE.Vector3(25, y, 16373 ),
                new THREE.Vector3(-76, y, 16389 ),
                new THREE.Vector3(-105, y, 17099 ),
                new THREE.Vector3(-199, y, 18443 ),
                new THREE.Vector3(-251, y, 19079 ),
                new THREE.Vector3(-30, y, 19416 ),
                new THREE.Vector3(2, y, 20076 ),
                new THREE.Vector3(9, y, 20535 ),
                new THREE.Vector3(-13, y, 21407 ),
                new THREE.Vector3(-3, y, 22692 ),
                new THREE.Vector3(122, y, 23374 ),
                new THREE.Vector3(160, y, 24383 ),
                new THREE.Vector3(197, y, 25000 )              
        ]);
 
        var vectorCheck1 = new THREE.SplineCurve3( [
                new THREE.Vector3(32, y, 18855 ),
                new THREE.Vector3(26, y, 18487 )
        ]);   
 
        var vectorCheck2 = new THREE.SplineCurve3( [
                new THREE.Vector3(224, y, -7406 ),
                new THREE.Vector3(287, y, -8232 ),
                new THREE.Vector3(362, y, -9701 ),
                new THREE.Vector3(405, y, -11168 ),
                new THREE.Vector3(419, y, -13280 ),
                new THREE.Vector3(401, y, -14406 ),
                new THREE.Vector3(362, y, -15941 ),
                new THREE.Vector3(291, y, -17384 ),
                new THREE.Vector3(208, y, -17997 ),
                new THREE.Vector3(148, y, -17311 ),
                new THREE.Vector3(108, y, -16462 ),
                new THREE.Vector3(52, y, -15041 ),
                new THREE.Vector3(30, y, -12214 ),
                new THREE.Vector3(47, y, -10816 ),
                new THREE.Vector3(72, y, -9600 ),
                new THREE.Vector3(100, y, -8819 ),
                new THREE.Vector3(102, y, -8178 ),
                new THREE.Vector3(133, y, -7951 ),
                new THREE.Vector3(200, y, -7526 ),
                new THREE.Vector3(216, y, -7391 )
        ]);   
 
 
 
        var geometryLine = new THREE.Geometry();
        var geometryLine2 = new THREE.Geometry();
        var geometryLine3 = new THREE.Geometry();
 
        geometryLine.vertices = pot.getPoints( 50 );
        geometryLine2.vertices = vectorCheck1.getPoints( 50 );
        geometryLine3.vertices = vectorCheck2.getPoints( 50 );
 
        var materialLine = new THREE.LineBasicMaterial( {} );
 
        //Creating the slpine objects
        var splineObject = new THREE.Line( geometryLine, materialLine );
        var splineObject2 = new THREE.Line( geometryLine2, materialLine );
        var splineObject3 = new THREE.Line( geometryLine3, materialLine );
        
        allCrates.push(splineObject);
        allCrates.push(splineObject2);
        allCrates.push(splineObject3);

 
        //Obstacle's Creations
		createObstacle(230, 24200);
		createObstacle(150, 22200);
		createObstacle(50, 21200);
		createObstacle(80, 20200);
		createObstacle(100, 19200);
		createObstacle(30, 18200);
		createObstacle(80, 17200);
		createObstacle(80, 14200);
		createObstacle(80, 13200);
		createObstacle(-70, 11200);
		createObstacle(-110, 9800);
		createObstacle(-130, 8200);
		createObstacle(-150, 7200);
		createObstacle(0, 7200);
		createObstacle(-200, 7800);
		createObstacle(-10, 6800);
		createObstacle(-250, 6800);
		createObstacle(50, 6400);
		createObstacle(-30, 5700);
		createObstacle(-50, 3500);
		createObstacle(-100, 3000);
		createObstacle(-20, 1200);
		createObstacle(-60, 100);
		createObstacle(0, -1000);
		createObstacle(100, -2300);
		createObstacle(70, -3500);
		createObstacle(200, -4800);
		createObstacle(210, -5300);
		createObstacle(100, -6400);
		createObstacle(350, -7700);
		createObstacle(350, -9000);
		createObstacle(450, -9010);
		createObstacle(400, -10000);
		createObstacle(500, -11000);
		createObstacle(445, -12300);
		createObstacle(520, -13700);
		createObstacle(520, -14300);
		createObstacle(400, -15200);
		createObstacle(450, -16400);
		createObstacle(350, -17000);
		createObstacle(430, -17700);
		createObstacle(196, -6820);
		createObstacle(120, -7200);
		createObstacle(70, -8300);
		createObstacle(40, -9200);
		createObstacle(-30, -10700);
		createObstacle(10, -11200);
		createObstacle(-70, -12100);
		createObstacle(-20, -13000);
		createObstacle(-60, -14100);
		createObstacle(30, -15000);
		createObstacle(10, -16200);
		createObstacle(20, -16900);
		createObstacle(90, -17500);
		createObstacle(70, -18100);
 
        
        
        for (var i=0; i<=100; i++) {
            randomX = Math.floor(Math.random() * 500)-200;
            randomY = Math.floor(Math.random() * 45000)-16000;  
           	createCoin(randomX, randomY);
        }      
       
       
        
        var geometryCoin = new THREE.CylinderGeometry( 8, 8, 2, 32 );
        var materialCoin = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        coin = new THREE.Mesh( geometryCoin, materialCoin );
       
        coin.position.y = water.position.y + Math.round(cube.geometry.parameters.height/2);
        coin.position.x = 250;
        coin.position.z = 24250;
        allCoins.push(coin);
        scene.add( coin );


        var sphereGeometry = new THREE.SphereGeometry( 8, 8, 16 ); 
		var sphereMaterial = new THREE.MeshLambertMaterial( {transparent: true, opacity: 0} ); 
		var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphere.position.set(250,  coin.position.y, 24250);
		scene.add(sphere);
       
 
        
        texture = new THREE.CanvasTexture( generateTexture( data, worldWidth, worldDepth ) );
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
        scene.add( mesh );

        //setting the renderer        
        renderer = new THREE.WebGLRenderer();        
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.innerHTML = "";
        container.appendChild( renderer.domElement );

       

        first = document.createElement("div");
		first.id="first1";
		first.className="first";
		var container = document.getElementById("container");
		container.appendChild(first);

     	document.getElementById("scoreDiv").innerHTML = score.toString();
     	document.getElementById("maxScore").innerHTML = 'highScore: '+maxScore.toString();
 
        window.addEventListener( 'resize', onWindowResize, false );
 
} 
 //Coins for collection
function createCoin(cx, cz) {
        
        var geometryCoin = new THREE.CylinderGeometry( 8, 8, 2, 32 );
        var materialCoin = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        coin = new THREE.Mesh( geometryCoin, materialCoin );
       
        coin.position.y = water.position.y + Math.round(cube.geometry.parameters.height/2);
        coin.position.x = cx;
        coin.position.z = cz;
        coin.rotation.x += 0.1;
        coin.rotation.z += 0.13;
        allCoins.push(coin);
        scene.add( coin );
        return coin;
}
 
//Obstacles creation
function createObstacle(ox, oz) {
        var crateTexture = new THREE.ImageUtils.loadTexture('textures/crate.jpg');
        var crateMaterial = new THREE.MeshBasicMaterial( { map: crateTexture } );
        var crateGeometry = new THREE.CubeGeometry(25, 25, 25, 1, 1, 1);
        crate = new THREE.Mesh(crateGeometry, crateMaterial);
        //voda je na 250 torej more bit objekt na 250+polovica vi??ine objekta
        crate.position.y = water.position.y + Math.round(cube.geometry.parameters.height/2);    
        crate.position.x = ox;
        crate.position.z = oz;
        allCrates.push(crate);
        scene.add( crate );
        return crate;
}
function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        
}
 


function generateHeight( width, height ) {
        var size = width * height, data = new Uint8Array( size ),
        perlin = new ImprovedNoise(), quality = 1, z = 100;
        for ( var j = 0; j < 4; j ++ ) {
                for ( var i = 0; i < size; i ++ ) {
                        var x = i % width, y = ~~ ( i / width );
                        data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
                }
                quality *= 5;
        }
        return data;
}
 
 

function generateTexture( data, width, height ) {
 
        var canvas, canvasScaled, context, image, imageData,
        level, diff, vector3, sun, shade;
 
        vector3 = new THREE.Vector3( 0, 0, 0 );
 
        sun = new THREE.Vector3( 1, 1, 1 );
        sun.normalize();
 
        canvas = document.createElement( 'canvas' );
        canvas.width = width;
        canvas.height = height;
 
        context = canvas.getContext( '2d' );
        context.fillStyle = '#000';
        context.fillRect( 0, 0, width, height );
 
        image = context.getImageData( 0, 0, canvas.width, canvas.height );
        imageData = image.data;
 
        for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {
                vector3.x = data[ j - 2 ] - data[ j + 2 ];
                vector3.y = 2;
                vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
                vector3.normalize();
 
                shade = vector3.dot( sun );
 
                imageData[ i ] = ( 20 + shade * 80 ) * ( 0.5 + data[ j ] * 0.007 );
                imageData[ i + 1 ] = ( 20 + shade * 80 ) * ( 0.5 + data[ j ] * 0.007 );
                imageData[ i + 2 ] = ( shade * 80 ) * ( 0.5 + data[ j ] * 0.003 );
        }
 
        context.putImageData( image, 0, 0 );
 
        
        canvasScaled = document.createElement( 'canvas' );
        canvasScaled.width = width * 4;
        canvasScaled.height = height * 4;
 
        context = canvasScaled.getContext( '2d' );
        context.scale( 4, 4 );
        context.drawImage( canvas, 0, 0 );
 
        image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
        imageData = image.data;
 
        for ( var i = 0, l = imageData.length; i < l; i += 4 ) {
                var v = ~~ ( Math.random() * 5 );
                imageData[ i ] += v;
                imageData[ i + 1 ] += v;
                imageData[ i + 2 ] += v;
        }
 
        context.putImageData( image, 0, 0 );
 
        return canvasScaled;
}


function createCilj(ox, oy, oz) {
        var crateTexture = new THREE.ImageUtils.loadTexture('textures/crate.jpg');
        var crateMaterial = new THREE.MeshBasicMaterial( { map: crateTexture } );
        var crateGeometry = new THREE.CubeGeometry(25, 25, 25, 1, 1, 1);
        crate = new THREE.Mesh(crateGeometry, crateMaterial);
        //voda je na 250 torej more bit objekt na 250+polovica vi??ine objekta
        crate.position.y = oy;    
        crate.position.x = ox;
        crate.position.z = oz;
        scene.add( crate );
        return crate;
}
 
 

function animate() {
        // scene.simulate();
        render();
        requestAnimationFrame( animate );
        //stats.update();
}
 
 
function render() {
 
        var delta = clock.getDelta();
        var moveDistance = 20 * delta;
        var rotateAngle = Math.PI / 6 * delta;
        
        var elapsed = Math.floor(clock.elapsedTime);
        if(started){
            if(elapsed % 2 == 1)
            	objSpeed -= 0.025;
            	if(objSpeed < -23)
                     objSpeed = -23;
            cube.translateZ(objSpeed);
            object.translateX(objSpeed);
        }
        //Keyboard keys mapping
        if(keyboard.pressed("left")) {
                if(!started && !colided){
                    startClock();
                }
                
                else{
                	cube.rotateOnAxis( new THREE.Vector3( 0, 1, 0 ), rotateAngle);
                	object.rotateOnAxis( new THREE.Vector3( 0, 1, 0 ), rotateAngle);
                }
        }
 
        if(keyboard.pressed("right")) {
                if(!started && !colided){
                    startClock();	
                }
                
                else{
                	cube.rotateOnAxis( new THREE.Vector3( 0, 1, 0 ), -rotateAngle);
                	object.rotateOnAxis( new THREE.Vector3( 0, 1, 0 ), -rotateAngle);
                }	
        }
 
        if(keyboard.pressed("space")) {
                init();
                started = false;
                colided = false;
                finished = false;
                score = 0;
                document.getElementById("gameOver").innerHTML = "";
        }
       
 
        // collision detection 
        var originPoint = cube.position.clone();
        if(!colided){
	        for (var vertexIndex = 0; vertexIndex < cube.geometry.vertices.length; vertexIndex++){		
				var localVertex = cube.geometry.vertices[vertexIndex].clone();
				var globalVertex = localVertex.applyMatrix4( cube.matrix );
				var directionVector = globalVertex.sub( cube.position );
				var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
				var collisionResultsCrate = ray.intersectObjects( allCrates );
				var collisionResultsCoins = ray.intersectObjects( allCoins );
				var collisionResultFinish = ray.intersectObjects(finishTmp);


				//  ??katlo
				if (collisionResultsCrate.length > 0 && started) {
					var hit = new Audio('sounds/hit.mp3');
					hit.play();

					started = false;
					colided = true; 
					document.getElementById("gameOver").innerHTML = 'Too Soon!!!  You\'ve collected '+score.toString()+' coins!';
					maxScore = calculateMaxScore(maxScore,score);
					document.getElementById("maxScore").innerHTML = 'highScore: '+maxScore.toString();
					break;
				}

				// finish
				if (collisionResultFinish.length > 0 && started) {
					var victory = new Audio('sounds/victory.wav');
					victory.play();

					started = false;
					finished = true;
					document.getElementById("gameOver").innerHTML = 'YOU\ ARE THE REAL PIRATE! You\'ve collected '+score.toString()+' coins!';
					maxScore = calculateMaxScore(maxScore,score);
					document.getElementById("maxScore").innerHTML = 'highScore: '+maxScore.toString();
					break;
				}

				//  ??eton
				if (collisionResultsCoins.length > 0 && collisionResultsCoins[0].distance < directionVector.length()) {
					var kovancek = new Audio('sounds/item1.wav');
					kovancek.play();
					// find out which coin you collected and remove it from the scene & array				
					for ( var i = 0; i < collisionResultsCoins.length; i++ ) {
						allCoins.splice(i,1);
						collisionResultsCoins[i].object.position.y = 0;
						scoreCounter[collisionResultsCoins[i].object] = 1;
						if(!scoreCounter){
							score++;
							scoreCounter = true;
						}

						break;
					};
					//score = calculateScore();
					document.getElementById("scoreDiv").innerHTML = score.toString();
				}	
			}
		}
		scoreCounter = false;      
       	rotateCoins();
        renderer.render( scene, camera );
}
 
 

function startClock(){
        started = true;
        clock = new THREE.Clock();
}


function rotateCoins(){
	for (coin1 of allCoins){
		coin1.rotation.x += 0.1;
        coin1.rotation.z += 0.13;
	}
}

function calculateScore(){
	var tmpScore = 0; 
	for (el of scoreCounter) {
		tmpScore += el;
	}
	return tmpScore;
}

function calculateMaxScore(max, score1){
	var pes = Math.max(max, score1);
	console.log(pes);
	return pes

}
