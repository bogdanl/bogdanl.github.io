var FBO = function( exports ){

    var scene, orthoCamera, rtt;
    exports.init = function(width, height, renderer, simulationMaterial, renderMaterial){

        //3 rtt setup
        scene = new THREE.Scene();
        orthoCamera = new THREE.OrthographicCamera(-1,1,1,-1,1/Math.pow(2, 53), 1);

        //4 create a target texture
        var options = {
            minFilter: THREE.NearestFilter,//important as we want to sample square pixels
            magFilter: THREE.NearestFilter,//
            format: THREE.RGBAFormat,//180407 changed to RGBAFormat
            type:THREE.FloatType//important as we need precise coordinates (not ints)
        };
        rtt = new THREE.WebGLRenderTarget(width, height, options);

        //5 the simulation:
        //create a bi-unit quadrilateral and uses the simulation material to update the Float Texture
        var geom = new THREE.BufferGeometry();
        geom.setAttribute(
            'position',
            new THREE.BufferAttribute(
                new Float32Array([-1,-1,0,0, 1,-1,0,0, 1,1,0,0, -1,-1,0,0, 1,1,0,0, -1,1,0,0]), 
                4
            ) 
        );
        geom.setAttribute('uv',
            new THREE.BufferAttribute(
                new Float32Array([0,1, 1,1, 1,0, 0,1, 1,0, 0,0]),
                2
            )
        );
        scene.add(new THREE.Mesh(geom, simulationMaterial));

        //6 the particles:
        //create a vertex buffer of size width * height with normalized coordinates
        var l = (width * height);
        var vertices = new Float32Array(l * 4);
        for (var i = 0; i < l; i++) {
            var i3 = i * 4;
            vertices[i3] = (i % width) / width ;
            vertices[i3 + 1] = (i / width) / height;
        }

        //create the particles geometry
        var geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 4));
        // geometry.setAttribute('newcolor', new THREE.BufferAttribute(colors, 3));
        //the rendermaterial is used to render the particles
        exports.particles = new THREE.Points(geometry, renderMaterial);

        exports.renderer = renderer;
        return scene;
    };
    
    //7 update loop
    exports.update = function(){

        //1 update the simulation and render the result in a target texture
        exports.renderer.clear();
        exports.renderer.setRenderTarget(rtt);
        exports.renderer.render(scene, orthoCamera);
        exports.renderer.setRenderTarget(null);

        //2 use the result of the swap as the new position for the particles' renderer
        exports.particles.material.uniforms.positions.value = rtt.texture;

    };
    return exports;
}({});
