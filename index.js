var SplineLoop = require('threejs-spline-loop');

function SplineLoopPrism(splineLoopInnerTop, splineLoopInnerBottom, splineLoopOuterTop, splineLoopOuterBottom) {
	this.splineLoopInnerTop = splineLoopInnerTop;
	this.splineLoopInnerBottom = splineLoopInnerBottom;
	this.splineLoopOuterTop = splineLoopOuterTop;
	this.splineLoopOuterBottom = splineLoopOuterBottom;
	this.splineLoops = [
		splineLoopInnerTop,
		splineLoopInnerBottom,
		splineLoopOuterTop,
		splineLoopOuterBottom
	]
}

SplineLoopPrism.prototype = {
	cache: function(segments) {
		this.splineLoopInnerTop.cache(segments);
		this.splineLoopInnerBottom.cache(segments);
		this.splineLoopOuterTop.cache(segments);
		this.splineLoopOuterBottom.cache(segments);
	},
	updateCache: function() {
		this.splineLoopInnerTop.updateCache();
		this.splineLoopInnerBottom.updateCache();
		this.splineLoopOuterTop.updateCache();
		this.splineLoopOuterBottom.updateCache();
	},
	sample: function() {
		var sampleVecA = new THREE.Vector3();
		var sampleVecB = new THREE.Vector3();
		var sampleVecC = new THREE.Vector3();
		var sampleVecD = new THREE.Vector3();
		var sampleVecAB = new THREE.Vector3();
		var sampleVecCD = new THREE.Vector3();
		var sampleVecABCD = new THREE.Vector3();

		return function(x, y, z) {
			sampleVecA.copy(this.splineLoopInnerTop.getCachedLoopPoint(x));
			sampleVecB.copy(this.splineLoopInnerBottom.getCachedLoopPoint(x));
			sampleVecC.copy(this.splineLoopOuterTop.getCachedLoopPoint(x));
			sampleVecD.copy(this.splineLoopOuterBottom.getCachedLoopPoint(x));
			sampleVecAB.copy(sampleVecA).multiplyScalar(1-y).add(sampleVecB.multiplyScalar(y));
			sampleVecCD.copy(sampleVecC).multiplyScalar(1-y).add(sampleVecD.multiplyScalar(y));
			sampleVecABCD.copy(sampleVecAB).multiplyScalar(1-z).add(sampleVecCD.multiplyScalar(z));
			return sampleVecABCD;
		}
	}()
}

SplineLoopPrism.createFromSplineLoopAndScalarAndOffsetY = function(splineLoop, scalar, offsetY) {
	var originalPoints = splineLoop.points;
	var pointsTotal = splineLoop.points.length;
	var prismSplines = [];
	var totalPrismSplines = 4;
	var scaleXoffsetYs = [
		[scalar, offsetY],
		[scalar, -offsetY],
		[1/scalar, offsetY],
		[1/scalar, -offsetY]
	];
	for (var iSpline = 0; iSpline < totalPrismSplines; iSpline++) {
		var prismPoints = [];
		for (var iPoint = 0; iPoint < pointsTotal; iPoint++) {
			var point = originalPoints[iPoint].clone().multiplyScalar(scaleXoffsetYs[iSpline][0]);
			point.y += scaleXoffsetYs[iSpline][1];
			prismPoints[iPoint] = point;
		}
		var prismSpline = new SplineLoop(prismPoints);
		prismSplines[iSpline] = prismSpline;
	}
	return new SplineLoopPrism(prismSplines[0], prismSplines[1], prismSplines[2], prismSplines[3]);
}
module.exports = SplineLoopPrism;