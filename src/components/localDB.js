//nach https://www.raymondcamden.com/2019/10/16/using-indexeddb-with-vuejs implementiert

//open database
var db;
var ready = false;

async function created() {
    db = await getDb();
    ready = true;
}

async function getDb() {
    return new Promise((resolve, reject) => {
        let request = window.indexedDB.open("session", 3);

        request.onupgradeneeded = function (event) {
            console.log("session storage size increased")
            let db = event.target.result;

            if (!db.objectStoreNames.contains("currentImage")) {
                let objectStore = db.createObjectStore("currentImage", { keyPath: "id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains("likes")) {
                let newObjectStore = db.createObjectStore("likes", { keyPath: "id", autoIncrement: true });
            }
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

//replaces local or session storage

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

export async function getDBImage() {
    if (!ready) {
        await created();
    }
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(["currentImage"], "readonly");
        let likeStore = transaction.objectStore("currentImage");
        let req = likeStore.get("userImg");

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

// store which memes the user has liked on this browser

export async function addDBLikes(list) {
    if (!ready) {
        await created();
    }
    return new Promise((resolve, reject) => {
        var transaction = db.transaction(["likes"], "readwrite");
        var objectStore = transaction.objectStore("likes");

        var req = objectStore.put({ id: "likeList", likedImg: list });

        req.onsuccess = function (event) {
            console.log("set data to like storage");
            resolve();
        };

        req.onerror = function (event) {
            reject(event.target.errorCode);
        };
    });
}

//read

export async function getDBLikes() {
    if (!ready) {
        await created();
    }
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(["likes"], "readonly");
        let objectStore = transaction.objectStore("likes");
        let req = objectStore.get("likeList");

        req.onsuccess = function (event) {
            let likes = event.target.result;
            console.log("got likes from storage ");
            resolve(likes);
        };

        req.onerror = function (event) {
            reject(event.target.errorCode);
        };
    });
}
