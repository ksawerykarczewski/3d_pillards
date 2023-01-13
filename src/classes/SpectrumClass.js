import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

import spectrumFrag from '../shaders/spectrum.frag'
import spectrumVert from '../shaders/spectrum.vert'
import MyGUI from '../utils/MyGui'

class SpectrumClass {
    constructor() {
        this.bind()
        this.modelLoader = new GLTFLoader()
        this.textureLoader = new THREE.TextureLoader()
    }

    init(scene) {
        this.scene = scene

        this.uniforms = {
            uMatCap: {
                value: this.textureLoader.load('./assets/textures/colorChrome.png')
            },
            uSpecterSize: {
                value: 0.8
            },
            uWaveBorder: {
                value: 0.01
            },
            uWaveSpeed: {
                    value: 0.01
            },
            uBorderColor: {
                value: new THREE.Color("hsl(287, 80%, 80%)")
            },
            uTime: {
                value: 0
            }
        }

        const shaderFolder = MyGUI.addFolder("Spectrum Folder")
        shaderFolder.open()
        shaderFolder.add(this.uniforms.uSpecterSize, 'value', -1, 1).name('Spectrum Size')
        shaderFolder.add(this.uniforms.uWaveBorder, 'value', 0, 1).name('Border Size')
        shaderFolder.add(this.uniforms.uWaveSpeed, 'value', 0, 1).name('Wave Speed')

        this.shaderMaterial = new THREE.ShaderMaterial({
            fragmentShader: spectrumFrag,
            vertexShader: spectrumVert,
            uniforms: this.uniforms,
            transparent: true
        })

        this.modelLoader.load('./assets/models/spectrum.glb', (glb) => {
            glb.scene.traverse(child => {
                if (child instanceof THREE.Mesh)
                    child.material = this.shaderMaterial
                    //child.material = new THREE.MeshNormalMaterial()
                child.scale.multiplyScalar(6.4)
                child.position.y = -.8
            })
            this.scene.add(glb.scene)
        })
    }

    update() {
        this.uniforms.uTime.value += 1
    }

    bind() {
    }
}

const _instance = new SpectrumClass()
export default _instance
