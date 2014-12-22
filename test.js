var onReady = function() {
	var View = require('threejs-managed-view').View;
	var SplineLoop = require('threejs-spline-loop');
	var SplineLoopHelper = require('threejs-spline-loop-helper');
	var SplineLoopPrism = require('./');
	var view = new View({
		useRafPolyfill: false
	});
	var scene = view.scene;
	view.camera.updateMatrixWorld();

	var pointsTotal = 8;
	var radius = 4;
	var points = [];
	for (var i = 0; i < pointsTotal; i++) {
		var ratio = i / pointsTotal;
		var radian = ratio * Math.PI * 2;
		var point = new THREE.Vector3();
		point.set(
			Math.cos(radian) * radius,
			1,
			Math.sin(radian) * radius
		);
		point.x += Math.random() - .5;
		point.y += Math.random() - .5;
		point.z += Math.random() - .5;
		points.push(point);
	};

	var spline = new SplineLoop(points);
	spline.cache(100);
	var splineHelper = new SplineLoopHelper(spline, {
		color: 0x7f9faf,
		handleRadius: .15,
		renderDepth: 1
	});
	scene.add(splineHelper);

	var splinePrism = SplineLoopPrism.createFromSplineLoopAndScalarAndOffsetY(spline, .9, .3);
	splinePrism.cache(100);

	var prismHelperOptions = {
		color: 0x9f7f5f,
		handleRadius: .05,
		renderDepth: 1
	};
	scene.add(new SplineLoopHelper(splinePrism.splineLoopInnerTop, prismHelperOptions));
	scene.add(new SplineLoopHelper(splinePrism.splineLoopInnerBottom, prismHelperOptions));
	scene.add(new SplineLoopHelper(splinePrism.splineLoopOuterTop, prismHelperOptions));
	scene.add(new SplineLoopHelper(splinePrism.splineLoopOuterBottom, prismHelperOptions));

	var sampleBall = new THREE.Mesh(
		new THREE.SphereGeometry(.2),
		new THREE.MeshBasicMaterial({
			color: 0xff0000
		})
	);
	scene.add(sampleBall);
	view.renderManager.onEnterFrame.add(function() {
		var time = (new Date()).getTime() * .00003;
		sampleBall.position.copy(splinePrism.sample(time%1, Math.cos(time*100) * .5 + .5, Math.sin(time*100) * .5 + .5));
	})
}

var loadAndRunScripts = require('loadandrunscripts');
loadAndRunScripts(
	[
		'bower_components/three.js/three.js'
	],
	onReady
);