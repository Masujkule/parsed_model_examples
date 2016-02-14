import THREE from 'three';
import EventEmitter from 'events';
import ActionTypes from '../constants';
import AppDispatcher from '../app_dispatcher';
import Globals from '../globals';
import ParsedModel from '../parsed_model';

let CHANGE_EVENT = 'change';


class SettingsStore extends EventEmitter {

  constructor () {
    super();

    this.worldRotation = Globals.WORLD_ROTATION;
    this.cameraPosition = new THREE.Vector3(0, 300, 500);
    this.cameraQuaternion = new THREE.Quaternion();
    this.parsedModel = new ParsedModel();
    this.parsedModel.load('bbq.json').then(
      //resolve
      () =>{
        this.emitChange();
      }
    );

    AppDispatcher.register((action) => {
      this.handle(action);
    });
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  getSettings() {

    let settings = {
      parsedModel: this.parsedModel,
      worldRotation: this.worldRotation,
      cameraPosition: this.cameraPosition,
      cameraQuaternion: this.cameraQuaternion
    };
    return settings;
  }

  handle(action) {
    switch(action.type) {

      case ActionTypes.UPDATE_CAMERA:
        this.cameraPosition = action.position;
        this.cameraQuaternion = action.quaternion;
        this.emitChange();
        break;

      default:
      // do nothing
    }
  }
}

export default new SettingsStore();
