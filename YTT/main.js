const dateList = {"1-1":"New Years Day", "1-2":"National Buffet Day", "1-3":"JRR Tolkien Day","1-4":"National Spaghetti Day","1-5":"National Whipped Cream Day", "1-6":"National Cuddle Up Day", "1-7":"National Bobblehead Day", "1-8":"Elvis Presley’s Birthday", "1-9":"National Word Nerd Day", "1-10":"National Houseplant Appreciation Day", "1-11":"National Milk Day", "1-12":"Kiss a Ginger Day", "1-13":"National Rubber Ducky Day", "1-14":"National Dress Up Your Pet Day", "1-15":"Martin Luther King's Birthday", "1-16":"National Nothing Day", "1-17":"Michelle Obama’s Birthday", "1-18":"Martin Luther King, Jr. Day", "1-19":"National Popcorn Day", "1-20":"National DJ Day", "1-21":"National Hugging Day", "1-22":"Celebration of Life Day", "1-23":"National Pie Day", "1-24":"National Compliment Day", "1-25":"Opposite Day", "1-26":"Australia Day", "1-27":"National Chocolate Cake Day", "1-28":"National Kazoo Day", "1-29":"National Fun at Work Day", "1-30":"National Croissant Day", "1-31":"National Backward Day", "2-1":"National Eat Ice Cream for Breakfast Day", "2-2":"Groundhog Day", "2-3":"Doggy Date Night", "2-4":"National Thank a Mail Carrier Day", "2-5":"National Shower with a Friend Day", "2-6":"Bob Marley's Birthday", "2-7":"Super Bowl Sunday", "2-8":"National Kite-Flying Day", "2-9":"National Toothache Day", "2-10":"	National Umbrella Day", "2-11":"National Inventors' Day", "2-12":"Abraham Lincoln's Birthday", "2-13":"World Radio Day", "2-14":"Valentine's Day", "2-15":"Presidents Day", "2-16":"Mardi Gras", "2-17":"Random Act of Kindness Day", "2-18":"National Drink Wine Day", "2-19":"Tug of War Day", "2-20":"National Muffin Day", "2-21":"National Sticky Bun Day", "2-22":"National Margarita Day", "2-23":"National Dog Biscuit Day", "2-24":"National Tortilla Chip Day", "2-25":"National Clam Chowder Day", "2-26":"National Pistachio Day", "2-27":"National Pokemon Day", "2-28":"Rare Disease Day", "2-29":"Leap Day", "3-1":"Justin Bieber's Birthday", "3-2":"Dr. Seuss’s Birthday", "3-3":"National If Pets Had Thumbs Day", "3-4":"National Grammar Day", "3-5":"National Cheese Doodle Day", "3-6":"National Dress Day", "3-7":"National Be Heard Day", "3-8":"National Proofreading Day", "3-9":"National Barbie Day", "3-10":"Mario Day", "3-11":"National Funeral Director and Mortician Recognition Day", "3-12":"National Girl Scout Day", "3-13":"National K9 Veterans Day", "3-14":"Pi Day", "3-15":"Ides of March", "3-16":"National Panda Day", "3-17":"St. Patrick's Day", "3-18":"Awkward Moments Day", "3-19":"National Let's Laugh Day", "3-20":"French Language Day", "3-21":"World Down Syndrome Day", "3-22":"National Goof Off Day", "3-23":"National Puppy Day", "3-24":"National Cheesesteak Day", "3-25":"International Waffle Day", "3-26":"Nike Air Max Day", "3-27":"Quentin Tarantino's Birthday", "3-28":"Lady Gaga's Birthday", "3-29":"National Mom and Pop Business Owners Day", "3-30":"Doctors' Day", "3-31":"World Backup Day", "4-1":"April Fools' Day", "4-2":"World Autism Awareness Day", "4-3":"National Find a Rainbow Day", "4-4":"Easter", "4-5":"National Deep Dish Pizza Day", "4-6":"New Beer's Eve", "4-7":"National Beer Day", "4-8":"National Empanada Day", "4-9":"National Unicorn Day", "4-10":"National Hug Your Dog Day", "4-11":"National Eight Track Tape Day", "4-12":"National Grilled Cheese Sandwich Day", "4-13":"National Scrabble Day", "4-14":"National Gardening Day", "4-15":"National High Five Day", "4-16":"Wear Pajamas to Work Day", "4-17":"International Haiku Poetry Day", "4-18":"National Velociraptor Awareness Day", "4-19":"National Garlic Day", "4-20":"National Weed Day", "4-21":"National Kindergarten Day", "4-22":"Earth Day", "4-23":"National Picnic Day", "4-24":"National Pigs in a Blanket Day", "4-25":"National DNA Day", "4-26":"National Pretzel Day", "4-27":"National Prime Rib Day", "4-28":"National Superhero Day", "4-29":"National Shrimp Scampi Day", "4-30":"National Bubble Tea Day", "5-1":"Beer Pong Day", "5-2":"International Harry Potter Day", "5-3":"Constitution Memorial Day", "5-4":"Star Wars Day", "5-5":"Cinco de Mayo", "5-6":"International No Diet Day", "5-7":"World Password Day", "5-8":"National Have a Coke Day", "5-9":"Mother's Day", "5-10":"National Clean Your Room Day", "5-11":"National Twilight Zone Day", "5-12":"National Limerick Day", "5-13":"National Apple Pie Day", "5-14":"National Dance Like a Chicken Day", "5-15":"National Chocolate Chip Day", "5-16":"National Honor Our LGBT Elders Day", "5-17":"Tax Day", "5-18":"National No Dirty Dishes Day", "5-19":"National Devil's Food Cake Day", "5-20":"National Be a Millionaire Day", "5-21":"National Talk Like Yoda Day", "5-22":"Harvey Milk Day", "5-23":"National Taffy Day", "5-24":"National Brother's Day", "5-25":"May Revolution Day", "5-26":"National Paper Airplane Day", "5-27":"National Grape Popsicle Day", "5-28":"National Hamburger Day", "5-29":"Put a Pillow on your Fridge Day", "5-30":"Indianapolis 500", "5-31":"Memorial Day", "6-1":"Flip a Coin Day", "6-2":"National Rocky Road Day", "6-3":"Repeat Day Repeat Day", "6-4":"National Cheese Day", "6-5":"Hot Air Balloon Day", "6-6":"National Yo-Yo Day", "6-7":"VCR Day", "6-8":"Best Friends Day", "6-9":"Donald Duck Day", "6-10":"Ice Tea Day", "6-11":"National Corn on the Cob Day", "6-12":"National Jerky Day", "6-13":"National Weed your Garden Day", "6-14":"Monkey Around Day", "6-15":""};
const d = new Date();
const yesterday = new Date(d);
const tomarrow = new Date(d);

function getHoliday(day, id){
    document.getElementById(id).innerHTML = searchGoogle(dateList[day])+day+": "+dateList[day]+"</a>";
}

function searchGoogle(term){
    return '<a target=\"_blank\"href=\"http://google.com/search?q='+term.replace(" ", "+")+"\">";
}

//Gets today's month and date
var todaysDate = (d.getMonth()+1).toString() +"-"+ d.getDate().toString();

//Sets date to yesterday
yesterday.setDate(yesterday.getDate() - 1);

var yesterdaysDay = (yesterday.getMonth()+1).toString();
var yesterdaysMonth = yesterday.getDate().toString();
var yesterdaysDate = yesterdaysDay+"-"+yesterdaysMonth;

//Sets date to tomarrow
tomarrow.setDate(tomarrow.getDate() + 1);

var tomarrowsDay = tomarrow.getDate().toString();
var tomarrowsMonth = (tomarrow.getMonth()+1).toString();
var tomarrowsDate = tomarrowsMonth+"-"+tomarrowsDay;

getHoliday(todaysDate, "today");
getHoliday(yesterdaysDate, "yesterday");
getHoliday(tomarrowsDate, "tomorrow");
