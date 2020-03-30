import {
  ActionManager,
  Engine,
  Scene,
  FollowCamera,
  Light,
  HemisphericLight,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  Texture,
  ShadowGenerator,
  DirectionalLight,
  CannonJSPlugin,
  ExecuteCodeAction,
  Sound
} from "@babylonjs/core";

import "@babylonjs/loaders";
import "pepjs";

import cannon from "cannon";

import Player from "./objects/Player";
import Level from "./objects/Level";
import SpeedBoost from "./objects/SpeedBoost";
import Flag from "./objects/Flag";

interface KeyMap {
  [key: string]: boolean;
}

class Game {
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  private _scene: Scene;
  private _camera: FollowCamera;
  private _light: Light;
  private _spotLight: DirectionalLight;
  private _player: Player;
  private _boostSound: Sound;

  constructor(canvasElement: string) {
    this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this._engine = new Engine(this._canvas, true);
  }

  createScene(): void {
    this._scene = new Scene(this._engine);
    this._scene.enablePhysics(null, new CannonJSPlugin(true, 10, cannon));

    this._spotLight = new DirectionalLight(
      "dir02",
      new Vector3(0.2, -2, 0),
      this._scene
    );
    this._spotLight.position = new Vector3(0, 80, 10);
    const shadowGenerator = new ShadowGenerator(2048, this._spotLight);

    this._player = new Player(
      "Carl",
      this._scene,
      new Vector3(3, 5, 0),
      shadowGenerator
    );

    let sbs = [
      new SpeedBoost(this._scene, shadowGenerator),
      new SpeedBoost(this._scene, shadowGenerator),
      new SpeedBoost(this._scene, shadowGenerator)
    ];
    const flag = new Flag(this._scene, shadowGenerator);
    const level = new Level(this._scene);

    const _scene = this._scene;
    const _player = this._player;
    const _boostSound = this._boostSound;
    this._scene.registerBeforeRender(() => {
      if (flag.getEntity().intersectsMesh(_player.getEntity(), false)) {
        this._player.addFlag();
        flag.randomPosition();
      }
      sbs = sbs.filter(sb => {
        if (sb.getEntity().intersectsMesh(_player.getEntity(), false)) {
          _player.addBoost();
          sb.getEntity().dispose();

          return false;
        }

        return true;
      });
    });

    this.setupKeyboard();
  }

  doRender(): void {
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });

    window.addEventListener("resize", () => {
      this._engine.resize();
    });
  }

  setupKeyboard = () => {
    const map: KeyMap = {
      a: false,
      w: false,
      s: false,
      d: false
    };
    this._scene.actionManager = new ActionManager(this._scene);

    this._scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, evt => {
        map[evt.sourceEvent.key] = Boolean(evt.sourceEvent.type === "keydown");

        if (evt.sourceEvent.key === "z") {
          this._player.honk();
        }
      })
    );

    this._scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function(evt) {
        map[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
      })
    );

    this._scene.registerAfterRender(() => {
      let force = new Vector3(0, 0, 0);
      if (map["w"]) {
        this._player.accelerate(-1);
      }

      if (map["s"]) {
        this._player.accelerate(1);
      }

      if (map["a"]) {
        this._player.turn(-5);
      }

      if (map["d"]) {
        this._player.turn(5);
      }

      if (map["x"]) {
        this._player.useBoost();
      }
    });
  };
}

window.addEventListener("DOMContentLoaded", () => {
  const game = new Game("renderCanvas");
  game.createScene();
  game.doRender();
});
