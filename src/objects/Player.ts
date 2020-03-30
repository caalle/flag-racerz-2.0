import {
  MeshBuilder,
  Scene,
  Vector3,
  PhysicsImpostor,
  FollowCamera,
  Space,
  Sound,
  ShadowGenerator
} from "@babylonjs/core";

export default class Player {
  private _name: string;
  private _scene: Scene;
  private _entity: any;
  private _camera: FollowCamera;
  private _boosts: number = 1;
  private _flags: number = 0;
  private _collectedBoostSound: Sound;
  private _activatedBoostSound: Sound;
  private _honkSound: Sound;
  private _collectedFlagSound: Sound;
  private _isPlayingSound: boolean = false;

  constructor(
    name: string,
    scene: Scene,
    position: Vector3,
    shadowGenerator: ShadowGenerator
  ) {
    this._scene = scene;
    this._name = name;

    this._collectedBoostSound = new Sound(
      "boosto",
      "/sounds/boosto.wav",
      this._scene
    );
    this._collectedFlagSound = new Sound(
      "done",
      "/sounds/done.wav",
      this._scene
    );
    this._activatedBoostSound = new Sound(
      "boost",
      "/sounds/boost.wav",
      this._scene
    );

    this._honkSound = new Sound("honk", "/sounds/meep-meep.wav", this._scene);

    this._entity = MeshBuilder.CreateBox(
      "box",
      { width: 2, height: 1, depth: 3 },
      this._scene
    );
    this._entity.position = position;
    shadowGenerator.addShadowCaster(this._entity);

    this._entity.physicsImpostor = new PhysicsImpostor(
      this._entity,
      PhysicsImpostor.BoxImpostor,
      { mass: 2, friction: 0.05, restitution: 0.1 },
      this._scene
    );

    this.createCamera();
  }

  createCamera = () => {
    this._camera = new FollowCamera(
      "camera1",
      new Vector3(0, 10, -10),
      this._scene,
      this._entity
    );

    this._camera.cameraAcceleration = 0.01;
    this._camera.heightOffset = 8;
    this._camera.radius = 20;
  };

  setPosition = (position: Vector3): void => {
    this._entity.position = position;
  };

  getEntity = (): any => this._entity;

  accelerate = (force: number): void => {
    this._entity.physicsImpostor.applyImpulse(
      this._entity.forward.clone().scale(force),
      this._entity.getAbsolutePosition().add(Vector3.Zero())
    );
  };

  turn = (angle: number) => {
    this._entity.rotate(
      new Vector3(0, 1, 0),
      angle * (Math.PI / 180),
      Space.LOCAL
    );
  };

  addBoost = () => {
    this._boosts += 1;
    console.info(`${this._name} has ${this._boosts} boosts`);
    this._collectedBoostSound.play();
  };

  useBoost = () => {
    if (this._boosts > 0) {
      this._boosts -= 1;

      console.info(`${this._name} has ${this._boosts} boosts`);
      this._activatedBoostSound.play();
      this._entity.physicsImpostor.applyImpulse(
        this._entity.forward.clone().scale(-50),
        this._entity.getAbsolutePosition().add(Vector3.Zero())
      );
    }
  };

  honk = () => {
    if (!this._isPlayingSound) {
      this._isPlayingSound = true;
      this._honkSound.play();
      this._isPlayingSound = false;
    }
  };

  addFlag = () => {
    this._flags += 1;
    this._collectedFlagSound.play();
  };
}
