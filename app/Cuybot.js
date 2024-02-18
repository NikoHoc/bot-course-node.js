const TelegramBot = require("node-telegram-bot-api")
const commands = require("../libs/commands")
const { helpTextMessage, invalidCommand } = require("../libs/constant")

class Cuybot extends TelegramBot{
    constructor(token, options) {
        super(token, options)
        this.on("message", (data) => {
            
            const isInCommand = Object.values(commands).some(keyword => keyword.test(data.text))
            if (!isInCommand) {
                console.log(`Invalid command executed by ${data.from.username}`)
                this.sendMessage(data.from.id, invalidCommand, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "Panduan Pengguna",
                                    callback_data: "go_to_help"
                                }
                            ]
                        ]
                    }
                })
                
                this.on("callback_query", (callback) => {
                    const callbackName = callback.data
                    if(callbackName == "go_to_help") {
                        this.sendMessage(callback.from.id, helpTextMessage)
                    } 
                })
                
            }
        })
    }

    getSticker() {
        this.on("sticker", (data) => {
            this.sendMessage(data.from.id, data.sticker.emoji)
            console.log("getSticker Executed by: " + data.from.username)
        })
    }

    getGreeting() {
        this.onText(commands.greeting, (data) => {
            this.sendMessage(data.from.id, "Halo cuy" )
            console.log("getGreeting Executed by: " + data.from.username)
        }) 
    }

    getFollow() {
        this.onText(commands.follow, (data, after) => {
            this.sendMessage(data.from.id, `Ur Words: ${after[1]}`)
            console.log("getFollow Executed by: " + data.from.username)
        })
    }

    getQuotes() {
        this.onText(commands.quote, async(data) => {
            const quoteEndpoint = "https://api.kanye.rest/";
            try {
                const apiCall = await fetch(quoteEndpoint);
                // //cara 1
                // const response = await apiCall.json();
                // console.log(response);
                // bot.sendMessage(data.from.id, Quotes of the day: ${response.quote});
        
                //cara 2
                const { quote } = await apiCall.json();
                this.sendMessage(data.from.id, `Quotes of the day: ${quote}`);
                console.log(quote)
                console.log("getQuotes Executed by: " + data.from.username)
            } catch(error) {
                console.log(error)
                this.sendMessage(data.from.id, "maaf silahkan ulangi")
            }
        })
    }

    getNews() {
        this.onText(commands.news, async(data) => {
            const newsEndPoint = "https://jakpost.vercel.app/api/category/indonesia";
            this.sendMessage(data.from.id, "Wait a moment..");
            try {
                const apiCall = await fetch(newsEndPoint);
                //cara 1
                const response = await apiCall.json();
                console.log(response);
                const maxNews = 3
        
                for (let i = 0; i < maxNews; i++) {
                    const news = response.posts[i];
                    const {title, image, headline} = news;
                    this.sendPhoto(data.from.id, image, { caption: `Judul: ${title} \n\n\Headline: ${headline}`});
                }

                console.log("getNews Executed by: " + data.from.username)
            } catch(error) {
                console.error(error)
                this.sendMessage(data.from.id, "maaf silahkan ulangi")
            }
        })
    }

    getQuake() {
        const quakeEndPoint = "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json"
        try {
            this.onText(commands.quake, async(data) => {
                const apiCall = await fetch(quakeEndPoint)
                const response = await apiCall.json();
                const { gempa } = response.Infogempa
                const { Wilayah, Magnitude, Tanggal, Jam, Kedalaman, Shakemap } = gempa;

                const imgSourceUrl = "https://data.bmkg.go.id/DataMKG/TEWS/" + Shakemap;
                this.sendPhoto(data.from.id, imgSourceUrl, {caption: `
                Info Gempa terbaru ${Tanggal} / ${Jam}:\n\n\Wilayah: ${Wilayah}\n\Besaran: ${Magnitude} SR\n\Kedalaman: ${Kedalaman}`})
                console.log("getQuake Executed by: " + data.from.username)
            })
        } catch(error) {
            this.sendMessage(data.from.id, "Maaf coba ulangi")
        }
    }
    
    getHelp() {
        this.onText(commands.help, async(data) => {
            this.sendMessage(data.from.id, helpTextMessage)
        })
    }
}

module.exports = Cuybot


