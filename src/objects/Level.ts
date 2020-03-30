import {
  Scene,
  MeshBuilder,
  StandardMaterial,
  Texture,
  PhysicsImpostor
} from "@babylonjs/core";

export default class Level {
  private _entity: any;
  private _scene: Scene;

  constructor(scene: Scene) {
    this._scene = scene;
    let ground = MeshBuilder.CreateGround(
      "ground",
      { width: 60, height: 60, subdivisions: 2 },
      this._scene
    );

    let materialPlane = new StandardMaterial("texturePlane", this._scene);
    materialPlane.diffuseTexture = new Texture(
      "textures/terrain_texture.jpg",
      this._scene
    );

    // @ts-ignore: TS2551
    materialPlane.diffuseTexture.uScale = 1.0;
    // @ts-ignore: TS2551
    materialPlane.diffuseTexture.vScale = 1.0;
    materialPlane.backFaceCulling = false;

    ground.material = materialPlane;
    ground.receiveShadows = true;

    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0.1, restitution: 0.7 },
      this._scene
    );
  }
}
