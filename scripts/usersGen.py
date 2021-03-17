import os,django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project4.settings")
django.setup()

from network.models import*

import random

orgList = ["gmail", "yahoo", "mail", "windowslive"]

nameList = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Christopher", "Daniel", 
    "Matthew", "Anthony", "Donald", "Mark", "Paul", "Steven", "Andrew", "Kenneth", "Joshua", "Kevin", "Brian", "George", "Edward", "Ronald", 
    "Timothy", "Jason", "Jeffrey", "Ryan", "Jacob", "Gary", "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon", 
    "Benjamin", "Samuel", "Frank", "Gregory", "Raymond", "Alexander", "Patrick", "Jack", "Dennis", "Jerry", "Tyler", "Aaron",
    "Jose", "Henry", "Adam", "Douglas", "Nathan", "Peter", "Zachary", "Kyle", "Walter", "Harold", "Jeremy", "Ethan", "Carl", 
    "Keith", "Roger", "Gerald", "Christian", "Terry", "Sean", "Arthur", "Austin", "Noah", "Lawrence", "Jesse", "Joe", "Bryan", 
    "Billy", "Jordan", "Albert", "Dylan", "Bruce", "Willie", "Gabriel", "Alan", "Juan", "Logan", "Wayne", "Ralph", "Roy", "Eugene", 
    "Randy", "Vincent", "Russell", "Louis", "Philip", "Bobby", "Johnny", "Bradley", "Aaliyah", "Aaron", "Abel", "Abigail", "Ace", "Ada", 
    "Adaline", "Adalyn", "Adam", "Addison", "Adelaide", "Adeline", "Adelyn", "Adira", "Adonis", "Adrian", "Adriel", "Aiden", "Ailani", "Alaia",
    "Alaina", "Alan", "Alana", "Alani", "Alden", "Alexa", "Alexander", "Alexandra", "Alice", "Alina", "Alivia", "Aliyah", "Alyssa", "Amara",
    "Amaya", "Amber", "Amelia", "Amir", "Amira", "Amy", "Anastasia", "Andrew", "Anna", "Annabelle", "Annalise", "Anthony", "Ara", "Arabella",
    "Archer", "Arden", "Ares", "Ari", "Aria", "Arian", "Ariana", "Arianna", "Ariella", "Arlo", "Armani", "Arthur", "Asa", "Asher", "Ashton",
    "Athena", "Atlas", "Atticus", "Aubree", "Audrey", "August", "Aurelia", "Aurora", "Austin", "Autumn", "Ava", "Avah", "Avery", "Avi", "Aviana",
    "Avianna", "Axel", "Ayla", "Azalea", "Azariah", "Azrael", "Baila", "Bailey", "Belen", "Bella", "Benjamin", "Bennett", "Beverly", "Bianca",
    "Birdie", "Blaine", "Braelyn", "Braxton", "Brayden", "Bria", "Brianna", "Brielle", "Bryson", "Cadence", "Caiden", "Cairo", "Caleb", "Cali",
    "Callie", "Calvin", "Camden", "Cameron", "Camila", "Capri", "Caroline", "Carter", "Cayden", "Celeste", "Charlotte", "Chase", "Chaya", "Chloe",
    "Christine", "Christopher", "Clara", "Colby", "Collin", "Connor", "Cooper", "Cora", "Corona", "Cruz", "Dakota", "Daniel", "David", "Declan",
    "Delilah", "Dillon", "Dior", "Dixie", "Easton", "Elaine", "Eleanor", "Elena", "Elian", "Eliana", "Elianna", "Elias", "Elijah", "Elise",
    "Elizabeth", "Ella", "Ellie", "Elliot", "Eloise", "Elsie", "Elyse", "Emerson", "Emersyn", "Emery", "Emilia", "Emily", "Emma", "Emmitt",
    "Enzo", "Esther", "Ethan", "Evan", "Evangeline", "Evelyn", "Evelynn", "Everett", "Everly", "Evie", "Ezekiel", "Ezra", "Finley", "Finn",
    "Flora", "Gabriella", "Gavin", "Gemma", "Genevieve", "Gia", "Gianna", "Gigi", "Giselle", "Grace", "Grayson", "Hannah", "Harlow", "Harper",
    "Hayden", "Henry", "Holden", "Hope", "Hudson", "Hunter", "Huxley", "Ira", "Iris", "Isaac", "Isabella", "Isla", "Iva", "Ivy", "Jace", "Jack",
    "Jackson", "Jacob", "Jade", "Jaliyah", "James", "Jameson", "Jane", "Janelle", "Jasmine", "Jasper", "Javier", "Jax", "Jaxon", "Jayce", "Jayda",
    "Jayden", "Jayla", "Jaylah", "Jayleen", "Jaylen", "Jazlyn", "Jemma", "Jenna", "Jensen", "Jeremiah", "Jessica", "Joel", "Joelle", "John", "Jolene",
    "Jonah", "Josephine", "Joshua", "Josiah", "Josie", "Jude", "Julia", "Julian", "Juno", "Kai", "Kaia", "Kaiden", "Kailani", "Kalani", "Kali",
    "Kayden", "Keanu", "Keaton", "Keilani", "Khari", "Kian", "Kiara", "Kieran", "Killian", "Knox", "Kora", "Kye", "Kylan", "Kyler", "Kyra", "Lachlan",
    "Lainey", "Lana", "Landon", "Lauren", "Layla", "Leah", "Leia", "Leighton", "Leilani", "Lena", "Lennox", "Leo", "Leon", "Leona", "Levi", "Lexi",
    "Lia", "Liam", "Liana", "Lila", "Liliana", "Lilith", "Lillian", "Lily", "Lincoln", "Logan", "Lola", "Lorelei", "Lorenzo", "Louise", "Luca",
    "Lucas", "Lucia", "Lucky", "Lucy", "Luke", "Luna", "Lydia", "Lyla", "Mabel", "Maddox", "Madeline", "Madison", "Maeve", "Makai", "Makenzie",
    "Malachi", "Maleah", "Malia", "Malik", "Marcus", "Maren", "Margot", "Mateo", "Matthew", "Maverick", "Maya", "Mia", "Micah", "Michael", "Mika",
    "Mikayla", "Mila", "Milan", "Miles", "Millie", "Milo", "Mina", "Molly", "Morgan", "Mya", "Myla", "Naila", "Nalani", "Nancy", "Naomi", "Nash",
    "Natalie", "Nathan", "Naya", "Nevaeh", "Nia", "Nina", "Noah", "Noelle", "Nora", "Nova", "Nya", "Nyah", "Nyla", "Octavia", "Oliver", "Olivia",
    "Omari", "Ophelia", "Orion", "Otis", "Owen", "Parker", "Paxton", "Penelope", "Penny", "Phoebe", "Phoenix", "Pia", "Poppy", "Presley", "Priya",
    "Quinn", "Rae", "Raelynn", "Rafael", "Rai", "Raiden", "Raina", "Raine", "Rayna", "Rayne", "Reece", "Reese", "Remi", "Remington", "Reyna", "Rhea",
    "Rhett", "Rhys", "Riley", "River", "Rivka", "Rohan", "Rohan", "Roman", "Romy", "Ronan", "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara",
    "Susan", "Jessica", "Sarah", "Karen", "Nancy", "Lisa", "Margaret", "Betty", "Sandra", "Ashley", "Dorothy", "Kimberly", "Emily", "Donna", "Michelle",
    "Carol", "Amanda", "Melissa", "Deborah", "Stephanie", "Rebecca", "Laura", "Sharon", "Cynthia", "Kathleen", "Amy", "Shirley", "Angela", "Helen",
    "Anna", "Brenda", "Pamela", "Nicole", "Samantha", "Katherine", "Emma", "Ruth", "Christine", "Catherine", "Debra", "Rachel", "Carolyn", "Janet",
    "Virginia", "Maria", "Heather", "Diane", "Julie", "Joyce", "Victoria", "Kelly", "Christina", "Lauren", "Joan", "Evelyn", "Olivia", "Judith", "Megan",
    "Cheryl", "Martha", "Andrea", "Frances", "Hannah", "Jacqueline", "Ann", "Gloria", "Jean", "Kathryn", "Alice", "Teresa", "Sara", "Janice", "Doris",
    "Madison", "Julia", "Grace", "Judy", "Abigail", "Marie", "Denise", "Beverly", "Amber", "Theresa", "Marilyn", "Danielle", "Diana", "Brittany",
    "Natalie", "Sophia", "Rose", "Isabella", "Alexis"]

def randPass():
    chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '@']
    text = ""
    for i in range(random.randrange(1,20)):
        text = text + random.choice(chars) 
    return text

def randEmail(name):
    number = random.randrange(1, 100000000)
    name = name + str(number)
    org = "@" + random.choice(orgList) + ".com"
    return name+org

def randName():
    name = random.choice(nameList) + random.choice(['_', '.', '-']) + 3 * str(random.randrange(10))
    return name

for i in range(100):
    name=randName()
    user = User.objects.create_user(username=name, email=randEmail(name), password=randPass())
    user.save()