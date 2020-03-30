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

export default class Flag {
  private _scene: Scene;
  private _entity: any;

  constructor(scene: Scene, shadowGenerator: ShadowGenerator) {
    this._scene = scene;

    this._entity = MeshBuilder.CreateCylinder(
      "flag",
      { diameterTop: 1, height: 6, diameterBottom: 2 },
      this._scene
    );

    this._entity.position = new Vector3(
      -30 + Math.random() * 60,
      1,
      -30 + Math.random() * 60
    );

    this._entity.physicsImpostor = new PhysicsImpostor(
      this._entity,
      PhysicsImpostor.CylinderImpostor,
      { mass: 0, friction: 0, restitution: 0 },
      this._scene
    );

    shadowGenerator.addShadowCaster(this._entity);

    const material = new StandardMaterial("material", this._scene);

    material.diffuseColor = Color3.Blue();
    this._entity.material = material;
  }
  getEntity = () => this._entity;
  randomPosition = (): void => {
    this._entity.position = new Vector3(
      -10 + Math.random() * 20,
      1,
      -10 + Math.random() * 20
    );
  };
}
