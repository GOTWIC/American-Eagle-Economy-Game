const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '-';
var fs = require('fs');
const { send } = require('process');
var money = JSON.parse(fs.readFileSync('Storage/money.json', 'utf8'));
var inventory = JSON.parse(fs.readFileSync('Storage/inventory.json', 'utf8'));
var points = JSON.parse(fs.readFileSync('Storage/points.json', 'utf8'))
var workMin = 200;
var workMax = 3000;
var mugFailChance = 30;
var mugSuccessChance;
var mugFailLoss = 0.1;
var mugMin = 2000;
var mugMax = 8000;
var robPercent = 80;
var checkPrev = false;


// Check mark: :white_check_mark:
// X mark: :x: 

// Access Cash:   money[sender.id].cash
// Access Cash:   money[sender.id].bank
// Access Net Worth:   money[sender.id].totalMoney

//Startup
client.once('ready', () =>{console.log('ONLINE');});


//When messaged
client.on('message', message => 
{  
    mugSuccessChance = 100 - parseFloat(mugFailChance);


    var sender = message.author;
    var author = message.author.username;
    var msg = message.content;

    const ID = message.author.id;
    
    if(!msg.startsWith(prefix) || sender.bot)
    {
        if(sender.id === '179805821742350336' && checkPrev)
        {
            message.delete();
            checkPrev = false;
        }

        return;
    } 

    if (msg.startsWith(prefix + 'say'))
    {
        message.delete();
        message.channel.send(msg.replace("-say",""));
        message.delete();
    }
    
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(!money[sender.id]) money[sender.id] = 
    {
        cash: 0,
        bank: 0,
        assets: 0,
        totalMoney: 0,
        networth: 0,
    }

    if(!inventory[sender.id]) inventory[sender.id] = 
    {
        trooper100x: 0,
        specialForcesx100: 0,
        Challenger2: 0,
        Leopard2: 0,
        T90: 0,
        M1Abrams: 0,
        DassaultRafale: 0,
        EurofighterTyphoon: 0,
        F22Raptor: 0,
        HobartClass: 0,
        AtagoClass: 0,
        ArleighBurkeClass: 0,
        USNimitz: 0,
        INSVikramaditya: 0,
        GeraldRFord: 0,
    }

    if(!points[sender.id]) points[sender.id] = 
    {
        strength: 0,
        popularity: 0,
        tickets: 0,
    }

    function saveMoneyData()
    {
        fs.writeFile('Storage/money.json', JSON.stringify(money), (err) => {if (err) console.error(err);});
        return 0;
    }

    function saveInventoryData()
    {
        fs.writeFile('Storage/inventory.json', JSON.stringify(inventory), (err) => {if (err) console.error(err);});
        return 0;
    }

    function savePointsData()
    {
        fs.writeFile('Storage/points.json', JSON.stringify(points), (err) => {if (err) console.error(err);});
        return 0;
    }

    function compileAssets()
    {
        money[sender.id].assets = 1000 * (inventory[sender.id].trooper100x * 100 + inventory[sender.id].specialForcesx100 * 200 + inventory[sender.id].Challenger2 * 1000 + inventory[sender.id].Leopard2 * 1500 + inventory[sender.id].T90 * 2500 + inventory[sender.id].M1Abrams * 3500 + inventory[sender.id].DassaultRafale * 4000 + inventory[sender.id].EurofighterTyphoon * 5000 + inventory[sender.id].F22Raptor * 6000 + inventory[sender.id].HobartClass * 9000 + inventory[sender.id].AtagoClass * 11000 + inventory[sender.id].ArleighBurkeClass * 14000 + inventory[sender.id].USNimitz * 20000 + inventory[sender.id].INSVikramaditya * 25000 + inventory[sender.id].GeraldRFord * 30000);
        saveInventoryData();
        return 0;
    }

    function addPoints(val, quant)
    {
        points[sender.id].strength = parseFloat(points[sender.id].strength) + val * quant;
        savePointsData();
        message.channel.send("added");
        return 0;
    }
    
        
    saveMoneyData();     
    saveInventoryData();
    savePointsData();

    money[sender.id].totalMoney = parseFloat(money[sender.id].cash) + parseFloat(money[sender.id].bank);
    money[sender.id].networth = parseFloat(money[sender.id].cash) + parseFloat(money[sender.id].bank) + parseFloat(money[sender.id].assets) ;
    //Help
    if(command === 'help')
    {
        checkPrev = true;
        const helpEmbed = new Discord.MessageEmbed()
	        .setColor('#fcad03')
            .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
            .setTitle("Here are the available commands")
            .addFields
            (
                // Blank Field  { name: '\u200B', value: '\u200B' },
                // New Field:   { name: '', value: '', inline: false },
                { name: '-work', value: 'Earn honest money. Success Rate: 100%', inline: false },
                { name: '-mug', value: 'Steal someone\'s money. Success Rate: ' + mugSuccessChance + '%', inline: false },
                { name: '-heist', value: 'Coming Soon!', inline: false },
                { name: '-rob < @user >', value: 'Try to rob another person. The lower your wealth, the higher your chance of success!', inline: false },
                { name: '-with < amount | all >', value: 'Withdraw an amount (or all) from your bank.', inline: false },
                { name: '-dep < amount | all >', value: 'Deposit an amount (or all) of your cash into your bank', inline: false },
                { name: '-wealth', value: 'View your monetary balance, asset value, and net worth.', inline: false },
                { name: '-store', value: 'View military items up for purchase', inline: false },
                { name: '-helpStore', value: 'Coming Soon!', inline: false },
                { name: '-inv', value: 'See what items you have purchased', inline: false },
                { name: '-buy', value: 'Use this to buy items in the store. See -helpStore to see how to buy items!', inline: false },
                { name: '-lb', value: 'Coming Soon!', inline: false },
                { name: '-points', value: 'Coming Soon!', inline: false },
            )
            message.channel.send(helpEmbed);
    }
    //Work
    if(command === 'work' || command === 'wrk' || command === 'wok' || command === 'wook' || command === 'wor')
    {
        
        var num1 = Math.floor((Math.random() * (workMax - workMin))+workMin);
        const workEmbed = new Discord.MessageEmbed()
	            .setColor('#fcad03')
                .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                .setDescription(":briefcase: You worked for $" + num1)
            message.channel.send(workEmbed);

        money[sender.id].cash = parseFloat(money[sender.id].cash) + parseFloat(num1);
        money[sender.id].totalMoney = parseFloat(money[sender.id].cash) + parseFloat(money[sender.id].bank);
            money[sender.id].networth = parseFloat(money[sender.id].cash) + parseFloat(money[sender.id].bank) + parseFloat(money[sender.id].assets) ;

        fs.writeFile('Storage/money.json', JSON.stringify(money), (err) => {if (err) console.error(JSON.stringify(money));});
    }
    //Check Wealth
    if(command === 'wealth' || command === 'welth' || command === 'welt' || command === 'wealt' || command === 'wel' )
    {
        var signCash = '';
        var signNetWorth = '';
        if(money[sender.id].cash < 0)
            signCash = '-';

        if(money[sender.id].networth < 0)
            signNetWorth = '-';
        const balEmbed = new Discord.MessageEmbed()
            .setColor('#fcad03')
            .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
            .addFields
            (               
                { name: 'Cash:', value: signCash + "$" + Math.abs(money[sender.id].cash), inline: false },
                { name: 'Bank:', value: "$" + money[sender.id].bank, inline: false },
                { name: 'Assets:', value: "$" + money[sender.id].assets, inline: false },
                { name: 'Net Worth:', value: signNetWorth + "$" + Math.abs(money[sender.id].networth), inline: false },
                
	        )       
        message.channel.send(balEmbed);
    }
    //Deposit Money
    if(command === 'dep' || command === 'dp')
    {
       
        if(money[sender.id].cash <= 0)
        {
            const depFailEmbed = new Discord.MessageEmbed()
	            .setColor('#fcad03')
                .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                .setDescription(":x: You have no money to deposit!")
            message.channel.send(depFailEmbed);
        }
        
        else
        {

            if(args[0] === 'all' || args[0] === 'al' )
            {
                const depEmbed = new Discord.MessageEmbed()
	                .setColor('#fcad03')
                    .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                    .setDescription(":white_check_mark: Deposited $" + money[sender.id].cash + " to your bank!")
                message.channel.send(depEmbed);
                money[sender.id].bank = parseFloat(money[sender.id].bank) + parseFloat(money[sender.id].cash);
                money[sender.id].cash = 0;
            }
            
            else if(!isNaN(args[0]))
            {
                if(args[0] > money[sender.id].cash)
                {
                    const depEmbed = new Discord.MessageEmbed()
	                    .setColor('#fcad03')
                        .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                        .setDescription(":x: You do not have enough cash to deposit!")
                    message.channel.send(depEmbed);
                }

                else
                {
                    const depEmbed = new Discord.MessageEmbed()
	                    .setColor('#fcad03')
                        .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                        .setDescription(":white_check_mark: Deposited $" + args[0] + " to your bank!")
                    message.channel.send(depEmbed);

                    money[sender.id].bank = parseFloat(money[sender.id].bank) + parseFloat(args[0]);
                    money[sender.id].cash = parseFloat(money[sender.id].cash) - parseFloat(args[0]);
                }
            }

            money[sender.id].totalMoney = parseFloat(money[sender.id].cash) + parseFloat(money[sender.id].bank);
            money[sender.id].networth = parseFloat(money[sender.id].cash) + parseFloat(money[sender.id].bank) + parseFloat(money[sender.id].assets) ;
            saveMoneyData();
        }
       
    }
    //Mug
    if(command === 'mug' || command === 'mugg' || command === 'mg')
    {
        var num2 = Math.floor((Math.random() * (100)));
        var num3;
        
        //succeeded
        if(num2 >= mugFailChance)
        {
            num3 = Math.floor((Math.random() * (mugMax - mugMin))+mugMin);
            const mugEmbed = new Discord.MessageEmbed()
	            .setColor('#fcad03')
                .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                .setDescription(":moneybag: You have successfully mugged a person for $" + num3 + "!")
            message.channel.send(mugEmbed);
            money[sender.id].cash = parseFloat(money[sender.id].cash) + parseFloat(num3);
            money[sender.id].totalMoney = parseFloat(money[sender.id].cash) + parseFloat(money[sender.id].bank);
            money[sender.id].networth = parseFloat(money[sender.id].cash) + parseFloat(money[sender.id].bank) + parseFloat(money[sender.id].assets) ;
            saveMoneyData();
        }

        //failed
        else
        {
            num3 = Math.floor(money[sender.id].totalMoney * mugFailLoss);
            const mugFailEmbed = new Discord.MessageEmbed()
	            .setColor('#fcad03')
                .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                .setDescription(":x: You were caught and fined $" + num3 + "!")
            message.channel.send(mugFailEmbed);
            
            if(money[sender.id].cash >= num3)
            {
                money[sender.id].cash = parseFloat(money[sender.id].cash) - parseFloat(num3);
            } 

            else
            {
                money[sender.id].cash  = 0;
                var temp1 = parseFloat(num3) - parseFloat(money[sender.id].cash);
                money[sender.id].bank = parseFloat(money[sender.id].bank) - parseFloat(num3);
            }

            money[sender.id].totalMoney = parseFloat(money[sender.id].cash) + parseFloat(money[sender.id].bank);
            money[sender.id].networth = parseFloat(money[sender.id].cash) + parseFloat(money[sender.id].bank) + parseFloat(money[sender.id].assets) ;
            saveMoneyData();
        }
        
    }
    //Withdraw Money
    if(command === 'with')
    {
        if (!isNaN(args[0]))
        {
            
            if(money[sender.id].bank <= 0)
             {
                const depFailEmbed = new Discord.MessageEmbed()
	               .setColor('#fcad03')
                   .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                   .setDescription(":x: You have no money to withdraw!")
                message.channel.send(depFailEmbed);
             }
            else if(args[0] > money[sender.id].bank)
            {
                const withEmbed = new Discord.MessageEmbed()
	                .setColor('#fcad03')
                    .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                    .setDescription(":x: You do not have enough money in your bank!")
                message.channel.send(withEmbed);
            }

            else
            {
                const withEmbed = new Discord.MessageEmbed()
	                .setColor('#fcad03')
                    .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                    .setDescription(":white_check_mark: Withdrew $" + args[0] + "!")
                message.channel.send(withEmbed);
                money[sender.id].bank = parseFloat(money[sender.id].bank) - parseFloat(args[0]);
                money[sender.id].cash = parseFloat(money[sender.id].cash) + parseFloat(args[0]);
                money[sender.id].totalMoney = parseFloat(money[sender.id].cash) + parseFloat(money[sender.id].bank);
            money[sender.id].networth = parseFloat(money[sender.id].cash) + parseFloat(money[sender.id].bank) + parseFloat(money[sender.id].assets) ;
                saveMoneyData();
            }
        }

        else if(args[0] === "all" || args[0] === "al" )
        {

            const withEmbed = new Discord.MessageEmbed()
	                .setColor('#fcad03')
                    .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                    .setDescription(":white_check_mark: Withdrew $" + money[sender.id].bank + "!")
            message.channel.send(withEmbed);    
            money[sender.id].cash = parseFloat(money[sender.id].cash) + parseFloat(money[sender.id].bank);
            money[sender.id].bank = parseFloat(money[sender.id].bank) - parseFloat(money[sender.id].bank);
            money[sender.id].totalMoney = parseFloat(money[sender.id].cash) + parseFloat(money[sender.id].bank);
            money[sender.id].networth = parseFloat(money[sender.id].cash) + parseFloat(money[sender.id].bank) + parseFloat(money[sender.id].assets) ;
            saveMoneyData();
        }
    }
    //Rob Another Person
    if(command === 'rob' || command === 'rb')
    {
        
        if (message.mentions.users.size > 0)
        {
            const taggedUser = message.mentions.users.first();

            if(!money[taggedUser.id]) money[taggedUser.id] = 
                {
                    cash: 0,
                    bank: 0,
                    totalMoney: 0,
                }
                
                
            saveMoneyData();
            
            
            var robSuccessRate;
            var num4 = Math.floor((Math.random() * (100)));

            if(parseFloat(money[sender.id].totalMoney) >= 9000000)
                robSuccessRate = 10;
            
            else
            {
                robSuccessRate = 100 - Math.ceil(parseFloat(money[sender.id].totalMoney + 1)/1000000) * 10;
            }
            
               //Success
            if(num4 < robSuccessRate)
            {
                var robPercentConverted = parseFloat(robPercent/100);
                var amountRobbed = Math.floor(parseFloat(money[taggedUser.id].cash) * robPercentConverted);
                var amountLeft = Math.floor(parseFloat(money[taggedUser.id].cash) * (1- robPercentConverted));
                money[taggedUser.id].cash = parseFloat(amountLeft);
                money[sender.id].cash  = parseFloat(money[sender.id].cash) + parseFloat(amountRobbed);
                const robEmbed = new Discord.MessageEmbed()
	                .setColor('#fcad03')
                    .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                    .setDescription(":white_check_mark: You successfully robbed $" + amountRobbed + " from " + taggedUser.username + "!")
                message.channel.send(robEmbed);
                
                saveMoneyData();
            }

            //Failed
            else if (num4 >= robSuccessRate)
            {
                var amountLost = Math.floor(.2 * parseFloat(money[sender.id].totalMoney));

                if(parseFloat(money[sender.id].cash) >= parseFloat(amountLost))
                {
                    money[sender.id].cash = parseFloat(money[sender.id].cash) - parseFloat(amountLost);
                } 

                else
                {
                   var temp2 = parseFloat(amountLost) - parseFloat(money[sender.id].cash);
                   money[sender.id].cash = 0;
                   money[sender.id].bank = parseFloat(money[sender.id].bank) - parseFloat(temp2);
                }

                const robFailEmbed = new Discord.MessageEmbed()
	                .setColor('#fcad03')
                    .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                    .setDescription(":x: You were caught while trying to rob " + taggedUser.username +" and were forced to play a fine of $" + amountLost + "!" )
                message.channel.send(robFailEmbed);

                saveMoneyData();;
            }    


                     
        }

        else 
        {
            const robMissingEmbed = new Discord.MessageEmbed()
	            .setColor('#fcad03')
                .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                .setDescription(":x: You haven\'t specified who you want to rob!!")
            message.channel.send(robMissingEmbed);
        }

        
    }
    //Show store
    if(command === 'store')
    {
        const storeEmbed = new Discord.MessageEmbed()
	        .setColor('#fcad03')
            .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
            .setTitle("Store")
            .setImage('https://media.discordapp.net/attachments/731363739722317835/780935579554545664/unknown.png?width=749&height=613')
            message.channel.send(storeEmbed);
    }   
    //Buy items from the store
    if(command === 'buy')
    {
        if(args[0] != null && args[1]!= null)
        {
            var temp3 = args[0].toLowerCase();
            var cost;

            function subtractCost(cost)
            {
                if(cost > money[sender.id].cash)
                        {
                            var temp4 = cost - parseFloat(money[sender.id].cash);
                            money[sender.id].cash = 0;
                            money[sender.id].bank = parseFloat(money[sender.id].bank) - parseFloat(temp4);
                        }
    
                        else
                        {
                            money[sender.id].cash = parseFloat(money[sender.id].cash) - parseFloat(cost);
                        }
                        saveMoneyData();
                return 0;
            }

            function failedTransacion()
            {
                const purchaseFailEmbed = new Discord.MessageEmbed()
                    .setColor('#fcad03')
                    .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                    .setDescription(":x: You do no have enough money!")
                message.channel.send(purchaseFailEmbed);
                return 0;
            }

            // -buy troopers quantity
            if(temp3 === 'troopers')
            {
                if(!isNaN(args[1]))
                {
                    cost = 100000 * args[1];
                    //Purchase Failed          
                    if(cost > money[sender.id].totalMoney)
                    {
                        failedTransacion();
                    }
                    //Purchase Successful
                    else
                    {
                        const purchaseFailEmbed = new Discord.MessageEmbed()
                            .setColor('#fcad03')
                            .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                            .setDescription(":white_check_mark: You have successfully purchased Troopers! Quantity: " + 100*args[1])
                        message.channel.send(purchaseFailEmbed);
    
                        inventory[sender.id].trooper100x =  parseFloat(inventory[sender.id].trooper100x) + parseFloat(args[1]);
                        addPoints( 1, args[1]);
                        subtractCost(cost);
                    }
                }
            }
            // -buy special forces quantity
            else if(temp3 === 'special')
            {
                if(!isNaN(args[2]))
                {
                    cost = 200000 * args[2];
                    //Purchase Failed          
                    if(cost > money[sender.id].totalMoney)
                    {
                        failedTransacion();
                    }


                    //Purchase Successful
                    else
                    {
                        const purchaseFailEmbed = new Discord.MessageEmbed()
                            .setColor('#fcad03')
                            .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                            .setDescription(":white_check_mark: You have successfully purchased Special Forces! Quantity: " + 100*args[2])
                        message.channel.send(purchaseFailEmbed);
    
                        inventory[sender.id].specialForcesx100 = parseFloat(inventory[sender.id].specialForcesx100) + parseFloat(args[2]);
                        
                        subtractCost(cost);
                    }
                } 
            }
            // -buy challenger 2 quantity
            else if(temp3 === 'challenger')
            {
                if(!isNaN(args[2]))
                {
                    cost = 1000000 * args[2];
                    //Purchase Failed          
                    if(cost > money[sender.id].totalMoney)
                    {
                        failedTransacion();
                    }
                    //Purchase Successful
                    else
                    {
                        const purchaseFailEmbed = new Discord.MessageEmbed()
                            .setColor('#fcad03')
                            .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                            .setDescription(":white_check_mark: You have successfully purchased the Challenger 2! Quantity: " + args[2])
                        message.channel.send(purchaseFailEmbed);
    
                        inventory[sender.id].Challenger2 =  parseFloat(inventory[sender.id].Challenger2) + parseFloat(args[2]);
                        
                        subtractCost(cost);
                    }
                } 
            }
            // -buy leopard 2 quantity   
            else if(temp3 === 'leopard')
            {
                if(!isNaN(args[2]))
                {
                    cost = 1500000 * args[2];
                    //Purchase Failed          
                    if(cost > money[sender.id].totalMoney)
                    {
                        failedTransacion();
                    }
                    //Purchase Successful
                    else
                    {
                        const purchaseFailEmbed = new Discord.MessageEmbed()
                            .setColor('#fcad03')
                            .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                            .setDescription(":white_check_mark: You have successfully purchased the Leopard 2! Quantity: " + args[2])
                        message.channel.send(purchaseFailEmbed);
    
                        inventory[sender.id].Leopard2 =  parseFloat(inventory[sender.id].Leopard2) + parseFloat(args[2]);
                        
                        subtractCost(cost);
                    }
                } 
            }
            // -buy t-90 quantity
            else if(temp3 === 't-90')
            {
                if(!isNaN(args[1]))
                {
                    cost = 2500000 * args[1];
                    //Purchase Failed          
                    if(cost > money[sender.id].totalMoney)
                    {
                        failedTransacion();
                    }
                    //Purchase Successful
                    else
                    {
                        const purchaseFailEmbed = new Discord.MessageEmbed()
                            .setColor('#fcad03')
                            .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                            .setDescription(":white_check_mark: You have successfully purchased the T-90! Quantity: " + args[1])
                        message.channel.send(purchaseFailEmbed);
    
                        inventory[sender.id].T90 =  parseFloat(inventory[sender.id].T90) + parseFloat(args[1]);
                        
                        subtractCost(cost);
                    }
                } 
            }
            // -buy m1 abrams quantity
            else if(temp3 === 'm1')
            {
                if(!isNaN(args[2]))
                {
                    cost = 3500000 * args[2];
                    //Purchase Failed          
                    if(cost > money[sender.id].totalMoney)
                    {
                        failedTransacion();
                    }
                    //Purchase Successful
                    else
                    {
                        const purchaseFailEmbed = new Discord.MessageEmbed()
                            .setColor('#fcad03')
                            .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                            .setDescription(":white_check_mark: You have successfully purchased the M1 Abrams! Quantity: " + args[2])
                        message.channel.send(purchaseFailEmbed);
    
                        inventory[sender.id].M1Abrams =  parseFloat(inventory[sender.id].M1Abrams) + parseFloat(args[2]);
                        
                        subtractCost(cost);
                    }
                } 
            }
            // -buy dassault rafale quantity
            else if(temp3 === 'dassault')
            {
                if(!isNaN(args[2]))
                {
                    cost = 4000000 * args[2];
                    //Purchase Failed          
                    if(cost > money[sender.id].totalMoney)
                    {
                        failedTransacion();
                    }
                    //Purchase Successful
                    else
                    {
                        const purchaseFailEmbed = new Discord.MessageEmbed()
                            .setColor('#fcad03')
                            .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                            .setDescription(":white_check_mark: You have successfully purchased the Dassault Rafale! Quantity: " + args[2])
                        message.channel.send(purchaseFailEmbed);
    
                        inventory[sender.id].DassaultRafale =  parseFloat(inventory[sender.id].DassaultRafale) + parseFloat(args[2]);
                        
                        subtractCost(cost);
                    }
                } 
            }
            // -buy eurofighter typhoon quantity
            else if(temp3 === 'eurofighter')
            {
                if(!isNaN(args[2]))
                {
                    cost = 5000000 * args[2];
                    //Purchase Failed          
                    if(cost > money[sender.id].totalMoney)
                    {
                        failedTransacion();
                    }
                    //Purchase Successful
                    else
                    {
                        const purchaseFailEmbed = new Discord.MessageEmbed()
                            .setColor('#fcad03')
                            .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                            .setDescription(":white_check_mark: You have successfully purchased the Eurofighter Typhoon! Quantity: " + args[2])
                        message.channel.send(purchaseFailEmbed);
    
                        inventory[sender.id].EurofighterTyphoon =  parseFloat(inventory[sender.id].EurofighterTyphoon) + parseFloat(args[2]);
                        
                        subtractCost(cost);
                    }
                } 
            }
            // -buy f-22 raptor quantity
            else if(temp3 === 'f-22')
            {
                if(!isNaN(args[2]))
                {
                    cost = 6000000 * args[2];
                    //Purchase Failed          
                    if(cost > money[sender.id].totalMoney)
                    {
                        failedTransacion();
                    }
                    //Purchase Successful
                    else
                    {
                        const purchaseFailEmbed = new Discord.MessageEmbed()
                            .setColor('#fcad03')
                            .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                            .setDescription(":white_check_mark: You have successfully purchased the F-22 Raptor! Quantity: " + args[2])
                        message.channel.send(purchaseFailEmbed);
    
                        inventory[sender.id].F22Raptor =  parseFloat(inventory[sender.id].F22Raptor) + parseFloat(args[2]);
                        
                        subtractCost(cost);
                    }
                } 
            }
            // -buy hobart class quantity
            else if(temp3 === 'hobart')
            {
                if(!isNaN(args[2]))
                {
                    cost = 9000000 * args[2];
                    //Purchase Failed          
                    if(cost > money[sender.id].totalMoney)
                    {
                        failedTransacion();
                    }
                    //Purchase Successful
                    else
                    {
                        const purchaseFailEmbed = new Discord.MessageEmbed()
                            .setColor('#fcad03')
                            .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                            .setDescription(":white_check_mark: You have successfully purchased the Hobart Class! Quantity: " + args[2])
                        message.channel.send(purchaseFailEmbed);
    
                        inventory[sender.id].HobartClass =  parseFloat(inventory[sender.id].HobartClass) + parseFloat(args[2]);
                        
                        subtractCost(cost);
                    }
                } 
            }
            // -buy atago class quantity
            else if(temp3 === 'atago')
            {
                if(!isNaN(args[2]))
                {
                    cost = 11000000 * args[2];
                    //Purchase Failed          
                    if(cost > money[sender.id].totalMoney)
                    {
                        failedTransacion();
                    }
                    //Purchase Successful
                    else
                    {
                        const purchaseFailEmbed = new Discord.MessageEmbed()
                            .setColor('#fcad03')
                            .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                            .setDescription(":white_check_mark: You have successfully purchased the Atago Class! Quantity: " + args[2])
                        message.channel.send(purchaseFailEmbed);
    
                        inventory[sender.id].AtagoClass =  parseFloat(inventory[sender.id].AtagoClass) + parseFloat(args[2]);
                        
                        subtractCost(cost);
                    }
                } 
            }
            // -buy arleigh burke class quantity
            else if(temp3 === 'arleigh')
            {
                if(!isNaN(args[3]))
                {
                    cost = 14000000 * args[3];
                    //Purchase Failed          
                    if(cost > money[sender.id].totalMoney)
                    {
                        failedTransacion();
                    }
                    //Purchase Successful
                    else
                    {
                        const purchaseFailEmbed = new Discord.MessageEmbed()
                            .setColor('#fcad03')
                            .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                            .setDescription(":white_check_mark: You have successfully purchased the Arleigh Burke Class! Quantity: " + args[3])
                        message.channel.send(purchaseFailEmbed);
    
                        inventory[sender.id].ArleighBurkeClass =  parseFloat(inventory[sender.id].ArleighBurkeClass) + parseFloat(args[3]);
                        
                        subtractCost(cost);
                    }
                } 
            }
            // -buy us nimitz quantity
            else if(temp3 === 'us')
            {
                if(!isNaN(args[2]))
                {
                    cost = 20000000 * args[2];
                    //Purchase Failed          
                    if(cost > money[sender.id].totalMoney)
                    {
                        failedTransacion();
                    }
                    //Purchase Successful
                    else
                    {
                        const purchaseFailEmbed = new Discord.MessageEmbed()
                            .setColor('#fcad03')
                            .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                            .setDescription(":white_check_mark: You have successfully purchased the US Nimitz! Quantity: " + args[2])
                        message.channel.send(purchaseFailEmbed);
    
                        inventory[sender.id].USNimitz =  parseFloat(inventory[sender.id].USNimitz) + parseFloat(args[2]);
                        
                        subtractCost(cost);
                    }
                } 
            }
            // -buy ins vikramaditya quantity
            else if(temp3 === 'ins')
            {
                if(!isNaN(args[2]))
                {
                    cost = 25000000 * args[2];
                    //Purchase Failed          
                    if(cost > money[sender.id].totalMoney)
                    {
                        failedTransacion();
                    }
                    //Purchase Successful
                    else
                    {
                        const purchaseFailEmbed = new Discord.MessageEmbed()
                            .setColor('#fcad03')
                            .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                            .setDescription(":white_check_mark: You have successfully purchased the INS Vikramaditya! Quantity: " + args[2])
                        message.channel.send(purchaseFailEmbed);
    
                        inventory[sender.id].INSVikramaditya =  parseFloat(inventory[sender.id].INSVikramaditya) + parseFloat(args[2]);
                        
                        subtractCost(cost);
                    }
                } 
            }
            // -buy gerald r ford quantity
            else if(temp3 === 'gerald')
            {
                if(!isNaN(args[3]))
                {
                    cost = 30000000 * args[3];
                    //Purchase Failed          
                    if(cost > money[sender.id].totalMoney)
                    {
                        failedTransacion();
                    }
                    //Purchase Successful
                    else
                    {
                        const purchaseFailEmbed = new Discord.MessageEmbed()
                            .setColor('#fcad03')
                            .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
                            .setDescription(":white_check_mark: You have successfully purchased the Gerald R Ford! Quantity: " + args[3])
                        message.channel.send(purchaseFailEmbed);
    
                        inventory[sender.id].GeraldRFord =  parseFloat(inventory[sender.id].GeraldRFord) + parseFloat(args[3]);
                        
                        subtractCost(cost);
                    }
                } 
            }

            compileAssets();
       }
    }
    //Admin commands
    if(command === 'admin')
    {
        if(sender.id === '473517971529138201')
        {
            if(args[0] != null)
            {
                var temp4 = args[0].toLowerCase();
                if (temp4 === 'reseteconomy')
                {
                    message.channel.send("Work in Progress!");
                }

                else if (temp4 === 'addmoney')
                {
                    message.channel.send("Work in Progress!");
                }

                else if (temp4 === 'getid')
                {

                }
            }
            

        }

        else  
        message.channel.send("lmfao " + message.author.username + ", you actually thought :laughing:");
    }
    //Show inventory
    if(command === 'inv')
    {
        checkPrev = true;
        const inventoryEmbed = new Discord.MessageEmbed()
            .setColor('#fcad03')
            .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
            .addFields
            (               
                { name: 'Inventory', value: '\n Troopers: ' + parseFloat(inventory[sender.id].trooper100x) * 100 + '\n Special Forces ' + parseFloat(inventory[sender.id].specialForcesx100) * 100 + '\n Challenger 2: ' + inventory[sender.id].Challenger2 + '\n Leopard 2: ' + inventory[sender.id].Leopard2 + '\n T-90: ' + inventory[sender.id].T90 + '\n M1 Abrams: ' + inventory[sender.id].M1Abrams + '\n Dassault Rafale: ' + inventory[sender.id].DassaultRafale + '\n Eurofighter Typhoon: ' + inventory[sender.id].EurofighterTyphoon + '\n F-22 Raptor: ' + inventory[sender.id].F22Raptor + '\n Hobart Class: ' + inventory[sender.id].HobartClass + '\n Atago Class: ' + inventory[sender.id].AtagoClass + '\n Arleigh Burke Class: ' + inventory[sender.id].ArleighBurkeClass + '\n US Nimitz: ' + inventory[sender.id].USNimitz + '\n INS Vikramaditya: ' + inventory[sender.id]. INSVikramaditya + '\n Gerald R Ford: ' + inventory[sender.id].GeraldRFord  , inline: false },
	        )  
        message.channel.send(inventoryEmbed);
    }
    //Show points
    if(command === 'points')
    {
        const pointsEmbed = new Discord.MessageEmbed()
            .setColor('#fcad03')
            .setAuthor(author, message.author.displayAvatarURL({ dynamic:true }))
            .addFields
            (  
                { name: 'Strength', value: points[sender.id].strength + ' points', inline: true },     
                { name: 'Popularity', value: points[sender.id].popularity + ' points', inline: true }, 
                { name: 'Tickets', value: '-', inline: true }, 
	        )  
        message.channel.send(pointsEmbed);
    }

    if(command === 'silence')
    {
        if(author === 'GOTWIC')
        {
            
            if (message.mentions.users.size > 0){

                let taggedUser = message.mentions.users.first();
                if (!taggedUser) return message.channel.send("Invalid user.");


                let mutedRole = message.guild.roles.cache.find(role => role.name === 'Muted');

                taggedUser.role.add(mutedRole);

            }

            
        }        
    }

    if(command === 'perm')
    {
        if (message.mentions.users.size > 0)
        {
            const taggedUser = message.mentions.users.first();

            if (taggedUser.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])) {
                message.channel.send("true");
            }
        }
    }



})



client.login('NzgwMTY4ODQyNjc1ODc5OTY3.X7rK2g.97DDhrILT4ey-nTWJwPropO8cGs');
