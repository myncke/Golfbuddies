import firebase from 'firebase';
require('firebase/firestore')
import DATABASE_REF from './FirebaseModel'

export default class GameModel extends FirebaseModel{

  private static firestoreFields = [
    "competition",
    "international",
    "prefGameSex",
    "specialWishes",
    "prefGroupSize",
    "creator",
  ]

  //Booleans
  public competition;
  public international;

  //Strings
  public prefGameSex;
  public specialWishes;

  //Integers
  public prefGroupSize;

  //References
  private creator;

  getCreator(){
    return creator.split('/Users/')[1];
  }

  /**
   * Set the value of creator
   * @param user = UserModel to which we make a reference
   */
  setCreator(user){
    this.creator = DATABASE_REF + 'Users/' + user.key
  }

  //Timestamps
  public date;

  //Geopoints
  public location;


  constructor(key, keepListening, onSuccess, onFailure) {
    super(key,keepListening,onSuccess,onFailure);
    keepListening ? this.listenToFirebase(onSuccess,onFailure) : this.getOnceFromFirebase(onSuccess, onFailure);
  }

  constructor(key){
    super(key);
  }

  private getDocRef(){
    return firebase.firestore().collection('Game').doc(this.key);
  }

  private getOnceFromFirebase(onSuccess, onFailure){
    this.getDocRef().get().then( doc => this.mapFields(doc, onSuccess,onFailure))
      .catch( error => onFailure(error))
  }

  private listenToFirebase(onSuccess, onFailure){
    this.getDocRef().get().onSnapshot( doc => this.mapFields(doc, onSuccess,onFailure))
  }

  //TODO; this can be simplified with reflection
  private static mapFields(object, doc, onSuccess, onFailure){
    if(doc.exists){
      let model = object || new GameModel(doc.id);
      let data = doc.data()
      for (let field of GameModel.firestoreFields) {
        model[field] = data[field];
      }
      console.log("Made an object: " + model.toString());
      onSuccess(model);
    } else {
      onFailure("Something went wrong, we couldn't find the document");
    }
  }

  static getAllFromFirebase(onSuccess, onFailure){
    let result = [];
    firebase.firestore().collection('Game').get().then(
      snapShot => snapShot.forEach(
        doc => result.push(this.mapFields(undefined, doc, onSuccess, onFailure))
      )
    )
    return result;
  }

  toJson(){
    let json = {};
    for (let field of GameModel.firestoreFields) {
      json[field] = this[field];
    }
    return json;
  }

  save(onSuccess, onFailure){
    this.getDocRef().set(this.toJson()).then(onSuccess()).catch(error => onFailure(error));
  }

}
