const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();
const fs = require('fs');
const broadcast = client.voice.createBroadcast();
const folderPath = "./Taunts/English/";
const token = process.env.BOT_TOKEN;
const timeConnected = 15 * (60 * 1000);

let voiceChannel;
let disconnectTimer;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    let number = getNumber(msg.content);

    if (number.toString() != "NaN") {
        voiceChannel = msg.member.voice.channel;

        if (voiceChannel) {
            const connection = await voiceChannel.join();

            let path = folderPath + number.toString() + ".mp3";

            fs.access(path, (err) => {
                if (err) {
                    console.log("file " + path + " not found");
                } else {
                    console.log("playing: " + path);
                    const dispatcher = connection.play(path);
                    if (disconnectTimer)
                        clearTimeout(disconnectTimer);

                    dispatcher.on('finish', () => {
                        disconnectTimer = setTimeout(() => { voiceChannel.leave() }, timeConnected);
                    });
                }
            });
        }
    }
});

client.login(token);

function getNumber(str) {
    if (typeof str == 'string') {
        let newStr = "";
        for (let i = 0; i < str.length; i++) {
            if (str[i] == " ")
                break;
            else
                newStr = newStr + str[i];
        }
        return parseInt(newStr)
    } else {
        return NaN;
    }
}