const vertex = require('./GLSL/gradationPlaneVertex.glsl');
const fragment = require('./GLSL/gradationPlaneFrag.glsl');
expor default class GradationPlane
{
    constructor(width,height)
    {
        this.width = width;
        this.height = height;
        this.mesh;
        this.uniforms = {};

        init()
    }

    init()
    {
        let geo = new THREE.Plane(width,height);
        let mat = new THREE.ShaderMaterial({
            uniforms:this.uniforms,
            fragmentShader:fragment,
            vertexShader:vertex
        })


        this.mesh = new THREE.Mesh(geo,mat);
        

    }


    getMesh()
    {
        return this.mesh;
    }


    update()
    {

    }


}