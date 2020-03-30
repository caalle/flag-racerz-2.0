import {
  MeshBuilder,
  Scene,
  Vector3,
  PhysicsImpostor,
  FollowCamera,
  Space,
  Animation,
  StandardMaterial,
  Color3,
  ShadowGenerator
} from "@babylonjs/core";

export default class SpeedBoost {
  private _scene: Scene;
  private _entity: any;

  constructor(scene: Scene, shadowGenerator: ShadowGenerator) {
    this._scene = scene;

    this._entity = MeshBuilder.CreateSphere(
      "box",
      { diameter: 1, segments: 4 },
      this._scene
    );

    this._entity.position = new Vector3(
      -30 + Math.random() * 60,
      0.5,
      -30 + Math.random() * 60
    );

    this._entity.physicsImpostor = new PhysicsImpostor(
      this._entity,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0, restitution: 0 },
      this._scene
    );

    shadowGenerator.addShadowCaster(this._entity);

    const material = new StandardMaterial("material", this._scene);

    material.diffuseColor = Color3.Red();
    this._entity.material = material;

    this.createAnimation();
  }

  createAnimation = () => {
    const pos = this._entity.position.clone();
    const animPos = new Animation(
      "speedBostAnimation",
      "position",
      30,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
    animPos.setKeys([
      {
        frame: 0,
        value: pos
      },

      {
        frame: 20,
        value: new Vector3(pos.x, pos.y + 1, pos.z)
      },

      {
        frame: 100,
        value: pos
      }
    ]);

    this._entity.animations = [animPos];
    this._scene.beginAnimation(this._entity, 0, 100, true);
  };

  setPosition = (position: Vector3): void => {
    this._entity.position = position;
  };

  getEntity = (): any => this._entity;
}
