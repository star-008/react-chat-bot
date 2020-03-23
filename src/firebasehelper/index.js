import * as firebase from "firebase";
import { default_pkgs } from "../Utils/Constants";
require("firebase/firestore");
const firebaseConfig = {
  apiKey: "AIzaSyBlBJtz1oV7_pWAyjrlkxdJ7ZenisHP5sk",
  projectId: "boltconcierge-2f0f9",
  databaseURL: "https://boltconcierge-2f0f9.firebaseio.com",
  storageBucket: "boltconcierge-2f0f9.appspot.com"
};
function filterArrayByKey(arr, key) {
  var a = arr.reduce(function(accumulator, current) {
    if (checkIfAlreadyExist(current)) {
      return accumulator;
    } else {
      return accumulator.concat([current]);
    }
    function checkIfAlreadyExist(currentVal) {
      return accumulator.some(function(item) {
        return item[key] === currentVal[key];
      });
    }
  }, []);
  return a;
}
const makeId = (uid1, uid2) => {
  //Check if user1’s id is less than user2's
  if (uid1 < uid2) return uid1 + uid2;
  else return uid2 + uid1;
};
class Firebase {
  static initialize() {
    firebase.initializeApp(firebaseConfig);
  }
  //
  static storage() {
    return firebase.storage();
  }
  static getStorage() {
    return firebase.storage;
  }
  static firestore() {
    return firebase.firestore();
  }
  static getAllBrands = callback => {
    console.log("getAllBrands");
    let path = "brands";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        var res = [];
        if (snapshot.val()) {
          res = snapshot.val();
        }
        callback(res);
      });
  };
  static updateUserData = (brand_name, uid, data) => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection(brand_name)
        .doc("data")
        .collection("user")
        .doc(`${uid}`)
        .set(data, { merge: true })
        .then(() => {
          firebase
            .firestore()
            .collection(brand_name)
            .doc("data")
            .collection("user")
            .doc(`${uid}`)
            .get()
            .then(res => {
              resolve(res.data());
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  };
  static getBoltPackages = callback => {
    let path = "packages/";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        let result = [];
        result = snapshot.val();
        //let res = Object.values(result)[0];
        console.log("value", result);
        callback(result);
      });
  };
  static getBrandDataByName = brand_name => {
    let path = "brands";
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(path)
        .orderByChild("name")
        .equalTo(brand_name)
        .on("value", snapshot => {
          let result = [];
          result = snapshot.val();
          let res = Object.values(result)[0];
          resolve(res);
        });
    });
  };
  static uploadImage(content, imagename, folder) {
    let path = "/" + folder + "/" + imagename + ".png";
    return new Promise((resolve, reject) => {
      let storageRef = this.storage().ref(path);
      storageRef.putString(content, "base64").then(function(snap) {
        storageRef
          .getDownloadURL()
          .then(function(img_url) {
            resolve(img_url);
          })
          .catch(err => {
            reject(err);
          });
      });
    });
  }
  static async addPost(post, brand_name) {
    console.log("post", post);
    const timestamp = await firebase.firestore.Timestamp.fromDate(new Date());
    console.log("timestamp", timestamp);
    return firebase
      .firestore()
      .collection(brand_name)
      .doc("data")
      .collection("post")
      .add({
        title: post.title,
        content: post.content,
        uid: post.uid,
        timestamp: timestamp,
        img_url: post.image_url,
        // firstname: post.firstname,
        // avatar_url:post.avatar_url

      });
  }
  static getPollsData = brand_name => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection(brand_name)
        .doc("data")
        .collection("user")
        .get()
        .then(res => {
          let array = [];
          res.forEach(function(doc) {
            let tenant_data = doc.data();
            array.push(tenant_data);
          });
          resolve(array);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static getUserDatafromUID = (brand_name, uid) => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection(brand_name)
        .doc("data")
        .collection("user")
        .doc(`${uid}`)
        .get()
        .then(res => {
          console.log("userdd")
          console.log(res)
          resolve(res.data());
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static getCommunityChats(uid1, uid2, callback) {
    const id = makeId(uid1, uid2);
    let path = "community_livechat/" + id;
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        var res = [];
        if (snapshot.val()) {
          res = snapshot.val();
        }
        callback(res);
      });
  }
  static updateBrandPackage = brand => {
    let path = "brands/" + brand;
    firebase
      .database()
      .ref(path)
      .update({ packages: default_pkgs });
  };
  static getTop10Perks = callback => {
    let path = "offers/top_10perks";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        let result = [];
        result = snapshot.val();
        let res = Object.values(result);
        callback(res);
      });
  };
  static getAllOffers = callback => {
    let path = "offers/redeem_offers";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        let result = [];
        result = snapshot.val();
        let res = Object.values(result);
        callback(res);
      });
  };
  static getAllDeactiveOffers = callback => {
    let path = "offers/deactive_offers";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        let result = [];
        if (snapshot.val()) result = snapshot.val();
        callback(result);
      });
  };
  static getAllTicketsById(user_id, callback) {
    let path = "livechat/" + user_id + "/tickets";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        var res = [];
        if (snapshot.val()) {
          res = snapshot.val();
        }
        callback(res);
      });
  }
  static getServicesRouting = (brand_name, callback) => {
    let path = "brands";
    firebase
      .database()
      .ref(path)
      .orderByChild("name")
      .equalTo(brand_name)
      .on("value", snapshot => {
        let result = [];
        result = snapshot.val();
        let res = Object.values(result)[0];
        callback(res.services_routing);
      });
  };
  static getTier1byID = tier1_id => {
    let path = "tier1/" + tier1_id;
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(path)
        .once("value", snapshot => {
          let result = snapshot.val();
          resolve(result);
        });
    });
  };
  static getCategorybyID = category_id => {
    let path = "categories/" + category_id;
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(path)
        .once("value", snapshot => {
          let result = snapshot.val();
          resolve(result);
        });
    });
  };
  static getCategoryIDbyTitle = title => {
    let path = "categories";
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(path)
        .orderByChild("topic")
        .equalTo(title)
        .once("value", snapshot => {
          let res = [];
          if (snapshot.val()) {
            res = Object.keys(snapshot.val());
          }

          console.log("result in ques", res);
          if (res.length > 0) resolve(res[0]);
          else resolve(false);
        });
    });
  };
  static signup = (profile, brand) => {
    console.log("profile", profile);
    const { phonenumber } = profile;
    return new Promise((resolve, reject) => {
      if (brand !== "Bolt") {
        firebase
          .firestore()
          .collection(`${brand}`)
          .doc("data")
          .collection("user")
          .where("phonenumber", "==", phonenumber)
          .get()
          .then(snapshot => {
            console.log("snapshot", snapshot);
            if (!snapshot.size) {
              firebase
                .firestore()
                .collection(`${brand}`)
                .doc("data")
                .collection("user")
                .add(profile)
                .then(res => {
                  resolve(res);
                })
                .catch(err => {
                  reject(err);
                });
            } else resolve(false);
          })
          .catch(err => {
            reject(err);
          });
      } else {
        firebase
          .firestore()
          .collection(`user`)
          .where("phonenumber", "==", phonenumber)
          .get()
          .then(snapshot => {
            console.log("snapshot", snapshot);
            if (!snapshot.size) {
              firebase
                .firestore()
                .collection(`${brand}`)
                .add(profile)
                .then(res => {
                  resolve(res);
                })
                .catch(err => {
                  reject(err);
                });
            } else resolve(false);
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  };
  static getProfile = (phonenumber, brand) => {
    return new Promise((resolve, reject) => {
      if (brand !== "Bolt") {
        console.log("phonenumber", phonenumber);
        console.log("brand", brand);
        firebase
          .firestore()
          .collection(`${brand}`)
          .doc("data")
          .collection("user")
          .where("phonenumber", "==", phonenumber)
          .limit(1)
          .get()
          .then(res => {
            if (res.size === 0) resolve(false);
            else resolve(res.docs[0]);
          })
          .catch(err => {
            reject(err);
          });
      } else {
        firebase
          .firestore()
          .collection(`user`)
          .where("phonenumber", "==", phonenumber)
          .limit(1)
          .get()
          .then(res => {
            if (res.size === 0) resolve(false);
            else resolve(res.docs[0]);
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  };
  static getProfileByUID = (uid, brand) => {
    console.log("uid", uid);
    console.log("brand", brand);
    return new Promise((resolve, reject) => {
      if (brand !== "Bolt") {
        firebase
          .firestore()
          .collection(`${brand}`)
          .doc("data")
          .collection("user")
          .doc(uid)
          .get()
          .then(res => {
            if (res.data()) resolve(res.data());
            else resolve(false);
          })
          .catch(err => {
            reject(err);
          });
      } else {
        firebase
          .firestore()
          .collection(`user`)
          .doc(uid)
          .get()
          .then(res => {
            if (res.data()) resolve(res.data());
            else resolve(false);
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  };
  static findAnswer = (item, room, adjective, callback) => {
    let path = "chatbot/quez";
    firebase
      .database()
      .ref(path)
      .orderByChild("item_room_adjective")
      .equalTo(item + "_" + room + "_" + adjective)
      .once("value", snapshot => {
        let res = [];
        if (snapshot.val()) {
          res = Object.values(snapshot.val());
        }
        console.log("result in ques", res);
        if (!res.length) {
          firebase
            .database()
            .ref(path)
            .orderByChild("item_room_adjective")
            .equalTo(item + "__" + adjective)
            .once("value", snapshot => {
              let result = [];
              if (snapshot.val()) {
                result = Object.values(snapshot.val());
                const ticket = result[0].ticket;
                let sub_path = "chatbot/answers";
                firebase
                  .database()
                  .ref(sub_path)
                  .orderByChild("ticket")
                  .equalTo(ticket)
                  .once("value", snapshot => {
                    let result = [];
                    result = Object.values(snapshot.val());
                    callback(result[0]);
                  });
              }
            });
        } else {
          const ticket = res[0].ticket;
          let sub_path = "chatbot/answers";
          firebase
            .database()
            .ref(sub_path)
            .orderByChild("ticket")
            .equalTo(ticket)
            .once("value", snapshot => {
              let result = [];
              result = Object.values(snapshot.val());
              callback(result[0]);
            });
        }
      });
  };
  static getAllItem(callback) {
    console.log("getAllItem");
    let path = "chatbot/quez";
    firebase
      .database()
      .ref(path)
      .once("value", snapshot => {
        var res = [];

        if (snapshot.val()) {
          res = snapshot.val();
        }
        var a = filterArrayByKey(res, "item");
        let result = a.map(item => item.item);
        callback(result);
      });
  }
  static getAllRoom(callback) {
    console.log("getAllRoom");
    let path = "chatbot/rooms";
    firebase
      .database()
      .ref(path)
      .once("value", snapshot => {
        var res = [];

        if (snapshot.val()) {
          res = snapshot.val();
        }
        callback(res);
      });
  }
  static getAllAdjective(callback) {
    console.log("getAllAdjective");
    let path = "chatbot/quez";
    firebase
      .database()
      .ref(path)
      .once("value", snapshot => {
        var res = [];

        if (snapshot.val()) {
          res = snapshot.val();
        }
        var a = filterArrayByKey(res, "adjective");
        let result = a.map(item => item.adjective);
        callback(result);
      });
  }
  static getAllWellness(callback) {
    console.log("getAllWellness");
    let path = "wellness_tickets";
    firebase
      .database()
      .ref(path)
      .once("value", snapshot => {
        var res = [];

        if (snapshot.val()) {
          res = snapshot.val();
        }

        callback(res);
      });
  }
  static getRoomByItem(item, callback) {
    let path = "chatbot/quez";
    firebase
      .database()
      .ref(path)
      .orderByChild("item")
      .equalTo(item)
      .once("value", snapshot => {
        let res = [];
        if (snapshot.val()) res = snapshot.val();
        res = Object.values(res);
        console.log("result before filter", res);
        var adjective = res.map(item => {
          return { value: item.adjective, label: item.adjective.toLowerCase() };
        });
        console.log("adjectives array", adjective);
        if (!res.pop().room) callback(null, adjective);
        else {
          var a = filterArrayByKey(res, "room");
          let result = a.map(item => item.room);
          callback(result, adjective);
        }
      });
  }
  static getLocationByCuisine(cuisine, callback) {
    let path = "restaurant_foods/";
    firebase
      .database()
      .ref(path)
      .orderByChild("cuisine")
      .equalTo(cuisine)
      .once("value", snapshot => {
        let res = [];
        if (snapshot.val()) res = snapshot.val();
        res = Object.values(res);
        var a = filterArrayByKey(res, "location");
        callback(a);
      });
  }
  static getAllLocations(callback) {
    let path = "restaurant_foods/";
    firebase
      .database()
      .ref(path)
      .once("value", snapshot => {
        var res = [];
        if (snapshot.val()) {
          res = snapshot.val();
        }
        var a = filterArrayByKey(res, "location");
        callback(a);
      });
  }
  static getAllCuisines(callback) {
    let path = "restaurant_foods/";
    firebase
      .database()
      .ref(path)
      .once("value", snapshot => {
        var res = [];
        if (snapshot.val()) {
          res = snapshot.val();
        }
        var a = filterArrayByKey(res, "cuisine");
        let result = a.map(item => item.cuisine);
        callback(result);
      });
  }
  static readMessage = uid => {
    let path = "livechat/" + uid;
    firebase
      .database()
      .ref(path)
      .update({ unread: null });
  };
  static requestChat = (uid, firstname, brand, ticket) => {
    let data = {
      uid: uid,
      username: firstname
    };
    if (brand !== "Bolt") data.brand = brand;
    let path = "livechat/" + uid;
    firebase
      .database()
      .ref(path)
      .update(data);
    let ticket_id = "" + ticket.id;
    let child_id = ticket_id.split(".").join("");
    let ticket_path = "livechat/" + uid + "/tickets/" + child_id;
    firebase
      .database()
      .ref(ticket_path)
      .set({
        ticket_id: ticket.id,
        issue: ticket.issue,
        title: ticket.title,
        status: ticket.status,
        time: ticket.time,
        item: ticket.item ? ticket.item : null,
        room: ticket.room ? ticket.room : null,
        band: ticket.band ? ticket.band : null,
        adjective: ticket.adjective ? ticket.adjective : null,
        response_sla: ticket.response_sla ? ticket.response_sla : null,
        repair_sla: ticket.repair_sla ? ticket.repair_sla : null
      });
  };
  static getChats(uid, ticket_id, callback) {
    let path = "livechat/" + uid + "/tickets/" + ticket_id + "/content";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        var res = [];
        if (snapshot.val()) {
          res = snapshot.val();
        }
        callback(res);
      });
  }
  static getTicketData(uid, ticket_id, callback) {
    let path = "livechat/" + uid + "/tickets/" + ticket_id;
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        var res = [];

        if (snapshot.val()) {
          res = snapshot.val();
        }
        callback(res);
      });
  }
  static getChatsById(uid, callback) {
    let path = "livechat/" + uid + "/unread";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        var res = null;
        console.log("unread,", snapshot.val());
        if (snapshot.val()) {
          res = snapshot.val();
        }
        callback(res);
      });
  }
  static addMessage(uid, ticket_id, message, callback) {
    let path = "livechat/" + uid + "/tickets/" + ticket_id + "/content";
    var newChild = firebase
      .database()
      .ref(path)
      .push();
    newChild.set(message, callback(true));
  }
  static getAllSuperAdmins(callback) {
    let path = "agencies/";
    firebase
      .database()
      .ref(path)
      .orderByChild("role")
      .equalTo(0)
      .on("value", snapshot => {
        let result = [];
        result = snapshot.val();
        let res = Object.values(result);
        callback(res);
      });
  }
  static getAgencyTyping(uid, ticket_id, callback) {
    let path = "livechat/" + uid + "/tickets/" + ticket_id + "/agency_typing";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        if (snapshot.val()) callback(snapshot.val());
        else callback(false);
      });
  }
  static getLandlordTyping(uid, ticket_id, callback) {
    let path = "livechat/" + uid + "/tickets/" + ticket_id + "/landlord_typing";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        if (snapshot.val()) callback(snapshot.val());
        else callback(false);
      });
  }
  static getContractorTyping(uid, ticket_id, callback) {
    let path =
      "livechat/" + uid + "/tickets/" + ticket_id + "/contractor_typing";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        if (snapshot.val()) callback(snapshot.val());
        else callback(false);
      });
  }
  static getStatus(uid, ticket_id, callback) {
    let path = "livechat/" + uid + "/tickets/" + ticket_id + "/status";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        if (snapshot.val()) {
          callback(snapshot.val());
        }
      });
  }
  static terminateChat(uid, ticket_id) {
    let path = "livechat/" + uid + "/tickets/" + ticket_id;
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(path)
        .update({ content: null, status: "Closed" })
        .then(() => {
          resolve("success");
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  static setTypeValue(uid, ticket_id, value) {
    let path = "livechat/" + uid + "/tickets/" + ticket_id;
    firebase
      .database()
      .ref(path)
      .update({ user_typing: value });
  }
}
Firebase.initialize();
export default Firebase;
