// ==UserScript==
// @name         Bazaar Price Helper
// @namespace    SMTH
// @version      1.01
// @description  自动填充bazaar上架价格
// @author       Mirrorhye[2564936]
// @match        https://www.torn.com/bazaar.php*
// @connect      api.torn.com
// ==/UserScript==

(function() {
    'use strict';

    function mir_get(key, preset) {
        if (window.localStorage === undefined) {
            return preset;
        }
        else if (!window.localStorage.getItem(key)) {
            return preset;
        }
        else {
            return window.localStorage.getItem(key);
        }
    }

    function mir_set(key, value) {
        if (window.localStorage === undefined){
            return;
        }
        else {
            window.localStorage.setItem(key, value);
        }
    }

    let positionKey = "bph_position";
    let position = mir_get(positionKey, 0);
    mir_set(positionKey, position);
    let premiumKey = "bph_premium";
    let premium = mir_get(premiumKey, 0.0);
    mir_set(premiumKey, premium);

    /// 你的api_key, 如果装了冰蛙 这里就不用改
    let API_KEY = '*'
    if (API_KEY == '*') {
        API_KEY = mir_get("APIKey");
    }
    console.log(API_KEY)

    function prices_choose_strategy(item_prices) {
        try {
            return item_prices[Math.max(Math.min(item_prices.length, parseInt(mir_get(positionKey, 0))), 0)] * (1+mir_get(premiumKey, 0.0)/100.0);
        } catch {
            return 0
        }
    }

    var lowest_price_cache = {};
    var item_name2id_map = {"Hammer":"1","Baseball Bat":"2","Crowbar":"3","Knuckle Dusters":"4","Pen Knife":"5","Kitchen Knife":"6","Dagger":"7","Axe":"8","Scimitar":"9","Chainsaw":"10","Samurai Sword":"11","Glock 17":"12","Raven MP25":"13","Ruger 22/45":"14","Beretta M9":"15","USP":"16","Beretta 92FS":"17","Fiveseven":"18","Magnum":"19","Desert Eagle":"20","Dual 92G Berettas":"21","Sawed-Off Shotgun":"22","Benelli M1 Tactical":"23","MP5 Navy":"24","P90":"25","AK-47":"26","M4A1 Colt Carbine":"27","Benelli M4 Super":"28","M16 A2 Rifle":"29","Steyr AUG":"30","M249 SAW":"31","Leather Vest":"32","Police Vest":"33","Bulletproof Vest":"34","Box of Chocolate Bars":"35","Big Box of Chocolate Bars":"36","Bag of Bon Bons":"37","Box of Bon Bons":"38","Box of Extra Strong Mints":"39","Pack of Music CDs":"40","DVD Player":"41","MP3 Player":"42","CD Player":"43","Pack of Blank CDs : 100":"44","Hard Drive":"45","Tank Top":"46","Trainers":"47","Jacket":"48","Full Body Armor":"49","Outer Tactical Vest":"50","Plain Silver Ring":"51","Sapphire Ring":"52","Gold Ring":"53","Diamond Ring":"54","Pearl Necklace":"55","Silver Necklace":"56","Gold Necklace":"57","Plastic Watch":"58","Stainless Steel Watch":"59","Gold Watch":"60","Personal Computer":"61","Microwave":"62","Minigun":"63","Pack of Cuban Cigars":"64","Television":"65","Morphine":"66","First Aid Kit":"67","Small First Aid Kit":"68","Simple Virus":"69","Polymorphic Virus":"70","Tunneling Virus":"71","Armored Virus":"72","Stealth Virus":"73","Santa Hat '04":"74","Christmas Cracker '04":"75","Snow Cannon":"76","Toyota MR2":"77","Honda NSX":"78","Audi TT Quattro":"79","BMW M5":"80","BMW Z8":"81","Chevrolet Corvette Z06":"82","Dodge Charger":"83","Pontiac Firebird":"84","Ford GT40":"85","Hummer H3":"86","Audi S4":"87","Honda Integra R":"88","Honda Accord":"89","Honda Civic":"90","Volkswagen Beetle":"91","Chevrolet Cavalier":"92","Ford Mustang":"93","Reliant Robin":"94","Holden SS":"95","Coat Hanger":"96","Bunch of Flowers":"97","Neutrilux 2000":"98","Springfield 1911":"99","Egg Propelled Launcher":"100","Bunny Suit":"101","Chocolate Egg '05":"102","Firewalk Virus":"103","Game Console":"104","Xbox":"105","Parachute":"106","Trench Coat":"107","9mm Uzi":"108","RPG Launcher":"109","Leather Bullwhip":"110","Ninja Claws":"111","Test Trophy":"112","Pet Rock":"113","Non-Anon Doll":"114","Poker Doll":"115","Yoda Figurine":"116","Trojan Horse":"117","Evil Doll":"118","Rubber Ducky of Doom":"119","Teppic Bear":"120","RockerHead Doll":"121","Mouser Doll":"122","Elite Action Man":"123","Toy Reactor":"124","Royal Doll":"125","Blue Dragon":"126","China Tea Set":"127","Mufasa Toy":"128","Dozen Roses":"129","Skanky Doll":"130","Lego Hurin":"131","Mystical Sphere":"132","10 Ton Pacifier":"133","Horse":"134","Uriel's Speakers":"135","Strife Clown":"136","Locked Teddy":"137","Riddle's Bat":"138","Soup Nazi Doll":"139","Pouncer Doll":"140","Spammer Doll":"141","Cookie Jar":"142","Vanity Mirror":"143","Banana Phone":"144","Xbox 360":"145","Yasukuni Sword":"146","Rusty Sword":"147","Dance Toy":"148","Lucky Dime":"149","Crystal Carousel":"150","Pixie Sticks":"151","Ice Sculpture":"152","Case of Whiskey":"153","Laptop":"154","Purple Frog Doll":"155","Skeleton Key":"156","Patriot Whip":"157","Statue Of Aeolus":"158","Bolt Cutters":"159","Photographs":"160","Black Unicorn":"161","WarPaint Kit":"162","Official Ninja Kit":"163","Leukaemia Teddy Bear":"164","Chocobo Flute":"165","Annoying Man":"166","Article on Crime":"167","Unknown":"208","Barbie Doll":"169","Wand of Destruction":"170","Jack-O-Lantern '05":"171","Gas Can":"172","Butterfly Knife":"173","XM8 Rifle":"174","Taser":"175","Chain Mail":"176","Cobra Derringer":"177","Flak Jacket":"178","Birthday Cake '05":"179","Bottle of Beer":"180","Bottle of Champagne":"181","Soap on a Rope":"182","Single Red Rose":"183","Bunch of Black Roses":"184","Bunch of Balloons '05":"185","Sheep Plushie":"186","Teddy Bear Plushie":"187","Cracked Crystal Ball":"188","S&W Revolver":"189","C4 Explosive":"190","Memory Locket":"191","Rainbow Stud Earring":"192","Hamster Toy":"193","Snowflake '05":"194","Christmas Tree '05":"195","Cannabis":"196","Ecstasy":"197","Ketamine":"198","LSD":"199","Opium":"200","PCP":"201","Mr Torn Crown '07":"202","Shrooms":"203","Speed":"204","Vicodin":"205","Xanax":"206","Ms Torn Crown '07":"207","Box of Sweet Hearts":"209","Bag of Chocolate Kisses":"210","Crazy Cow":"211","Legend's Urn":"212","Dreamcatcher":"213","Brutus Keychain":"214","Kitten Plushie":"215","Single White Rose":"216","Claymore Sword":"217","Crossbow":"218","Enfield SA-80":"219","Grenade":"220","Stick Grenade":"221","Flash Grenade":"222","Jackhammer":"223","Swiss Army Knife":"224","Mag 7":"225","Smoke Grenade":"226","Spear":"227","Vektor CR-21":"228","Claymore Mine":"229","Flare Gun":"230","Heckler & Koch SL8":"231","SIG 550":"232","BT MP9":"233","Chain Whip":"234","Wooden Nunchakus":"235","Kama":"236","Kodachi":"237","Sai":"238","Ninja Stars":"239","Type 98 Anti Tank":"240","Bushmaster Carbon 15":"241","HEG":"242","Taurus":"243","Blowgun":"244","Bo Staff":"245","Fireworks":"246","Katana":"247","Qsz-92":"248","SKS Carbine":"249","Twin Tiger Hooks":"250","Wushu Double Axes":"251","Ithaca 37":"252","Lorcin 380":"253","S&W M29":"254","Flamethrower":"255","Tear Gas":"256","Throwing Knife":"257","Jaguar Plushie":"258","Mayan Statue":"259","Dahlia":"260","Wolverine Plushie":"261","Hockey Stick":"262","Crocus":"263","Orchid":"264","Pele Charm":"265","Nessie Plushie":"266","Heather":"267","Red Fox Plushie":"268","Monkey Plushie":"269","Soccer Ball":"270","Ceibo Flower":"271","Edelweiss":"272","Chamois Plushie":"273","Panda Plushie":"274","Jade Buddha":"275","Peony":"276","Cherry Blossom":"277","Kabuki Mask":"278","Maneki Neko":"279","Elephant Statue":"280","Lion Plushie":"281","African Violet":"282","Donator Pack":"283","Bronze Paint Brush":"284","Silver Paint Brush":"285","Gold Paint Brush":"286","Pand0ra's Box":"287","Mr Brownstone Doll":"288","Dual Axes":"289","Dual Hammers":"290","Dual Scimitars":"291","Dual Samurai Swords":"292","Japanese/English Dictionary":"293","Bottle of Sake":"294","Oriental Log":"295","Oriental Log Translation":"296","YouYou Yo Yo":"297","Monkey Cuffs":"298","Jester's Cap":"299","Gibal's Dragonfly":"300","Green Ornament":"301","Purple Ornament":"302","Blue Ornament":"303","Purple Bell":"304","Mistletoe":"305","Mini Sleigh":"306","Snowman":"307","Christmas Gnome":"308","Gingerbread House":"309","Lollipop":"310","Mardi Gras Beads":"311","Devil Toy":"312","Cookie Launcher":"313","Cursed Moon Pendant":"314","Apartment Blueprint":"315","Semi-Detached House Blueprint":"316","Detached House Blueprint":"317","Beach House Blueprint":"318","Chalet Blueprint":"319","Villa Blueprint":"320","Penthouse Blueprint":"321","Mansion Blueprint":"322","Ranch Blueprint":"323","Palace Blueprint":"324","Castle Blueprint":"325","Printing Paper":"326","Blank Tokens":"327","Blank Credit Cards":"328","Skateboard":"329","Boxing Gloves":"330","Dumbbells":"331","Combat Vest":"332","Liquid Body Armor":"333","Flexible Body Armor":"334","Stick of Dynamite":"335","Cesium-137":"336","Dirty Bomb":"337","Sh0rty's Surfboard":"338","Puzzle Piece":"339","Hunny Pot":"340","Seductive Stethoscope":"341","Dollar Bill Collectible":"342","Backstage Pass":"343","Chemi's Magic Potion":"344","Pack of Trojans":"345","Pair of High Heels":"346","Thong":"347","Hazmat Suit":"348","Flea Collar":"349","Dunkin's Donut":"350","Amazon Doll":"351","BBQ Smoker":"352","Bag of Cheetos":"353","Motorbike":"354","Citrus Squeezer":"355","Superman Shades":"356","Kevlar Helmet":"357","Raw Ivory":"358","Fine Chisel":"359","Ivory Walking Cane":"360","Neumune Tablet":"361","Mr Torn Crown '08":"362","Ms Torn Crown '08":"363","Box of Grenades":"364","Box of Medical Supplies":"365","Erotic DVD":"366","Feathery Hotel Coupon":"367","Lawyer Business Card":"368","Lottery Voucher":"369","Drug Pack":"370","Dark Doll":"371","Empty Box":"372","Parcel":"373","Birthday Present":"374","Present":"375","Christmas Present":"376","Birthday Wrapping Paper":"377","Generic Wrapping Paper":"378","Christmas Wrapping Paper":"379","Small Explosive Device":"380","Gold Laptop":"381","Gold Plated AK-47":"382","Platinum PDA":"383","Camel Plushie":"384","Tribulus Omanense":"385","Sports Sneakers":"386","Handbag":"387","Pink Mac-10":"388","Mr Torn Crown '09":"389","Ms Torn Crown '09":"390","Macana":"391","Pepper Spray":"392","Slingshot":"393","Brick":"394","Metal Nunchakus":"395","Business Class Ticket":"396","Flail":"397","SIG 552":"398","ArmaLite M-15A4":"399","Guandao":"400","Lead Pipe":"401","Ice Pick":"402","Box of Tissues":"403","Bandana":"404","Loaf of Bread":"405","Afro Comb":"406","Compass":"407","Sextant":"408","Yucca Plant":"409","Fire Hydrant":"410","Model Space Ship":"411","Sports Shades":"412","Mountie Hat":"413","Proda Sunglasses":"414","Ship in a Bottle":"415","Paper Weight":"416","RS232 Cable":"417","Tailors Dummy":"418","Small Suitcase":"419","Medium Suitcase":"420","Large Suitcase":"421","Vanity Hand Mirror":"422","Poker Chip":"423","Rabbit Foot":"424","Voodoo Doll":"425","Bottle of Tequila":"426","Sumo Doll":"427","Casino Pass":"428","Chopsticks":"429","Coconut Bra":"430","Dart Board":"431","Crazy Straw":"432","Sensu":"433","Yakitori Lantern":"434","Dozen White Roses":"435","Snowboard":"436","Glow Stick":"437","Cricket Bat":"438","Frying Pan":"439","Pillow":"440","Khinkeh P0rnStar Doll":"441","Blow-Up Doll":"442","Strawberry Milkshake":"443","Breadfan Doll":"444","Chaos Man":"445","Karate Man":"446","Burmese Flag":"447","Bl0ndie's Dictionary":"448","Hydroponic Grow Tent":"449","Leopard Coin":"450","Florin Coin":"451","Gold Noble Coin":"452","Ganesha Sculpture":"453","Vairocana Buddha Sculpture":"454","Quran Script : Ibn Masud":"455","Quran Script : Ubay Ibn Kab":"456","Quran Script : Ali":"457","Shabti Sculpture":"458","Egyptian Amulet":"459","White Senet Pawn":"460","Black Senet Pawn":"461","Senet Board":"462","Epinephrine":"463","Melatonin":"464","Serotonin":"465","Snow Globe '09":"466","Dancing Santa Claus '09":"467","Christmas Stocking '09":"468","Santa's Elf '09":"469","Christmas Card '09":"470","Admin Portrait '09":"471","Blue Easter Egg":"472","Green Easter Egg":"473","Red Easter Egg":"474","Yellow Easter Egg":"475","White Easter Egg":"476","Black Easter Egg":"477","Gold Easter Egg":"478","Metal Dog Tag":"479","Bronze Dog Tag":"480","Silver Dog Tag":"481","Gold Dog Tag":"482","MP5k":"483","AK74U":"484","Skorpion":"485","TMP":"486","Thompson":"487","MP 40":"488","Luger":"489","Blunderbuss":"490","Zombie Brain":"491","Human Head":"492","Medal of Honor":"493","Citroen Saxo":"494","Classic Mini":"495","Fiat Punto":"496","Nissan Micra":"497","Peugeot 106":"498","Renault Clio":"499","Vauxhall Corsa":"500","Volvo 850":"501","Alfa Romeo 156":"502","BMW X5":"503","Seat Leon Cupra":"504","Vauxhall Astra GSI":"505","Volkswagen Golf GTI":"506","Audi S3":"507","Ford Focus RS":"508","Honda S2000":"509","Mini Cooper S":"510","Sierra Cosworth":"511","Lotus Exige":"512","Mitsubishi Evo X":"513","Porsche 911 GT3":"514","Subaru Impreza STI":"515","TVR Sagaris":"516","Aston Martin One-77":"517","Audi R8":"518","Bugatti Veyron":"519","Ferrari 458":"520","Lamborghini Gallardo":"521","Lexus LFA":"522","Mercedes SLR":"523","Nissan GT-R":"524","Mr Torn Crown '10":"525","Ms Torn Crown '10":"526","Bag of Candy Kisses":"527","Bag of Tootsie Rolls":"528","Bag of Chocolate Truffles":"529","Can of Munster":"530","Bottle of Pumpkin Brew":"531","Can of Red Cow":"532","Can of Taurine Elite":"533","Witch's Cauldron":"534","Electronic Pumpkin":"535","Jack O Lantern Lamp":"536","Spooky Paper Weight":"537","Medieval Helmet":"538","Blood Spattered Sickle":"539","Cauldron":"540","Bottle of Stinky Swamp Punch":"541","Bottle of Wicked Witch":"542","Deputy Star":"543","Wind Proof Lighter":"544","Dual TMPs":"545","Dual Bushmasters":"546","Dual MP5s":"547","Dual P90s":"548","Dual Uzis":"549","Bottle of Kandy Kane":"550","Bottle of Minty Mayhem":"551","Bottle of Mistletoe Madness":"552","Can of Santa Shooters":"553","Can of Rockstar Rudolph":"554","Can of X-MASS":"555","Bag of Reindeer Droppings":"556","Advent Calendar":"557","Santa's Snot":"558","Polar Bear Toy":"559","Fruitcake":"560","Book of Carols":"561","Sweater":"562","Gift Card":"563","Glasses":"564","High-Speed Drive":"565","Mountain Bike":"566","Cut-Throat Razor":"567","Slim Crowbar":"568","Balaclava":"569","Advanced Driving Tactics Manual":"570","Ergonomic Keyboard":"571","Tracking Device":"572","Screwdriver":"573","Fanny Pack":"574","Tumble Dryer":"575","Chloroform":"576","Heavy Duty Padlock":"577","Duct Tape":"578","Wireless Dongle":"579","Horse's Head":"580","Book":"581","Tin Foil Hat":"582","Brown Easter Egg":"583","Orange Easter Egg":"584","Pink Easter Egg":"585","Jawbreaker":"586","Bag of Sherbet":"587","Goodie Bag":"588","Undefined":"891","Undefined 2":"590","Undefined 3":"591","Undefined 4":"592","Mr Torn Crown '11":"593","Ms Torn Crown '11":"594","Pile of Vomit":"595","Rusty Dog Tag":"596","Gold Nugget":"597","Witch's Hat":"598","Golden Broomstick":"599","Devil's Pitchfork":"600","Christmas Lights":"601","Gingerbread Man":"602","Golden Wreath":"603","Pair of Ice Skates":"604","Diamond Icicle":"605","Santa Boots":"606","Santa Gloves":"607","Santa Hat":"608","Santa Jacket":"609","Santa Trousers":"610","Snowball":"611","Tavor TAR-21":"612","Harpoon":"613","Diamond Bladed Knife":"614","Naval Cutlass":"615","Trout":"616","Banana Orchid":"617","Stingray Plushie":"618","Steel Drum":"619","Nodding Turtle":"620","Snorkel":"621","Flippers":"622","Speedo":"623","Bikini":"624","Wetsuit":"625","Diving Gloves":"626","Dog Poop":"627","Stink Bombs":"628","Toilet Paper":"629","Mr Torn Crown '12":"630","Ms Torn Crown '12":"631","Petrified Humerus":"632","Latex Gloves":"633","Bag of Bloody Eyeballs":"634","Straitjacket":"635","Cinnamon Ornament":"636","Christmas Express":"637","Bottle of Christmas Cocktail":"638","Golden Candy Cane":"639","Kevlar Gloves":"640","WWII Helmet":"641","Motorcycle Helmet":"642","Construction Helmet":"643","Welding Helmet":"644","Safety Boots":"645","Hiking Boots":"646","Leather Helmet":"647","Leather Pants":"648","Leather Boots":"649","Leather Gloves":"650","Combat Helmet":"651","Combat Pants":"652","Combat Boots":"653","Combat Gloves":"654","Riot Helmet":"655","Riot Body":"656","Riot Pants":"657","Riot Boots":"658","Riot Gloves":"659","Dune Helmet":"660","Dune Vest":"661","Dune Pants":"662","Dune Boots":"663","Dune Gloves":"664","Assault Helmet":"665","Assault Body":"666","Assault Pants":"667","Assault Boots":"668","Assault Gloves":"669","Delta Gas Mask":"670","Delta Body":"671","Delta Pants":"672","Delta Boots":"673","Delta Gloves":"674","Marauder Face Mask":"675","Marauder Body":"676","Marauder Pants":"677","Marauder Boots":"678","Marauder Gloves":"679","EOD Helmet":"680","EOD Apron":"681","EOD Pants":"682","EOD Boots":"683","EOD Gloves":"684","Torn Bible":"685","Friendly Bot Guide":"686","Egotistical Bear":"687","Brewery Key":"688","Signed Jersey":"689","Mafia Kit":"690","Octopus Toy":"691","Bear Skin Rug":"692","Tractor Toy":"693","Mr Torn Crown '13":"694","Ms Torn Crown '13":"695","Piece of Cake":"696","Rotten Eggs":"697","Peg Leg":"698","Antidote":"699","Christmas Angel":"700","Eggnog":"701","Sprig of Holly":"702","Festive Socks":"703","Respo Hoodie":"704","Staff Haxx Button":"705","Birthday Cake '14":"706","Lump of Coal":"707","Gold Ribbon":"708","Silver Ribbon":"709","Bronze Ribbon":"710","Coin : Factions":"711","Coin : Casino":"712","Coin : Education":"713","Coin : Hospital":"714","Coin : Jail":"715","Coin : Travel Agency":"716","Coin : Companies":"717","Coin : Stock Exchange":"718","Coin : Church":"719","Coin : Auction House":"720","Coin : Race Track":"721","Coin : Museum":"722","Coin : Drugs":"723","Coin : Dump":"724","Coin : Estate Agents":"725","Scrooge's Top Hat":"726","Scrooge's Topcoat":"727","Scrooge's Trousers":"728","Scrooge's Boots":"729","Scrooge's Gloves":"730","Empty Blood Bag":"731","Blood Bag : A+":"732","Blood Bag : A-":"733","Blood Bag : B+":"734","Blood Bag : B-":"735","Blood Bag : AB+":"736","Blood Bag : AB-":"737","Blood Bag : O+":"738","Blood Bag : O-":"739","Mr Torn Crown":"740","Ms Torn Crown":"741","Molotov Cocktail":"742","Christmas Sweater '15":"743","Book : Brawn Over Brains":"744","Book : Time Is In The Mind":"745","Book : Keeping Your Face Handsome":"746","Book : A Job For Your Hands":"747","Book : Working 9 Til 5":"748","Book : Making Friends, Enemies, And Cakes":"749","Book : High School For Adults":"750","Book : Milk Yourself Sober":"751","Book : Fight Like An Asshole":"752","Book : Mind Over Matter":"753","Book : No Shame No Pain":"754","Book : Run Like The Wind":"755","Book : Weaseling Out Of Trouble":"756","Book : Get Hard Or Go Home":"757","Book : Gym Grunting - Shouting To Success":"758","Book : Self Defense In The Workplace":"759","Book : Speed 3 - The Rejected Script":"760","Book : Limbo Lovers 101":"761","Book : The Hamburglar's Guide To Crime":"762","Book : What Are Old Folk Good For Anyway?":"763","Book : Medical Degree Schmedical Degree":"764","Book : No More Soap On A Rope":"765","Book : Mailing Yourself Abroad":"766","Book : Smuggling For Beginners":"767","Book : Stealthy Stealing of Underwear":"768","Book : Shawshank Sure Ain't For Me!":"769","Book : Ignorance Is Bliss":"770","Book : Winking To Win":"771","Book : Finders Keepers":"772","Book : Hot Turkey":"773","Book : Higher Daddy, Higher!":"774","Book : The Real Dutch Courage":"775","Book : Because I'm Happy - The Pharrell Story":"776","Book : No More Sick Days":"777","Book : Duke - My Story":"778","Book : Self Control Is For Losers":"779","Book : Going Back For More":"780","Book : Get Drunk And Lose Dignity":"781","Book : Fuelling Your Way To Failure":"782","Book : Yes Please Diabetes":"783","Book : Ugly Energy":"784","Book : Memories And Mammaries":"785","Book : Brown-nosing The Boss":"786","Book : Running Away From Trouble":"787","Certificate of Awesome":"788","Certificate of Lame":"789","Plastic Sword":"790","Mediocre T-Shirt":"791","Penelope":"792","Cake Frosting":"793","Lock Picking Kit":"794","Special Fruitcake":"795","Felovax":"796","Zylkene":"797","Duke's Safe":"798","Duke's Selfies":"799","Duke's Poetry":"800","Duke's Dog's Ashes":"801","Duke's Will":"802","Duke's Gimp Mask":"803","Duke's Herpes Medication":"804","Duke's Hammer":"805","Old Lady Mask":"806","Exotic Gentleman Mask":"807","Ginger Kid Mask":"808","Young Lady Mask":"809","Moustache Man Mask":"810","Scarred Man Mask":"811","Psycho Clown Mask":"812","Nun Mask":"813","Tyrosine":"814","Keg of Beer":"815","Glass of Beer":"816","Six Pack of Alcohol":"817","Six Pack of Energy Drink":"818","Rosary Beads":"819","Piggy Bank":"820","Empty Vial":"821","Vial of Blood":"822","Vial of Urine":"823","Vial of Saliva":"824","Questionnaire ":"825","Agreement":"826","Perceptron : Calibrator":"827","Donald Trump Mask '16":"828","Yellow Snowman '16":"829","Nock Gun":"830","Beretta Pico":"831","Riding Crop":"832","Sand":"833","Sweatpants":"834","String Vest":"835","Black Oxfords":"836","Rheinmetall MG 3":"837","Homemade Pocket Shotgun":"838","Madball":"839","Nail Bomb":"840","Classic Fedora":"841","Pinstripe Suit Trousers":"842","Duster":"843","Tranquilizer Gun":"844","Bolt Gun":"845","Scalpel":"846","Nerve Gas":"847","Kevlar Lab Coat":"848","Loupes":"849","Sledgehammer":"850","Wifebeater":"851","Metal Detector":"852","Graveyard Key":"853","Questionnaire : Completed":"854","Agreement : Signed":"855","Spray Can : Black":"856","Spray Can : Red":"857","Spray Can : Pink":"858","Spray Can : Purple":"859","Spray Can : Blue":"860","Spray Can : Green":"861","Spray Can : Yellow":"862","Spray Can : Orange":"863","Salt Shaker":"864","Poison Mistletoe":"865","Santa's List '17":"866","Soapbox":"867","Turkey Baster":"868","Elon Musk Mask '17":"869","Love Juice":"870","Bug Swatter":"871","Nothing":"872","Bottle of Green Stout":"873","Prototype":"874","Rotten Apple":"875","Festering Chicken":"876","Mouldy Pizza":"877","Smelly Cheese":"878","Sour Milk":"879","Stale Bread":"880","Spoiled Fish":"881","Insurance Policy ":"882","Bank Statement":"883","Car Battery":"884","Scrap Metal":"885","Torn City Times":"886","Magazine":"887","Umbrella":"888","Travel Mug":"889","Headphones":"890","Mix CD":"892","Lost and Found Office Key":"893","Cosmetics Case":"894","Phone Card":"895","Subway Pass":"896","Bottle Cap":"897","Silver Coin":"898","Silver Bead":"899","Lucky Quarter":"900","Daffodil":"901","Bunch of Carnations":"902","White Lily":"903","Funeral Wreath":"904","Car Keys":"905","Handkerchief":"906","Candle":"907","Paper Bag":"908","Tin Can":"909","Betting Slip":"910","Fidget Spinner":"911","Majestic Moose":"912","Lego Wonder Woman":"913","CR7 Doll":"914","Stretch Armstrong Doll":"915","Beef Femur":"916","Snake's Fang":"917","Icey Igloo":"918","Federal Jail Key":"919","Halloween Basket : Spooky":"920","Michael Myers Mask '18":"921","Toast Jesus '18":"922","Cheesus '18":"923","Bottle of Christmas Spirit":"924","Scammer in the Slammer '18":"925","Gronch Mask '18":"926","Baseball Cap":"927","Bermudas":"928","Blouse":"929","Boob Tube":"930","Bush Hat":"931","Camisole":"932","Capri Pants":"933","Cardigan":"934","Cork Hat":"935","Crop Top":"936","Fisherman Hat":"937","Gym Shorts":"938","Halterneck":"939","Raincoat":"940","Pantyhose":"941","Pencil Skirt":"942","Peplum Top":"943","Polo Shirt":"944","Poncho":"945","Puffer Vest":"946","Mackintosh":"947","Shorts":"948","Skirt":"949","Travel Socks":"950","Turtleneck":"951","Yoga Pants":"952","Bronze Racing Trophy":"953","Silver Racing Trophy":"954","Gold Racing Trophy":"955","Pack of Blank CDs : 250":"956","Pack of Blank CDs : 50":"957","Chest Harness":"958","Choker":"959","Fishnet Stockings":"960","Knee-high Boots":"961","Lingerie":"962","Mankini":"963","Mini Skirt":"964","Nipple Tassels":"965","Bowler Hat":"966","Fitted Shirt":"967","Bow Tie":"968","Neck Tie":"969","Waistcoat":"970","Blazer":"971","Suit Trousers":"972","Derby Shoes":"973","Smoking Jacket":"974","Monocle":"975","Bronze Microphone":"976","Silver Microphone":"977","Gold Microphone":"978","Paint Mask":"979","Ladder":"980","Wire Cutters":"981","Ripped Jeans":"982","Bandit Mask":"983","Bottle of Moonshine":"984","Can of Goose Juice":"985","Can of Damp Valley":"986","Can of Crocozade":"987","Fur Coat":"988","Fur Scarf":"989","Fur Hat":"990","Platform Shoes":"991","Silver Flats":"992","Crystal Bracelet":"993","Cocktail Ring":"994","Sun Hat":"995","Square Sunglasses":"996","Statement Necklace":"997","Floral Dress":"998","Shrug":"1001","Eye Patch":"1002","Halloween Basket : Creepy":"1003","Halloween Basket : Freaky":"1004","Halloween Basket : Frightful":"1005","Halloween Basket : Haunting":"1006","Halloween Basket : Shocking":"1007","Halloween Basket : Terrifying":"1008","Halloween Basket : Horrifying":"1009","Halloween Basket : Petrifying":"1010","Halloween Basket : Nightmarish":"1011","Blood Bag : Irradiated":"1012","Jigsaw Mask '19":"1013","Reading Glasses":"1014","Chinos":"1015","Collared Shawl":"1016","Pleated Skirt":"1017","Flip Flops":"1018","Bingo Visor":"1019","Cover-ups":"1020","Sandals":"1021","Golf Socks":"1022","Flat Cap":"1023","Slippers":"1024","Bathrobe":"1025","Party Hat '19":"1026","Badge : 15th Anniversary":"1027","Birthday Cupcake":"1028","Strippogram Voucher":"1029","Dong : Thomas":"1030","Dong : Greg":"1031","Dong : Effy":"1032","Dong : Holly":"1033","Dong : Jeremy":"1034","Anniversary Present":"1035","Greta Mask '19":"1036","Anatoly Mask '19":"1037","Santa Beard":"1038","Bag of Humbugs":"1039","Christmas Cracker":"1040","Special Snowflake":"1041","Concussion Grenade":"1042","Paper Crown : Green":"1043","Paper Crown : Yellow":"1044","Paper Crown : Red":"1045","Paper Crown : Blue":"1046","Denim Shirt":"1047","Denim Vest":"1048","Denim Jacket":"1049","Denim Jeans":"1050","Denim Shoes":"1051","Denim Cap":"1052","Bread Knife":"1053","Semtex":"1054","Poison Umbrella":"1055","Millwall Brick":"1056","Gentleman Cache":"1057","Gold Chain":"1058","Snapback Hat":"1059","Saggy Pants":"1060","Oversized Shirt":"1061","Basketball Shirt":"1062","Parachute Pants":"1063","Tube Dress":"1064","Gold Sneakers":"1065","Shutter Shades":"1066","Silver Hoodie":"1067","Bucket Hat":"1068","Puffer Jacket":"1069","Durag":"1070","Onesie":"1071","Baseball Jacket":"1072","Braces":"1073","Panama Hat":"1074","Pipe":"1075","Shoulder Sweater":"1076","Sports Jacket":"1077","Old Wallet":"1078","Cardholder":"1079","Billfold":"1080","Coin Purse":"1081","Zip Wallet":"1082","Clutch":"1083","Credit Card":"1084","Lipstick":"1085","License":"1086","Tampon":"1087","Receipt":"1088","Family Photo":"1089","Lint":"1090","Handcuffs":"1091","Lubricant":"1092","Hit Contract":"1093","Syringe":"1094","Spoon":"1095","Cell Phone":"1096","Assless Chaps":"1097","Opera Gloves":"1098","Booty Shorts":"1099","Collar":"1100","Ball Gag":"1101","Blindfold":"1102","Maid Uniform":"1103","Maid Hat":"1104","Ball Gown":"1105","Fascinator Hat":"1106","Wedding Dress":"1107","Wedding Veil":"1108","Head Scarf":"1109","Nightgown":"1110","Pullover":"1111","Elegant Cache":"1112","Naughty Cache":"1113","Elderly Cache":"1114","Denim Cache":"1115","Wannabe Cache":"1116","Cutesy Cache":"1117","Armor Cache":"1118","Melee Cache":"1119","Small Arms Cache":"1120","Medium Arms Cache":"1121","Heavy Arms Cache":"1122","Spy Camera":"1123","Cloning Device":"1124","Card Skimmer":"1125","Tutu":"1126","Knee Socks":"1127","Kitty Shoes":"1128","Cat Ears":"1129","Bunny Ears":"1130","Puppy Ears":"1131","Heart Sunglasses":"1132","Hair Bow":"1133","Lolita Dress":"1134","Unicorn Horn":"1135","Check Skirt":"1136","Polka Dot Dress":"1137","Ballet Shoes":"1138","Dungarees":"1139","Tights":"1140","Pennywise Mask '20":"1141","Tiger King Mask '20":"1142","Medical Mask":"1143","Chin Diaper":"1144","Tighty Whities":"1145","Tangerine":"1146","Helmet of Justice":"1147","Broken Bauble":"1148","Purple Easter Egg":"1149","Ski Mask":"1150","Bunny Nose":"1151","SMAW Launcher":"1152","China Lake":"1153","Milkor MGL":"1154","PKM":"1155","Negev NG-5":"1156","Stoner 96":"1157","Meat Hook":"1158","Cleaver":"1159","Arca Fortunae":"1176"};

    set_monitor()

    function set_monitor() {
        const intervalID = setInterval(updateUI, 500);
        let last_additem_item_count = 0
        let last_manage_item_count = 0

        function onPositionChange() {
            let position = parseInt($("#bph_position").attr('value'));
            position = Math.max(Math.min(49, position), 0);
            $("#bph_position").attr('value', position);
            mir_set(positionKey, position);
            last_additem_item_count = 0
            last_manage_item_count = 0
        }
        function onPremiumChange() {
            let premium = parseFloat($("#bph_preInput").attr('value'));
            if (isNaN(premium)) {
                premium = 0.0;
            }
            $("#bph_preInput").attr('value', premium);
            mir_set(premiumKey, premium);
            last_additem_item_count = 0
            last_manage_item_count = 0
        }

        function updateUI() {
            console.log(`等待页面更新`);

            if ($("div[class^=appHeaderWrapper]").length > 0 && $("div[class=bph_header]").length == 0) {
                let premium = mir_get(premiumKey, 0.0);
                let position = Math.max(Math.min(49, parseInt(mir_get(positionKey, 0))), 0);
                let select = `<select id="bph_position">`;
                for (let i = 0; i < 50; i++) {
                    if (i == position) {
                        select += `<option value="${i}" selected="selected">${i}</option>`
                    } else {
                        select += `<option value="${i}">${i}</option>`
                    }
                }
                select += `</select>`
                $("div[class^=appHeaderWrapper]").append(`<div class="bph_header" style="padding:10px 0 0 0"><div style="background-color:white;padding:10px;border:1px solid black;">以市场第${select}低的价位为基准&nbsp;&nbsp;溢价+
                <input id="bph_preInput" value="${premium}" style="background-color:lightgray;width:30px;padding: 0 5px 0 5px;font-weight:bold;color:#333;text-align: center;">%
                </div><hr class="page-head-delimiter m-top10 m-bottom10"></div>`);
                $("#bph_preInput").change(onPremiumChange);
                $("#bph_position").change(onPositionChange);
            }

            let additem_page_items = document.querySelectorAll("[data-group='child']");
            if (additem_page_items.length != last_additem_item_count && additem_page_items.length > 0) { // tab改变了
                fill_prices_at_additem(additem_page_items)
            }
            last_additem_item_count = additem_page_items.length

            if (window.location.href.endsWith('manage')) {
                let manage_page_items = document.querySelectorAll("div[class^=item]");
                if (manage_page_items.length != last_manage_item_count && manage_page_items.length > 0) {
                    fill_prices_at_manage(manage_page_items)
                }
                last_manage_item_count = manage_page_items.length
            }
        }
    }

    function fill_prices_at_additem(page_items) {
        function fill_item_price(item_input, item_price) {
            item_input.value = item_price;
            item_input.dispatchEvent(new Event("input"));
        }

        console.log(`[manage] - 更新需要填充的价格`);
        for (let i = 0; i < page_items.length; i++) {
            let item = page_items[i];

            let item_name = item.getElementsByTagName("canvas")[0].getAttribute('aria-label');
            let item_id = item_name2id_map[item_name];
            let item_input = item.getElementsByTagName("input")[1]; // 价格input

            get_item_price(item_id, item_prices => {
                fill_item_price(item_input, Math.ceil(prices_choose_strategy(item_prices)))
            })
        }
    }

    function fill_prices_at_manage(page_items) {
        function fill_item_price(item_input, item_price, item_detail1, item_detail2, old_price) {
            console.log(`price: ${item_price}`);

            item_detail1.innerText = `${old_price} => ${item_price}`;
            let color = "green";
            if (item_price - old_price > 0) {
                color = "red";
            } else if (item_price - old_price == 0) {
                color = "white";
            }
            item_detail2.style.color = color
            item_detail2.innerText = `${item_price - old_price}(${((item_price - old_price)/old_price).toFixed(2)}%)`;

            item_input.value = item_price + '-';
        }

        console.log(`[additem] - 更新需要填充的价格`);
        for (let i = 0; i < page_items.length; i++) {
            let item = page_items[i];

            let item_name = item.querySelector("[role='heading'] b").innerText
            let item_id = item_name2id_map[item_name];
            let item_input = item.querySelectorAll("input")[1]; // 价格input
            let old_price = 0
            for (let j in item_input.value) {
                let n = item_input.value[j];
                if (n >= '0' && n <= '9') {
                    old_price = old_price*10 + (n - '0');
                }
            }
            let item_detail1 = item.querySelector("div[class^=bonuses]")
            let item_detail2 = item.querySelector("div[class^=rrp]")

            get_item_price(item_id, item_prices => {
                fill_item_price(item_input, Math.ceil(prices_choose_strategy(item_prices)), item_detail1, item_detail2, old_price)
            })
        }
    }

    function get_item_price(item_id, callback) {
        if (lowest_price_cache[item_id]) {
            // 缓存命中
            let item_prices = lowest_price_cache[item_id];
            // console.log(`lowest缓存: ${item_id} - prices:${item_prices}`);
            callback(item_prices);
        } else {
            // 请求API
            let API = `https://api.torn.com/market/${item_id}?selections=&key=${API_KEY}`;
            console.log(`请求: ${API}, item id: ${item_id}`);
            fetch(API)
                .then((res) => {
                if(res.ok){
                    return res.json();
                } else {
                    console.log(`出现未知错误 ${res}`);
                }
            }, networkError => {
                console.log(`出现网络错误 ${networkError}`);
            }).then((json_data) => {
                let item_prices = [];
                json_data.bazaar.forEach(e => {
                    if (typeof(e.cost) == "undefined") {
                        item_prices.push(0)
                    } else {
                        item_prices.push(e.cost)
                    }
                });
                // console.log(`[caching] ${item_id} - price:${item_prices}`);
                lowest_price_cache[item_id] = item_prices.sort((x,y) => x-y);
                callback(item_prices);
            });
        };
    }

})();