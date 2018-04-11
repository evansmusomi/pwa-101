// web-push Module
const webpush = require("web-push");
const vapid = require("./vapid.json");

// configure keys
webpush.setVapidDetails(
  "mailto:apps@evansmusomi.com",
  vapid.publicKey,
  vapid.privateKey
);

const pushSubscription = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/dLumt7s5klw:APA91bFnPG-KgM53diZ2gnd4PVYrL7P-1H15wzNKjpTe2mZnZFzKhcnUEFWFnaYeUJdI_vUaJu3miDsIzkIHEBU2r_XECyRlFuctGTQmviZswRf1mRtqEd06ef4eRAoKUZiX-v8t1XEG",
  keys: {
    auth: "OAmFSAAz-OdZ_vRTr058-w==",
    p256dh:
      "BOMor7PcU6qc0WdEQ7N3HFuOY_Eg7yxhu41p1ilpqDPkpeM_fRiPOwwPpeuEha6rbYKoWaXXop_rvoRpM8cxbGg="
  }
};

webpush.sendNotification(
  pushSubscription,
  "A notification from the push server"
);
console.log("Push sent to client");
