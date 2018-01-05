/**
* dat.globe Javascript WebGL Globe Toolkit
* https://github.com/dataarts/webgl-globe
*
* Copyright 2011 Data Arts Team, Google Creative Lab
*
* Licensed under the Apache License, Version 2.0 (the 'License');
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*/

var DAT = DAT || {};
// var raycaster = new THREE.Raycaster();

DAT.Globe = function(container, opts) {
    // var domEvents = new THREEx.DomEvents(camera, renderer.domElement)
    opts = opts || {};

    var colorFn = opts.colorFn || function(x) {
        var c = new THREE.Color();
        c.setHSL((0.6 - (x * 0.5)), 1.0, 0.5);
        return c;
    };
    var imgDir = opts.imgDir || '/public/imgs/'; //lol do we need this

    var Shaders = {
        'earth': {
            uniforms: {
                'texture': {
                    type: 't',
                    value: null
                }
            },
            vertexShader: [
                'varying vec3 vNormal;',
                'varying vec2 vUv;',
                'void main() {',
                'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
                'vNormal = normalize( normalMatrix * normal );',
                'vUv = uv;',
                '}'
            ].join('\n'),
            fragmentShader: [
                'uniform sampler2D texture;',
                'varying vec3 vNormal;',
                'varying vec2 vUv;',
                'void main() {',
                'vec3 diffuse = texture2D( texture, vUv ).xyz;',
                'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
                'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );',
                'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
                '}'
            ].join('\n')
        }
    };

    var camera,
        scene,
        renderer,
        w,
        h;
    var mesh,
        point,
        city,
        cloudMesh;

    var globe;

    var overRenderer;

    var curZoomSpeed = 0;
    var zoomSpeed = 50;

    var mouse = {
            x: 0,
            y: 0
        },
        mouseOnDown = {
            x: 0,
            y: 0
        };
    var rotation = {
            x: 0,
            y: 0
        },
        target = {
            x: Math.PI * 3 / 2,
            y: Math.PI / 6.0
        },
        targetOnDown = {
            x: 0,
            y: 0
        };

    var distance = 100000,
        distanceTarget = 100000;
    var padding = 40;
    var PI_HALF = Math.PI / 2;


    function init() {

        container.style.color = '#fff';
        container.style.font = '13px/20px Arial, sans-serif';

        var shader,
            uniforms,
            material;
        w = container.offsetWidth || window.innerWidth;
        h = container.offsetHeight || window.innerHeight;

        camera = new THREE.PerspectiveCamera(30, w / h, 1, 10000);
        camera.position.z = distance;

        scene = new THREE.Scene();

        var light = new THREE.AmbientLight(0xFFFFFF);
        scene.add(light);

        //SUBMIT BUTTON!!!!!!!!!
        var text = document.getElementById('text')

        //EARTH!!!!!!!!!
        var geometry = new THREE.SphereGeometry(200, 40, 30);
        shader = Shaders['earth'];
        uniforms = THREE.UniformsUtils.clone(shader.uniforms);

        uniforms['texture'].value = THREE.ImageUtils.loadTexture(imgDir + 'world.jpg');

        material = new THREE.ShaderMaterial({uniforms: uniforms, vertexShader: shader.vertexShader, fragmentShader: shader.fragmentShader});

        mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.y = Math.PI;
        scene.add(mesh);

        //CLOUDS!!!!!!!!!!!!!!
        var cloudGeometry = new THREE.SphereGeometry(205, 40, 30);
        var cloudMaterial = new THREE.MeshLambertMaterial({transparent: true, opacity: 0.4});
        cloudMaterial.map = new THREE.TextureLoader().load('/public/imgs/clouds.png');
        cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        scene.add(cloudMesh);

        // globe = new THREE.Group();
        // console.log('globe!!!!!!', globe)

        var imagePrefix = "/public/imgs/"
        var urls = [
            'space.jpg',
            'space.jpg',
            'space.jpg',
            'space.jpg',
            'space.jpg',
            'space.jpg'
        ]
        var skyBox = new THREE.CubeTextureLoader().setPath(imagePrefix).load(urls);
        scene.background = skyBox;

        geometry = new THREE.BoxGeometry(3, 3, 10);
        // geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -0.5));
        point = new THREE.Mesh(geometry);

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(w, h);

        renderer.domElement.style.position = 'absolute';

        container.appendChild(renderer.domElement);

        container.addEventListener('mousedown', onMouseDown, false);
        container.addEventListener('mousewheel', onMouseWheel, false);
        container.addEventListener('mousewheel', onMouseWheel, false);

        text.addEventListener('keydown', submitText, false);
        // document.addEventListener('keydown', onDocumentKeyDown, false);
        // window.addEventListener('resize', onWindowResize, false);

        container.addEventListener('mouseover', function() {
            overRenderer = true;
        }, false);

        container.addEventListener('mouseout', function() {
            overRenderer = false;
        }, false);
    }

    function addData(data, opts) {
        var lat,
            lng,
            size,
            color,
            i,
            step,
            colorFnWrapper;

        opts.animated = opts.animated || false;
        this.is_animated = opts.animated;
        opts.format = opts.format || 'magnitude'; // other option is 'legend'
        if (opts.format === 'magnitude') {
            step = 3;
            colorFnWrapper = function(data, i) {
                return colorFn(data[i + 2]);
            }
        } else if (opts.format === 'legend') {
            step = 4;
            colorFnWrapper = function(data, i) {
                return colorFn(data[i + 3]);
            }
        } else {
            throw('error: format not supported: ' + opts.format);
        }

        if (!opts.animated) {
            if (this._baseGeometry === undefined) {
                this._baseGeometry = new THREE.Geometry();
                for (i = 0; i < data.length; i += step) {
                    // console.log('inside for loop of addData', data.length)
                    lat = data[i];
                    lng = data[i + 1];
                    //        size = data[i + 2];
                    color = colorFnWrapper(data, i);
                    size = 3;
                    addPoint(lat, lng, size, color, this._baseGeometry);
                }
            }
            var subgeo = new THREE.Geometry();
            for (i = 0; i < data.length; i += step) {
                // console.log('inside other for loop???', data);
                lat = data[i];
                lng = data[i + 1];
                color = colorFnWrapper(data, i);
                // size = data[i + 2];
                // size = size * 200;
                addPoint(lat, lng, size, color, subgeo);
            }
        }

    };

    function createPoints() {
        this.points = new THREE.Mesh(this._baseGeometry, new THREE.MeshBasicMaterial({color: 0xff0000}));
        scene.add(this.points);
    }

    // console.log('these are the points', this.points)
    function addPoint(lat, lng, size, color, subgeo) {

        var phi = (90 - lat) * Math.PI / 180;
        var theta = (180 - lng) * Math.PI / 180;

        point.position.x = 200 * Math.sin(phi) * Math.cos(theta);
        point.position.y = 200 * Math.cos(phi);
        point.position.z = 200 * Math.sin(phi) * Math.sin(theta);

        point.lookAt(mesh.position);

        point.scale.z = Math.max(size, 0.1); // avoid non-invertible matrix
        point.updateMatrix();

        if (point.matrixAutoUpdate) {
            point.updateMatrix();
        }
        subgeo.merge(point.geometry, point.matrix);
    }

    function submitText(e) {
        console.log('inside submitClick | globe.js')

        if (e.keyCode == 13) {
            event.preventDefault();
            var text = document.getElementById('text').value
            console.log('text', text)

            $.ajax({
                type: "POST",
                url: '/check-city',
                data: {
                    textVal
                },
                dataType: 'json',
                success: function(data) {
                    console.log('three.js side | data for lat/long', data)

                    var lat = data.latitude;
                    var lng = data.longitude;

                    goToPoint(lat, lng);
                    // var phi = latitude * Math.PI / 180;
                    // var theta = (270 - longitude) * Math.PI / 180;
                    // var euler = new THREE.Euler(phi, theta, 0, 'XYZ');
                },
                error: function(err) {
                    console.log('error!!', err)
                    return;
                }
            })
        }
        else {

        }



    }

    function goToPoint(lat, lng) {
        console.log('inside goToPoint')
        console.log('lat: ', lat, 'lng: ', lng)

        var phi = (90 - lat) * Math.PI / 180;
        var theta = (180 - lng) * Math.PI / 180;
        var euler = new THREE.Euler(phi, theta, 0, 'XYZ');

        var from = {
            x: camera.position.x,
            y: camera.position.y,
            z: distance
        };
        // console.log('current camera position: ', from)

        var to = {
            posX: 200 * Math.sin(phi) * Math.cos(theta),
            posY: 200 * Math.cos(phi),
            posZ: distance
        };
        // console.log('need to move to: ', to)

        var tween = new TWEEN.Tween(from)
            .to(to,600)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
                camera.position.set(this.x, this.y, this.z);
                camera.lookAt(new THREE.Vector3(0,0,0));
            })
            .onComplete(function () {
                camera.lookAt(new THREE.Vector3(0,0,0));
            })
            .start();

    }

    function onMouseDown(event) {
        event.preventDefault();

        container.addEventListener('mousemove', onMouseMove, false);
        container.addEventListener('mouseup', onMouseUp, false);
        container.addEventListener('mouseout', onMouseOut, false);

        mouseOnDown.x = -event.clientX;
        mouseOnDown.y = event.clientY;

        targetOnDown.x = target.x;
        targetOnDown.y = target.y;

        container.style.cursor = 'move';
    }

    function onMouseMove(event) {
        mouse.x = -event.clientX;
        mouse.y = event.clientY;

        var zoomDamp = distance / 1000;

        target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005 * zoomDamp;
        target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005 * zoomDamp;

        target.y = target.y > PI_HALF
            ? PI_HALF
            : target.y;
        target.y = target.y < -PI_HALF
            ? -PI_HALF
            : target.y;

        // console.log('target.x: ', target.x)
        // console.log('target.x: ', target.y);
    }

    function onMouseUp(event) {
        container.removeEventListener('mousemove', onMouseMove, false);
        container.removeEventListener('mouseup', onMouseUp, false);
        container.removeEventListener('mouseout', onMouseOut, false);
        container.style.cursor = 'auto';
    }

    function onMouseOut(event) {
        container.removeEventListener('mousemove', onMouseMove, false);
        container.removeEventListener('mouseup', onMouseUp, false);
        container.removeEventListener('mouseout', onMouseOut, false);
    }

    function onMouseWheel(event) {
        event.preventDefault();
        if (overRenderer) {
            zoom(event.wheelDeltaY * 0.3);
        }
        return false;
    }

    // function onWindowResize(event) {
    //     camera.aspect = container.offsetWidth / container.offsetHeight;
    //     camera.updateProjectionMatrix();
    //     renderer.setSize(container.offsetWidth, container.offsetHeight);
    // }

    function zoom(delta) {
        distanceTarget -= delta;
        distanceTarget = distanceTarget > 1000
            ? 1000
            : distanceTarget;
        distanceTarget = distanceTarget < 350
            ? 350
            : distanceTarget;
    }

    function animate() {
        requestAnimationFrame(animate);
        cloudMesh.rotation.x += 0.000;
        cloudMesh.rotation.y += 0.001;
        render();
    }

    function render() {
        zoom(curZoomSpeed);
        // console.log('zoom(curZoomSpeed) :' z)

        rotation.x += (target.x - rotation.x) * 0.1;
        rotation.y += (target.y - rotation.y) * 0.1;
        distance += (distanceTarget - distance) * 0.3;
        // console.log('rotation.x: ', rotation.x);
        // console.log('rotation.y: ', rotation.y);

        camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
        camera.position.y = distance * Math.sin(rotation.y);
        camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);

        // console.log('camera.position.x: ', camera.position.x);
        // console.log('camera.position.y: ', camera.position.y);
        // console.log('camera.position.z: ', camera.position.z);
        // TWEEN.update();
        camera.lookAt(mesh.position);

        renderer.render(scene, camera);
    }

    init();
    this.animate = animate;
    this.addData = addData;
    this.createPoints = createPoints;
    this.renderer = renderer;
    this.scene = scene;

    return this;

};
