const TelegramBot = require("node-telegram-bot-api")
require("dotenv").config()

const token = process.env.TELEGRAM_TOKEN

const bot = new TelegramBot(token, { polling: true })
//listner untuk semua message (text)
bot.on("message", async (data) => {
    // if (data.text !== "!halo") {
    //     //bot.getMe untuk profile bot kita, async
    //     const botProfile = await bot.getMe();
    //     console.log(botProfile)

    //     bot.sendMessage(data.from.id, Halo perkenalkan saya adalah ${botProfile.first_name}! Ada yang bisa saya bantu?)
    // }

    //jika ketik "halo" di telegram
    // if (data.text == "halo") {
    //     bot.sendMessage(data.from.id, "halo juga " + data.from.first_name)
    // } else {
    //     bot.sendMessage(data.from.id, "Halo coy!");
    // }
})

//listner untuk message stiker
bot.on("sticker", (data) => {
    console.log(data)
    bot.sendMessage(data.from.id, data.sticker.emoji)
})

//muncul text di terminal /halo/
//kalau /^dasd$/ tdak keluar
//regex
//spesifik untuk user ketik !halo saja
bot.onText(/^!halo$/, (data) => {
    console.log("Testing...", data);
    bot.sendMessage(data.from.id, "halo beb! ✌️")
})

bot.onText(/^!follows(.+)/, (data, after) => {
    //after[1] dijadiin array jdi jika ketik !follows haloo niko, yg terkirim jadinya haloo niko, follows tidak ikut
    bot.sendMessage(data.from.id, `kata-katamu:${after[1]}`)
})

// feteching quotes api
bot.onText(/^!quotes$/, async (data) => {
    //fetch api
    const quoteEndpoint = "https://api.kanye.rest/";

    try {
        const apiCall = await fetch(quoteEndpoint);
        //cara 1
        // const response = await apiCall.json();
        // console.log(response);
        // bot.sendMessage(data.from.id, Quotes of the day: ${response.quote});

        //cara 2
        const { quote } = await apiCall.json();
        bot.sendMessage(data.from.id, `Quotes of the day: ${quote}`);
    } catch(error) {
        console.log(error)
        bot.sendMessage(data.from.id, "maaf silahkan ulangi")
    }
})

bot.onText(/^!news$/, async(data) => {
    const newsEndPoint = "https://jakpost.vercel.app/api/category/indonesia";
    bot.sendMessage(data.from.id, "Wait a moment..");

    try {
        const apiCall = await fetch(newsEndPoint);
        //cara 1
        const response = await apiCall.json();
        console.log(response);
        const maxNews = 3

        for (let i = 0; i < maxNews; i++) {
            const news = response.posts[i];
            const {title, image, headline} = news;
            bot.sendPhoto(data.from.id, image, 
                {caption: `Judul: ${title} \n\n\Headline: ${headline}`});
        }
    } catch(error) {
        console.log(error)
        bot.sendMessage(data.from.id, "maaf silahkan ulangi")
    }
})