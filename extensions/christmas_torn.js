// ==UserScript==
// @name         Christmas Town Helper mobile ver
// @namespace    hardy.ct.helper
// @version      2.3.3
// @description  Christmas Town Helper. Highlights Items, Chests, NPCs. And Games Cheat
// @author       Hardy [2131687]
// @match        https://www.torn.com/christmas_town.php*
// @grant        none
// ==/UserScript==
(function () {
    'use strict';

    if(window.xmas_torn_helper_flag) return;
    window.xmas_torn_helper_flag = true;

    /*
    兼容手机
     */
    const wh_fake_GM = {};
    try {
        GM_getValue();
        wh_fake_GM.isRunningUserscriptEngine = true;
    } catch {
        wh_fake_GM.isRunningUserscriptEngine = false;
    }
    if (wh_fake_GM.isRunningUserscriptEngine) {
        wh_fake_GM.GM_getValue = GM_getValue;
        wh_fake_GM.GM_setValue = GM_setValue;
        wh_fake_GM.GM_addStyle = GM_addStyle;
        wh_fake_GM.GM_xmlhttpRequest = GM_xmlhttpRequest;
        wh_fake_GM.unsafeWindow = unsafeWindow;
    }
    const GM_getValue = wh_fake_GM.isRunningUserscriptEngine ? wh_fake_GM.GM_getValue : (k) => {
        const localDB = localStorage.getItem('wh_fake_GM_DB')
            ? JSON.parse(localStorage.getItem('wh_fake_GM_DB'))
            : {};
        return localDB[k];
    };
    const GM_setValue = wh_fake_GM.isRunningUserscriptEngine ? wh_fake_GM.GM_setValue : (k, v) => {
        const localDB = localStorage.getItem('wh_fake_GM_DB')
            ? JSON.parse(localStorage.getItem('wh_fake_GM_DB'))
            : {};
        localDB[k] = v;
        localStorage.setItem('wh_fake_GM_DB', JSON.stringify(localDB))
    };
    const GM_addStyle = wh_fake_GM.isRunningUserscriptEngine ? wh_fake_GM.GM_addStyle : (v) => {
        const wh_gStyle = document.querySelector('style#wh-gStyle');
        if (wh_gStyle) {
            wh_gStyle.innerHTML += v;
        } else {
            const wh_gStyle = document.createElement("style");
            wh_gStyle.id = 'wh-gStyle';
            wh_gStyle.innerHTML = v;
            document.head.append(wh_gStyle);
        }
    };
    const GM_xmlhttpRequest = wh_fake_GM.isRunningUserscriptEngine ? wh_fake_GM.GM_xmlhttpRequest : (args) => {
        const str = `{"items":[[4555555,"Points",45000],[1,"Hammer",47],[2,"Baseball Bat",187],[3,"Crowbar",200],[4,"Knuckle Dusters",485],[5,"Pen Knife",709],[6,"Kitchen Knife",1579],[7,"Dagger",1292],[8,"Axe",3070],[9,"Scimitar",5140],[10,"Chainsaw",11469],[11,"Samurai Sword",56401],[12,"Glock 17",256],[13,"Raven MP25",534],[14,"Ruger 22/45",683],[15,"Beretta M9",1615],[16,"USP",1775],[17,"Beretta 92FS",4350],[18,"Fiveseven",7648],[19,"Magnum",15867],[20,"Desert Eagle",36022],[21,"Dual 92G Berettas",3000000],[22,"Sawed-Off Shotgun",1640],[23,"Benelli M1 Tactical",3233],[24,"MP5 Navy",3559],[25,"P90",6550],[26,"AK-47",9569],[27,"M4A1 Colt Carbine",11765],[28,"Benelli M4 Super",21427],[29,"M16 A2 Rifle",36711],[30,"Steyr AUG",62167],[31,"M249 SAW",675971],[32,"Leather Vest",1500],[33,"Police Vest",7003],[34,"Bulletproof Vest",31310],[35,"Box of Chocolate Bars",538],[36,"Big Box of Chocolate Bars",5552],[37,"Bag of Bon Bons",669],[38,"Box of Bon Bons",1385],[39,"Box of Extra Strong Mints",688],[40,"Pack of Music CDs",180],[41,"DVD Player",668],[42,"MP3 Player",347],[43,"CD Player",309],[44,"Pack of Blank CDs : 100",184],[45,"Hard Drive",475],[46,"Tank Top",234],[47,"Trainers",310],[48,"Jacket",269],[49,"Full Body Armor",61558],[50,"Outer Tactical Vest",746700],[51,"Plain Silver Ring",216],[52,"Sapphire Ring",1045],[53,"Gold Ring",299],[54,"Diamond Ring",3980],[55,"Pearl Necklace",24109],[56,"Silver Necklace",9141],[57,"Gold Necklace",413],[58,"Plastic Watch",598],[59,"Stainless Steel Watch",2778],[60,"Gold Watch",968],[61,"Personal Computer",276],[62,"Microwave",10356],[63,"Minigun",1300014],[64,"Pack of Cuban Cigars",565],[65,"Television",919],[66,"Morphine",17469],[67,"First Aid Kit",8375],[68,"Small First Aid Kit",4760],[69,"Simple Virus",1432],[70,"Polymorphic Virus",38931],[71,"Tunneling Virus",22595],[72,"Armored Virus",101829],[73,"Stealth Virus",200039],[74,"Santa Hat '04",0],[75,"Christmas Cracker '04",0],[76,"Snow Cannon",0],[77,"Toyota MR2",28944],[78,"Honda NSX",31855],[79,"Audi TT Quattro",54563],[80,"BMW M5",42571],[81,"BMW Z8",79813],[82,"Chevrolet Corvette Z06",49755],[83,"Dodge Charger",68458],[84,"Pontiac Firebird",58574],[85,"Ford GT40",119889],[86,"Hummer H3",22477],[87,"Audi S4",12510],[88,"Honda Integra R",14293],[89,"Honda Accord",22911],[90,"Honda Civic",8845],[91,"Volkswagen Beetle",7356],[92,"Chevrolet Cavalier",5327],[93,"Ford Mustang",16471],[94,"Reliant Robin",8859],[95,"Holden SS",24902],[96,"Coat Hanger",616789],[97,"Bunch of Flowers",166],[98,"Neutrilux 2000",0],[99,"Springfield 1911",241],[100,"Egg Propelled Launcher",0],[101,"Bunny Suit",0],[102,"Chocolate Egg '05",0],[103,"Firewalk Virus",52659],[104,"Game Console",3616],[105,"Xbox",0],[106,"Parachute",462000000],[107,"Trench Coat",408958],[108,"9mm Uzi",600796],[109,"RPG Launcher",700000001],[110,"Leather Bullwhip",925],[111,"Ninja Claws",4966],[112,"Test Trophy",0],[113,"Pet Rock",0],[114,"Non-Anon Doll",0],[115,"Poker Doll",0],[116,"Yoda Figurine",0],[117,"Trojan Horse",0],[118,"Evil Doll",0],[119,"Rubber Ducky of Doom",0],[120,"Teppic Bear",0],[121,"RockerHead Doll",0],[122,"Mouser Doll",0],[123,"Elite Action Man",0],[124,"Toy Reactor",0],[125,"Royal Doll",0],[126,"Blue Dragon",0],[127,"China Tea Set",0],[128,"Mufasa Toy",0],[129,"Dozen Roses",1083],[130,"Skanky Doll",0],[131,"Lego Hurin",0],[132,"Mystical Sphere",0],[133,"10 Ton Pacifier",0],[134,"Horse",0],[135,"Uriel's Speakers",0],[136,"Strife Clown",0],[137,"Locked Teddy",0],[138,"Riddle's Bat",0],[139,"Soup Nazi Doll",0],[140,"Pouncer Doll",0],[141,"Spammer Doll",0],[142,"Cookie Jar",0],[143,"Vanity Mirror",0],[144,"Banana Phone",0],[145,"Xbox 360",0],[146,"Yasukuni Sword",16998500],[147,"Rusty Sword",76963],[148,"Dance Toy",0],[149,"Lucky Dime",0],[150,"Crystal Carousel",0],[151,"Pixie Sticks",228858],[152,"Ice Sculpture",0],[153,"Case of Whiskey",0],[154,"Laptop",565407],[155,"Purple Frog Doll",0],[156,"Skeleton Key",0],[157,"Patriot Whip",0],[158,"Statue Of Aeolus",0],[159,"Bolt Cutters",741],[160,"Photographs",4900000],[161,"Black Unicorn",0],[162,"WarPaint Kit",0],[163,"Official Ninja Kit",0],[164,"Leukaemia Teddy Bear",0],[165,"Chocobo Flute",0],[166,"Annoying Man",0],[167,"Article on Crime",45000000],[168,"Unknown",0],[169,"Barbie Doll",0],[170,"Wand of Destruction",0],[171,"Jack-O-Lantern '05",0],[172,"Gas Can",846459],[173,"Butterfly Knife",1124],[174,"XM8 Rifle",9629],[175,"Taser",4042],[176,"Chain Mail",3239],[177,"Cobra Derringer",53152],[178,"Flak Jacket",4157],[179,"Birthday Cake '05",0],[180,"Bottle of Beer",4474],[181,"Bottle of Champagne",4804],[182,"Soap on a Rope",922],[183,"Single Red Rose",502],[184,"Bunch of Black Roses",761],[185,"Bunch of Balloons '05",0],[186,"Sheep Plushie",715],[187,"Teddy Bear Plushie",724],[188,"Cracked Crystal Ball",0],[189,"S&W Revolver",940],[190,"C4 Explosive",356666],[191,"Memory Locket",599999],[192,"Rainbow Stud Earring",0],[193,"Hamster Toy",0],[194,"Snowflake '05",0],[195,"Christmas Tree '05",0],[196,"Cannabis",6775],[197,"Ecstasy",55469],[198,"Ketamine",50771],[199,"LSD",54044],[200,"Opium",82229],[201,"PCP",101003],[202,"Mr Torn Crown '07",0],[203,"Shrooms",9129],[204,"Speed",169155],[205,"Vicodin",3902],[206,"Xanax",849725],[207,"Ms Torn Crown '07",0],[208,"Unknown",0],[209,"Box of Sweet Hearts",671],[210,"Bag of Chocolate Kisses",699],[211,"Crazy Cow",0],[212,"Legend's Urn",0],[213,"Dreamcatcher",0],[214,"Brutus Keychain",0],[215,"Kitten Plushie",718],[216,"Single White Rose",0],[217,"Claymore Sword",71333],[218,"Crossbow",675],[219,"Enfield SA-80",203031],[220,"Grenade",7011],[221,"Stick Grenade",12587],[222,"Flash Grenade",45275],[223,"Jackhammer",4539215],[224,"Swiss Army Knife",1950],[225,"Mag 7",52297],[226,"Smoke Grenade",98536],[227,"Spear",525],[228,"Vektor CR-21",6550],[229,"Claymore Mine",13389],[230,"Flare Gun",378],[231,"Heckler & Koch SL8",32560],[232,"SIG 550",74043],[233,"BT MP9",40625],[234,"Chain Whip",3217],[235,"Wooden Nunchakus",5602],[236,"Kama",40000],[237,"Kodachi",101398],[238,"Sai",1000],[239,"Ninja Star",1088],[240,"Type 98 Anti Tank",17383333],[241,"Bushmaster Carbon 15",10486],[242,"HEG",15024],[243,"Taurus",308],[244,"Blowgun",8300],[245,"Bo Staff",283],[246,"Fireworks",2750],[247,"Katana",12959],[248,"Qsz-92",75813],[249,"SKS Carbine",4966],[250,"Twin Tiger Hooks",41997],[251,"Wushu Double Axes",89995],[252,"Ithaca 37",6960],[253,"Lorcin 380",352],[254,"S&W M29",34747],[255,"Flamethrower",2481998],[256,"Tear Gas",59222],[257,"Throwing Knife",29492],[258,"Jaguar Plushie",17299],[259,"Mayan Statue",2354],[260,"Dahlia",2948],[261,"Wolverine Plushie",10586],[262,"Hockey Stick",2491],[263,"Crocus",10278],[264,"Orchid",30600],[265,"Pele Charm",2400],[266,"Nessie Plushie",40658],[267,"Heather",45080],[268,"Red Fox Plushie",41645],[269,"Monkey Plushie",46055],[270,"Soccer Ball",2475],[271,"Ceibo Flower",42329],[272,"Edelweiss",29916],[273,"Chamois Plushie",44057],[274,"Panda Plushie",71346],[275,"Jade Buddha",9713],[276,"Peony",72564],[277,"Cherry Blossom",64021],[278,"Kabuki Mask",7500],[279,"Maneki Neko",35998],[280,"Elephant Statue",4477],[281,"Lion Plushie",70997],[282,"African Violet",58042],[283,"Donator Pack",22991775],[284,"Bronze Paint Brush",0],[285,"Silver Paint Brush",0],[286,"Gold Paint Brush",0],[287,"Pand0ra's Box",0],[288,"Mr Brownstone Doll",0],[289,"Dual Axes",0],[290,"Dual Hammers",867813715],[291,"Dual Scimitars",948054838],[292,"Dual Samurai Swords",0],[293,"Japanese/English Dictionary",0],[294,"Bottle of Sake",8960],[295,"Oriental Log",0],[296,"Oriental Log Translation",2275000],[297,"YouYou Yo Yo",0],[298,"Monkey Cuffs",0],[299,"Jester's Cap",0],[300,"Gibal's Dragonfly",0],[301,"Green Ornament",0],[302,"Purple Ornament",0],[303,"Blue Ornament",0],[304,"Purple Bell",0],[305,"Mistletoe",338333],[306,"Mini Sleigh",206138],[307,"Snowman",634856],[308,"Christmas Gnome",561194],[309,"Gingerbread House",234384],[310,"Lollipop",577],[311,"Mardi Gras Beads",0],[312,"Devil Toy",0],[313,"Cookie Launcher",0],[314,"Cursed Moon Pendant",0],[315,"Apartment Blueprint",0],[316,"Semi-Detached House Blueprint",0],[317,"Detached House Blueprint",0],[318,"Beach House Blueprint",0],[319,"Chalet Blueprint",0],[320,"Villa Blueprint",0],[321,"Penthouse Blueprint",0],[322,"Mansion Blueprint",0],[323,"Ranch Blueprint",0],[324,"Palace Blueprint",0],[325,"Castle Blueprint",0],[326,"Printing Paper",44999],[327,"Blank Tokens",47995],[328,"Blank Credit Cards",56775],[329,"Skateboard",419000000],[330,"Boxing Gloves",453200000],[331,"Dumbbells",448500000],[332,"Combat Vest",3236198],[333,"Liquid Body Armor",10211917],[334,"Flexible Body Armor",12274750],[335,"Stick of Dynamite",64720],[336,"Cesium-137",521666667],[337,"Dirty Bomb",0],[338,"Sh0rty's Surfboard",0],[339,"Puzzle Piece",0],[340,"Hunny Pot",0],[341,"Seductive Stethoscope",0],[342,"Dollar Bill Collectible",0],[343,"Backstage Pass",0],[344,"Chemi's Magic Potion",0],[345,"Pack of Trojans",18250000],[346,"Pair of High Heels",0],[347,"Thong",3966667],[348,"Hazmat Suit",0],[349,"Flea Collar",0],[350,"Dunkin's Donut",0],[351,"Amazon Doll",0],[352,"BBQ Smoker",0],[353,"Bag of Cheetos",0],[354,"Motorbike",0],[355,"Citrus Squeezer",0],[356,"Superman Shades",0],[357,"Kevlar Helmet",0],[358,"Raw Ivory",0],[359,"Fine Chisel",0],[360,"Ivory Walking Cane",9295000],[361,"Neumune Tablet",1349011],[362,"Mr Torn Crown '08",0],[363,"Ms Torn Crown '08",0],[364,"Box of Grenades",1062866],[365,"Box of Medical Supplies",255971],[366,"Erotic DVD",2425041],[367,"Feathery Hotel Coupon",13537101],[368,"Lawyer Business Card",585560],[369,"Lottery Voucher",936821],[370,"Drug Pack",4340673],[371,"Dark Doll",0],[372,"Empty Box",885],[373,"Parcel",0],[374,"Birthday Present",0],[375,"Present",0],[376,"Christmas Present",0],[377,"Birthday Wrapping Paper",738],[378,"Generic Wrapping Paper",963],[379,"Christmas Wrapping Paper",1023],[380,"Small Explosive Device",3013197],[381,"Gold Laptop",0],[382,"Gold Plated AK-47",0],[383,"Platinum PDA",0],[384,"Camel Plushie",91330],[385,"Tribulus Omanense",77801],[386,"Sports Sneakers",0],[387,"Handbag",0],[388,"Pink Mac-10",0],[389,"Mr Torn Crown '09",0],[390,"Ms Torn Crown '09",0],[391,"Macana",84499],[392,"Pepper Spray",1627],[393,"Slingshot",470],[394,"Brick",441],[395,"Metal Nunchakus",399850],[396,"Business Class Ticket",6063644],[397,"Flail",7000000],[398,"SIG 552",6896667],[399,"ArmaLite M-15A4",18396208],[400,"Guandao",200000],[401,"Lead Pipe",87],[402,"Ice Pick",19609],[403,"Box of Tissues",183],[404,"Bandana",451],[405,"Loaf of Bread",4000000],[406,"Afro Comb",30981],[407,"Compass",12675],[408,"Sextant",21000],[409,"Yucca Plant",8549],[410,"Fire Hydrant",18993],[411,"Model Space Ship",21777],[412,"Sports Shades",4141],[413,"Mountie Hat",22749],[414,"Proda Sunglasses",4812],[415,"Ship in a Bottle",50500],[416,"Paper Weight",2748],[417,"RS232 Cable",308],[418,"Tailors Dummy",0],[419,"Small Suitcase",1785320],[420,"Medium Suitcase",4095000],[421,"Large Suitcase",10198871],[422,"Vanity Hand Mirror",323000],[423,"Poker Chip",0],[424,"Rabbit Foot",0],[425,"Voodoo Doll",0],[426,"Bottle of Tequila",4713],[427,"Sumo Doll",7544],[428,"Casino Pass",83083313],[429,"Chopsticks",3000],[430,"Coconut Bra",456904],[431,"Dart Board",2900],[432,"Crazy Straw",1072],[433,"Sensu",7772],[434,"Yakitori Lantern",6300],[435,"Dozen White Roses",0],[436,"Snowboard",4223],[437,"Glow Stick",52639],[438,"Cricket Bat",12735],[439,"Frying Pan",367],[440,"Pillow",487356],[441,"Khinkeh P0rnStar Doll",0],[442,"Blow-Up Doll",0],[443,"Strawberry Milkshake",0],[444,"Breadfan Doll",0],[445,"Chaos Man",0],[446,"Karate Man",0],[447,"Burmese Flag",0],[448,"Bl0ndie's Dictionary",0],[449,"Hydroponic Grow Tent",0],[450,"Leopard Coin",1510000],[451,"Florin Coin",1580000],[452,"Gold Noble Coin",1593333],[453,"Ganesha Sculpture",11357001],[454,"Vairocana Buddha Sculpture",0],[455,"Quran Script : Ibn Masud",15100000],[456,"Quran Script : Ubay Ibn Kab",15359400],[457,"Quran Script : Ali",15827600],[458,"Shabti Sculpture",22000000],[459,"Egyptian Amulet",450000000],[460,"White Senet Pawn",9703000],[461,"Black Senet Pawn",8250000],[462,"Senet Board",984202],[463,"Epinephrine",909760],[464,"Melatonin",303681],[465,"Serotonin",1307084],[466,"Snow Globe '09",28999999],[467,"Dancing Santa Claus '09",3500000],[468,"Christmas Stocking '09",0],[469,"Santa's Elf '09",488000000],[470,"Christmas Card '09",0],[471,"Admin Portrait '09",0],[472,"Blue Easter Egg",165666],[473,"Green Easter Egg",0],[474,"Red Easter Egg",159450],[475,"Yellow Easter Egg",168998],[476,"White Easter Egg",449850],[477,"Black Easter Egg",0],[478,"Gold Easter Egg",1449997],[479,"Metal Dog Tag",0],[480,"Bronze Dog Tag",0],[481,"Silver Dog Tag",0],[482,"Gold Dog Tag",0],[483,"MP5k",3999],[484,"AK74U",9399],[485,"Skorpion",4130],[486,"TMP",4677],[487,"Thompson",14682],[488,"MP 40",10993],[489,"Luger",7876],[490,"Blunderbuss",3798],[491,"Zombie Brain",0],[492,"Human Head",0],[493,"Medal of Honor",18000000],[494,"Citroen Saxo",9628],[495,"Classic Mini",9800],[496,"Fiat Punto",57400],[497,"Nissan Micra",23883],[498,"Peugeot 106",9674],[499,"Renault Clio",10999],[500,"Vauxhall Corsa",7052],[501,"Volvo 850",82568],[502,"Alfa Romeo 156",13861],[503,"BMW X5",34000],[504,"Seat Leon Cupra",10150],[505,"Vauxhall Astra GSI",8104],[506,"Volkswagen Golf GTI",11800],[507,"Audi S3",0],[508,"Ford Focus RS",55240],[509,"Honda S2000",23773],[510,"Mini Cooper S",29000],[511,"Sierra Cosworth",8838777],[512,"Lotus Exige",18949],[513,"Mitsubishi Evo X",159614],[514,"Porsche 911 GT3",92500],[515,"Subaru Impreza STI",0],[516,"TVR Sagaris",33231],[517,"Aston Martin One-77",1291999],[518,"Audi R8",156333],[519,"Bugatti Veyron",0],[520,"Ferrari 458",872000],[521,"Lamborghini Gallardo",775222],[522,"Lexus LFA",722833],[523,"Mercedes SLR",957000],[524,"Nissan GT-R",69836],[525,"Mr Torn Crown '10",0],[526,"Ms Torn Crown '10",0],[527,"Bag of Candy Kisses",19423],[528,"Bag of Tootsie Rolls",29260],[529,"Bag of Chocolate Truffles",59990],[530,"Can of Munster",1492585],[531,"Bottle of Pumpkin Brew",79462],[532,"Can of Red Cow",1992567],[533,"Can of Taurine Elite",3573122],[534,"Witch's Cauldron",500000],[535,"Electronic Pumpkin",175000],[536,"Jack O Lantern Lamp",0],[537,"Spooky Paper Weight",202944],[538,"Medieval Helmet",0],[539,"Blood Spattered Sickle",0],[540,"Cauldron",784888],[541,"Bottle of Stinky Swamp Punch",315357],[542,"Bottle of Wicked Witch",162904],[543,"Deputy Star",0],[544,"Wind Proof Lighter",67866665],[545,"Dual TMPs",0],[546,"Dual Bushmasters",0],[547,"Dual MP5s",0],[548,"Dual P90s",0],[549,"Dual Uzis",0],[550,"Bottle of Kandy Kane",65849],[551,"Bottle of Minty Mayhem",149907],[552,"Bottle of Mistletoe Madness",282759],[553,"Can of Santa Shooters",1434450],[554,"Can of Rockstar Rudolph",1929857],[555,"Can of X-MASS",3520831],[556,"Bag of Reindeer Droppings",60052],[557,"Advent Calendar",18333],[558,"Santa's Snot",19870],[559,"Polar Bear Toy",67029],[560,"Fruitcake",2710],[561,"Book of Carols",9235505],[562,"Sweater",9494],[563,"Gift Card",3110271],[564,"Glasses",146350],[565,"High-Speed Drive",116664],[566,"Mountain Bike",473353],[567,"Cut-Throat Razor",172147],[568,"Slim Crowbar",175166],[569,"Balaclava",720632],[570,"Advanced Driving Manual",209811],[571,"Ergonomic Keyboard",247166],[572,"Tracking Device",893776],[573,"Screwdriver",195063],[574,"Fanny Pack",152374],[575,"Tumble Dryer",144274],[576,"Chloroform",130442],[577,"Heavy Duty Padlock",129997],[578,"Duct Tape",124194],[579,"Wireless Dongle",179249],[580,"Horse's Head",1050292],[581,"Book",6066000],[582,"Tin Foil Hat",0],[583,"Brown Easter Egg",0],[584,"Orange Easter Egg",159000],[585,"Pink Easter Egg",119000],[586,"Jawbreaker",226233],[587,"Bag of Sherbet",260140],[588,"Goodie Bag",33915000],[589,"Undefined",0],[590,"Undefined 2",0],[591,"Undefined 3",0],[592,"Undefined 4",0],[593,"Mr Torn Crown '11",0],[594,"Ms Torn Crown '11",0],[595,"Pile of Vomit",1976333],[596,"Rusty Dog Tag",0],[597,"Gold Nugget",9700000],[598,"Witch's Hat",0],[599,"Golden Broomstick",0],[600,"Devil's Pitchfork",0],[601,"Christmas Lights",195927],[602,"Gingerbread Man",122333],[603,"Golden Wreath",286792],[604,"Pair of Ice Skates",289737],[605,"Diamond Icicle",176384],[606,"Santa Boots",798750],[607,"Santa Gloves",416903],[608,"Santa Hat",2589086],[609,"Santa Jacket",1071692],[610,"Santa Trousers",519510],[611,"Snowball",15338],[612,"Tavor TAR-21",347337],[613,"Harpoon",117798],[614,"Diamond Bladed Knife",829741],[615,"Naval Cutlass",50999999],[616,"Trout",19371],[617,"Banana Orchid",12516],[618,"Stingray Plushie",10427],[619,"Steel Drum",0],[620,"Nodding Turtle",10015],[621,"Snorkel",15070],[622,"Flippers",6014],[623,"Speedo",21463],[624,"Bikini",14157],[625,"Wetsuit",20250],[626,"Diving Gloves",2997],[627,"Dog Poop",890501],[628,"Stink Bombs",940135],[629,"Toilet Paper",923143],[630,"Mr Torn Crown '12",0],[631,"Ms Torn Crown '12",0],[632,"Petrified Humerus",0],[633,"Latex Gloves",0],[634,"Bag of Bloody Eyeballs",55970],[635,"Straitjacket",0],[636,"Cinnamon Ornament",128996],[637,"Christmas Express",825135],[638,"Bottle of Christmas Cocktail",149949],[639,"Golden Candy Cane",676507],[640,"Kevlar Gloves",475000],[641,"WWII Helmet",131871],[642,"Motorcycle Helmet",52631666],[643,"Construction Helmet",13622],[644,"Welding Helmet",0],[645,"Safety Boots",109196],[646,"Hiking Boots",16500],[647,"Leather Helmet",1311],[648,"Leather Pants",1300],[649,"Leather Boots",931],[650,"Leather Gloves",929],[651,"Combat Helmet",3057819],[652,"Combat Pants",2661777],[653,"Combat Boots",2178521],[654,"Combat Gloves",1888137],[655,"Riot Helmet",0],[656,"Riot Body",2000000000],[657,"Riot Pants",0],[658,"Riot Boots",0],[659,"Riot Gloves",0],[660,"Dune Helmet",0],[661,"Dune Vest",0],[662,"Dune Pants",0],[663,"Dune Boots",0],[664,"Dune Gloves",0],[665,"Assault Helmet",0],[666,"Assault Body",0],[667,"Assault Pants",0],[668,"Assault Boots",0],[669,"Assault Gloves",0],[670,"Delta Gas Mask",0],[671,"Delta Body",0],[672,"Delta Pants",0],[673,"Delta Boots",0],[674,"Delta Gloves",0],[675,"Marauder Face Mask",0],[676,"Marauder Body",0],[677,"Marauder Pants",0],[678,"Marauder Boots",0],[679,"Marauder Gloves",0],[680,"EOD Helmet",0],[681,"EOD Apron",0],[682,"EOD Pants",0],[683,"EOD Boots",0],[684,"EOD Gloves",0],[685,"Torn Bible",0],[686,"Friendly Bot Guide",0],[687,"Egotistical Bear",0],[688,"Brewery Key",0],[689,"Signed Jersey",0],[690,"Mafia Kit",0],[691,"Octopus Toy",0],[692,"Bear Skin Rug",0],[693,"Tractor Toy",0],[694,"Mr Torn Crown '13",0],[695,"Ms Torn Crown '13",0],[696,"Piece of Cake",0],[697,"Rotten Eggs",0],[698,"Peg Leg",0],[699,"Antidote",0],[700,"Christmas Angel",90299],[701,"Eggnog",979211],[702,"Sprig of Holly",32744],[703,"Festive Socks",247248],[704,"Respo Hoodie",0],[705,"Staff Haxx Button",0],[706,"Birthday Cake '14",0],[707,"Lump of Coal",65994],[708,"Gold Ribbon",0],[709,"Silver Ribbon",0],[710,"Bronze Ribbon",299566420],[711,"Coin : Factions",0],[712,"Coin : Casino",0],[713,"Coin : Education",0],[714,"Coin : Hospital",0],[715,"Coin : Jail",0],[716,"Coin : Travel Agency",0],[717,"Coin : Companies",0],[718,"Coin : Stock Exchange",0],[719,"Coin : Church",0],[720,"Coin : Auction House",0],[721,"Coin : Race Track",0],[722,"Coin : Museum",0],[723,"Coin : Drugs",0],[724,"Coin : Dump",0],[725,"Coin : Estate Agents",0],[726,"Scrooge's Top Hat",0],[727,"Scrooge's Topcoat",80000000],[728,"Scrooge's Trousers",39000000],[729,"Scrooge's Boots",0],[730,"Scrooge's Gloves",0],[731,"Empty Blood Bag",17377],[732,"Blood Bag : A+",18398],[733,"Blood Bag : A-",22874],[734,"Blood Bag : B+",21403],[735,"Blood Bag : B-",24390],[736,"Blood Bag : AB+",26813],[737,"Blood Bag : AB-",26998],[738,"Blood Bag : O+",18052],[739,"Blood Bag : O-",23500],[740,"Mr Torn Crown",0],[741,"Ms Torn Crown",0],[742,"Molotov Cocktail",68636],[743,"Christmas Sweater '15",0],[744,"Book : Brawn Over Brains",0],[745,"Book : Time Is In The Mind",0],[746,"Book : Keeping Your Face Handsome",0],[747,"Book : A Job For Your Hands",0],[748,"Book : Working 9 Til 5",0],[749,"Book : Making Friends, Enemies, And Cakes",0],[750,"Book : High School For Adults",0],[751,"Book : Milk Yourself Sober",0],[752,"Book : Fight Like An Asshole",0],[753,"Book : Mind Over Matter",0],[754,"Book : No Shame No Pain",0],[755,"Book : Run Like The Wind",0],[756,"Book : Weaseling Out Of Trouble",0],[757,"Book : Get Hard Or Go Home",0],[758,"Book : Gym Grunting - Shouting To Success",0],[759,"Book : Self Defense In The Workplace",0],[760,"Book : Speed 3 - The Rejected Script",0],[761,"Book : Limbo Lovers 101",0],[762,"Book : The Hamburglar's Guide To Crime",0],[763,"Book : What Are Old Folk Good For Anyway?",0],[764,"Book : Medical Degree Schmedical Degree",0],[765,"Book : No More Soap On A Rope",0],[766,"Book : Mailing Yourself Abroad",0],[767,"Book : Smuggling For Beginners",0],[768,"Book : Stealthy Stealing of Underwear",0],[769,"Book : Shawshank Sure Ain't For Me!",0],[770,"Book : Ignorance Is Bliss",0],[771,"Book : Winking To Win",0],[772,"Book : Finders Keepers",0],[773,"Book : Hot Turkey",0],[774,"Book : Higher Daddy, Higher!",0],[775,"Book : The Real Dutch Courage",0],[776,"Book : Because I'm Happy - The Pharrell Story",0],[777,"Book : No More Sick Days",0],[778,"Book : Duke - My Story",0],[779,"Book : Self Control Is For Losers",0],[780,"Book : Going Back For More",0],[781,"Book : Get Drunk And Lose Dignity",0],[782,"Book : Fuelling Your Way To Failure",0],[783,"Book : Yes Please Diabetes",0],[784,"Book : Ugly Energy",0],[785,"Book : Memories And Mammaries",0],[786,"Book : Brown-nosing The Boss",0],[787,"Book : Running Away From Trouble",0],[788,"Certificate of Awesome",30820],[789,"Certificate of Lame",15376],[790,"Plastic Sword",3728],[791,"Mediocre T-Shirt",1546],[792,"Penelope",0],[793,"Cake Frosting",0],[794,"Lock Picking Kit",0],[795,"Special Fruitcake",0],[796,"Felovax",0],[797,"Zylkene",0],[798,"Duke's Safe",0],[799,"Duke's Selfies",0],[800,"Duke's Poetry",0],[801,"Duke's Dog's Ashes",0],[802,"Duke's Will",0],[803,"Duke's Gimp Mask",0],[804,"Duke's Herpes Medication",0],[805,"Duke's Hammer",0],[806,"Old Lady Mask",20694],[807,"Exotic Gentleman Mask",29972],[808,"Ginger Kid Mask",40096],[809,"Young Lady Mask",25249],[810,"Moustache Man Mask",25079],[811,"Scarred Man Mask",24571],[812,"Psycho Clown Mask",122219],[813,"Nun Mask",23822],[814,"Tyrosine",604498],[815,"Keg of Beer",8983930],[816,"Glass of Beer",0],[817,"Six Pack of Alcohol",1120359],[818,"Six Pack of Energy Drink",13920628],[819,"Rosary Beads",3987876],[820,"Piggy Bank",0],[821,"Empty Vial",0],[822,"Vial of Blood",0],[823,"Vial of Urine",0],[824,"Vial of Saliva",0],[825,"Questionnaire ",0],[826,"Agreement",0],[827,"Perceptron : Calibrator",0],[828,"Donald Trump Mask '16",0],[829,"Yellow Snowman '16",0],[830,"Nock Gun",0],[831,"Beretta Pico",70000000],[832,"Riding Crop",0],[833,"Sand",998800],[834,"Sweatpants",1119000],[835,"String Vest",785001],[836,"Black Oxfords",0],[837,"Rheinmetall MG 3",0],[838,"Homemade Pocket Shotgun",0],[839,"Madball",0],[840,"Nail Bomb",4433333],[841,"Classic Fedora",1273888],[842,"Pinstripe Suit Trousers",1365962],[843,"Duster",0],[844,"Tranquilizer Gun",0],[845,"Bolt Gun",0],[846,"Scalpel",0],[847,"Nerve Gas",0],[848,"Kevlar Lab Coat",0],[849,"Loupes",0],[850,"Sledgehammer",0],[851,"Wifebeater",0],[852,"Metal Detector",0],[853,"Graveyard Key",0],[854,"Questionnaire : Completed",0],[855,"Agreement : Signed",0],[856,"Spray Can : Black",0],[857,"Spray Can : Red",0],[858,"Spray Can : Pink",0],[859,"Spray Can : Purple",0],[860,"Spray Can : Blue",0],[861,"Spray Can : Green",0],[862,"Spray Can : Yellow",0],[863,"Spray Can : Orange",0],[864,"Salt Shaker",178750],[865,"Poison Mistletoe",9376546],[866,"Santa's List '17",0],[867,"Soapbox",0],[868,"Turkey Baster",101666],[869,"Elon Musk Mask '17",0],[870,"Love Juice",15033333],[871,"Bug Swatter",0],[872,"Nothing",0],[873,"Bottle of Green Stout",974083],[874,"Prototype",0],[875,"Rotten Apple",0],[876,"Festering Chicken",0],[877,"Mouldy Pizza",0],[878,"Smelly Cheese",0],[879,"Sour Milk",0],[880,"Stale Bread",0],[881,"Spoiled Fish",0],[882,"Insurance Policy ",0],[883,"Bank Statement",0],[884,"Car Battery",0],[885,"Scrap Metal",0],[886,"Torn City Times",0],[887,"Magazine",0],[888,"Umbrella",0],[889,"Travel Mug",0],[890,"Headphones",0],[891,"Undefined",0],[892,"Mix CD",0],[893,"Lost and Found Office Key",0],[894,"Cosmetics Case",0],[895,"Phone Card",0],[896,"Subway Pass",0],[897,"Bottle Cap",0],[898,"Silver Coin",0],[899,"Silver Bead",0],[900,"Lucky Quarter",0],[901,"Daffodil",0],[902,"Bunch of Carnations",0],[903,"White Lily",0],[904,"Funeral Wreath",0],[905,"Car Keys",0],[906,"Handkerchief",0],[907,"Candle",0],[908,"Paper Bag",0],[909,"Tin Can",0],[910,"Betting Slip",0],[911,"Fidget Spinner",0],[912,"Majestic Moose",0],[913,"Lego Wonder Woman",0],[914,"CR7 Doll",0],[915,"Stretch Armstrong Doll",0],[916,"Beef Femur",0],[917,"Snake's Fang",0],[918,"Icey Igloo",0],[919,"Federal Jail Key",0],[920,"Halloween Basket : Spooky",0],[921,"Michael Myers Mask '18",0],[922,"Toast Jesus '18",0],[923,"Cheesus '18",0],[924,"Bottle of Christmas Spirit",1103228],[925,"Scammer in the Slammer '18",0],[926,"Gronch Mask '18",0],[927,"Baseball Cap",3800000],[928,"Bermudas",0],[929,"Blouse",0],[930,"Boob Tube",0],[931,"Bush Hat",14483333],[932,"Camisole",6000000],[933,"Capri Pants",0],[934,"Cardigan",0],[935,"Cork Hat",0],[936,"Crop Top",0],[937,"Fisherman Hat",14000000],[938,"Gym Shorts",0],[939,"Halterneck",0],[940,"Raincoat",0],[941,"Pantyhose",3400000],[942,"Pencil Skirt",0],[943,"Peplum Top",2500001],[944,"Polo Shirt",3500000],[945,"Poncho",18375000],[946,"Puffer Vest",0],[947,"Mackintosh",0],[948,"Shorts",0],[949,"Skirt",0],[950,"Travel Socks",0],[951,"Turtleneck",16000000],[952,"Yoga Pants",14999995],[953,"Bronze Racing Trophy",0],[954,"Silver Racing Trophy",0],[955,"Gold Racing Trophy",0],[956,"Pack of Blank CDs : 250",0],[957,"Pack of Blank CDs : 50",18214],[958,"Chest Harness",5500000],[959,"Choker",9299630],[960,"Fishnet Stockings",7250001],[961,"Knee-high Boots",7805001],[962,"Lingerie",22000000],[963,"Mankini",0],[964,"Mini Skirt",18666667],[965,"Nipple Tassels",66900000],[966,"Bowler Hat",4888888],[967,"Fitted Shirt",0],[968,"Bow Tie",10000000],[969,"Neck Tie",10456790],[970,"Waistcoat",0],[971,"Blazer",0],[972,"Suit Trousers",0],[973,"Derby Shoes",11000000],[974,"Smoking Jacket",69696969],[975,"Monocle",0],[976,"Bronze Microphone",0],[977,"Silver Microphone",0],[978,"Gold Microphone",0],[979,"Paint Mask",0],[980,"Ladder",0],[981,"Wire Cutters",0],[982,"Ripped Jeans",35000000],[983,"Bandit Mask",2050000],[984,"Bottle of Moonshine",993747],[985,"Can of Goose Juice",303467],[986,"Can of Damp Valley",551946],[987,"Can of Crocozade",848521],[988,"Fur Coat",17000000],[989,"Fur Scarf",9500000],[990,"Fur Hat",0],[991,"Platform Shoes",5399444],[992,"Silver Flats",0],[993,"Crystal Bracelet",22788888],[994,"Cocktail Ring",0],[995,"Sun Hat",0],[996,"Square Sunglasses",14996888],[997,"Statement Necklace",39666667],[998,"Floral Dress",0],[1001,"Shrug",2224000],[1002,"Eye Patch",0],[1003,"Halloween Basket : Creepy",0],[1004,"Halloween Basket : Freaky",0],[1005,"Halloween Basket : Frightful",0],[1006,"Halloween Basket : Haunting",0],[1007,"Halloween Basket : Shocking",0],[1008,"Halloween Basket : Terrifying",0],[1009,"Halloween Basket : Horrifying",0],[1010,"Halloween Basket : Petrifying",0],[1011,"Halloween Basket : Nightmarish",0],[1012,"Blood Bag : Irradiated",22294],[1013,"Jigsaw Mask '19",0],[1014,"Reading Glasses",1999999],[1015,"Chinos",2350000],[1016,"Collared Shawl",0],[1017,"Pleated Skirt",1900000],[1018,"Flip Flops",3537410],[1019,"Bingo Visor",0],[1020,"Cover-ups",0],[1021,"Sandals",0],[1022,"Golf Socks",2000000],[1023,"Flat Cap",0],[1024,"Slippers",43394500],[1025,"Bathrobe",0],[1026,"Party Hat '19",999629],[1027,"Badge : 15th Anniversary",808000],[1028,"Birthday Cupcake",1282987],[1029,"Strippogram Voucher",13449997],[1030,"Dong : Thomas",3334984],[1031,"Dong : Greg",2712000],[1032,"Dong : Effy",0],[1033,"Dong : Holly",3611111],[1034,"Dong : Jeremy",2599997],[1035,"Anniversary Present",90000000],[1036,"Greta Mask '19",310000001],[1037,"Anatoly Mask '19",0],[1038,"Santa Beard",0],[1039,"Bag of Humbugs",264622],[1040,"Christmas Cracker",1057282],[1041,"Special Snowflake",0],[1042,"Concussion Grenade",4266666],[1043,"Paper Crown : Green",441986],[1044,"Paper Crown : Yellow",484697],[1045,"Paper Crown : Red",572500],[1046,"Paper Crown : Blue",467222],[1047,"Denim Shirt",1700000],[1048,"Denim Vest",2000001],[1049,"Denim Jacket",1500001],[1050,"Denim Jeans",3684892],[1051,"Denim Shoes",2100000],[1052,"Denim Cap",1499999],[1053,"Bread Knife",0],[1054,"Semtex",0],[1055,"Poison Umbrella",0],[1056,"Millwall Brick",0],[1057,"Gentleman Cache",18279998],[1058,"Gold Chain",0],[1059,"Snapback Hat",0],[1060,"Saggy Pants",0],[1061,"Oversized Shirt",4199999],[1062,"Basketball Shirt",3725009],[1063,"Parachute Pants",0],[1064,"Tube Dress",1900000],[1065,"Gold Sneakers",89000000],[1066,"Shutter Shades",0],[1067,"Silver Hoodie",11249444],[1068,"Bucket Hat",1737000],[1069,"Puffer Jacket",6000000],[1070,"Durag",2698888],[1071,"Onesie",99000000],[1072,"Baseball Jacket",3525391],[1073,"Braces",0],[1074,"Panama Hat",4199999],[1075,"Pipe",0],[1076,"Shoulder Sweater",0],[1077,"Sports Jacket",5009326],[1078,"Old Wallet",0],[1079,"Cardholder",0],[1080,"Billfold",0],[1081,"Coin Purse",0],[1082,"Zip Wallet",0],[1083,"Clutch",0],[1084,"Credit Card",0],[1085,"Lipstick",0],[1086,"License",0],[1087,"Tampon",0],[1088,"Receipt",0],[1089,"Family Photo",0],[1090,"Lint",0],[1091,"Handcuffs",0],[1092,"Lubricant",0],[1093,"Hit Contract",0],[1094,"Syringe",0],[1095,"Spoon",0],[1096,"Cell Phone",0],[1097,"Assless Chaps",9291315],[1098,"Opera Gloves",0],[1099,"Booty Shorts",4199444],[1100,"Collar",0],[1101,"Ball Gag",0],[1102,"Blindfold",9000000],[1103,"Maid Uniform",28750001],[1104,"Maid Hat",0],[1105,"Ball Gown",0],[1106,"Fascinator Hat",0],[1107,"Wedding Dress",0],[1108,"Wedding Veil",0],[1109,"Head Scarf",7689999],[1110,"Nightgown",8000001],[1111,"Pullover",1715219],[1112,"Elegant Cache",24262962],[1113,"Naughty Cache",39000000],[1114,"Elderly Cache",9832962],[1115,"Denim Cache",4623722],[1116,"Wannabe Cache",18137933],[1117,"Cutesy Cache",13903750],[1118,"Armor Cache",3000000001],[1119,"Melee Cache",0],[1120,"Small Arms Cache",0],[1121,"Medium Arms Cache",2500003830],[1122,"Heavy Arms Cache",4990000001],[1123,"Spy Camera",0],[1124,"Cloning Device",0],[1125,"Card Skimmer",0],[1126,"Tutu",7196888],[1127,"Knee Socks",0],[1128,"Kitty Shoes",36000000],[1129,"Cat Ears",19500000],[1130,"Bunny Ears",6400000],[1131,"Puppy Ears",4894444],[1132,"Heart Sunglasses",0],[1133,"Hair Bow",2488888],[1134,"Lolita Dress",0],[1135,"Unicorn Horn",0],[1136,"Check Skirt",2400000],[1137,"Polka Dot Dress",0],[1138,"Ballet Shoes",2700000],[1139,"Dungarees",1366667],[1140,"Tights",2197001],[1141,"Pennywise Mask '20",0],[1142,"Tiger King Mask '20",0],[1143,"Medical Mask",0],[1144,"Chin Diaper",4000000],[1145,"Tighty Whities",1025202],[1146,"Tangerine",500012],[1147,"Helmet of Justice",0],[1148,"Broken Bauble",1746738],[1149,"Purple Easter Egg",419550],[1150,"Ski Mask",250000001],[1151,"Bunny Nose",0],[1152,"SMAW Launcher",0],[1153,"China Lake",0],[1154,"Milkor MGL",0],[1155,"PKM",0],[1156,"Negev NG-5",0],[1157,"Stoner 96",0],[1158,"Meat Hook",52500000],[1159,"Cleaver",150000000],[1176,"Arca Fortunae",0],[1177,"Sandworm Mask '21",402592157],[1178,"Party Popper",1456102],[1179,"Eye Bleach",0],[1180,"Prince Philip Mask '21",214999998],[1181,"Krampus Mask '21",367675000]]}`;
        const fake_res = {};
        fake_res.responseText = str;
        if (args.onload) args.onload(fake_res);
    };
    const unsafeWindow = wh_fake_GM.isRunningUserscriptEngine ? unsafeWindow : window;

    /*
    原始脚本
     */
    let version = "2.3.3";
    // Thanks to xedx for Dark Mode support
    // Thanks Kafia for beep effect
    //Thanks to Ahab and Helcostr for the list of words and all the help.
    let listofWords = ["elf", "eve", "fir", "ham", "icy", "ivy", "joy", "pie", "toy", "gift", "gold", "list", "love", "nice", "sled", "star", "wish", "wrap", "xmas", "yule", "angel", "bells", "cider", "elves", "goose", "holly", "jesus", "merry", "myrrh", "party", "skate", "visit", "candle", "creche", "cookie", "eggnog", "family", "frosty", "icicle", "joyful", "manger", "season", "spirit", "tinsel", "turkey", "unwrap", "wonder", "winter", "wreath", "charity", "chimney", "festive", "holiday", "krampus", "mittens", "naughty", "package", "pageant", "rejoice", "rudolph", "scrooge", "snowman", "sweater", "tidings", "firewood", "nativity", "reindeer", "shopping", "snowball", "stocking", "toboggan", "trimming", "vacation", "wise men", "workshop", "yuletide", "chestnuts", "christmas", "fruitcake", "greetings", "mince pie", "mistletoe", "ornaments", "snowflake", "tradition", "candy cane", "decoration", "ice skates", "jack frost", "north pole", "nutcracker", "saint nick", "yule log", "card", "jolly", "hope", "scarf", "candy", "sleigh", "parade", "snowy", "wassail", "blizzard", "noel", "partridge", "give", "carols", "tree", "fireplace", "socks", "lights", "kings", "goodwill", "sugarplum", "bonus", "coal", "snow", "happy", "presents", "pinecone"];
    let hideDrn = true;
    let settings = {"count": 0, "spawn": 0, "speed": 0};
    let lastSoundChirp;
    let mobile = false;
    initiate();
    let chirp = new Audio("https://www.torn.com/js/chat/sounds/Chirp_1.mp3");
    var hangmanArray = [];
    var hangmanCharactersArray = [];
    var wordFixerStart = false;
    var typeGameStart = false;
    var hangmanStart = false;
    let typoCD;
    window.addEventListener("hashchange", addBox);
    let original_fetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async (url, init) => {
        let response = await original_fetch(url, init)
        let respo = response.clone();
        respo.json().then((data) => {
            if (url.includes("christmas_town.php")) {
                if (init.body) {
                    var body = JSON.parse(init.body);
                }
                if (url.includes("q=move") || url.includes("q=initMap")) {
                    if (url.includes("q=move")) {
                        if (wordFixerStart || hangmanStart || typeGameStart) {
                            wordFixerStart = false;
                            hangmanStart = false;
                            typeGameStart = false;
                            clearInterval(typoCD);
                            stopGame();
                        }
                    }
                    if (data.mapData) {
                        if (data.mapData.inventory && (settings.spawn === 1 || settings.speed === 1)) {
                            let obj = {};
                            obj.modifier = 0;
                            obj.speedModifier = 0;
                            for (const ornament of data.mapData.inventory) {
                                if (ornament.category == "ornaments") {
                                    if (ornament.modifierType == 'itemSpawn') {
                                        obj.modifier += ornament.modifier;
                                    } else if (ornament.modifierType == 'speed') {
                                        obj.speedModifier += ornament.modifier;
                                    } else {
                                        console.debug('CT: Unknown ornament modifier "' + ornament.modifierType + '"');
                                    }
                                }
                            }
                            GM_setValue("spawn", obj.modifier);
                            GM_setValue("speed", obj.speedModifier);
                            setTimeout(updateSpawnRate, 3000);
                            settings.spawn = 0;
                            settings.speed = 0;
                        }
                        if (data.mapData.items) {
                            let items = data.mapData.items;
                            if (items.length > 0) {
                                settings.count = 1;
                                let itemArray = [];
                                let chestArray = [];
                                for (const item of items) {
                                    let image = item.image.url;
                                    let position = item.position;
                                    let info = ctHelperGetInfo(image);
                                    if (info.type == "chests" || info.type == "combinationChest") {
                                        chestArray.push([info.name, position.x, position.y, info.index]);
                                        if (isChecked('sound_notif_helper', 2)) {
                                            beep();
                                        }
                                    } else {
                                        itemArray.push([info.name, position.x, position.y]);
                                        if (isChecked('sound_notif_helper', 2)) {
                                            beep();
                                        }
                                    }
                                }
                                chestArray.sort(function (a, b) {
                                    return a[3] - b[3];
                                });
                                ctHelperChangeHTML(itemArray, "hardyNearbyItems");
                                ctHelperChangeHTML(chestArray, "hardyNearbyChests");
                            } else {
                                if (settings.count == 1) {
                                    document.querySelector(".hardyNearbyChests").innerHTML = '<label>Nearby Chests(0)</label><div class="content"></div>';
                                    document.querySelector(".hardyNearbyItems").innerHTML = '<label>Nearby Items(0)</label><div class="content"></div>';
                                    settings.count = 0;
                                }
                            }
                        }
                        if (data.mapData.users) {
                            let users = data.mapData.users;
                            if (users.length > 0) {
                                checkForNPC();
                            }
                        }
                        if (data.mapData && data.mapData.trigger && data.mapData.trigger.item) {
                            let trigger = data.mapData.trigger;
                            settings.spawn = 1;
                            settings.speed = 1;
                            if (trigger.message.includes("You find")) {
                                let itemUrl = trigger.item.image.url;
                                let reg = /\/images\/items\/([0-9]+)\/large\.png/g;
                                if (reg.test(itemUrl)) {
                                    let itemId = itemUrl.split("/")[3];
                                    let savedData = getSaveData();
                                    if (savedData.items[itemId]) {
                                        savedData.items[itemId] += 1;
                                    } else {
                                        savedData.items[itemId] = 1;
                                    }
                                    localStorage.setItem("ctHelperFound", JSON.stringify(savedData));
                                }
                            }
                        }
                    }
                } else if (url.includes("q=miniGameAction")) {
                    if (body && body.action && body.action === "complete" && typeGameStart) {
                        typeGameStart = false;
                        clearInterval(typoCD);
                        stopGame();
                    }
                    if (wordFixerStart) {
                        if (data.finished) {
                            stopGame();
                            wordFixerStart = false;
                        } else {
                            if (data.progress && data.progress.word) {
                                wordSolver(data.progress.word);
                            }
                        }
                    } else if (hangmanStart) {
                        if (data.mistakes === 6 || data.message.startsWith("Congratulations")) {
                            hangmanStart = false;
                            stopGame();
                        } else {
                            hangmanCharactersArray.push(body.result.character.toUpperCase());
                            if (data.positions.length === 0) {
                                let array = [];
                                let letter = body.result.character.toUpperCase();
                                for (const word of hangmanArray) {
                                    if (word.indexOf(letter) === -1) {
                                        array.push(word);
                                    }
                                }
                                hangmanArray = array;
                                hangmanMain();
                            } else {

                                let array = [];
                                let letter = body.result.character.toUpperCase();
                                let positions = data.positions;
                                let length = positions.length;
                                for (const word of hangmanArray) {
                                    var index = 0;
                                    for (const position of positions) {
                                        if (word[position] === letter) {
                                            index += 1;
                                        }
                                    }
                                    if (index === length && countLetter(word, letter) == length) {
                                        array.push(word);
                                    }
                                }
                                hangmanArray = getUnique(array);
                                hangmanMain();
                            }
                        }
                    } else if (typeGameStart) {
                        console.log("nothing");
                    }
                    if (body && body.action && body.action === "start") {
                        if (body.gameType) {
                            let gameType = body.gameType;
                            if (gameType == "gameWordFixer" && isChecked('word_fixer_helper', 2)) {
                                wordFixerStart = true;
                                startGame("Word Fixer");
                                wordSolver(data.progress.word);

                            } else if (gameType === "gameHangman" && isChecked('hangman_helper', 2)) {
                                hangmanStart = true;
                                startGame("Hangman");
                                hangmanArray = [];
                                hangmanCharactersArray = [];
                                let words = data.progress.words;
                                if (words.length > 1) {
                                    hangmanStartingFunction(words[0], words[1]);
                                } else {
                                    hangmanStartingFunction(words[0], 0);
                                }
                            } else if (gameType === "gameTypocalypse" && isChecked('typocalypsehelper', 2)) {

                                if (!typeGameStart) {
                                    typeGameStart = true;
                                    startGame("Typocalypse Helper");
                                    document.querySelector(".hardyGameBoxContent").addEventListener("click", (e) => {
                                        let target = e.target;
                                        if (target.className === "hardyCTTypoAnswer") {
                                            let input = document.querySelector("div[class^='game'] div[class^='board'] input");
                                            if (input) {
                                                input.value = target.getAttribute("hardy");//the answer that has to be typed
                                                let event = new Event('input', {bubbles: true});
                                                let tracker = input._valueTracker;
                                                if (tracker) {
                                                    tracker.setValue('');
                                                }
                                                input.dispatchEvent(event);
                                            }
                                        }
                                    });
                                    startTypo();
                                }
                            }
                        }
                    }
                }
                if (data.prizes) {
                    settings.spawn = 1;
                    settings.speed = 1;
                    if (data.prizes.length > 0) {
                        let savedData = getSaveData();
                        for (const prize of data.prizes) {
                            if (prize.category === "tornItems") {
                                let itemId = prize.type;
                                if (savedData.items[itemId]) {
                                    savedData.items[itemId] += 1;
                                } else {
                                    savedData.items[itemId] = 1;
                                }
                            }
                        }
                        localStorage.setItem("ctHelperFound", JSON.stringify(savedData));
                    }
                }
                if (data.mapData && data.mapData.cellEvent && data.mapData.cellEvent.prizes) {
                    let prizes = data.mapData.cellEvent.prizes;
                    settings.spawn = 1;
                    settings.speed = 1;
                    if (prizes.length > 0) {
                        let savedData = getSaveData();
                        for (const prize of prizes) {
                            if (prize.category === "tornItems") {
                                let itemId = prize.type;
                                if (savedData.items[itemId]) {
                                    savedData.items[itemId] += 1;
                                } else {
                                    savedData.items[itemId] = 1;
                                }
                            }
                        }
                        localStorage.setItem("ctHelperFound", JSON.stringify(savedData));
                    }
                }

            }
        });
        return response;
    };

    function addBox() {
        if (!document.querySelector(".hardyCTBox")) {
            if (document.querySelector("#christmastownroot div[class^='appCTContainer']")) {
                let newBox = document.createElement("div");
                let pcHTML =
                    `<div class="hardyCTHeader hardyCTShadow">Christmas Town Helper</div>
                <div class="hardyCTContent hardyCTShadow"><br>
                    <div style="display: flex; align-items: flex-start;">
                        <div class="hardyNearbyItems""><label>Nearby Items(0)</label>
                            <div class="content"></div>
                        </div>
                        <div style="align-self: center; width: 70%;">
                	        <div style="margin-bottom: 20px;">
                                <p><a href="#/cthelper" class="ctRecordLink">Settings</a><br></p>
                            </div>
                	        <p class="ctHelperSpawnRate ctHelperSuccess">&nbsp;</p>
                            <p class="ctHelperSpeedRate ctHelperSuccess">&nbsp;</p>
                        </div>
                        <div class="hardyNearbyChests""><label>Nearby Chests(0)</label>
                            <div class="content"></div>
                        </div>
                    </div>
                </div>`;
                let mobileHTML = '<div class="hardyCTHeader hardyCTShadow">Christmas Town Helper</div><div class="hardyCTContent hardyCTShadow"><br><a href="#/cthelper" class="ctRecordLink">Settings</a><br><br><p class="ctHelperSpawnRate ctHelperSuccess">&nbsp;</p><p class="ctHelperSpeedRate ctHelperSuccess">&nbsp;</p><div class="hardyNearbyItems" style="float: left;"><label>Nearby Items(0)</label><div class="content"></div></div><div class="hardyNearbyChests" style="float:right;"><label>Nearby Chests(0)</label><div class="content"></div></div></div>';
                if (mobile) {
                    newBox.innerHTML = mobileHTML
                } else {
                    newBox.innerHTML = pcHTML;
                }
                newBox.className = 'hardyCTBox';
                let doc = document.querySelector("#christmastownroot div[class^='appCTContainer']");
                doc.insertBefore(newBox, doc.firstChild.nextSibling);
                if (timedFunction) {
                    clearInterval(timedFunction);
                }
                settings.spawn = 1;
                settings.speed = 1;
            } else {
                var timedFunction = setInterval(addBox, 1000);
            }
        }
        let pageUrl = window.location.href;
        if (pageUrl.includes("mapeditor") || pageUrl.includes("parametereditor") || pageUrl.includes("mymaps")) {
            document.querySelector(".hardyCTBox").style.display = "none";
            let node = document.querySelector(".hardyCTBox2");
            if (node) {
                node.style.display = "none";
            }
        } else if (pageUrl.includes("cthelper")) {
            document.querySelector(".hardyCTBox").style.display = "none";
            createTable();
            let node = document.querySelector(".hardyCTBox2");
            if (node) {
                node.style.display = "block";
            }
            console.log(node)
        } else {
            let box = document.querySelector(".hardyCTBox")
            if (box) {
                box.style.display = "block";
            }
            let node = document.querySelector(".hardyCTBox2");
            if (node) {
                node.style.display = "none";
            }
        }
        hideDoctorn();
    }

    function checkForNPC() {
        let npcList = document.querySelectorAll(".ct-user.npc");
        if (npcList.length > 0) {
            for (const npc of npcList) {
                if (npc.querySelector("svg").getAttribute("fill").toUpperCase() === "#FA5B27") {
                    npc.setAttribute("npcType", "santa");
                } else {
                    npc.setAttribute("npcType", "other");
                }
            }
        }
    }

    function ctHelperGetInfo(link) {
        let obj = {};
        obj.type = "item";
        let array = ["/keys/", "/chests/", "/combinationChest/"];
        for (const category of array) {
            if (link.indexOf(category) !== -1) {
                obj.type = category.replace(/\//g, "");
            }
        }
        if (obj.type === "keys") {
            if (link.includes("bronze")) {
                obj.name = "Bronze Key";
            } else if (link.includes("gold")) {
                obj.name = "Golden Key";
            } else if (link.includes("silver")) {
                obj.name = "Silver Key";
            }
        } else if (obj.type == "chests") {
            if (link.includes("1.gif")) {
                obj.name = "Gold Chest";
                obj.index = 0;
            } else if (link.includes("2.gif")) {
                obj.name = "Silver Chest";
                obj.index = 1;
            } else if (link.includes("3.gif")) {
                obj.name = "Bronze Chest";
                obj.index = 3;
            }
        } else if (obj.type == "combinationChest") {
            obj.name = "Combination Chest";
            obj.index = 2;
        } else if (obj.type == "item") {
            obj.name = "Mystery Gift";
        }
        return obj;
    }

    function ctHelperChangeHTML(array, selector) {
        let length = array.length;
        if (length > 0) {
            let newArray = [];
            for (const element of array) {
                newArray.push(`<p>${element[0]} at ${element[1]}, ${element[2]}&nbsp;</p>`);
            }
            if (selector == "hardyNearbyItems") {
                document.querySelector("." + selector).innerHTML = `<label>Nearby Items(${length})</label><div class="content">${newArray.join("")}</div>`;
            } else {
                document.querySelector("." + selector).innerHTML = `<label>Nearby Chests(${length})</label><div class="content">${newArray.join("")}</div>`;
            }
        } else {
            if (selector == "hardyNearbyItems") {
                document.querySelector("." + selector).innerHTML = `<label>Nearby Items(0)</label><div class="content"></div>`;
            } else {
                document.querySelector("." + selector).innerHTML = `<label>Nearby Chests(0)</label><div class="content"></div>`;
            }
        }
    }

    function applyCSS() {
        if (isChecked('santa_clawz_helper', 2)) {
            GM_addStyle(`[class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADuy'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADu4'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADms'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADjr'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADj4'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADSx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADPy'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADOx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADLx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADKq'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADCS'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAAD03'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAACun'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAACnk'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAACmg'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAACSe'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAACGL'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAAC1U'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAAC0w'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAAByX'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAABsX'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAAB7g'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAACzVBMVEUAAACTM'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC9FBMVEUAAADlw'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC9FBMVEUAAAD67'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC9FBMVEUAAACnR'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADy2'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADrw'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADlt'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADl5'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADgp'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADgo'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADak'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADKx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADJn'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAAD9+'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAAD57'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAAD16'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAAClR'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAACdN'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAAC0R'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAABxW'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC8VBMVEUAAADKe'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC8VBMVEUAAADKc'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC7lBMVEUAAACXN'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADy1'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADw7'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADvz'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADu6'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADsx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADrx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADr1'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADpv'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADnt'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADe6'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADc2'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADVg'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADOv'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADLh'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADFV'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADEx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAD68'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAD28'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAACup'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAACQN'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAC0p'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAC0l'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAABsX'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAABpe'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAB2V'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAB/e'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADy1'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADt5'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADj4'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADf0'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADcr'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADal'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADLv'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADJx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAAD9+'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAACnl'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAACWM'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAACMh'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAAC+Y'] {opacity: .2;}`);
        }
        if (isChecked('snowball_shooter_helper', 2)) {
            GM_addStyle(`[class^='moving-block'] [style*='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABHwAAAB5'], [class^='moving-block'] [style*='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABGAAAABu'], [class^='moving-block'] [style*='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABG4AAABm'], [class^='moving-block'] [style*='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABFIAAAB5'], [class^='moving-block'] [style*='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAwIAAAB6'], [class^='moving-block'] [style*='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA9QAAABu'], [class^='moving-block'] [style*='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA44AAAB4'], [class^='moving-block'] [style*='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA0gAAABm'], [class^='moving-block'] [style*='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+IAAABm'] {opacity: .2;}`);
        }
        if (isChecked('christmas_wreath_helper', 2)) {
            GM_addStyle(`img[alt='christmas wreath'] {display: none;}`);
        }
        if (isChecked("accessibility_helper", 2)) {
            GM_addStyle('@keyframes pulse {0% {box-shadow: 0 0 0 60px;}50% {box-shadow: 0 0 0 60px;}100% {box-shadow: 0 0 0 60px;}}');
            if (isChecked("santa_helper", 2)) {
                GM_addStyle(`div[npcType="santa"] { border-radius: 50%; color:  #a80a0a6e; animation: pulse 2s ease-out infinite; }`);
            }
            if (isChecked("item_helper", 2)) {
                GM_addStyle(`.items-layer .ct-item img  { color: rgba(145, 135, 77, .66); border-radius: 50% ;animation: pulse 2s ease-in-out infinite; }`);
            }
            if (isChecked("npc_helper", 2)) {
                GM_addStyle(`div[npcType="other"] { border-radius: 50%; color: #0051ff87; animation: pulse 2s ease-out infinite;}`);
            }
        } else {
            GM_addStyle('@keyframes pulse {0% {box-shadow: 0 0 0 0px;}50% {box-shadow: 0 0 0 60px;}100% {box-shadow: 0 0 0 0px;}}');
            if (isChecked("santa_helper", 2)) {
                GM_addStyle(`div[npcType="santa"] { border-radius: 50%; color: #ff00006e; animation: pulse 2s ease-out infinite; }`);
            }
            if (isChecked("item_helper", 2)) {
                GM_addStyle(`.items-layer .ct-item img  { color:rgba(244, 226, 130, .66); border-radius: 50% ;animation: pulse 2s ease-in-out infinite; }`);
            }
            if (isChecked("npc_helper", 2)) {
                GM_addStyle(`div[npcType="other"] { border-radius: 50%; color: #0051ff87; animation: pulse 2s ease-out infinite;}`);
            }
        }
    }

    function sortWord(word) {
        let array = word.toUpperCase().split("");
        array.sort();
        return array.join("");
    }

    function wordSolver(jumbled) {
        var wordSolution = 'whereiscrimes2.0';
        for (const word of listofWords) {
            if (sortWord(word) === sortWord(jumbled)) {
                wordSolution = word.toUpperCase();
            }
        }
        if (wordSolution === 'whereiscrimes2.0') {
            updateGame('<label class="ctHelperError">Sorry! couldn\'t find the solution. ):</label>');
        } else {
            updateGame(`<label class="ctHelperSuccess">${wordSolution}</label>`);
        }
    }

    function getPrices() {
        var last_update = GM_getValue('last');
        if (last_update === null || typeof last_update == "undefined") {
            last_update = 0;
        }
        if (Date.now() / 1000 - last_update > 14400) {
            GM_xmlhttpRequest({
                method: 'GET',
                timeout: 20000,
                url: 'https://script.google.com/macros/s/AKfycbyRfg1Cx2Jm3IuCWASUu8czKeP3wm5jKsie4T4bxwZHzXTmPbaw4ybPRA/exec?key=getItems',
                onload: function (e) {
                    try {
                        let data = JSON.parse(e.responseText);
                        if (data.items) {
                            let items = data.items;
                            let obj = {};
                            obj.items = {};
                            for (var pp = 0; pp < items.length; pp++) {
                                let id = items[pp][0];
                                obj.items[id] = {};
                                obj.items[id].name = items[pp][1];
                                obj.items[id].value = items[pp][2];
                            }
                            localStorage.setItem('ctHelperItemInfo', JSON.stringify(obj));
                            GM_setValue('last', Date.now() / 1000);
                            console.log("Price data received");
                        }
                    } catch (error) {
                        console.log("Error updating prices: " + error.message);
                    }
                }
            });
        }
    }

    function getSaveData() {
        let savedFinds = localStorage.getItem("ctHelperFound");
        var saved;
        if (typeof savedFinds == "undefined" || savedFinds === null) {
            saved = {};
            saved.items = {};
        } else {
            saved = JSON.parse(savedFinds);
        }
        return saved;
    }

    function createTable() {
        if (!document.querySelector(".hardyCTBox2")) {
            let node = document.createElement("div");
            node.className = "hardyCTBox2";
            document.querySelector(".content-wrapper").appendChild(node);
            document.querySelector(".hardyCTBox2").addEventListener("click", (e) => {
                if (e.target.id === "hardyctHelperSave") {
                    let checkboxes = document.querySelectorAll(".hardyCTHelperCheckbox");
                    for (const checkbox of checkboxes) {
                        if (checkbox.checked) {
                            GM_setValue(checkbox.id, "yes");
                        } else {
                            GM_setValue(checkbox.id, "no");
                        }
                    }
                    location.reload();
                } else if (e.target.id == "hardyctHelperdelete") {
                    document.querySelector(".hardyCTtextBox").innerHTML = '<p>Are you sure you want to delete the finds data?</p><button id="hardyCTConfirmDelete">Yes</button><button id="hardyCTNoDelete">No</button>';
                } else if (e.target.id == "hardyCTConfirmDelete") {
                    let obj = {"items": {}};
                    localStorage.setItem("ctHelperFound", JSON.stringify(obj));
                    document.querySelector(".hardyCTtextBox").innerHTML = '<label class="ctHelperSuccess"Data deleted!</label>';
                    document.querySelector(".hardyCTTable").innerHTML = '';
                } else if (e.target.id == "hardyCTNoDelete") {
                    document.querySelector(".hardyCTtextBox").innerHTML = '';
                }
            });
        }
        document.querySelector(".hardyCTBox2").innerHTML = '<div class="hardyCTHeader">Christmas Town Helper</div><div class="hardyCTTableBox"><div class="hardyCTbuttonBox" style="margin-top: 8px;"><input type="checkbox" class="hardyCTHelperCheckbox" id="santa_helper"  value="yes"' + isChecked('santa_helper', 1) + '><label for="santa_helper">Highlight Santa</label><br><input type="checkbox" class="hardyCTHelperCheckbox" id="npc_helper"  value="yes"' + isChecked('npc_helper', 1) + '><label for="npc_helper">Highlight other NPCs</label><br><input type="checkbox" class="hardyCTHelperCheckbox" id="typocalypsehelper" value="yes"' + isChecked("typocalypsehelper", 1) + '><label for="typocalypsehelper">Typoclypse Helper</label><br><input type="checkbox" class="hardyCTHelperCheckbox" id="item_helper"  value="yes"' + isChecked('item_helper', 1) + '><label for="item_helper">Highlight Chest and Items</label><br><input type="checkbox" class="hardyCTHelperCheckbox" id="christmas_wreath_helper"  value="yes"' + isChecked('christmas_wreath_helper', 1) + '><label for="christmas_wreath_helper">Christmas Wreath Helper</label><br><input type="checkbox" class="hardyCTHelperCheckbox" id="snowball_shooter_helper"  value="yes"' + isChecked('snowball_shooter_helper', 1) + '><label for="snowball_shooter_helper">Snowball Shooter Helper</label><br><input type="checkbox" class="hardyCTHelperCheckbox" id="santa_clawz_helper" value="yes"' + isChecked('santa_clawz_helper', 1) + '><label for="santa_clawz_helper">Santa Clawz Helper</label><br><input type="checkbox" class="hardyCTHelperCheckbox" id="word_fixer_helper" value="yes"' + isChecked('word_fixer_helper', 1) + '><label for="word_fixer_helper">Word Fixer Helper</label><br><input type="checkbox" class="hardyCTHelperCheckbox" id="hangman_helper" value="yes"' + isChecked('hangman_helper', 1) + '><label for="hangman_helper">Hangman Helper</label><br><input type="checkbox" class="hardyCTHelperCheckbox" id="accessibility_helper"  value="yes"' + isChecked('accessibility_helper', 1) + '><label for="accessibility_helper">Accessibility (Dims the highlighter and removes the blinking, for users facing discomfort due to bright color of highlighter)</label><br><input type="checkbox" class="hardyCTHelperCheckbox" id="sound_notif_helper" value="yes"' + isChecked('sound_notif_helper', 1) + '><label for="sound_notif_helper">Sound Notification on Item Find</label><br><a href="#/" class="ctRecordLink" style="display:inline;">Go back</a><button id="hardyctHelperSave">Save Settings</button><button id="hardyctHelperdelete">Delete Finds</button></div><div class="hardyCTtextBox"></div><br><hr><br><div class="hardyCTTable" style="overflow-x:auto;"></div></div>';
        let itemData = localStorage.getItem("ctHelperItemInfo");
        var marketValueData;
        if (typeof itemData == "undefined" || itemData === null) {
            marketValueData = "ched";
        } else {
            marketValueData = JSON.parse(itemData);
        }
        if (marketValueData == "ched") {
            document.querySelector(".hardyCTTableBox").innerHTML = '<label class="ctHelperError">Unable to get data from the spreadsheet. Kindly refresh the page. Contact Father [2131687] if the problem persists</label>';
        } else {
            let savedData = getSaveData();
            let obj = {"items": {}};

            if (savedData == obj) {
                document.querySelector(".hardyCTTableBox").innerHTML = '<label class="ctHelperError">You haven\'t found any items yet. Try again later!</label>';
            } else {
                let calc = {};
                calc.totalValue = 0;
                calc.count = 0;
                let tableArray = [];
                let array = [];
                for (var mp in savedData.items) {
                    let count = savedData.items[mp];
                    let item = marketValueData.items[mp];
                    let name = item.name;
                    let value = item.value;
                    let price = count * value
                    calc.count += parseInt(count);
                    calc.totalValue += parseInt(price);
                    array.push([mp, name, count, value, price]);
                }
                array.sort(function (a, b) {
                    return b[4] - a[4];
                });
                for (const row of array) {
                    tableArray.push(`<tr><td><img src="/images/items/${row[0]}/medium.png", alt = "${row[1]}"></td><td>${row[1]}</td><td>${row[2]}</td><td>$${formatNumber(row[3])}</td><td>$${formatNumber(row[4])}</td></tr>`);
                }
                document.querySelector(".hardyCTTable").innerHTML = '<table><tr><th>Image</th><th>Item Name</th><th>Amount</th><th>Price</th><th>Total</th></tr>' + tableArray.join("") + `</table><p>Total value: $${formatNumber(calc.totalValue)}</p><p> No. of Items: ${calc.count}</p><p>Average value of an item: $${formatNumber(Math.round(calc.totalValue / calc.count))}</p>`;

            }
        }

    }

    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    function isChecked(element, returnType) {
        let value = GM_getValue(element);
        if (typeof value == "undefined" || value === null || value === "no") {
            if (returnType == 1) {
                return "";
            } else {
                return false;
            }
        } else {
            if (returnType == 1) {
                return " checked";
            } else {
                return true;
            }
        }
    }

    function firstRun() {
        if (!isChecked("firstRun", 2)) {
            GM_setValue("christmas_wreath_helper", "yes");
            GM_setValue("typocalypsehelper", "yes");
            GM_setValue("snowball_shooter_helper", "yes");
            GM_setValue("santa_clawz_helper", "yes");
            GM_setValue("word_fixer_helper", "yes");
            GM_setValue("hangman_helper", "yes");
            GM_setValue("santa_helper", "yes");
            GM_setValue("npc_helper", "yes");
            GM_setValue("item_helper", "yes");
            GM_setValue("firstRun", "blah");
            GM_setValue("version", version);
            GM_setValue("month", Date.now());
        }
    }

    function deleteOldData() {
        let now = new Date(Date.now());
        if (now.getMonth == 11) {
            if (new Date(GM_getValue("month")).getFullYear() != now.getFullYear()) {
                let obj = {"items": {}};
                localStorage.setItem("ctHelperFound", JSON.stringify(obj));
                GM_setValue("month", Date.now());
            }
        }
    }

    function stopGame() {
        let node = document.querySelector(".ctHelperGameBox");
        if (node) {
            node.remove();
        }
    }

    function startGame(gameName) {
        if (!document.querySelector(".ctHelperGameBox")) {
            let node = document.createElement("div");
            node.className = "ctHelperGameBox";
            let reference = document.querySelector(".ct-wrap");
            reference.parentNode.insertBefore(node, reference);
        }
        document.querySelector(".ctHelperGameBox").innerHTML = '<div class="hardyCTHeader">' + gameName + ' Helper</div><div class="hardyGameBoxContent"></div>'
    }

    function updateGame(content) {
        let node = document.querySelector(".hardyGameBoxContent");
        if (node) {
            node.innerHTML = content;
        }
    }

    function hangmanStartingFunction(letters1, letters2) {
        if (letters2 == 0) {
            let totalLength = letters1;
            for (const word of listofWords) {
                if (word.length === letters1 && !word.split(" ")[1]) {
                    hangmanArray.push(word.toUpperCase());
                }
            }
        } else {
            let totalLength = letters1 + letters2 + 1;
            for (const word of listofWords) {
                if (word.length === totalLength) {
                    if (word.split(" ")[1] && word.split(" ")[0].length == letters1 && word.split(" ")[1].length == letters2) {
                        hangmanArray.push(word.toUpperCase());
                    }
                }
            }
        }
        hangmanMain();
    }

    function hangmanMain() {
        let array = [];
        let obj = {};
        let html1 = '<p style="font-weight: bold; font-size: 16px; margin: 8px; text-align: center;">Possible Solutions</p><p class="ctHelperSuccess">';
        for (const word of hangmanArray) {
            array.push(word.toUpperCase());
            let letters = getUniqueLetter(word.replace(/\s/g, "").split(""));
            for (const letter of letters) {
                if (obj[letter]) {
                    obj[letter] += 1;
                } else {
                    obj[letter] = 1;
                }
            }
        }
        let sortable = [];
        for (const key in obj) {
            sortable.push([key, obj[key], String(+((obj[key] / hangmanArray.length) * 100).toFixed(2)) + "% chance"]);
        }
        sortable.sort(function (a, b) {
            return b[1] - a[1];
        });
        let lettersArray = [];
        let limit = {};
        limit.limit = 5;
        let length = sortable.length;
        if (length > 5) {
            limit.limit = 5;
        } else {
            limit.limit = length;
        }
        for (var mkl = 0; mkl < limit.limit; mkl++) {
            let letter = sortable[mkl];
            lettersArray.push(`${letter[0].toUpperCase()} <label class="helcostrDoesntLikeGreenCommas">(${letter[2]})</label>`);
        }
        updateGame(html1 + array.join('<label class="helcostrDoesntLikeGreenCommas">, </label>') + '</p><p style="font-weight: bold; font-size: 16px; margin: 8px; text-align: center;">Suggested Letters</p><p class="ctHelperSuccess">' + lettersArray.join('<label class="helcostrDoesntLikeGreenCommas">, </label>') + '</p>');
    }

    function getUnique(array) {
        let newArray = [];
        for (var mn = 0; mn < array.length; mn++) {
            if (newArray.indexOf(array[mn]) == -1) {
                newArray.push(array[mn]);
            }
        }
        return newArray;
    }

    function countLetter(string, letter) {
        let array = string.split("");
        let obj = {};
        obj.count = 0;
        for (const a of array) {
            if (a === letter) {
                obj.count += 1;
            }
        }
        return obj.count;
    }

    function hideDoctorn() {
        if (hideDrn) {
            GM_addStyle(`.doctorn-widget {display: none;}`);
        }
    }

    function getUniqueLetter(argArray) {
        let newArray = [];
        let array = getUnique(argArray);
        for (const letter of array) {
            if (hangmanCharactersArray.indexOf(letter) === -1) {
                newArray.push(letter);
            }
        }
        return newArray;
    }

    function updateSpawnRate() {
        let spawn = GM_getValue("spawn");
        let speed = GM_getValue("speed");
        if (typeof spawn == "undefined" || spawn === null) {
            settings.spawn = 1;
        } else {
            document.querySelector(".ctHelperSpawnRate").innerHTML = `You have a spawn rate bonus of ${spawn}%.`;
        }
        if (typeof speed == "undefined" || speed === null) {
            settings.spawn = 1;
        } else {
            document.querySelector(".ctHelperSpeedRate").innerHTML = `You have a speed rate bonus of ${speed}%.`;
        }
    }

    function checkVersion() {
        let current_version = GM_getValue('version');
        if (current_version === null || typeof current_version == "undefined" || current_version != version) {
            enableNewFeatures();
            GM_setValue('version', version);
        }
    }

    function enableNewFeatures() {
        console.log("No feature to be enabled by default");
    }

    function initiate() {
        firstRun();
        let innerWidth = window.innerWidth;
        mobile = innerWidth <= 600;
        addBox();
        checkVersion();
        applyCSS();
        getPrices()
        deleteOldData();
        let lastSound = GM_getValue("lastSound");
        if (typeof lastSound === "undefined" || lastSound === null) {
            GM_setValue("lastSound", "0");
            lastSoundChirp = 0;
        } else {
            lastSoundChirp = lastSound;
        }
    }

    function startTypo() {
        typoCD = setInterval(() => {
            let boxes = document.querySelectorAll("div[class^='game'] div[class^='board'] div[class^='gift']");
            let length = boxes.length;
            let array = [];
            if (length > 0) {
                for (const gift of boxes) {
                    let phrase = gift.innerText;
                    array.push(`<button class="hardyCTTypoAnswer" hardy="${phrase}">${phrase}</button>`);
                }
                array.reverse();
            }
            updateGame(array.join(""));
        }, 500);
    }

    function beep() {
        let now = parseInt(Date.now() / 1000);
        let diff = now - lastSoundChirp;
        if (diff >= 60) {
            GM_setValue("lastSound", now);
            lastSoundChirp = now;
            chirp.play();
        }
    }

    GM_addStyle(`
#hardyctHelperSave {background-color: #2da651;}
#hardyctHelperSave:hover {background-color: #2da651c4;}
#hardyctHelperdelete {background-color: #f03b10;}
#hardyctHelperdelete:hover {background-color: #f03b10bd;}
.ctRecordLink:hover {background-color: #53a3d7;}
.ct-user-wrap .user-map:before {display:none;}
body.dark-mode .hardyCTShadow { box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); -moz-box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); -webkit-box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64);}
body.dark-mode .hardyCTHeader { background-color: #454545; border-radius: 0.5em 0.5em 0 0; text-align: center; text-indent: 0.5em; font-size: 16px; color: #b5bbbb; padding: 5px 0px 5px 0px;}
body:not(.dark-mode) .hardyCTHeader { background-color: #0d0d0d; border: 2px solid #000; border-radius: 0.5em 0.5em 0 0; text-align: center; text-indent: 0.5em; font-size: 16px; color: #b5bbbb; padding: 5px 0px 5px 0px;}
body:not(.dark-mode) .hardyCTContent, body:not(.dark-mode) .hardyCTTableBox, body:not(.dark-mode) .hardyGameBoxContent { border-radius: 0px 0px 8px 8px; background-color: rgb(242, 242, 242); color: black; box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); -moz-box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); -webkit-box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); padding: 5px 8px; overflow: auto; }
.hardyCTBox, .hardyCTBox2, .ctHelperGameBox {margin-bottom: 18px;}
.hardyCTBox2 table { color: #333; font-family: Helvetica, Arial, sans-serif; width: 640px; border: 2px #808080 solid; margin: 20px; }
.hardyCTBox2 td, th { border: 1px solid rgba(0, 0, 0, .55); height: 30px; transition: all 0.3s; }
.hardyCTBox2 th { background: #868282; font-weight: bold; text-align: center; }
.hardyCTBox2 td { background: #c6c4c4; text-align: center;}
.hardyCTBox2 tr:nth-child(even) td { background: #F1F1F1; }
.hardyCTBox2 tr:nth-child(odd) td { background: #c6c4c4; }
.hardyCTBox2 tr td:hover { background: #666; color: #FFF; }
.hardyCTTable { padding: 5px; }
table:not([cellpadding]) td {vertical-align: middle;}
.hardyCTHelperCheckbox { margin: 8px; margin-left: 18px; }
.hardyCTtextBox { text-align: center; }
.hardyCTtextBox button { background-color: rgba(240, 60, 17, .91); }
.hardyCTBox2 button { padding: 8px 5px 8px 5px; border-radius: 4px; color: white; margin: 9px; font-weight: bold;}
.ctHelperError { color: #ff000091; margin: 5px; }
.body:not(.dark-mode) .ctHelperSuccess { color: #38a333; margin: 5px; font-weight: bold; font-size: 16px; line-height: 1.3;}
body.dark-mode .ctHelperSuccess { color: #b5bbbb; margin: 5px; font-weight: bold; font-size: 16px; line-height: 1.3;}
.hardyCTBox2 p { margin: 15px; font-weight: bold; font-family: Helvetica; }
.hardyNearbyItems label, .hardyNearbyChests label { font-weight: bold; }
.hardyCTBox p { margin-top: 9px; font-family: Helvetica; }
body:not(.dark-mode) .helcostrDoesntLikeGreenCommas {color: #333;}
body.dark-mode .helcostrDoesntLikeGreenCommas {color: #919191;}
.ctHelperSpawnRate, .ctHelperSpeedRate {text-align: center; font-size: 14px}
label[for='accessibility_helper'] {line-height: 1.6; margin-left: 8px;}
.hardyCTTypoAnswer {padding: 5px 6px; background-color: #4a9f33; color: white; margin: 5px; border-radius: 5px;}
.hardyCTTypoAnswer:hover, .hardyCTTypoAnswer:focus {color: white;}
` + (mobile ? ` .ctRecordLink { margin: 18px 9px 18px 18px; padding:10px 5px 10px 5px; background-color: #4294f2; border-radius: 4px; color: #fdfcfc; text-decoration: none; font-weight: bold;} body.dark-mode .hardyCTContent, body.dark-mode .hardyCTTableBox, body.dark-mode .hardyGameBoxContent { border-radius: 0px 0px 8px 8px; background-color: #27292d; color: #b5bbbb; box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); -moz-box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); -webkit-box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); padding: 5px 8px; overflow: auto; } .hardyNearbyItems, .hardyNearbyChests { padding: 4px; display: inline; } .hardyCTContent .content {overflow-y: auto; height: 60px; margin-right: 3px; margin-top: 3px;}` : ` .ctRecordLink { margin: 18px 9px 18px 180px; padding:10px 15px 10px 15px; background-color: #4294f2; border-radius: 4px; color: #fdfcfc; text-decoration: none; font-weight: bold;} body.dark-mode .hardyCTContent, body.dark-mode .hardyCTTableBox, body.dark-mode .hardyGameBoxContent {  height: 140px; border-radius: 0px 0px 8px 8px; background-color: #27292d; color: #b5bbbb; box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); -moz-box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); -webkit-box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); padding: 5px 8px; overflow: auto; } .hardyNearbyItems, .hardyNearbyChests { padding: 4px; display: inline; margin-top: 0px; width: 30%; } .hardyCTContent .content {overflow-y: auto; height: 100px; margin-right: 3px; margin-top: 3px;}`));
})();
