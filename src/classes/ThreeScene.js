import * as THREE from "three"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import RAF from '../utils/raf'
import config from '../utils/config'
import MyGui from '../utils/MyGui'

import SpherePillards from './SpherePillardsClass'
import Floor from './FloorClass'
import Spectrum from './SpectrumClass'
import ParticleSystem from './ParticleSystem'
import ParallaxCamera from './ParallaxCamera'

class ThreeScene {
    constructor() {
        this.bind()

        this.camera
        this.scene
        this.renderer
        this.controls
    }

    init() {
        //RENDERER SETUP
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.debug.checkShaderErrors = true
        //this.renderer.outputEncoding = THREE.LogLuvEncoding
        //this.renderer.outputEncoding = THREE.sRGBEncoding
        document.body.appendChild(this.renderer.domElement)

        //MAIN SCENE INSTANCE
        const color = new THREE.Color(0x151515)
        const fog = new THREE.Fog(color, 15, 30)
        this.scene = new THREE.Scene()
        this.scene.background = color
        this.scene.fog = fog

        //CAMERA AND ORBIT CONTROLLER
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.position.set(0, 0, 20)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enabled = false //config.controls
        this.controls.maxDistance = 20
        this.controls.minDistance = 10
        this.controls.minPolarAngle = 0; // radians
        this.controls.maxPolarAngle = Math.PI / 2 + 0.3; // radians

        ParallaxCamera.init(this.camera)

        SpherePillards.init(this.scene)
        Floor.init(this.scene)
        Spectrum.init(this.scene)
        ParticleSystem.init(this.scene)

        // if (config.myGui)
        //     MyGui.start()
        MyGui.hide()
        if (config.myGui)
            MyGui.show()

        const camerFolder = MyGui.addFolder("Camera Folder")
        camerFolder.open()
        camerFolder.add(this.controls, "enabled").onChange(()=>{
            if(this.controls.enabled) {
                ParallaxCamera.active = false
            }
        }).listen().name('Orbit Controls')
        camerFolder.add(ParallaxCamera, "active").onChange(()=>{
            if(ParallaxCamera.active) {
                this.controls.enabled = false
            }
        }).listen().name('Parallax Controls')

        camerFolder.add(ParallaxCamera.params, "intensity", 0.001, 0.02)
        camerFolder.add(ParallaxCamera.params, "ease", 0.01, 0.1)

        //RENDER LOOP AND WINDOW SIZE UPDATER SETUP
        window.addEventListener("resize", this.resizeCanvas)
        RAF.subscribe('threeSceneUpdate', this.update)
    }

    update() {
        this.renderer.render(this.scene, this.camera)
        this.scene.rotateY(0.001)
        SpherePillards.update()
        //Spectrum.update()
        ParallaxCamera.update()
        //ParticleSystem.update()
    }


    resizeCanvas() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
    }

    bind() {
        this.resizeCanvas = this.resizeCanvas.bind(this)
        this.update = this.update.bind(this)
        this.init = this.init.bind(this)
    }
}

const _instance = new ThreeScene()
export default _instance