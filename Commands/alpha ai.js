const axios = require("axios");

const baseApiUrl = async () => {
  return "https://noobs-api.top/dipto"; // replace with your AI API if needed
};

module.exports.config = {
  name: "alpha ai",
  version: "12.0",
  author: "Cid Kageno (modified by J O Y)",
  shortDescription: "Alpha replies in-character when triggered or replied to",
  longDescription: "Replies as Alpha from Shadow Garden when someone mentions 'alpha' or replies to Alpha's message. No conversation memory.",
  category: "ai",
  cooldowns: 0
};

module.exports.onStart = async function () {};

module.exports.onChat = async ({ api, event, message }) => {
  try {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const body = event.body?.trim();
    if (!body) return;

    const isTriggered =
      body.toLowerCase().includes("alpha") ||
      (event.messageReply && event.messageReply.senderID === api.getCurrentUserID());

    if (!isTriggered) return;

    const specialUsers = {
      "100075163264087": "Lord Shadow"
    };

    let prefix = "🌑 Alpha says:\n";
    if (specialUsers[senderID]) {
      prefix = `🌑 ${specialUsers[senderID]}, Alpha replies:\n`;
    }

    // Send request to AI API
    const response = await axios.get(
      `${await baseApiUrl()}/baby?text=${encodeURIComponent(body)}&senderID=${senderID}`
    );

    const alphaReply = response.data.reply || "";
    if (!alphaReply) return;

    await api.sendMessage(alphaReply, threadID, (error, info) => {
      if (!info) return;
      global.GoatBot.onReply.set(info.messageID, {
        commandName: "alpha ai",
        type: "reply",
        messageID: info.messageID,
        author: senderID
      });
    }, event.messageID);

  } catch (err) {
    console.error(err);
  }
};

module.exports.onReply = async ({ api, event, Reply }) => {
  try {
    if (event.type !== "message_reply") return;

    const senderID = event.senderID;
    const threadID = event.threadID;
    const body = event.body?.trim();
    if (!body) return;

    // Call AI API for reply
    const response = await axios.get(
      `${await baseApiUrl()}/baby?text=${encodeURIComponent(body)}&senderID=${senderID}`
    );

    const alphaReply = response.data.reply || "";
    if (!alphaReply) return;

    await api.sendMessage(alphaReply, threadID, (error, info) => {
      if (!info) return;
      global.GoatBot.onReply.set(info.messageID, {
        commandName: "alpha ai",
        type: "reply",
        messageID: info.messageID,
        author: senderID
      });
    }, event.messageID);

  } catch (err) {
    console.error(err);
  }
};
