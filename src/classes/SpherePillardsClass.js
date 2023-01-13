import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import SoundReactor from './SoundReactor'
import MyGUI from '../utils/MyGui'
import LoadingController from './LoadingController'

class SpherePillardsClass {
    constructor() {
        this.bind()
        this.modelLoader = new GLTFLoader(LoadingController)
        this.texturelLoader = new THREE.TextureLoader()
        this.params = {
            waveSpeed: 1,
            subDiv: 2,
            pillardSize: .3
        }
    }

    init(scene) {
        this.scene = scene
        this.upVector = new THREE.Vector3(0, 1, 0)
        this.pillards = new THREE.Group()
        this.pillard

        //matcap material
        const metalTexture = this.texturelLoader.load('./assets/textures/metal.jpeg')
        const chromeTexture = this.texturelLoader.load('./assets/textures/chrome.jpeg')

        this.metalMatcap = new THREE.MeshMatcapMaterial({
            matcap: metalTexture
        })
        this.chromeMatcap = new THREE.MeshMatcapMaterial({
            matcap: chromeTexture
        })

        this.modelLoader.load('./assets/models/pillard.glb', (glb) => {
            glb.scene.traverse(child => {
                if (child.name == "base")
                    this.pillard = child
                    child.material = this.metalMatcap
                if (child.name == "Cylinder")
                    child.material = this.chromeMatcap
            })
            this.computePositions()
        })

        const sphereFolder = MyGUI.addFolder('Sphere Pillards')
        sphereFolder.open()
        sphereFolder.add(this.params, 'waveSpeed', 0.001, 3).name('Wave Speed')
        sphereFolder.add(this.params, 'subDiv', 1, 3).step(1).name('Ico Subdivisions').onChange(this.computePositions)
        sphereFolder.add(this.params, 'pillardSize', 0.01, 1).name('Pill Size').onChange(this.computePositions)
    }

    computePositions(){
        let ico
        this.scene.traverse(child => {
            if (child.name == 'ico') {
                ico = child
            }
        })

        if (ico)
            this.scene.remove(ico)

        const sphereGeometry = new THREE.IcosahedronGeometry(4, this.params.subDiv)
        const sphereMaterial = this.metalMatcap
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
        sphere.name = 'ico'
        // const sphere = new THREE.Mesh(sphereGeom, new THREE.MeshNormalMaterial({
        //     wireframe: true
        // }))
        this.scene.add(sphere)
        this.pillards.remove()
        for (var i = this.pillards.children.length - 1; i >= 0; i--) {
            this.pillards.remove(this.pillards.children[i]);
        }
        //console.log("--->" + this.pillards.children.length)

        let verticesArray = []
        for (let i = 0; i < sphereGeometry.vertices.length; i++) {
            verticesArray.push(sphereGeometry.vertices[i])
        }

        for (let i = 0; i < verticesArray.length; i++) {
            const pillardClone = this.pillard.clone()
            const positionVec = new THREE.Vector3(verticesArray[i].x, verticesArray[i].y, verticesArray[i].z)
            
            pillardClone.position.copy(positionVec)
            pillardClone.children[0].position.y = 3
            pillardClone.scale.multiplyScalar(this.params.pillardSize)
            pillardClone.quaternion.setFromUnitVectors(this.upVector, positionVec.normalize())
            this.pillards.add(pillardClone)

        }
        this.scene.add(this.pillards)
        //console.log(verticesArray)
    }

    update() {
        if (SoundReactor.playFlag) {
            let i = 0
            while (i < this.pillards.children.length) {
                this.pillards.children[i].children[0].position.y = SoundReactor.fdata[i] / 255 * 3
                i++
            }
            
        }else{
            let i = 0
            while (i < this.pillards.children.length) {
                this.pillards.children[i].children[0].position.y = (Math.sin(Date.now() * 0.005 * this.params.waveSpeed + this.pillards.children[i].position.x) + 1)
                i++
            }
        }
    }

    bind() {
        this.computePositions = this.computePositions.bind(this)
        this.init = this.init.bind(this)
    }
}

const _instance = new SpherePillardsClass()
export default _instance