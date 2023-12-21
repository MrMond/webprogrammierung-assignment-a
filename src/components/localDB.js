//nach https://www.raymondcamden.com/2019/10/16/using-indexeddb-with-vuejs
//open database
var db;
var ready = false;

async function created() {
    db = await getDb();
    ready = true;
}

export async function getDb() {
    return new Promise((resolve, reject) => {
        let request = window.indexedDB.open("session", 1);

        request.onupgradeneeded = function (event) {
            console.log("session storage size increased")
            let db = event.target.result;
            let objectStore = db.createObjectStore("currentImage", { keyPath: "id", autoIncrement: true });
            let likeStore = db.createObjectStore("likes", { keyPath: "id", autoIncrement: true });
        }

        request.onsuccess = function (event) {
            console.log("new session storage set up");
            resolve(event.target.result);
        }

        // error handeling
        request.onerror = function (event) {
            console.error("DB error while opening: " + event.target.errorCode);
            reject(event.target.errorCode)
        }

        request.onblocked = function (event) {
            console.warn("Database blocked. Please close other tabs with this site open.");
            reject(event.target.errorCode);
        }
    });
}

export async function setDBImage(image) {
    if (!ready) {
        await created();
    }
    return new Promise((resolve, reject) => {
        var transaction = db.transaction(["currentImage"], "readwrite");
        var objectStore = transaction.objectStore("currentImage");

        var req = objectStore.put({ id: "userImg", image: image });

        req.onsuccess = function (event) {
            console.log("set data to session storage");
            resolve();
        };

        req.onerror = function (event) {
            reject(event.target.errorCode);
        };
    });
}

export async function addDBLikes(identifier) {
    if (!ready) {
        await created();
    }
    return new Promise((resolve, reject) => {
        var transaction = db.transaction(["likes"], "readwrite");
        var objectStore = transaction.objectStore("likes");

        var req = objectStore.add({ likedImg: identifier });

        req.onsuccess = function (event) {
            console.log("set data to session storage");
            resolve();
        };

        req.onerror = function (event) {
            reject(event.target.errorCode);
        };
    });
}

export async function getDBImage() {
    if (!ready) {
        await created();
    }
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(["currentImage"], "readonly");
        let objectStore = transaction.objectStore("currentImage");
        let req = objectStore.get("userImg");

        req.onsuccess = function (event) {
            let image = event.target.result ? event.target.result.image : null;
            console.log("got data from session storage");
            resolve(image);
        };

        req.onerror = function (event) {
            reject(event.target.errorCode);
        };
    });
}