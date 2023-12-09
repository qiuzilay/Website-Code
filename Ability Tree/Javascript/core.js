history.scrollRestoration = "manual";

$(document).ready(function(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const latest = "2022-12-10";
    const display = {"changelog": true};
    const alertor = $('div.alert-window');
    const changelog = {
        "element": $('div.changelog'),
        "button": $('div.changelog button.redirect'),
        "info": $('div.changelog span[data-changelog]')
    };
    const url = [
        "../storage/soundeffects/Random_levelup.wav",
        "../storage/soundeffects/Block.end_portal.eyeplace1.wav",
        "../storage/soundeffects/Block.end_portal.eyeplace2.wav",
        "../storage/soundeffects/Block.end_portal.eyeplace3.wav"
    ];
    const touch = {};
    const time = {};
    const force = {
        "warrior": 0,
        "archer": 0,
        "mage": 0,
        "assassin": 0,
        "shaman": 0
    };
    var className;
    var classNameLower;
    var currentClass;
    var classObject;
    var classBranch;
    var classTable;
    var classInfo;
    var classAPool;
    var copyTooltip;
    var popup_count = 0;
    var path = {
        "warrior": [],
        "archer": [],
        "mage": [],
        "assassin": [],
        "shaman": []
    };
    var repository = {
        "warrior": {
            "branch": {},
            "button": {
                "Bash": {
                    "name": "Bash",
                    "combo": "RLR",
                    "level": 0,
                    "import": null,
                    "export": ["Spear Proficiency I"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Spear Proficiency I": {
                    "name": "Spear Proficiency I",
                    "level": 1,
                    "import": ["Bash"],
                    "export": ["Cheaper Bash", "Double Bash"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Cheaper Bash": {
                    "name": "Cheaper Bash",
                    "level": 1,
                    "import": ["Spear Proficiency I"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Double Bash": {
                    "name": "Double Bash",
                    "level": 2,
                    "import": ["Spear Proficiency I"],
                    "export": ["Charge"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Charge": {
                    "name": "Charge",
                    "combo": "RRR",
                    "level": 0,
                    "import": ["Double Bash"],
                    "export": ["Vehement", "Tougher Skin"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Vehement": {
                    "name": "Vehement",
                    "level": 1,
                    "import": ["Charge"],
                    "export": ["Uppercut"],
                    "cost": 1,
                    "lock": ["Tougher Skin"],
                    "required": null,
                    "archetype": {
                        "name": "Fallen",
                        "min": 0
                    }
                },
                "Tougher Skin": {
                    "name": "Tougher Skin",
                    "level": 1,
                    "import": ["Charge"],
                    "export": ["War Scream"],
                    "cost": 1,
                    "lock": ["Vehement"],
                    "required": null,
                    "archetype": {
                        "name": "Paladin",
                        "min": 0
                    }
                },
                "Uppercut": {
                    "name": "Uppercut",
                    "combo": "RLL",
                    "level": 0,
                    "import": ["Cheaper Charge", "Vehement"],
                    "export": ["Cheaper Charge", "Heavy Impact", "Earth Mastery", "Thunder Mastery"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Cheaper Charge": {
                    "name": "Cheaper Charge",
                    "level": 1,
                    "import": ["Uppercut", "War Scream"],
                    "export": ["Uppercut", "War Scream", "Thunder Mastery", "Air Mastery", "Water Mastery"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "War Scream": {
                    "name": "War Scream",
                    "combo": "RRL",
                    "level": 0,
                    "import": ["Cheaper Charge", "Tougher Skin"],
                    "export": ["Cheaper Charge", "Air Mastery", "Fire Mastery"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Heavy Impact": {
                    "name": "Heavy Impact",
                    "level": 2,
                    "import": ["Uppercut"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Earth Mastery": {
                    "name": "Earth Mastery",
                    "level": 1,
                    "import": ["Uppercut"],
                    "export": ["Quadruple Bash"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Fallen",
                        "min": 0
                    }
                },
                "Thunder Mastery": {
                    "name": "Thunder Mastery",
                    "level": 1,
                    "import": ["Cheaper Charge", "Air Mastery", "Uppercut"],
                    "export": ["Fireworks", "Air Mastery", "Water Mastery"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Fallen",
                        "min": 0
                    }
                },
                "Air Mastery": {
                    "name": "Air Mastery",
                    "level": 1,
                    "import": ["Cheaper Charge", "Thunder Mastery", "War Scream"],
                    "export": ["Flyby Jab", "Thunder Mastery", "Water Mastery"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Battle Monk",
                        "min": 0
                    }
                },
                "Fire Mastery": {
                    "name": "Fire Mastery",
                    "level": 1,
                    "import": ["War Scream"],
                    "export": ["Flaming Uppercut"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Paladin",
                        "min": 0
                    }
                },
                "Water Mastery": {
                    "name": "Water Mastery",
                    "level": 1,
                    "import": ["Cheaper Charge", "Thunder Mastery", "Air Mastery"],
                    "export": ["Half-Moon Swipe"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Battle Monk",
                        "min": 0
                    }
                },
                "Quadruple Bash": {
                    "name": "Quadruple Bash",
                    "level": 2,
                    "import": ["Fireworks", "Earth Mastery"],
                    "export": ["Fireworks", "Bak'al's Grasp"],
                    "cost": 2,
                    "lock": null,
                    "required": "Bash",
                    "archetype": {
                        "name": "Fallen",
                        "min": 0
                    }
                },
                "Fireworks": {
                    "name": "Fireworks",
                    "level": 2,
                    "import": ["Quadruple Bash", "Thunder Mastery"],
                    "export": ["Quadruple Bash", "Bak'al's Grasp"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Fallen",
                        "min": 0
                    }
                },
                "Flyby Jab": {
                    "name": "Flyby Jab",
                    "level": 2,
                    "import": ["Flaming Uppercut", "Air Mastery"],
                    "export": ["Flaming Uppercut", "Iron Lungs"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Flaming Uppercut": {
                    "name": "Flaming Uppercut",
                    "level": 2,
                    "import": ["Flyby Jab", "Fire Mastery"],
                    "export": ["Flyby Jab", "Iron Lungs"],
                    "cost": 2,
                    "lock": null,
                    "required": "Uppercut",
                    "archetype": {
                        "name": "Paladin",
                        "min": 0
                    }
                },
                "Half-Moon Swipe": {
                    "name": "Half-Moon Swipe",
                    "level": 2,
                    "import": ["Water Mastery"],
                    "export": ["Air Shout"],
                    "cost": 2,
                    "lock": null,
                    "required": "Uppercut",
                    "archetype": {
                        "name": "Battle Monk",
                        "min": 1
                    }
                },
                "Iron Lungs": {
                    "name": "Iron Lungs",
                    "level": 1,
                    "import": ["Flyby Jab", "Flaming Uppercut"],
                    "export": ["Mantle of the Bovemists"],
                    "cost": 1,
                    "lock": null,
                    "required": "War Scream",
                    "archetype": {
                        "name": "Paladin",
                        "min": 0
                    }
                },
                "Generalist": {
                    "name": "Generalist",
                    "level": 4,
                    "import": ["Air Shout"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Battle Monk",
                        "min": 3
                    }
                },
                "Air Shout": {
                    "name": "Air Shout",
                    "level": 2,
                    "import": ["Half-Moon Swipe"],
                    "export": ["Generalist", "Cheaper Uppercut"],
                    "cost": 2,
                    "lock": null,
                    "required": "War Scream",
                    "archetype": {
                        "name": "Battle Monk",
                        "min": 0
                    }
                },
                "Mantle of the Bovemists": {
                    "name": "Mantle of the Bovemists",
                    "level": 4,
                    "import": ["Iron Lungs"],
                    "export": ["Provoke"],
                    "cost": 2,
                    "lock": null,
                    "required": "War Scream",
                    "archetype": {
                        "name": "Paladin",
                        "min": 3
                    }
                },
                "Bak'al's Grasp": {
                    "name": "Bak'al's Grasp",
                    "level": 4,
                    "import": ["Quadruple Bash", "Fireworks"],
                    "export": ["Spear Proficiency II"],
                    "cost": 2,
                    "lock": null,
                    "required": "War Scream",
                    "archetype": {
                        "name": "Fallen",
                        "min": 2
                    }
                },
                "Spear Proficiency II": {
                    "name": "Spear Proficiency II",
                    "level": 1,
                    "import": ["Cheaper Uppercut", "Bak'al's Grasp"],
                    "export": ["Cheaper Uppercut", "Precise Strikes", "Enraged Blow"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Cheaper Uppercut": {
                    "name": "Cheaper Uppercut",
                    "level": 1,
                    "import": ["Spear Proficiency II", "Aerodynamics", "Air Shout"],
                    "export": ["Spear Proficiency II", "Aerodynamics", "Precise Strikes", "Flying Kick", "Counter"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Counter": {
                    "name": "Counter",
                    "level": 2,
                    "import": ["Cheaper Uppercut", "Aerodynamics"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Aerodynamics": {
                    "name": "Aerodynamics",
                    "level": 2,
                    "import": ["Cheaper Uppercut", "Provoke"],
                    "export": ["Cheaper Uppercut", "Provoke", "Counter"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Battle Monk",
                        "min": 0
                    }
                },
                "Provoke": {
                    "name": "Provoke",
                    "level": 2,
                    "import": ["Aerodynamics", "Mantle of the Bovemists"],
                    "export": ["Aerodynamics", "Air Shout", "Manachism"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Enraged Blow": {
                    "name": "Enraged Blow",
                    "level": 3,
                    "import": ["Spear Proficiency II"],
                    "export": ["Boiling Blood"],
                    "cost": 2,
                    "lock": null,
                    "required": "Bak'al's Grasp",
                    "archetype": {
                        "name": "Fallen",
                        "min": 0
                    }
                },
                "Flying Kick": {
                    "name": "Flying Kick",
                    "level": 2,
                    "import": ["Cheaper Uppercut"],
                    "export": ["Ragnarokkr", "Stronger Mantle", "Precise Strikes"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Battle Monk",
                        "min": 1
                    }
                },
                "Stronger Mantle": {
                    "name": "Stronger Mantle",
                    "level": 1,
                    "import": ["Flying Kick", "Manachism"],
                    "export": ["Flying Kick", "Manachism", "Precise Strikes"],
                    "cost": 1,
                    "lock": null,
                    "required": "Mantle of the Bovemists",
                    "archetype": {
                        "name": "Paladin",
                        "min": 0
                    }
                },
                "Manachism": {
                    "name": "Manachism",
                    "level": 3,
                    "import": ["Stronger Mantle", "Provoke"],
                    "export": ["Stronger Mantle", "Stronger Bash"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Paladin",
                        "min": 3
                    }
                },
                "Boiling Blood": {
                    "name": "Boiling Blood",
                    "level": 2,
                    "import": ["Ragnarokkr", "Enraged Blow"],
                    "export": ["Ragnarokkr", "Intoxicating Blood", "Uncontainable Corruption"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Ragnarokkr": {
                    "name": "Ragnarokkr",
                    "level": 3,
                    "import": ["Boiling Blood", "Flying Kick"],
                    "export": ["Boiling Blood", "Intoxicating Blood", "Comet"],
                    "cost": 2,
                    "lock": null,
                    "required": "War Scream",
                    "archetype": {
                        "name": "Fallen",
                        "min": 0
                    }
                },
                "Precise Strikes": {
                    "name": "Precise Strikes",
                    "level": 1,
                    "import": ["Burning Heart", "Flying Kick", "Stronger Mantle"],
                    "export": ["Burning Heart", "Whirlwind Strike", "Collide"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Burning Heart": {
                    "name": "Burning Heart",
                    "level": 1,
                    "import": ["Precise Strikes", "Stronger Bash"],
                    "export": ["Precise Strikes", "Stronger Bash", "Collide", "Rejuvenating Skin"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Paladin",
                        "min": 0
                    }
                },
                "Stronger Bash": {
                    "name": "Stronger Bash",
                    "level": 1,
                    "import": ["Burning Heart", "Manachism"],
                    "export": ["Burning Heart", "Rejuvenating Skin"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Intoxicating Blood": {
                    "name": "Intoxicating Blood",
                    "level": 2,
                    "import": ["Boiling Blood", "Ragnarokkr"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Bak'al's Grasp",
                    "archetype": {
                        "name": "Fallen",
                        "min": 5
                    }
                },
                "Comet": {
                    "name": "Comet",
                    "level": 2,
                    "import": ["Ragnarokkr"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Fireworks",
                    "archetype": {
                        "name": "Fallen",
                        "min": 0
                    }
                },
                "Collide": {
                    "name": "Collide",
                    "level": 2,
                    "import": ["Precise Strikes", "Burning Heart"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Flying Kick",
                    "archetype": {
                        "name": "Battle Monk",
                        "min": 4
                    }
                },
                "Rejuvenating Skin": {
                    "name": "Rejuvenating Skin",
                    "level": 4,
                    "import": ["Burning Heart", "Stronger Bash"],
                    "export": ["Mythril Skin"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Paladin",
                        "min": 5
                    }
                },
                "Uncontainable Corruption": {
                    "name": "Uncontainable Corruption",
                    "level": 1,
                    "import": ["Radiant Devotee", "Boiling Blood"],
                    "export": ["Radiant Devotee", "Armour Breaker", "Massive Bash"],
                    "cost": 1,
                    "lock": null,
                    "required": "Bak'al's Grasp",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Radiant Devotee": {
                    "name": "Radiant Devotee",
                    "level": 1,
                    "import": ["Uncontainable Corruption", "Whirlwind Strike"],
                    "export": ["Uncontainable Corruption", "Whirlwind Strike", "Armour Breaker", "Ambidextrous"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Battle Monk",
                        "min": 1
                    }
                },
                "Whirlwind Strike": {
                    "name": "Whirlwind Strike",
                    "level": 4,
                    "import": ["Radiant Devotee", "Precise Strikes"],
                    "export": ["Radiant Devotee", "Spirit of the Rabbit", "Ambidextrous"],
                    "cost": 2,
                    "lock": null,
                    "required": "Uppercut",
                    "archetype": {
                        "name": "Battle Monk",
                        "min": 5
                    }
                },
                "Mythril Skin": {
                    "name": "Mythril Skin",
                    "level": 2,
                    "import": ["Rejuvenating Skin"],
                    "export": ["Shield Strike", "Sparkling Hope"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Paladin",
                        "min": 6
                    }
                },
                "Armour Breaker": {
                    "name": "Armour Breaker",
                    "level": 3,
                    "import": ["Uncontainable Corruption", "Radiant Devotee"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Bak'al's Grasp",
                    "archetype": {
                        "name": "Fallen",
                        "min": 0
                    }
                },
                "Ambidextrous": {
                    "name": "Ambidextrous",
                    "level": 1,
                    "import": ["Radiant Devotee", "Whirlwind Strike"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Counter",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Shield Strike": {
                    "name": "Shield Strike",
                    "level": 2,
                    "import": ["Sparkling Hope", "Mythril Skin"],
                    "export": ["Sparkling Hope", "Cheaper Bash II"],
                    "cost": 2,
                    "lock": null,
                    "required": "Mantle of the Bovemists",
                    "archetype": {
                        "name": "Paladin",
                        "min": 0
                    }
                },
                "Sparkling Hope": {
                    "name": "Sparkling Hope",
                    "level": 3,
                    "import": ["Shield Strike", "Mythril Skin"],
                    "export": ["Shield Strike", "Cheaper Bash II"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Paladin",
                        "min": 0
                    }
                },
                "Massive Bash": {
                    "name": "Massive Bash",
                    "level": 3,
                    "import": ["Tempest", "Uncontainable Corruption"],
                    "export": ["Tempest", "Massacre", "Cheaper War Scream"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Fallen",
                        "min": 7
                    }
                },
                "Tempest": {
                    "name": "Tempest",
                    "level": 2,
                    "import": ["Massive Bash", "Spirit of the Rabbit"],
                    "export": ["Massive Bash", "Spirit of the Rabbit", "Massacre", "Axe Kick"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Battle Monk",
                        "min": 0
                    }
                },
                "Spirit of the Rabbit": {
                    "name": "Spirit of the Rabbit",
                    "level": 1,
                    "import": ["Tempest", "Whirlwind Strike"],
                    "export": ["Tempest", "Axe Kick", "Radiance", "Cyclone"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Battle Monk",
                        "min": 5
                    }
                },
                "Massacre": {
                    "name": "Massacre",
                    "level": 2,
                    "import": ["Massive Bash", "Tempest"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Fallen",
                        "min": 5
                    }
                },
                "Axe Kick": {
                    "name": "Axe Kick",
                    "level": 1,
                    "import": ["Tempest", "Spirit of the Rabbit"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Radiance": {
                    "name": "Radiance",
                    "level": 3,
                    "import": ["Cheaper Bash II", "Spirit of the Rabbit"],
                    "export": ["Cheaper Bash II"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Paladin",
                        "min": 3
                    }
                },
                "Cheaper Bash II": {
                    "name": "Cheaper Bash II",
                    "display": "Cheaper Bash",
                    "level": 1,
                    "import": ["Radiance", "Shield Strike", "Sparkling Hope"],
                    "export": ["Radiance", "Second Chance"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Cheaper War Scream": {
                    "name": "Cheaper War Scream",
                    "level": 1,
                    "import": ["Massive Bash"],
                    "export": ["Blood Pact"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Discombobulate": {
                    "name": "Discombobulate",
                    "level": 4,
                    "import": ["Cyclone"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Battle Monk",
                        "min": 11
                    }
                },
                "Cyclone": {
                    "name": "Cyclone",
                    "level": 2,
                    "import": ["Spirit of the Rabbit"],
                    "export": ["Discombobulate", "Thunderclap"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Battle Monk",
                        "min": 0
                    }
                },
                "Thunderclap": {
                    "name": "Thunderclap",
                    "level": 2,
                    "import": ["Cyclone"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Bash",
                    "archetype": {
                        "name": "Battle Monk",
                        "min": 8
                    }
                },
                "Second Chance": {
                    "name": "Second Chance",
                    "level": 4,
                    "import": ["Cheaper Bash II"],
                    "export": ["Cheaper Uppercut II", "Martyr"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Paladin",
                        "min": 12
                    }
                },
                "Blood Pact": {
                    "name": "Blood Pact",
                    "level": 4,
                    "import": ["Cheaper War Scream"],
                    "export": ["Haemorrhage", "Brink of Madness"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Fallen",
                        "min": 10
                    }
                },
                "Haemorrhage": {
                    "name": "Haemorrhage",
                    "level": 2,
                    "import": ["Blood Pact"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Blood Pact",
                    "archetype": {
                        "name": "Fallen",
                        "min": 0
                    }
                },
                "Brink of Madness": {
                    "name": "Brink of Madness",
                    "level": 3,
                    "import": ["Cheaper Uppercut II", "Blood Pact"],
                    "export": ["Cheaper Uppercut II"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Cheaper Uppercut II": {
                    "name": "Cheaper Uppercut II",
                    "display": "Cheaper Uppercut",
                    "level": 1,
                    "import": ["Brink of Madness", "Second Chance"],
                    "export": ["Brink of Madness"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Martyr": {
                    "name": "Martyr",
                    "level": 2,
                    "import": ["Second Chance"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Paladin",
                        "min": 0
                    }
                }
            }
        },
        "archer": {
            "branch":{},
            "button": {
                "Arrow Bomb": {
                    "name": "Arrow Bomb",
                    "level": 0,
                    "combo": "LRR",
                    "import": null,
                    "export": ["Bow Proficiency I"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Bow Proficiency I": {
                    "name": "Bow Proficiency I",
                    "level": 1,
                    "import": ["Arrow Bomb"],
                    "export": ["Cheaper Arrow Bomb", "Heart Shatter"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Cheaper Arrow Bomb": {
                    "name": "Cheaper Arrow Bomb",
                    "level": 1,
                    "import": ["Bow Proficiency I"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Heart Shatter": {
                    "name": "Heart Shatter",
                    "level": 2,
                    "import": ["Bow Proficiency I"],
                    "export": ["Escape"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Escape": {
                    "name": "Escape",
                    "level": 0,
                    "combo": "LLL",
                    "import": ["Heart Shatter"],
                    "export": ["Double Shots", "Power Shots"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Double Shots": {
                    "name": "Double Shots",
                    "level": 1,
                    "import": ["Escape"],
                    "export": ["Arrow Storm"],
                    "cost": 1,
                    "lock": ["Power Shots"],
                    "required": null,
                    "archetype": {
                        "name": "Boltslinger",
                        "min": 0
                    }
                },
                "Power Shots": {
                    "name": "Power Shots",
                    "level": 1,
                    "import": ["Escape"],
                    "export": ["Arrow Shield"],
                    "cost": 1,
                    "lock": ["Double Shots"],
                    "required": null,
                    "archetype": {
                        "name": "Sharpshooter",
                        "min": 0
                    }
                },
                "Arrow Storm": {
                    "name": "Arrow Storm",
                    "level": 0,
                    "combo": "LRL",
                    "import": ["Double Shots", "Cheaper Escape"],
                    "export": ["Cheaper Escape", "Windy Feet", "Air Mastery", "Thunder Mastery"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Arrow Shield": {
                    "name": "Arrow Shield",
                    "level": 0,
                    "combo": "LLR",
                    "import": ["Power Shots", "Cheaper Escape"],
                    "export": ["Cheaper Escape", "Fire Mastery", "Earth Mastery"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Cheaper Escape": {
                    "name": "Cheaper Escape",
                    "level": 1,
                    "import": ["Arrow Storm", "Arrow Shield"],
                    "export": ["Arrow Storm", "Arrow Shield", "Water Mastery", "Thunder Mastery", "Fire Mastery"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Windy Feet": {
                    "name": "Windy Feet",
                    "level": 2,
                    "import": ["Arrow Storm"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Air Mastery": {
                    "name": "Air Mastery",
                    "level": 1,
                    "import": ["Arrow Storm"],
                    "export": ["Arrow Rain"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Boltslinger",
                        "min": 0
                    }
                },
                "Thunder Mastery": {
                    "name": "Thunder Mastery",
                    "level": 1,
                    "import": ["Arrow Storm", "Cheaper Escape", "Fire Mastery"],
                    "export": ["Fire Mastery", "Water Mastery", "Nimble String"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Boltslinger",
                        "min": 0
                    }
                },
                "Fire Mastery": {
                    "name": "Fire Mastery",
                    "level": 1,
                    "import": ["Arrow Shield", "Cheaper Escape", "Thunder Mastery"],
                    "export": ["Thunder Mastery", "Water Mastery", "Fire Creep"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Sharpshooter",
                        "min": 0
                    }
                },
                "Earth Mastery": {
                    "name": "Earth Mastery",
                    "level": 1,
                    "import": ["Arrow Shield"],
                    "export": ["Bryophyte Roots"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Trapper",
                        "min": 0
                    }
                },
                "Water Mastery": {
                    "name": "Water Mastery",
                    "level": 1,
                    "import": ["Cheaper Escape", "Thunder Mastery", "Fire Mastery"],
                    "export": ["Phantom Ray"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Sharpshooter",
                        "min": 0
                    }
                },
                "Phantom Ray": {
                    "name": "Phantom Ray",
                    "level": 3,
                    "import": ["Water Mastery", "Fire Creep"],
                    "export": ["Fire Creep", "Focus"],
                    "cost": 2,
                    "lock": ["Windstorm", "Nimble String", "Arrow Hurricane"],
                    "required": "Arrow Storm",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Fire Creep": {
                    "name": "Fire Creep",
                    "level": 2,
                    "import": ["Phantom Ray", "Bryophyte Roots", "Fire Mastery"],
                    "export": ["Phantom Ray", "Bryophyte Roots"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Bryophyte Roots": {
                    "name": "Bryophyte Roots",
                    "level": 2,
                    "import": ["Earth Mastery", "Fire Creep"],
                    "export": ["Basaltic Trap", "Fire Creep"],
                    "cost": 2,
                    "lock": null,
                    "required": "Arrow Storm",
                    "archetype": {
                        "name": "Trapper",
                        "min": 1
                    }
                },
                "Arrow Rain": {
                    "name": "Arrow Rain",
                    "level": 2,
                    "import": ["Air Mastery", "Nimble String"],
                    "export": ["Triple Shots", "Nimble String"],
                    "cost": 2,
                    "lock": null,
                    "required": "Arrow Shield",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Nimble String": {
                    "name": "Nimble String",
                    "level": 2,
                    "import": ["Thunder Mastery", "Arrow Rain"],
                    "export": ["Frenzy", "Arrow Rain"],
                    "cost": 2,
                    "lock": ["Phantom Ray"],
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Triple Shots": {
                    "name": "Triple Shots",
                    "level": 1,
                    "import": ["Arrow Rain", "Frenzy"],
                    "export": ["Guardian Angels", "Frenzy"],
                    "cost": 1,
                    "lock": null,
                    "required": "Double Shots",
                    "archetype": {
                        "name": "Boltslinger",
                        "min": 0
                    }
                },
                "Frenzy": {
                    "name": "Frenzy",
                    "level": 2,
                    "import": ["Nimble String", "Triple Shots"],
                    "export": ["Guardian Angels", "Triple Shots"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Boltslinger",
                        "min": 0
                    }
                },
                "Guardian Angels": {
                    "name": "Guardian Angels",
                    "level": 4,
                    "import": ["Triple Shots", "Frenzy"],
                    "export": ["Windstorm"],
                    "cost": 2,
                    "lock": null,
                    "required": "Arrow Shield",
                    "archetype": {
                        "name": "Boltslinger",
                        "min": 3
                    }
                },
                "Focus": {
                    "name": "Focus",
                    "level": 4,
                    "import": ["Phantom Ray"],
                    "export": ["Cheaper Arrow Storm", "Grappling Hook"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Sharpshooter",
                        "min": 2
                    }
                },
                "Basaltic Trap": {
                    "name": "Basaltic Trap",
                    "level": 4,
                    "import": ["Bryophyte Roots"],
                    "export": ["More Shields"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Trapper",
                        "min": 2
                    }
                },
                "Windstorm": {
                    "name": "Windstorm",
                    "level": 2,
                    "import": ["Guardian Angels", "Cheaper Arrow Storm"],
                    "export": ["Refined Gunpowder", "Stormy Feet", "Cheaper Arrow Storm"],
                    "cost": 2,
                    "lock": ["Phantom Ray"],
                    "required": "Arrow Storm",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Cheaper Arrow Storm": {
                    "name": "Cheaper Arrow Storm",
                    "level": 1,
                    "import": ["Windstorm", "Grappling Hook", "Focus"],
                    "export": ["Windstorm", "Grappling Hook", "More Focus"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Grappling Hook": {
                    "name": "Grappling Hook",
                    "level": 3,
                    "import": ["Cheaper Arrow Storm", "Focus", "More Shields"],
                    "export": ["Cheaper Arrow Storm", "More Shields", "More Focus", "Implosion"],
                    "cost": 2,
                    "lock": ["Escape Artist"],
                    "required": null,
                    "archetype": {
                        "name": "Trapper",
                        "min": 0
                    }
                },
                "More Shields": {
                    "name": "More Shields",
                    "level": 1,
                    "import": ["Grappling Hook", "Basaltic Trap"],
                    "export": ["Grappling Hook", "Implosion", "Patient Hunter", "Bouncing Bomb"],
                    "cost": 1,
                    "lock": null,
                    "required": "Arrow Shield",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "More Focus": {
                    "name": "More Focus",
                    "level": 1,
                    "import": ["Cheaper Arrow Storm", "Grappling Hook"],
                    "export": ["Twain's Arc"],
                    "cost": 1,
                    "lock": null,
                    "required": "Focus",
                    "archetype": {
                        "name": "Sharpshooter",
                        "min": 0
                    }
                },
                "Implosion": {
                    "name": "Implosion",
                    "level": 2,
                    "import": ["Grappling Hook", "More Shields"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Trapper",
                        "min": 0
                    }
                },
                "Patient Hunter": {
                    "name": "Patient Hunter",
                    "level": 2,
                    "import": ["More Shields"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Basaltic Trap",
                    "archetype": {
                        "name": "Trapper",
                        "min": 0
                    }
                },
                "Stormy Feet": {
                    "name": "Stormy Feet",
                    "level": 1,
                    "import": ["Windstorm"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Windy Feet",
                    "archetype": {
                        "name": "Boltslinger",
                        "min": 0
                    }
                },
                "Refined Gunpowder": {
                    "name": "Refined Gunpowder",
                    "level": 1,
                    "import": ["Traveler", "Windstorm"],
                    "export": ["Traveler", "Leap", "Fierce Stomp"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Traveler": {
                    "name": "Traveler",
                    "level": 1,
                    "import": ["Twain's Arc", "Refined Gunpowder"],
                    "export": ["Twain's Arc", "Refined Gunpowder", "Fierce Stomp"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Twain's Arc": {
                    "name": "Twain's Arc",
                    "level": 3,
                    "import": ["More Focus"],
                    "export": ["Traveler", "Shocking Bomb", "Scorched Earth", "Bouncing Bomb"],
                    "cost": 2,
                    "lock": null,
                    "required": "Focus",
                    "archetype": {
                        "name": "Sharpshooter",
                        "min": 4
                    }
                },
                "Bouncing Bomb": {
                    "name": "Bouncing Bomb",
                    "level": 3,
                    "import": ["More Shields", "Twain's Arc"],
                    "export": ["Twain's Arc", "More Traps", "Scorched Earth", "Better Arrow Shield"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Trapper",
                        "min": 3
                    }
                },
                "Fierce Stomp": {
                    "name": "Fierce Stomp",
                    "level": 2,
                    "import": ["Refined Gunpowder", "Traveler"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Boltslinger",
                        "min": 2
                    }
                },
                "Scorched Earth": {
                    "name": "Scorched Earth",
                    "level": 2,
                    "import": ["Twain's Arc", "Bouncing Bomb"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Fire Creep",
                    "archetype": {
                        "name": "Sharpshooter",
                        "min": 0
                    }
                },
                "More Traps": {
                    "name": "More Traps",
                    "level": 1,
                    "import": ["Bouncing Bomb"],
                    "export": ["Mana Trap"],
                    "cost": 1,
                    "lock": null,
                    "required": "Basaltic Trap",
                    "archetype": {
                        "name": "Trapper",
                        "min": 0
                    }
                },
                "Leap": {
                    "name": "Leap",
                    "level": 2,
                    "import": ["Homing Shots", "Refined Gunpowder"],
                    "export": ["Homing Shots", "Better Leap", "Better Guardian Angels"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Boltslinger",
                        "min": 5
                    }
                },
                "Shocking Bomb": {
                    "name": "Shocking Bomb",
                    "level": 2,
                    "import": ["Better Arrow Shield" , "Homing Shots", "Twain's Arc"],
                    "export": ["Better Arrow Shield" , "Homing Shots", "Initiator"],
                    "cost": 2,
                    "lock": null,
                    "required": "Arrow Bomb",
                    "archetype": {
                        "name": "Sharpshooter",
                        "min": 5
                    }
                },
                "Mana Trap": {
                    "name": "Mana Trap",
                    "level": 4,
                    "import": ["Better Arrow Shield", "More Traps"],
                    "export": ["Better Arrow Shield", "Cheaper Arrow Storm II"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Trapper",
                        "min": 5
                    }
                },
                "Better Arrow Shield": {
                    "name": "Better Arrow Shield",
                    "level": 1,
                    "import": ["Shocking Bomb", "Mana Trap", "Twain's Arc", "Bouncing Bomb"],
                    "export": ["Shocking Bomb", "Mana Trap", "Initiator"],
                    "cost": 1,
                    "lock": null,
                    "required": "Arrow Shield",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Homing Shots": {
                    "name": "Homing Shots",
                    "level": 3,
                    "import": ["Leap", "Shocking Bomb"],
                    "export": ["Leap", "Shocking Bomb", "Better Leap", "Escape Artist"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Sharpshooter",
                        "min": 2
                    }
                },
                "Better Leap": {
                    "name": "Better Leap",
                    "level": 1,
                    "import": ["Leap", "Homing Shots"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Leap",
                    "archetype": {
                        "name": "Boltslinger",
                        "min": 0
                    }
                },
                "Better Guardian Angels": {
                    "name": "Better Guardian Angels",
                    "level": 1,
                    "import": ["Leap", "Escape Artist"],
                    "export": ["Arrow Hurricane", "Escape Artist"],
                    "cost": 1,
                    "lock": null,
                    "required": "Guardian Angels",
                    "archetype": {
                        "name": "Boltslinger",
                        "min": 0
                    }
                },
                "Escape Artist": {
                    "name": "Escape Artist",
                    "level": 2,
                    "import": ["Homing Shots", "Better Guardian Angels"],
                    "export": ["Precise Shot", "Better Guardian Angels"],
                    "cost": 2,
                    "lock": ["Grappling Hook"],
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Initiator": {
                    "name": "Initiator",
                    "level": 3,
                    "import": ["Shocking Bomb", "Better Arrow Shield", "Cheaper Arrow Storm II"],
                    "export": ["Cheaper Arrow Shield", "Cheaper Arrow Storm II", "Call of the Hound", "Rocket Jump"],
                    "cost": 2,
                    "lock": null,
                    "required": "Focus",
                    "archetype": {
                        "name": "Sharpshooter",
                        "min": 5
                    }
                },
                "Cheaper Arrow Storm II": {
                    "name": "Cheaper Arrow Storm II",
                    "display": "Cheaper Arrow Storm",
                    "level": 1,
                    "import": ["Initiator", "Mana Trap"],
                    "export": ["Initiator", "Call of the Hound", "Rocket Jump"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Arrow Hurricane": {
                    "name": "Arrow Hurricane",
                    "level": 4,
                    "import": ["Precise Shot", "Better Guardian Angels"],
                    "export": ["Precise Shot", "Shrapnel Bomb"],
                    "cost": 2,
                    "lock": ["Phantom Ray"],
                    "required": null,
                    "archetype": {
                        "name": "Boltslinger",
                        "min": 8
                    }
                },
                "Precise Shot": {
                    "name": "Precise Shot",
                    "level": 1,
                    "import": ["Arrow Hurricane", "Cheaper Arrow Shield", "Escape Artist"],
                    "export": ["Arrow Hurricane", "Cheaper Arrow Shield", "Shrapnel Bomb"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Sharpshooter",
                        "min": 0
                    }
                },
                "Cheaper Arrow Shield": {
                    "name": "Cheaper Arrow Shield",
                    "level": 1,
                    "import": ["Precise Shot", "Initiator"],
                    "export": ["Precise Shot", "Decimator", "Crepuscular Ray"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Rocket Jump": {
                    "name": "Rocket Jump",
                    "level": 1,
                    "import": ["Initiator", "Cheaper Arrow Storm II"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Arrow Bomb",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Call of the Hound": {
                    "name": "Call of the Hound",
                    "level": 3,
                    "import": ["Initiator", "Cheaper Arrow Storm II"],
                    "export": ["Cheaper Escape II"],
                    "cost": 2,
                    "lock": null,
                    "required": "Arrow Shield",
                    "archetype": {
                        "name": "Trapper",
                        "min": 0
                    }
                },
                "Shrapnel Bomb": {
                    "name": "Shrapnel Bomb",
                    "level": 2,
                    "import": ["Arrow Hurricane", "Precise Shot"],
                    "export": ["Geyser Stomp"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Boltslinger",
                        "min": 8
                    }
                },
                "Decimator": {
                    "name": "Decimator",
                    "level": 2,
                    "import": ["Cheaper Arrow Shield", "Cheaper Escape II"],
                    "export": ["Cheaper Escape II"],
                    "cost": 2,
                    "lock": null,
                    "required": "Phantom Ray",
                    "archetype": {
                        "name": "Sharpshooter",
                        "min": 0
                    }
                },
                "Cheaper Escape II": {
                    "name": "Cheaper Escape II",
                    "display": "Cheaper Escape",
                    "level": 1,
                    "import": ["Decimator", "Call of the Hound"],
                    "export": ["Decimator", "Stronger Hook", "Tangled Traps"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Stronger Hook": {
                    "name": "Stronger Hook",
                    "level": 1,
                    "import": ["Cheaper Escape II"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Grappling Hook",
                    "archetype": {
                        "name": "Trapper",
                        "min": 5
                    }
                },
                "Tangled Traps": {
                    "name": "Tangled Traps",
                    "level": 2,
                    "import": ["Cheaper Escape II"],
                    "export": ["Stronger Patient Hunter", "Minefield"],
                    "cost": 2,
                    "lock": null,
                    "required": "Basaltic Trap",
                    "archetype": {
                        "name": "Trapper",
                        "min": 0
                    }
                },
                "Stronger Patient Hunter": {
                    "name": "Stronger Patient Hunter",
                    "level": 1,
                    "import": ["Tangled Traps"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Patient Hunter",
                    "archetype": {
                        "name": "Trapper",
                        "min": 0
                    }
                },
                "Minefield": {
                    "name": "Minefield",
                    "level": 4,
                    "import": ["Tangled Traps", "Cheaper Arrow Bomb II"],
                    "export": ["Grape Bomb", "Cheaper Arrow Bomb II"],
                    "cost": 2,
                    "lock": null,
                    "required": "Basaltic Trap",
                    "archetype": {
                        "name": "Trapper",
                        "min": 10
                    }
                },
                "Grape Bomb": {
                    "name": "Grape Bomb",
                    "level": 3,
                    "import": ["Minefield", "More Focus II"],
                    "export": ["More Focus II"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Geyser Stomp": {
                    "name": "Geyser Stomp",
                    "level": 2,
                    "import": ["Shrapnel Bomb"],
                    "export": ["Elusive", "Snow Storm"],
                    "cost": 2,
                    "lock": null,
                    "required": "Fierce Stomp",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Elusive": {
                    "name": "Elusive",
                    "level": 2,
                    "import": ["Geyser Stomp"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Boltslinger",
                        "min": 0
                    }
                },
                "Snow Storm": {
                    "name": "Snow Storm",
                    "level": 3,
                    "import": ["Geyser Stomp", "Cheaper Arrow Bomb II"],
                    "export": ["Cheaper Arrow Bomb II", "All-Seeing Panoptes"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "All-Seeing Panoptes": {
                    "name": "All-Seeing Panoptes",
                    "level": 4,
                    "import": ["Snow Storm"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Guardian Angels",
                    "archetype": {
                        "name": "Boltslinger",
                        "min": 11
                    }
                },
                "Crepuscular Ray": {
                    "name": "Crepuscular Ray",
                    "level": 4,
                    "import": ["Cheaper Arrow Shield"],
                    "export": ["Cheaper Arrow Bomb II"],
                    "cost": 2,
                    "lock": null,
                    "required": "Arrow Storm",
                    "archetype": {
                        "name": "Sharpshooter",
                        "min": 10
                    }
                },
                "More Focus II": {
                    "name": "More Focus II",
                    "display": "More Focus",
                    "level": 1,
                    "import": ["Cheaper Arrow Bomb II", "Grape Bomb"],
                    "export": ["Grape Bomb"],
                    "cost": 1,
                    "lock": null,
                    "required": "Focus",
                    "archetype": {
                        "name": "Sharpshooter",
                        "min": 0
                    }
                },
                "Cheaper Arrow Bomb II": {
                    "name": "Cheaper Arrow Bomb II",
                    "display": "Cheaper Arrow Bomb",
                    "level": 1,
                    "import": ["Crepuscular Ray", "Snow Storm", "Minefield"],
                    "export": ["More Focus II", "Snow Storm", "Minefield"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                }
            }
        },
        "mage": {
            "branch": {},
            "button": {
                "Meteor": {
                    "name": "Meteor",
                    "level": 0,
                    "combo": "RLL",
                    "import": null,
                    "export": ["Wand Proficiency I"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Wand Proficiency I": {
                    "name": "Wand Proficiency I",
                    "level": 1,
                    "import": ["Meteor"],
                    "export": ["Cheaper Meteor", "Shooting Star"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Cheaper Meteor": {
                    "name": "Cheaper Meteor",
                    "level": 1,
                    "import": ["Wand Proficiency I"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Shooting Star": {
                    "name": "Shooting Star",
                    "level": 2,
                    "import": ["Wand Proficiency I"],
                    "export": ["Teleport"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Teleport": {
                    "name": "Teleport",
                    "level": 1,
                    "import": ["Shooting Star"],
                    "export": ["Wand Proficiency II", "Wisdom"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Wand Proficiency II": {
                    "name": "Wand Proficiency II",
                    "level": 1,
                    "import": ["Teleport"],
                    "export": ["Heal"],
                    "cost": 1,
                    "lock": ["Wisdom"],
                    "required": null,
                    "archetype": {
                        "name": "Riftwalker",
                        "min": 0
                    }
                },
                "Wisdom": {
                    "name": "Wisdom",
                    "level": 1,
                    "import": ["Teleport"],
                    "export": ["Ice Snake"],
                    "cost": 1,
                    "lock": ["Wand Proficiency II"],
                    "required": null,
                    "archetype": {
                        "name": "Arcanist",
                        "min": 0
                    }
                },
                "Heal": {
                    "name": "Heal",
                    "level": 0,
                    "combo": "RLR",
                    "import": ["Wand Proficiency II", "Cheaper Teleport"],
                    "export": ["Cheaper Teleport", "Air Mastery", "Thunder Mastery"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Cheaper Teleport": {
                    "name": "Cheaper Teleport",
                    "level": 1,
                    "import": ["Heal", "Ice Snake"],
                    "export": ["Heal", "Ice Snake", "Thunder Mastery", "Water Mastery"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Ice Snake": {
                    "name": "Ice Snake",
                    "level": 0,
                    "combo": "RRL",
                    "import": ["Cheaper Teleport", "Wisdom"],
                    "export": ["Cheaper Teleport", "Fire Mastery", "Earth Mastery"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Air Mastery": {
                    "name": "Air Mastery",
                    "level": 1,
                    "import": ["Heal"],
                    "export": ["Wind Slash"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Riftwalker",
                        "min": 0
                    }
                },
                "Thunder Mastery": {
                    "name": "Thunder Mastery",
                    "level": 1,
                    "import": ["Heal", "Cheaper Teleport"],
                    "export": ["Thunderstorm", "Water Mastery"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Riftwalker",
                        "min": 0
                    }
                },
                "Fire Mastery": {
                    "name": "Fire Mastery",
                    "level": 1,
                    "import": ["Ice Snake"],
                    "export": ["Burning Sigil"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Arcanist",
                        "min": 0
                    }
                },
                "Earth Mastery": {
                    "name": "Earth Mastery",
                    "level": 1,
                    "import": ["Ice Snake"],
                    "export": ["Burning Sigil"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Arcanist",
                        "min": 0
                    }
                },
                "Water Mastery": {
                    "name": "Water Mastery",
                    "level": 1,
                    "import": ["Cheaper Teleport", "Thunder Mastery"],
                    "export": ["Sunshower"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Light Bender",
                        "min": 0
                    }
                },
                "Wind Slash": {
                    "name": "Wind Slash",
                    "level": 2,
                    "import": ["Air Mastery", "Thunderstorm"],
                    "export": ["Windsweeper", "Thunderstorm"],
                    "cost": 2,
                    "lock": null,
                    "required": "Teleport",
                    "archetype": {
                        "name": "Riftwalker",
                        "min": 0
                    }
                },
                "Thunderstorm": {
                    "name": "Thunderstorm",
                    "level": 2,
                    "import": ["Wind Slash", "Thunder Mastery"],
                    "export": ["Wind Slash", "Windsweeper"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Burning Sigil": {
                    "name": "Burning Sigil",
                    "level": 2,
                    "import": ["Fire Mastery", "Earth Mastery"],
                    "export": ["Stronger Meteor", "Arcane Transfer"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Stronger Meteor": {
                    "name": "Stronger Meteor",
                    "level": 1,
                    "import": ["Burning Sigil"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Meteor",
                    "archetype": {
                        "name": "Arcanist",
                        "min": 2
                    }
                },
                "Sunshower": {
                    "name": "Sunshower",
                    "level": 2,
                    "import": ["Water Mastery"],
                    "export": ["Ophanim"],
                    "cost": 2,
                    "lock": ["Arcane Transfer"],
                    "required": null,
                    "archetype": {
                        "name": "Light Bender",
                        "min": 0
                    }
                },
                "Windsweeper": {
                    "name": "Windsweeper",
                    "level": 4,
                    "import": ["Thunderstorm"],
                    "export": ["Cheaper Heal"],
                    "cost": 2,
                    "lock": null,
                    "required": "Ice Snake",
                    "archetype": {
                        "name": "Riftwalker",
                        "min": 3
                    }
                },
                "Ophanim": {
                    "name": "Ophanim",
                    "level": 4,
                    "import": ["Sunshower"],
                    "export": ["Purification"],
                    "cost": 2,
                    "lock": null,
                    "required": "Meteor",
                    "archetype": {
                        "name": "Light Bender",
                        "min": 2
                    }
                },
                "Arcane Transfer": {
                    "name": "Arcane Transfer",
                    "level": 4,
                    "import": ["Burning Sigil"],
                    "export": ["Sentient Snake"],
                    "cost": 2,
                    "lock": ["Sunshower", "Larger Heal", "Orphion's Pulse"],
                    "required": "Heal",
                    "archetype": {
                        "name": "Arcanist",
                        "min": 2
                    }
                },
                "Cheaper Heal": {
                    "name": "Cheaper Heal",
                    "level": 1,
                    "import": ["Purification", "Windsweeper"],
                    "export": ["Purification", "Eye Piercer", "Breathless"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Purification": {
                    "name": "Purification",
                    "level": 3,
                    "import": ["Cheaper Heal", "Sentient Snake", "Ophanim"],
                    "export": ["Cheaper Heal", "Sentient Snake", "Breathless", "Larger Heal", "Cheaper Teleport II"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Sentient Snake": {
                    "name": "Sentient Snake",
                    "level": 2,
                    "import": ["Purification", "Arcane Transfer"],
                    "export": ["Purification", "Larger Heal", "Larger Mana Bank", "Pyrokinesis"],
                    "cost": 2,
                    "lock": null,
                    "required": "Ice Snake",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Eye Piercer": {
                    "name": "Eye Piercer",
                    "level": 2,
                    "import": ["Cheaper Heal"],
                    "export": ["Cheaper Ice Snake"],
                    "cost": 2,
                    "lock": null,
                    "required": "Teleport",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Breathless": {
                    "name": "Breathless",
                    "level": 2,
                    "import": ["Cheaper Heal", "Purification"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Windsweeper",
                    "archetype": {
                        "name": "Riftwalker",
                        "min": 0
                    }
                },
                "Larger Heal": {
                    "name": "Larger Heal",
                    "level": 1,
                    "import": ["Purification", "Sentient Snake"],
                    "export": null,
                    "cost": 1,
                    "lock": ["Arcane Transfer"],
                    "required": "Heal",
                    "archetype": {
                        "name": "Light Bender",
                        "min": 0
                    }
                },
                "Larger Mana Bank": {
                    "name": "Larger Mana Bank",
                    "level": 1,
                    "import": ["Sentient Snake"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Arcane Transfer",
                    "archetype": {
                        "name": "Arcanist",
                        "min": 0
                    }
                },
                "Cheaper Ice Snake": {
                    "name": "Cheaper Ice Snake",
                    "level": 1,
                    "import": ["Fortitude", "Eye Piercer"],
                    "export": ["Fortitude", "Blink", "Transonic Warp"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Fortitude": {
                    "name": "Fortitude",
                    "level": 3,
                    "import": ["Cheaper Ice Snake", "Cheaper Teleport II"],
                    "export": ["Cheaper Ice Snake", "Cheaper Teleport II", "Blink", "Healthier Ophanim I"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Light Bender",
                        "min": 2
                    }
                },
                "Cheaper Teleport II": {
                    "name": "Cheaper Teleport II",
                    "display": "Cheaper Teleport",
                    "level": 1,
                    "import": ["Fortitude", "Purification"],
                    "export": ["Fortitude", "Healthier Ophanim I", "Snake Nest"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Pyrokinesis": {
                    "name": "Pyrokinesis",
                    "level": 3,
                    "import": ["Sentient Snake"],
                    "export": ["Seance"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Arcanist",
                        "min": 4
                    }
                },
                "Blink": {
                    "name": "Blink",
                    "level": 2,
                    "import": ["Cheaper Ice Snake", "Fortitude"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Teleport",
                    "archetype": {
                        "name": "Riftwalker",
                        "min": 0
                    }
                },
                "Healthier Ophanim I": {
                    "name": "Healthier Ophanim I",
                    "level": 1,
                    "import": ["Snake Nest", "Fortitude", "Cheaper Teleport II"],
                    "export": ["Snake Nest", "Fluid Healing", "Orphion's Pulse"],
                    "cost": 1,
                    "lock": null,
                    "required": "Ophanim",
                    "archetype": {
                        "name": "Light Bender",
                        "min": 0
                    }
                },
                "Snake Nest": {
                    "name": "Snake Nest",
                    "level": 2,
                    "import": ["Healthier Ophanim I", "Seance", "Cheaper Teleport II"],
                    "export": ["Healthier Ophanim I", "Seance", "Orphion's Pulse", "Arcane Restoration"],
                    "cost": 2,
                    "lock": null,
                    "required": "Ice Snake",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Seance": {
                    "name": "Seance",
                    "level": 1,
                    "import": ["Snake Nest", "Pyrokinesis"],
                    "export": ["Snake Nest", "Arcane Restoration", "Larger Mana Bank II"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Transonic Warp": {
                    "name": "Transonic Warp",
                    "level": 3,
                    "import": ["Fluid Healing", "Cheaper Ice Snake"],
                    "export": ["Fluid Healing", "Diffusion"],
                    "cost": 2,
                    "lock": null,
                    "required": "Windsweeper",
                    "archetype": {
                        "name": "Riftwalker",
                        "min": 5
                    }
                },
                "Fluid Healing": {
                    "name": "Fluid Healing",
                    "level": 2,
                    "import": ["Transonic Warp", "Healthier Ophanim I"],
                    "export": ["Transonic Warp", "Diffusion"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Light Bender",
                        "min": 0
                    }
                },
                "Orphion's Pulse": {
                    "name": "Orphion's Pulse",
                    "level": 2,
                    "import": ["Healthier Ophanim I", "Snake Nest"],
                    "export": ["Lightweaver"],
                    "cost": 2,
                    "lock": ["Arcane Transfer"],
                    "required": "Heal",
                    "archetype": {
                        "name": "Light Bender",
                        "min": 5
                    }
                },
                "Arcane Restoration": {
                    "name": "Arcane Restoration",
                    "level": 2,
                    "import": ["Snake Nest", "Seance"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Pyrokinesis",
                    "archetype": {
                        "name": "Arcanist",
                        "min": 0
                    }
                },
                "Diffusion": {
                    "name": "Diffusion",
                    "level": 4,
                    "import": ["Transonic Warp", "Fluid Healing"],
                    "export": ["More Winded", "Cheaper Ice Snake II"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Riftwalker",
                        "min": 6
                    }
                },
                "Lightweaver": {
                    "name": "Lightweaver",
                    "level": 4,
                    "import": ["Arcane Speed", "Orphion's Pulse"],
                    "export": ["Arcane Speed", "Cheaper Meteor II"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Light Bender",
                        "min": 7
                    }
                },
                "Arcane Speed": {
                    "name": "Arcane Speed",
                    "level": 2,
                    "import": ["Lightweaver", "Larger Mana Bank II"],
                    "export": ["Lightweaver", "Larger Mana Bank II", "Cheaper Meteor II", "Psychokinesis"],
                    "cost": 2,
                    "lock": null,
                    "required": "Heal",
                    "archetype": {
                        "name": "Arcanist",
                        "min": 0
                    }
                },
                "Larger Mana Bank II": {
                    "name": "Larger Mana Bank II",
                    "display": "Larger Mana Bank",
                    "level": 1,
                    "import": ["Arcane Speed", "Seance"],
                    "export": ["Arcane Speed", "Chaos Explosion", "Psychokinesis"],
                    "cost": 1,
                    "lock": null,
                    "required": "Arcane Transfer",
                    "archetype": {
                        "name": "Arcanist",
                        "min": 0
                    }
                },
                "More Winded": {
                    "name": "More Winded",
                    "level": 1,
                    "import": ["Diffusion"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Windsweeper",
                    "archetype": {
                        "name": "Riftwalker",
                        "min": 0
                    }
                },
                "Psychokinesis": {
                    "name": "Psychokinesis",
                    "level": 2,
                    "import": ["Arcane Speed", "Larger Mana Bank II"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Meteor",
                    "archetype": {
                        "name": "Arcanist",
                        "min": 5
                    }
                },
                "Cheaper Ice Snake II": {
                    "name": "Cheaper Ice Snake II",
                    "display": "Cheaper Ice Snake",
                    "level": 1,
                    "import": ["Explosive Entrance", "Diffusion"],
                    "export": ["Explosive Entrance", "Time Dilation", "Gust"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Explosive Entrance": {
                    "name": "Explosive Entrance",
                    "level": 2,
                    "import": ["Cheaper Ice Snake II", "Cheaper Meteor II"],
                    "export": ["Cheaper Ice Snake II", "Cheaper Meteor II", "Gust", "Better Ophanim"],
                    "cost": 2,
                    "lock": null,
                    "required": "Teleport",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Cheaper Meteor II": {
                    "name": "Cheaper Meteor II",
                    "display": "Cheaper Meteor",
                    "level": 1,
                    "import": ["Explosive Entrance", "Lightweaver", "Arcane Speed"],
                    "export": ["Explosive Entrance", "Better Ophanim"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Chaos Explosion": {
                    "name": "Chaos Explosion",
                    "level": 4,
                    "import": ["Larger Mana Bank II"],
                    "export": ["Arctic Snake"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Arcanist",
                        "min": 8
                    }
                },
                "Time Dilation": {
                    "name": "Time Dilation",
                    "level": 3,
                    "import": ["Cheaper Ice Snake II"],
                    "export": ["More Winded II"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Riftwalker",
                        "min": 5
                    }
                },
                "Gust": {
                    "name": "Gust",
                    "level": 2,
                    "import": ["Cheaper Ice Snake II", "Explosive Entrance"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Windsweeper",
                    "archetype": {
                        "name": "Riftwalker",
                        "min": 7
                    }
                },
                "Better Ophanim": {
                    "name": "Better Ophanim",
                    "level": 1,
                    "import": ["Explosive Entrance", "Cheaper Meteor II"],
                    "export": ["Healthier Ophanim II"],
                    "cost": 1,
                    "lock": null,
                    "required": "Ophanim",
                    "archetype": {
                        "name": "Light Bender",
                        "min": 0
                    }
                },
                "Arctic Snake": {
                    "name": "Arctic Snake",
                    "level": 2,
                    "import": ["Chaos Explosion"],
                    "export": ["Arcane Power", "Larger Mana Bank III"],
                    "cost": 2,
                    "lock": null,
                    "required": "Ice Snake",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Arcane Power": {
                    "name": "Arcane Power",
                    "level": 1,
                    "import": ["Arctic Snake"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Arcane Power",
                    "archetype": {
                        "name": "Arcanist",
                        "min": 0
                    }
                },
                "More Winded II": {
                    "name": "More Winded II",
                    "display": "More Winded",
                    "level": 1,
                    "import": ["Dynamic Faith", "Time Dilation"],
                    "export": ["Dynamic Faith", "Devitalize", "Timelock"],
                    "cost": 1,
                    "lock": null,
                    "required": "Windsweeper",
                    "archetype": {
                        "name": "Riftwalker",
                        "min": 0
                    }
                },
                "Dynamic Faith": {
                    "name": "Dynamic Faith",
                    "level": 1,
                    "import": ["More Winded II", "Healthier Ophanim II"],
                    "export": ["More Winded II", "Healthier Ophanim II", "Devitalize", "Divination"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Healthier Ophanim II": {
                    "name": "Healthier Ophanim II",
                    "level": 1,
                    "import": ["Dynamic Faith", "Better Ophanim"],
                    "export": ["Dynamic Faith", "Divination", "Sunflare"],
                    "cost": 1,
                    "lock": null,
                    "required": "Healthier Ophanim I",
                    "archetype": {
                        "name": "Light Bender",
                        "min": 0
                    }
                },
                "Larger Mana Bank III": {
                    "name": "Larger Mana Bank III",
                    "display": "Larger Mana Bank",
                    "level": 1,
                    "import": ["Arctic Snake"],
                    "export": ["Arcane Overflow"],
                    "cost": 1,
                    "lock": null,
                    "required": "Arcane Transfer",
                    "archetype": {
                        "name": "Arcanist",
                        "min": 0
                    }
                },
                "Devitalize": {
                    "name": "Devitalize",
                    "level": 2,
                    "import": ["More Winded II", "Dynamic Faith"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Riftwalker",
                        "min": 5
                    }
                },
                "Divination": {
                    "name": "Divination",
                    "level": 3,
                    "import": ["Dynamic Faith", "Healthier Ophanim II"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Ophanim",
                    "archetype": {
                        "name": "Light Bender",
                        "min": 0
                    }
                },
                "Sunflare": {
                    "name": "Sunflare",
                    "level": 4,
                    "import": ["Healthier Ophanim II"],
                    "export": ["Arcane Overflow", "Manastorm", "Better Lightweaver"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Light Bender",
                        "min": 11
                    }
                },
                "Better Lightweaver": {
                    "name": "Better Lightweaver",
                    "level": 1,
                    "import": ["Sunflare"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Lightweaver",
                    "archetype": {
                        "name": "Light Bender",
                        "min": 0
                    }
                },
                "Arcane Overflow": {
                    "name": "Arcane Overflow",
                    "level": 4,
                    "import": ["Sunflare", "Larger Mana Bank III"],
                    "export": ["Manastorm", "Memory Recolletion"],
                    "cost": 2,
                    "lock": null,
                    "required": "Arcane Transfer",
                    "archetype": {
                        "name": "Arcanist",
                        "min": 12
                    }
                },
                "Timelock": {
                    "name": "Timelock",
                    "level": 4,
                    "import": ["More Winded II", "Cheaper Heal II"],
                    "export": ["Cheaper Heal II"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Riftwalker",
                        "min": 12
                    }
                },
                "Cheaper Heal II": {
                    "name": "Cheaper Heal II",
                    "display": "Cheaper Heal",
                    "level": 1,
                    "import": ["Timelock", "Manastorm"],
                    "export": ["Timelock", "Manastorm"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Manastorm": {
                    "name": "Manastorm",
                    "level": 2,
                    "import": ["Cheaper Heal II", "Sunflare", "Arcane Overflow"],
                    "export": ["Cheaper Heal II"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Arcanist",
                        "min": 4
                    }
                },
                "Memory Recolletion": {
                    "name": "Memory Recolletion",
                    "level": 1,
                    "import": ["Arcane Overflow"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Chaos Explosion",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                }
            }
        },
        "assassin": {
            "branch": {},
            "button": {
                "Spin Attack": {
                    "name": "Spin Attack",
                    "level": 0,
                    "combo": "RLR",
                    "import": null,
                    "export": ["Dagger Proficiency I"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Dagger Proficiency I": {
                    "name": "Dagger Proficiency I",
                    "level": 1,
                    "import": ["Spin Attack"],
                    "export": ["Cheaper Spin Attack", "Double Spin"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Cheaper Spin Attack": {
                    "name": "Cheaper Spin Attack",
                    "level": 1,
                    "import": ["Dagger Proficiency I"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Spin Attack",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Double Spin": {
                    "name": "Double Spin",
                    "level": 2,
                    "import": ["Dagger Proficiency I"],
                    "export": ["Dash"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Dash": {
                    "name": "Dash",
                    "combo": "RRR",
                    "level": 0,
                    "import": ["Double Spin"],
                    "export": ["Poisoned Blade", "Double Slice"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Poisoned Blade": {
                    "name": "Poisoned Blade",
                    "level": 1,
                    "import": ["Dash"],
                    "export": ["Smoke Bomb"],
                    "cost": 1,
                    "lock": ["Double Slice"],
                    "required": null,
                    "archetype": {
                        "name": "Shadestepper",
                        "min": 0
                    }
                },
                "Double Slice": {
                    "name": "Double Slice",
                    "level": 1,
                    "import": ["Dash"],
                    "export": ["Multihit"],
                    "cost": 1,
                    "lock": ["Poisoned Blade"],
                    "required": null,
                    "archetype": {
                        "name": "Acrobat",
                        "min": 0
                    }
                },
                "Smoke Bomb": {
                    "name": "Smoke Bomb",
                    "combo": "RRL",
                    "level": 0,
                    "import": ["Cheaper Dash", "Poisoned Blade"],
                    "export": ["Cheaper Dash", "Earth Mastery", "Thunder Mastery"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Cheaper Dash": {
                    "name": "Cheaper Dash",
                    "level": 1,
                    "import": ["Smoke Bomb", "Multihit"],
                    "export": ["Smoke Bomb", "Multihit", "Fire Mastery", "Water Mastery"],
                    "cost": 1,
                    "lock": null,
                    "required": "Dash",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Multihit": {
                    "name": "Multihit",
                    "combo": "RLL",
                    "level": 0,
                    "import": ["Cheaper Dash", "Double Slice"],
                    "export": ["Cheaper Dash", "Water Mastery", "Air Mastery"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Earth Mastery": {
                    "name": "Earth Mastery",
                    "level": 1,
                    "import": ["Thunder Mastery", "Smoke Bomb"],
                    "export": ["Thunder Mastery", "Backstab"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Shadestepper",
                        "min": 0
                    }
                },
                "Thunder Mastery": {
                    "name": "Thunder Mastery",
                    "level": 1,
                    "import": ["Earth Mastery", "Smoke Bomb"],
                    "export": ["Earth Mastery", "Backstab"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Shadestepper",
                        "min": 0
                    }
                },
                "Water Mastery": {
                    "name": "Water Mastery",
                    "level": 1,
                    "import": ["Air Mastery", "Multihit", "Cheaper Dash"],
                    "export": ["Air Mastery", "Fire Mastery", "Fatality"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Acrobat",
                        "min": 0
                    }
                },
                "Air Mastery": {
                    "name": "Air Mastery",
                    "level": 1,
                    "import": ["Water Mastery", "Multihit"],
                    "export": ["Water Mastery", "Fatality"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Acrobat",
                        "min": 0
                    }
                },
                "Fire Mastery": {
                    "name": "Fire Mastery",
                    "level": 1,
                    "import": ["Cheaper Dash", "Water Mastery"],
                    "export": ["Sticky Bomb"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Trickster",
                        "min": 0
                    }
                },
                "Backstab": {
                    "name": "Backstab",
                    "level": 2,
                    "import": ["Earth Mastery", "Thunder Mastery"],
                    "export": ["Vanish"],
                    "cost": 2,
                    "lock": ["Stronger Multihit", "Fatality"],
                    "required": "Multihit",
                    "archetype": {
                        "name": "Shadestepper",
                        "min": 2
                    }
                },
                "Fatality": {
                    "name": "Fatality",
                    "level": 2,
                    "import": ["Water Mastery", "Air Mastery"],
                    "export": ["Righting Reflex", "Lacerate"],
                    "cost": 2,
                    "lock": ["Backstab"],
                    "required": "Multihit",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Vanish": {
                    "name": "Vanish",
                    "level": 3,
                    "import": ["Sticky Bomb", "Backstab"],
                    "export": ["Sticky Bomb", "Surprise Strike"],
                    "cost": 2,
                    "lock": null,
                    "required": "Dash",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Sticky Bomb": {
                    "name": "Sticky Bomb",
                    "level": 2,
                    "import": ["Vanish", "Fire Mastery"],
                    "export": ["Vanish", "Mirror Image"],
                    "cost": 2,
                    "lock": null,
                    "required": "Smoke Bomb",
                    "archetype": {
                        "name": "Trickster",
                        "min": 0
                    }
                },
                "Righting Reflex": {
                    "name": "Righting Reflex",
                    "level": 2,
                    "import": ["Fatality"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Acrobat",
                        "min": 0
                    }
                },
                "Surprise Strike": {
                    "name": "Surprise Strike",
                    "level": 4,
                    "import": ["Vanish"],
                    "export": ["Silent Killer"],
                    "cost": 2,
                    "lock": null,
                    "required": "Vanish",
                    "archetype": {
                        "name": "Shadestepper",
                        "min": 3
                    }
                },
                "Mirror Image": {
                    "name": "Mirror Image",
                    "level": 4,
                    "import": ["Sticky Bomb"],
                    "export": ["Shenanigans"],
                    "cost": 2,
                    "lock": null,
                    "required": "Vanish",
                    "archetype": {
                        "name": "Trickster",
                        "min": 2
                    }
                },
                "Lacerate": {
                    "name": "Lacerate",
                    "level": 4,
                    "import": ["Fatality"],
                    "export": ["Wall of Smoke"],
                    "cost": 2,
                    "lock": ["Echo"],
                    "required": null,
                    "archetype": {
                        "name": "Acrobat",
                        "min": 2
                    }
                },
                "Silent Killer": {
                    "name": "Silent Killer",
                    "level": 3,
                    "import": ["Surprise Strike"],
                    "export": ["Better Smoke Bomb", "Shadow Travel"],
                    "cost": 2,
                    "lock": null,
                    "required": "Vanish",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Shenanigans": {
                    "name": "Shenanigans",
                    "level": 1,
                    "import": ["Mirror Image"],
                    "export": ["Cheaper Multihit"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Trickster",
                        "min": 0
                    }
                },
                "Wall of Smoke": {
                    "name": "Wall of Smoke",
                    "level": 2,
                    "import": ["Lacerate"],
                    "export": ["Dagger Proficiency II"],
                    "cost": 2,
                    "lock": null,
                    "required": "Smoke Bomb",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Better Smoke Bomb": {
                    "name": "Better Smoke Bomb",
                    "level": 1,
                    "import": ["Shadow Travel", "Silent Killer"],
                    "export": ["Shadow Travel", "Cheaper Smoke Bomb"],
                    "cost": 1,
                    "lock": null,
                    "required": "Smoke Bomb",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Shadow Travel": {
                    "name": "Shadow Travel",
                    "level": 2,
                    "import": ["Cheaper Multihit", "Better Smoke Bomb", "Silent Killer"],
                    "export": ["Cheaper Multihit", "Better Smoke Bomb", "Blazing Powder", "Last Laugh"],
                    "cost": 2,
                    "lock": null,
                    "required": "Vanish",
                    "archetype": {
                        "name": "Shadestepper",
                        "min": 0
                    }
                },
                "Cheaper Multihit": {
                    "name": "Cheaper Multihit",
                    "level": 1,
                    "import": ["Shadow Travel", "Dagger Proficiency II", "Shenanigans"],
                    "export": ["Shadow Travel", "Dagger Proficiency II", "Blazing Powder", "Last Laugh", "Weightless"],
                    "cost": 1,
                    "lock": null,
                    "required": "Multihit",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Dagger Proficiency II": {
                    "name": "Dagger Proficiency II",
                    "level": 1,
                    "import": ["Cheaper Multihit", "Wall of Smoke"],
                    "export": ["Cheaper Multihit", "Weightless"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Last Laugh": {
                    "name": "Last Laugh",
                    "level": 2,
                    "import": ["Shadow Travel", "Cheaper Multihit"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Mirror Image",
                    "archetype": {
                        "name": "Trickster",
                        "min": 3
                    }
                },
                "Cheaper Smoke Bomb": {
                    "name": "Cheaper Smoke Bomb",
                    "level": 1,
                    "import": ["Blazing Powder", "Better Smoke Bomb"],
                    "export": ["Blazing Powder", "Black Hole", "Violent Vortex"],
                    "cost": 1,
                    "lock": null,
                    "required": "Smoke Bomb",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Blazing Powder": {
                    "name": "Blazing Powder",
                    "level": 2,
                    "import": ["Cheaper Smoke Bomb", "Shadow Travel", "Cheaper Multihit"],
                    "export": ["Cheaper Smoke Bomb", "Black Hole", "Sandbagging"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Weightless": {
                    "name": "Weightless",
                    "level": 3,
                    "import": ["Cheaper Multihit", "Dagger Proficiency II"],
                    "export": ["Hop", "Dancing Blade"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Acrobat",
                        "min": 3
                    }
                },
                "Black Hole": {
                    "name": "Black Hole",
                    "level": 2,
                    "import": ["Cheaper Smoke Bomb", "Blazing Powder"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Sandbagging": {
                    "name": "Sandbagging",
                    "level": 2,
                    "import": ["Hop", "Blazing Powder"],
                    "export": ["Hop", "Delirious Gas", "Echo", "Stronger Multihit"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Trickster",
                        "min": 0
                    }
                },
                "Stronger Multihit": {
                    "name": "Stronger Multihit",
                    "level": 1,
                    "import": ["Sandbagging", "Hop"],
                    "export": null,
                    "cost": 1,
                    "lock": ["Backstab"],
                    "required": "Multihit",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Hop": {
                    "name": "Hop",
                    "level": 2,
                    "import": ["Sandbagging", "Weightless"],
                    "export": ["Sandbagging", "Stronger Multihit"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Acrobat",
                        "min": 0
                    }
                },
                "Dancing Blade": {
                    "name": "Dancing Blade",
                    "level": 2,
                    "import": ["Weightless"],
                    "export": ["Far Reach"],
                    "cost": 2,
                    "lock": null,
                    "required": "Dash",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Violent Vortex": {
                    "name": "Violent Vortex",
                    "level": 2,
                    "import": ["Cheaper Smoke Bomb"],
                    "export": ["Marked"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Shadestepper",
                        "min": 0
                    }
                },
                "Delirious Gas": {
                    "name": "Delirious Gas",
                    "level": 3,
                    "import": ["Sandbagging"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Smoke Bomb",
                    "archetype": {
                        "name": "Trickster",
                        "min": 4
                    }
                },
                "Marked": {
                    "name": "Marked",
                    "level": 4,
                    "import": ["Violent Vortex"],
                    "export": ["Ambush"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Shadestepper",
                        "min": 5
                    }
                },
                "Echo": {
                    "name": "Echo",
                    "level": 4,
                    "import": ["Shurikens", "Sandbagging"],
                    "export": ["Shurikens", "Cheaper Dash II"],
                    "cost": 2,
                    "lock": ["Lacerate"],
                    "required": "Mirror Image",
                    "archetype": {
                        "name": "Trickster",
                        "min": 6
                    }
                },
                "Shurikens": {
                    "name": "Shurikens",
                    "level": 3,
                    "import": ["Echo", "Far Reach"],
                    "export": ["Echo", "Far Reach", "Psithurism"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Acrobat",
                        "min": 0
                    }
                },
                "Far Reach": {
                    "name": "Far Reach",
                    "level": 1,
                    "import": ["Shurikens", "Dancing Blade"],
                    "export": ["Shurikens", "Psithurism", "Cheaper Spin Attack II"],
                    "cost": 1,
                    "lock": null,
                    "required": "Multihit",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Psithurism": {
                    "name": "Psithurism",
                    "level": 1,
                    "import": ["Shurikens", "Far Reach"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Acrobat",
                        "min": 5
                    }
                },
                "Ambush": {
                    "name": "Ambush",
                    "level": 1,
                    "import": ["Marked"],
                    "export": ["Death Magnet", "Cheaper Multihit II"],
                    "cost": 1,
                    "lock": null,
                    "required": "Surprise Strike",
                    "archetype": {
                        "name": "Shadestepper",
                        "min": 4
                    }
                },
                "Cheaper Dash II": {
                    "name": "Cheaper Dash II",
                    "display": "Cheaper Dash",
                    "level": 1,
                    "import": ["Echo"],
                    "export": ["Hoodwink"],
                    "cost": 1,
                    "lock": null,
                    "required": "Dash",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Parry": {
                    "name": "Parry",
                    "level": 3,
                    "import": ["Cheaper Spin Attack II"],
                    "export": ["Choke Bomb"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Acrobat",
                        "min": 5
                    }
                },
                "Cheaper Spin Attack II": {
                    "name": "Cheaper Spin Attack II",
                    "display": "Cheaper Spin Attack",
                    "level": 1,
                    "import": ["Far Reach"],
                    "export": ["Parry", "Wall Jump"],
                    "cost": 1,
                    "lock": null,
                    "required": "Spin Attack",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Death Magnet": {
                    "name": "Death Magnet",
                    "level": 3,
                    "import": ["Cheaper Multihit II", "Ambush"],
                    "export": ["Cheaper Multihit II", "Fatla Spin"],
                    "cost": 2,
                    "lock": null,
                    "required": "Vanish",
                    "archetype": {
                        "name": "Shadestepper",
                        "min": 5
                    }
                },
                "Cheaper Multihit II": {
                    "name": "Cheaper Multihit II",
                    "display": "Cheaper Multihit",
                    "level": 1,
                    "import": ["Death Magnet", "Hoodwink", "Ambush"],
                    "export": ["Death Magnet", "Hoodwink", "Fatal Spin"],
                    "cost": 1,
                    "lock": null,
                    "required": "Multihit",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Hoodwink": {
                    "name": "Hoodwink",
                    "level": 2,
                    "import": ["Choke Bomb", "Cheaper Multihit II", "Cheaper Dash II"],
                    "export": ["Choke Bomb", "Cheaper Multihit II", "Cheaper Smoke Bomb II"],
                    "cost": 2,
                    "lock": null,
                    "required": "Spin Attack",
                    "archetype": {
                        "name": "Trickster",
                        "min": 1
                    }
                },
                "Choke Bomb": {
                    "name": "Choke Bomb",
                    "level": 2,
                    "import": ["Hoodwink", "Wall Jump", "Parry"],
                    "export": ["Hoodwink", "Wall Jump", "Stronger Lacerate"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Trickster",
                        "min": 0
                    }
                },
                "Wall Jump": {
                    "name": "Wall Jump",
                    "level": 2,
                    "import": ["Choke Bomb", "Cheaper Spin Attack II"],
                    "export": ["Choke Bomb", "Stronger Lacerate"],
                    "cost": 2,
                    "lock": null,
                    "required": "Hop",
                    "archetype": {
                        "name": "Acrobat",
                        "min": 5
                    }
                },
                "Fatal Spin": {
                    "name": "Fatal Spin",
                    "level": 2,
                    "import": ["Death Magnet", "Cheaper Multihit II"],
                    "export": ["Stronger Vortex", "Harvester"],
                    "cost": 2,
                    "lock": null,
                    "required": "Marked",
                    "archetype": {
                        "name": "Shadestepper",
                        "min": 8
                    }
                },
                "Stronger Lacerate": {
                    "name": "Stronger Lacerate",
                    "level": 1,
                    "import": ["Choke Bomb", "Wall Jump"],
                    "export": ["Blade Fury"],
                    "cost": 1,
                    "lock": null,
                    "required": "Lacerate",
                    "archetype": {
                        "name": "Acrobat",
                        "min": 0
                    }
                },
                "Stronger Vortex": {
                    "name": "Stronger Vortex",
                    "level": 1,
                    "import": ["Fatal Spin"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Violent Vortex",
                    "archetype": {
                        "name": "Shadestepper",
                        "min": 4
                    }
                },
                "Harvester": {
                    "name": "Harvester",
                    "level": 3,
                    "import": ["Cheaper Smoke Bomb II", "Fatal Spin"],
                    "export": ["Cheaper Smoke Bomb II", "Satsujin", "More Marks"],
                    "cost": 2,
                    "lock": null,
                    "required": "Marked",
                    "archetype": {
                        "name": "Shadestepper",
                        "min": 0
                    }
                },
                "Cheaper Smoke Bomb II": {
                    "name": "Cheaper Smoke Bomb II",
                    "display": "Cheaper Smoke Bomb",
                    "level": 1,
                    "import": ["Harvester", "Blade Fury", "Hoodwink"],
                    "export": ["Harvester", "Blade Fury", "More Marks", "Stronger Clones", "Forbidden Art"],
                    "cost": 1,
                    "lock": null,
                    "required": "Smoke Bomb",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Blade Fury": {
                    "name": "Blade Fury",
                    "level": 2,
                    "import": ["Cheaper Smoke Bomb II", "Stronger Lacerate"],
                    "export": ["Cheaper Smoke Bomb II", "Stronger Clones", "Ricochets", "Jasmine Bloom"],
                    "cost": 2,
                    "lock": null,
                    "required": "Multihit",
                    "archetype": {
                        "name": "Acrobat",
                        "min": 0
                    }
                },
                "More Marks": {
                    "name": "More Marks",
                    "level": 1,
                    "import": ["Harvester", "Cheaper Smoke Bomb II"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Marked",
                    "archetype": {
                        "name": "Shadestepper",
                        "min": 0
                    }
                },
                "Stronger Clones": {
                    "name": "Stronger Clones",
                    "level": 1,
                    "import": ["Cheaper Smoke Bomb II", "Blade Fury"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Echo",
                    "archetype": {
                        "name": "Trickster",
                        "min": 7
                    }
                },
                "Ricochets": {
                    "name": "Ricochets",
                    "level": 1,
                    "import": ["Blade Fury"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Shurikens",
                    "archetype": {
                        "name": "Acrobat",
                        "min": 6
                    }
                },
                "Satsujin": {
                    "name": "Satsujin",
                    "level": 4,
                    "import": ["Harvester"],
                    "export": ["Devour", "Better Marked"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Shadestepper",
                        "min": 12
                    }
                },
                "Forbidden Art": {
                    "name": "Forbidden Art",
                    "level": 3,
                    "import": ["Cheaper Smoke Bomb II"],
                    "export": ["Diversion"],
                    "cost": 2,
                    "lock": null,
                    "required": "Mirror Image",
                    "archetype": {
                        "name": "Trickster",
                        "min": 8
                    }
                },
                "Jasmine Bloom": {
                    "name": "Jasmine Bloom",
                    "level": 4,
                    "import": ["Blade Fury"],
                    "export": ["Better Ricochets"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Acrobat",
                        "min": 12
                    }
                },
                "Diversion": {
                    "name": "Diversion",
                    "level": 4,
                    "import": ["Forbidden Art"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Delirious Gas",
                    "archetype": {
                        "name": "Trickster",
                        "min": 11
                    }
                },
                "Better Ricochets": {
                    "name": "Better Ricochets",
                    "level": 1,
                    "import": ["Jasmine Bloom"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Ricochets",
                    "archetype": {
                        "name": "Acrobat",
                        "min": 0
                    }
                },
                "Devour": {
                    "name": "Devour",
                    "level": 1,
                    "import": ["Satsujin"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Harvester",
                    "archetype": {
                        "name": "Shadestepper",
                        "min": 0
                    }
                },
                "Better Marked": {
                    "name": "Better Marked",
                    "level": 1,
                    "import": ["Satsujin"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                }
            }
        },
        "shaman": {
            "branch": {},
            "button": {
                "Totem": {
                    "name": "Totem",
                    "level": 0,
                    "combo": "RLR",
                    "import": null,
                    "export": ["Relik Proficiency I"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Relik Proficiency I": {
                    "name": "Relik Proficiency I",
                    "level": 1,
                    "import": ["Totem"],
                    "export": ["Cheaper Totem", "Totemic Smash"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Cheaper Totem": {
                    "name": "Cheaper Totem",
                    "level": 1,
                    "import": ["Relik Proficiency I"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Totem",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Totemic Smash": {
                    "name": "Totemic Smash",
                    "level": 2,
                    "import": ["Relik Proficiency I"],
                    "export": ["Haul"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Haul": {
                    "name": "Haul",
                    "level": 1,
                    "combo": "RRR",
                    "import": ["Totemic Smash"],
                    "export": ["Distant Grasp", "Hand of the Shaman"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Distant Grasp": {
                    "name": "Distant Grasp",
                    "level": 1,
                    "import": ["Haul"],
                    "export": ["Uproot"],
                    "cost": 1,
                    "lock": ["Hand of the Shaman"],
                    "required": null,
                    "archetype": {
                        "name": "Summoner",
                        "min": 0
                    }
                },
                "Hand of the Shaman": {
                    "name": "Hand of the Shaman",
                    "level": 1,
                    "import": ["Haul"],
                    "export": ["Aura"],
                    "cost": 1,
                    "lock": ["Distant Grasp"],
                    "required": null,
                    "archetype": {
                        "name": "Acolyte",
                        "min": 0
                    }
                },
                "Uproot": {
                    "name": "Uproot",
                    "level": 0,
                    "combo": "RRL",
                    "import": ["Cheaper Haul", "Distant Grasp"],
                    "export": ["Cheaper Haul", "Earth Mastery", "Air Mastery"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Cheaper Haul": {
                    "name": "Cheaper Haul",
                    "level": 1,
                    "import": ["Uproot", "Aura"],
                    "export": ["Uproot", "Aura", "Air Mastery", "Thunder Mastery", "Water Mastery"],
                    "cost": 1,
                    "lock": null,
                    "required": "Haul",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Aura": {
                    "name": "Aura",
                    "level": 0,
                    "combo": "RLL",
                    "import": ["Cheaper Haul", "Hand of the Shaman"],
                    "export": ["Cheaper Haul", "Thunder Mastery", "Fire Mastery"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Earth Mastery": {
                    "name": "Earth Mastery",
                    "level": 1,
                    "import": ["Air Mastery", "Uproot"],
                    "export": ["Air Mastery", "Nature's Jolt"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Summoner",
                        "min": 0
                    }
                },
                "Air Mastery": {
                    "name": "Air Mastery",
                    "level": 1,
                    "import": ["Earth Mastery", "Uproot", "Cheaper Haul", "Thunder Mastery"],
                    "export": ["Earth Mastery", "Nature's Jolt", "Thunder Mastery", "Water Mastery"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Summoner",
                        "min": 0
                    }
                },
                "Thunder Mastery": {
                    "name": "Thunder Mastery",
                    "level": 1,
                    "import": ["Aura", "Cheaper Haul", "Air Mastery"],
                    "export": ["Shocking Aura", "Air Mastery", "Water Mastery"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Acolyte",
                        "min": 0
                    }
                },
                "Fire Mastery": {
                    "name": "Fire Mastery",
                    "level": 1,
                    "import": ["Aura"],
                    "export": ["Flaming Tongue"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Acolyte",
                        "min": 0
                    }
                },
                "Water Mastery": {
                    "name": "Water Mastery",
                    "level": 1,
                    "import": ["Cheaper Haul", "Air Mastery", "Thunder Mastery"],
                    "export": ["Rain Dance"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Ritualist",
                        "min": 0
                    }
                },
                "Nature's Jolt": {
                    "name": "Nature's Jolt",
                    "level": 2,
                    "import": ["Earth Mastery", "Air Mastery"],
                    "export": ["Overseer"],
                    "cost": 2,
                    "lock": null,
                    "required": "Haul",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Shocking Aura": {
                    "name": "Shocking Aura",
                    "level": 2,
                    "import": ["Thunder Mastery", "Flaming Tongue"],
                    "export": ["Flaming Tongue", "Sacrificial Shrine"],
                    "cost": 2,
                    "lock": null,
                    "required": "Aura",
                    "archetype": {
                        "name": "Acolyte",
                        "min": 0
                    }
                },
                "Flaming Tongue": {
                    "name": "Flaming Tongue",
                    "level": 2,
                    "import": ["Shocking Aura", "Fire Mastery"],
                    "export": ["Shocking Aura", "Sacrificial Shrine"],
                    "cost": 2,
                    "lock": null,
                    "required": "Uproot",
                    "archetype": {
                        "name": "Acolyte",
                        "min": 0
                    }
                },
                "Overseer": {
                    "name": "Overseer",
                    "level": 2,
                    "import": ["Nature's Jolt"],
                    "export": ["Puppet Master"],
                    "cost": 2,
                    "lock": null,
                    "required": "Uproot",
                    "archetype": {
                        "name": "Summoner",
                        "min": 0
                    }
                },
                "Rain Dance": {
                    "name": "Rain Dance",
                    "level": 2,
                    "import": ["Water Mastery"],
                    "export": ["Mask of the Lunatic"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Ritualist",
                        "min": 0
                    }
                },
                "Puppet Master": {
                    "name": "Puppet Master",
                    "level": 4,
                    "import": ["Overseer"],
                    "export": ["More Puppets"],
                    "cost": 2,
                    "lock": null,
                    "required": "Totem",
                    "archetype": {
                        "name": "Summoner",
                        "min": 3
                    }
                },
                "Mask of the Lunatic": {
                    "name": "Mask of the Lunatic",
                    "level": 4,
                    "import": ["Rain Dance"],
                    "export": ["Cheaper Uproot"],
                    "cost": 2,
                    "lock": null,
                    "required": "Uproot",
                    "archetype": {
                        "name": "Ritualist",
                        "min": 2
                    }
                },
                "Sacrificial Shrine": {
                    "name": "Sacrificial Shrine",
                    "level": 4,
                    "import": ["Shocking Aura", "Flaming Tongue"],
                    "export": ["Rebound"],
                    "cost": 2,
                    "lock": ["Regeneration"],
                    "required": "Totem",
                    "archetype": {
                        "name": "Acolyte",
                        "min": 3
                    }
                },
                "More Puppets": {
                    "name": "More Puppets",
                    "level": 1,
                    "import": ["Puppet Master"],
                    "export": ["Stagnation"],
                    "cost": 1,
                    "lock": null,
                    "required": "Puppet Master",
                    "archetype": {
                        "name": "Summoner",
                        "min": 0
                    }
                },
                "Cheaper Uproot": {
                    "name": "Cheaper Uproot",
                    "level": 1,
                    "import": ["Mask of the Lunatic"],
                    "export": ["Cheaper Aura", "Better Totem", "Rebound", "Hymn of Hate"],
                    "cost": 1,
                    "lock": null,
                    "required": "Uproot",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Rebound": {
                    "name": "Rebound",
                    "level": 3,
                    "import": ["Sacrificial Shrine"],
                    "export": ["Cheaper Uproot", "Better Totem", "Blood Connection"],
                    "cost": 2,
                    "lock": null,
                    "required": "Aura",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Stagnation": {
                    "name": "Stagnation",
                    "level": 2,
                    "import": ["Cheaper Aura", "More Puppets"],
                    "export": ["Cheaper Aura", "Exploding Puppets"],
                    "cost": 2,
                    "lock": null,
                    "required": "Nature's Jolt",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Cheaper Aura": {
                    "name": "Cheaper Aura",
                    "level": 1,
                    "import": ["Stagnation", "Cheaper Uproot"],
                    "export": ["Stagnation", "Exploding Puppets"],
                    "cost": 1,
                    "lock": null,
                    "required": "Aura",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Better Totem": {
                    "name": "Better Totem",
                    "level": 1,
                    "import": ["Cheaper Uproot", "Rebound"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Totem",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Blood Connection": {
                    "name": "Blood Connection",
                    "level": 2,
                    "import": ["Rebound"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Haul",
                    "archetype": {
                        "name": "Acolyte",
                        "min": 0
                    }
                },
                "Exploding Puppets": {
                    "name": "Exploding Puppets",
                    "level": 2,
                    "import": ["Stagnation", "Cheaper Aura"],
                    "export": ["Bullwhip", "More Puppets II"],
                    "cost": 2,
                    "lock": null,
                    "required": "Puppet Master",
                    "archetype": {
                        "name": "Summoner",
                        "min": 0
                    }
                },
                "Hymn of Hate": {
                    "name": "Hymn of Hate",
                    "level": 3,
                    "import": ["Cheaper Uproot", "More Blood Pool"],
                    "export": ["More Blood Pool", "Mask of the Fanatic"],
                    "cost": 2,
                    "lock": null,
                    "required": "Mask of the Lunatic",
                    "archetype": {
                        "name": "Ritualist",
                        "min": 0
                    }
                },
                "More Blood Pool": {
                    "name": "More Blood Pool",
                    "level": 1,
                    "import": ["Hymn of Hate", "Rebound"],
                    "export": ["Hymn of Hate", "Mask of the Fanatic", "Vengeful Spirit"],
                    "cost": 1,
                    "lock": null,
                    "required": "Sacrificial Shrine",
                    "archetype": {
                        "name": "Acolyte",
                        "min": 0
                    }
                },
                "Bullwhip": {
                    "name": "Bullwhip",
                    "level": 3,
                    "import": ["Exploding Puppets"],
                    "export": ["Double Totem"],
                    "cost": 2,
                    "lock": null,
                    "required": "Uproot",
                    "archetype": {
                        "name": "Summoner",
                        "min": 0
                    }
                },
                "More Puppets II": {
                    "name": "More Puppets II",
                    "display": "More Puppets",
                    "level": 1,
                    "import": ["Exploding Puppets"],
                    "export": ["Cheaper Totem II"],
                    "cost": 1,
                    "lock": null,
                    "required": "More Puppets",
                    "archetype": {
                        "name": "Summoner",
                        "min": 0
                    }
                },
                "Mask of the Fanatic": {
                    "name": "Mask of the Fanatic",
                    "level": 3,
                    "import": ["Hymn of Hate", "More Blood Pool"],
                    "export": ["Masquerade", "Storm Dance"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Ritualist",
                        "min": 3
                    }
                },
                "Vengeful Spirit": {
                    "name": "Vengeful Spirit",
                    "level": 2,
                    "import": ["More Blood Pool"],
                    "export": ["Blood Moon"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Acolyte",
                        "min": 0
                    }
                },
                "Masquerade": {
                    "name": "Masquerade",
                    "level": 2,
                    "import": ["Mask of the Fanatic"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Mask of the Lunatic",
                    "archetype": {
                        "name": "Ritualist",
                        "min": 0
                    }
                },
                "Double Totem": {
                    "name": "Double Totem",
                    "level": 2,
                    "import": ["Cheaper Totem II", "Bullwhip"],
                    "export": ["Cheaper Totem II", "Cheaper Aura II"],
                    "cost": 2,
                    "lock": null,
                    "required": "Aura",
                    "archetype": {
                        "name": "Summoner",
                        "min": 2
                    }
                },
                "Cheaper Totem II": {
                    "name": "Cheaper Totem II",
                    "display": "Cheaper Totem",
                    "level": 1,
                    "import": ["Double Totem", "Storm Dance", "More Puppets II"],
                    "export": ["Double Totem", "Storm Dance", "Cheaper Aura II", "Seeking Totem", "Regeneration"],
                    "cost": 1,
                    "lock": null,
                    "required": "Totem",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Regeneration": {
                    "name": "Regeneration",
                    "level": 2,
                    "import": ["Cheaper Totem II", "Storm Dance"],
                    "export": null,
                    "cost": 2,
                    "lock": ["Sacrificial Shrine"],
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Storm Dance": {
                    "name": "Storm Dance",
                    "level": 2,
                    "import": ["Cheaper Totem II", "Blood Moon", "Mask of the Fanatic"],
                    "export": ["Cheaper Totem II", "Blood Moon", "Cheaper Haul II", "Seeking Totem", "Regeneration"],
                    "cost": 2,
                    "lock": null,
                    "required": "Aura",
                    "archetype": {
                        "name": "Ritualist",
                        "min": 0
                    }
                },
                "Blood Moon": {
                    "name": "Blood Moon",
                    "level": 1,
                    "import": ["Storm Dance", "Vengeful Spirit"],
                    "export": ["Storm Dance", "Cheaper Haul II", "Twisted Tether"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Cheaper Haul II": {
                    "name": "Cheaper Haul II",
                    "display": "Cheaper Haul",
                    "level": 1,
                    "import": ["Storm Dance", "Blood Moon"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Haul",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Cheaper Aura II": {
                    "name": "Cheaper Aura II",
                    "display": "Cheaper Aura",
                    "level": 1,
                    "import": ["Seeking Totem", "Double Totem", "Cheaper Totem II"],
                    "export": ["Seeking Totem", "Stronger Totem", "Crimson Effigy"],
                    "cost": 1,
                    "lock": null,
                    "required": "Aura",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Seeking Totem": {
                    "name": "Seeking Totem",
                    "level": 2,
                    "import": ["Cheaper Totem II", "Storm Dance", "Cheaper Aura II"],
                    "export": ["Cheaper Aura II", "Stronger Totem", "Depersonalization", "Mask of the Coward"],
                    "cost": 2,
                    "lock": null,
                    "required": "Mask of the Fanatic",
                    "archetype": {
                        "name": "Ritualist",
                        "min": 0
                    }
                },
                "Twisted Tether": {
                    "name": "Twisted Tether",
                    "level": 4,
                    "import": ["Storm Dance", "Blood Moon"],
                    "export": ["Fluid Healing", "More Blood Pool II"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Acolyte",
                        "min": 7
                    }
                },
                "Stronger Totem": {
                    "name": "Stronger Totem",
                    "level": 1,
                    "import": ["Cheaper Aura II", "Seeking Totem"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Totem",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Depersonalization": {
                    "name": "Depersonalization",
                    "level": 1,
                    "import": ["Seeking Totem"],
                    "export": null,
                    "cost": 1,
                    "lock": null,
                    "required": "Masquerade",
                    "archetype": {
                        "name": "Ritualist",
                        "min": 6
                    }
                },
                "Crimson Effigy": {
                    "name": "Crimson Effigy",
                    "level": 4,
                    "import": ["Mask of the Coward", "Cheaper Aura II"],
                    "export": ["Mask of the Coward", "Maddening Roots"],
                    "cost": 2,
                    "lock": null,
                    "required": "Uproot",
                    "archetype": {
                        "name": "Summoner",
                        "min": 8
                    }
                },
                "Mask of the Coward": {
                    "name": "Mask of the Coward",
                    "level": 3,
                    "import": ["Crimson Effigy", "Fluid Healing", "Seeking Totem"],
                    "export": ["Crimson Effigy", "Fluid Healing", "Chant of the Coward"],
                    "cost": 2,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Ritualist",
                        "min": 7
                    }
                },
                "Fluid Healing": {
                    "name": "Fluid Healing",
                    "level": 2,
                    "import": ["Mask of the Coward", "More Blood Pool II", "Twisted Tether"],
                    "export": ["Mask of the Coward", "More Blood Pool II", "Chant of the Coward", "Blood Rite"],
                    "cost": 2,
                    "lock": null,
                    "required": "Sacrificial Shrine",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "More Blood Pool II": {
                    "name": "More Blood Pool II",
                    "display": "More Blood Pool",
                    "level": 1,
                    "import": ["Fluid Healing", "Twisted Tether"],
                    "export": ["Fluid Healing", "Blood Rite"],
                    "cost": 1,
                    "lock": null,
                    "required": "Sacrificial Shrine",
                    "archetype": {
                        "name": "Acolyte",
                        "min": 0
                    }
                },
                "Maddening Roots": {
                    "name": "Maddening Roots",
                    "level": 2,
                    "import": ["Crimson Effigy"],
                    "export": ["More Effigies"],
                    "cost": 2,
                    "lock": null,
                    "required": "Uproot",
                    "archetype": {
                        "name": "Summoner",
                        "min": 0
                    }
                },
                "Chant of the Coward": {
                    "name": "Chant of the Coward",
                    "level": 2,
                    "import": ["Mask of the Coward", "Fluid Healing"],
                    "export": ["Chant of the Fanatic"],
                    "cost": 2,
                    "lock": null,
                    "required": "Mask of the Coward",
                    "archetype": {
                        "name": "Ritualist",
                        "min": 7
                    }
                },
                "Blood Rite": {
                    "name": "Blood Rite",
                    "level": 3,
                    "import": ["Fluid Healing", "More Blood Pool II"],
                    "export": ["Stronger Tether"],
                    "cost": 2,
                    "lock": null,
                    "required": "Sacrificial Shrine",
                    "archetype": {
                        "name": "Acolyte",
                        "min": 9
                    }
                },
                "More Effigies": {
                    "name": "More Effigies",
                    "level": 1,
                    "import": ["Maddening Roots"],
                    "export": ["Triple Totem", "Invigorating Wave"],
                    "cost": 1,
                    "lock": null,
                    "required": "Crimson Effigy",
                    "archetype": {
                        "name": "Summoner",
                        "min": 8
                    }
                },
                "Chant of the Fanatic": {
                    "name": "Chant of the Fanatic",
                    "level": 3,
                    "import": ["Stronger Tether", "Chant of the Coward"],
                    "export": ["Stronger Tether", "Mengdu", "Frog Dance"],
                    "cost": 2,
                    "lock": null,
                    "required": "Mask of the Fanatic",
                    "archetype": {
                        "name": "Ritualist",
                        "min": 10
                    }
                },
                "Stronger Tether": {
                    "name": "Stronger Tether",
                    "level": 1,
                    "import": ["Chant of the Fanatic", "Blood Rite"],
                    "export": ["Chant of the Fanatic", "More Blood Pool III"],
                    "cost": 1,
                    "lock": null,
                    "required": "Twisted Tether",
                    "archetype": {
                        "name": "Acolyte",
                        "min": 0
                    }
                },
                "Triple Totem": {
                    "name": "Triple Totem",
                    "level": 2,
                    "import": ["Invigorating Wave", "More Effigies"],
                    "export": ["Invigorating Wave", "Shepherd"],
                    "cost": 2,
                    "lock": null,
                    "required": "Double Totem",
                    "archetype": {
                        "name": "Summoner",
                        "min": 0
                    }
                },
                "Invigorating Wave": {
                    "name": "Invigorating Wave",
                    "level": 3,
                    "import": ["Triple Totem", "Mengdu", "More Effigies"],
                    "export": ["Triple Totem", "Mengdu", "Shepherd"],
                    "cost": 2,
                    "lock": null,
                    "required": "Aura",
                    "archetype": {
                        "name": "Summoner",
                        "min": 3
                    }
                },
                "Mengdu": {
                    "name": "Mengdu",
                    "level": 1,
                    "import": ["Invigorating Wave", "Chant of the Fanatic"],
                    "export": ["Invigorating Wave"],
                    "cost": 1,
                    "lock": null,
                    "required": null,
                    "archetype": {
                        "name": "Ritualist",
                        "min": 0
                    }
                },
                "Frog Dance": {
                    "name": "Frog Dance",
                    "level": 2,
                    "import": ["Chant of the Fanatic"],
                    "export": ["Mask of the Awakened"],
                    "cost": 2,
                    "lock": null,
                    "required": "Mask of the Coward",
                    "archetype": {
                        "name": "Ritualist",
                        "min": 0
                    }
                },
                "More Blood Pool III": {
                    "name": "More Blood Pool III",
                    "display": "More Blood Pool",
                    "level": 1,
                    "import": ["Stronger Tether"],
                    "export": ["Blood Sorrow"],
                    "cost": 1,
                    "lock": null,
                    "required": "Sacrificial Shrine",
                    "archetype": {
                        "name": "Acolyte",
                        "min": 0
                    }
                },
                "Shepherd": {
                    "name": "Shepherd",
                    "level": 4,
                    "import": ["Triple Totem", "Invigorating Wave"],
                    "export": ["Cheaper Uproot II"],
                    "cost": 2,
                    "lock": null,
                    "required": "Puppet Master",
                    "archetype": {
                        "name": "Summoner",
                        "min": 12
                    }
                },
                "Blood Sorrow": {
                    "name": "Blood Sorrow",
                    "level": 4,
                    "import": ["More Blood Pool III"],
                    "export": null,
                    "cost": 2,
                    "lock": null,
                    "required": "Uproot",
                    "archetype": {
                        "name": "Acolyte",
                        "min": 12
                    }
                },
                "Cheaper Uproot II": {
                    "name": "Cheaper Uproot II",
                    "display": "Cheaper Uproot",
                    "level": 1,
                    "import": ["Shepherd", "Mask of the Awakened"],
                    "export": ["Mask of the Awakened"],
                    "cost": 1,
                    "lock": null,
                    "required": "Uproot",
                    "archetype": {
                        "name": null,
                        "min": null
                    }
                },
                "Mask of the Awakened": {
                    "name": "Mask of the Awakened",
                    "level": 4,
                    "import": ["Cheaper Uproot II", "Frog Dance"],
                    "export": ["Cheaper Uproot II"],
                    "cost": 2,
                    "lock": null,
                    "required": "Uproot",
                    "archetype": {
                        "name": "Ritualist",
                        "min": 12
                    }
                }
            }
        }
    };

    $.fn.exist = function () {
        return this.length !== 0;
    }

    const random = function(min=1, max=3) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const mobile = function() {
        return ('ontouchstart'in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    }

    // 職業內容分隔
    $('button.tablinks').click(function(){
        className = $(this).data('class');
        classNameLower = className.toLowerCase();
        currentClass = $(`div#${className}`);
        classObject = $(`div#${className} .content button[data-name]`);
        classBranch = $(`div#${className} .content span[data-connect]`);
        classTable = $(`div#${className} .content table`);
        classInfo = $(`div#${className} span[data-type]`);
        classAPool = $(`div#${className} span[data-type="point"]`);
    });

    const audio = [];
    class SoundEffect {
        constructor(usage, speed=1.5) {
            this.speed = speed;
            switch (usage) {
                case 'enable':
                    this.audio = new Audio(url[random()]);
                    this.enable();
                    break;
                case 'disable':
                    this.audio = new Audio(url[random()]);
                    this.disable();
                    break;
                case 'levelup':
                    this.audio = new Audio(url[0]);
                    this.levelup();
                    break;
            }
        }

        enable() {

            this.audio.controls = false;
            this.audio.volume = 0.8;
            this.audio.playbackRate = 1.5;
            this.audio.preservesPitch = false;
            this.audio.mozPreservesPitch = false;
            this.audio.webkitPreservesPitch = false;
            this.audio.play();

            this.audio.onplaying = function(){$(this.audio).animate({volume: 0}, 1000, function(){$(this).remove()})}
        }

        disable() {

            this.audio.controls = false;
            this.audio.volume = 0.8;
            this.audio.playbackRate = 0.5;
            this.audio.preservesPitch = false;
            this.audio.mozPreservesPitch = false;
            this.audio.webkitPreservesPitch = false;
            this.audio.play();

            this.audio.onplaying = function(){$(this.audio).animate({volume: 0}, 1000, function(){$(this).remove()})}
        }

        levelup() {
            
            if (this.speed == 1.5) {
                this.audio.controls = false;
                this.audio.volume = 0.8;
                this.audio.playbackRate = 1.5;
                this.audio.preservesPitch = false;
                this.audio.mozPreservesPitch = false;
                this.audio.webkitPreservesPitch = false;
                this.audio.play();
                
                $(this.audio).one('ended', function(){$(this).remove()})
            }

            else if (this.speed = 0.5) {
                this.audio.controls = false;
                this.audio.volume = 0.25;
                this.audio.playbackRate = 0.5;
                this.audio.preservesPitch = false;
                this.audio.mozPreservesPitch = false;
                this.audio.webkitPreservesPitch = false;
                this.audio.play();
                
                $(this.audio).one('ended', function(){$(this).remove()})
            }

        }
    }

    class Gadget {
        static popup(text, imageURL) {
            const toast_block = $('div.toast');
            const popup_block = $(document.createElement('div')).addClass('popup');
            popup_block.append($(document.createElement('img')).attr('src', imageURL));
            popup_block.append($(document.createElement('span')).text(text));
            toast_block.append(popup_block);
            popup_block.addClass('active').on('animationstart', function(){
                popup_count += 1;
            }).on('animationend', function(){
                popup_count -= 1;
                if (popup_count == 0) {
                    $('.popup').remove();
                }
            });
        }

        static state(obj, check)/* 紀錄物件狀態 */{
            const object = $(obj);
            try {
                repository[classNameLower].button[object.data('name')].state = object.attr('class').split(' ');
            }
            catch {
                repository[object.closest('div.tabcontent').attr('id').toLowerCase()].button[object.data('name')].state = object.attr('class').split(' ');
            }
            finally {
                return object;
            }
        }

        static stringifyNull(json) {
            if (json == null) {json = JSON.stringify(json)}
            return json;
        }

        static defined(variable)/* 檢查是否非undefined，是則回傳true，否則回傳false */{
            return (typeof variable != 'undefined');
        }

        static nonNull(variable)/* 檢查是否非空值 */{
            return (JSON.stringify(variable) != 'null');
        }

        static classFilter(array)/* 從當前的class下方過濾出在nameList中的Object */{
            return classObject.filter(function(){return array.includes($(this).data('name'))})
        }

        static combine(arr1, arr2)/* 合併兩個陣列 */{
            arr1 = (Gadget.nonNull(arr1) && Gadget.defined(arr1)) ? arr1 : [];
            arr2 = (Gadget.nonNull(arr2) && Gadget.defined(arr2)) ? arr2 : [];
            const result = arr1.concat(arr2).filter(function(element, index, self){
                return $.inArray(element, self) == index;
            });

            return result;
        }

        static anyEnable(list)/* 檢查nameList中是否有物件處於enable狀態 */{
            let result = false;
            $.each(list, function(index, name){
                if (repository[classNameLower].button[name].state.includes('enable')) {
                    result = true;
                    return false;
                }
            })
            return result;
        }
        
        static findInState(list, state)/* 過濾出nameList中處於指定狀態的Object name */{
            const result = [];
            $.each(list, function(index, name){
                if (repository[classNameLower].button[name].state.includes(state)) {
                    result.push(name);
                }
            });
            return result;
        }

    }

    class EventHandler {
        constructor(obj, label=true) {
            this.object = $(obj);
            this.data = repository[classNameLower].button[$(obj).data('name')];
            this.relative = {
                "import": Gadget.nonNull(this.data.import) ? Gadget.classFilter(this.data.import) : false,
                "export": Gadget.nonNull(this.data.export) ? Gadget.classFilter(this.data.export) : false
            };
            this.label = label;
        }

        static info(obj, usage) {
            console.groupCollapsed(`%c[%cEventHandler%c.%cinfo%c]%c`, "color: #5946B2", "color: #9C51B6", "color: initial", "color: #5DADEC", "color: #5946B2", "color: initial");
            
            const self = {};
            self.object = $(obj);
            self.data = repository[classNameLower].button[$(obj).data('name')];
            self.relative = {
                "lock": Gadget.nonNull(self.data.lock) ? Gadget.classFilter(self.data.lock) : false,
                "archetype": Gadget.nonNull(self.data.archetype.name) ? classInfo.filter(function(){return $(this).data('type') == self.data.archetype.name}) : false
            };

            if (usage.toLowerCase() == 'enable') {
                // 處理cost
                classAPool.text(parseInt(classAPool.text()) - self.data.cost);
                console.log(`Ability Points: ${parseInt(classAPool.text())+self.data.cost} -> ${classAPool.text()}`);

                // 處理lock
                if (self.relative.lock != false) {
                    self.relative.lock.each(function(){
                        Gadget.state($(this).addClass('lock'))
                    });
                }

                //處理archetype
                if (self.relative.archetype != false) {
                    self.relative.archetype.text(parseInt(self.relative.archetype.text()) + 1);
                    console.log(`${self.data.archetype.name}: ${parseInt(self.relative.archetype.text())-1} -> ${self.relative.archetype.text()}`);
                }
            }
            else if (usage.toLowerCase() == 'disable') {
                // 處理cost
                classAPool.text(parseInt(classAPool.text()) + self.data.cost);
                console.log(`Ability Points: ${parseInt(classAPool.text())-self.data.cost} -> ${classAPool.text()}`);

                // 處理lock
                if (self.relative.lock != false) {
                    self.relative.lock.each(function(){
                        Gadget.state($(this).removeClass('lock'))
                    });
                }

                //處理archetype
                if (self.relative.archetype != false) {
                    self.relative.archetype.text(parseInt(self.relative.archetype.text()) - 1);
                    console.log(`${self.data.archetype.name}: ${parseInt(self.relative.archetype.text())+1} -> ${self.relative.archetype.text()}`);
                }
            }
            else {console.warn('打錯字\uFF01')}

            Update.execute(self.object, usage)

            console.groupEnd();
            return false;
        }

        enable() {
            this.object.addClass('enable').removeClass('disable');
            Gadget.state(this.object);

            return this;
        }

        disable() {
            this.object.addClass('disable').removeClass('enable');
            Gadget.state(this.object);
            
            return this;
        }

        toggle() {
            this.object.addClass('toggle');
            Gadget.state(this.object);
            
            return this;
        }

        enableEvent() {
            console.groupCollapsed(`%c[%cEventHandler%c.%cenableEvent%c]%c <${this.data.name}>`, "color: #5946B2", "color: #9C51B6", "color: initial", "color: #5DADEC", "color: #5946B2", "color: initial");
            
            if (this.label) {
                const playsound = new SoundEffect('enable');
            }
            
            this.enable();
            if (this.relative.export != false) {this.relative.export.each(function(){Gadget.state($(this).addClass('toggle'))})};

            console.groupCollapsed(`%c[%cPath%c]`, "color: #5946B2", "color: #9C51B6", "color: #5946B2");
            Path.memorize(this);
            Path.draw(this);
            console.groupEnd();

            EventHandler.info(this.object, 'enable');

            console.warn('path', path);

            console.groupEnd();
            return this;
        }

        disableEvent() {
            console.groupCollapsed(`%c[%cEventHandler%c.%cdisableEvent%c]%c <${this.data.name}>`, "color: #5946B2", "color: #9C51B6", "color: initial", "color: #5DADEC", "color: #5946B2", "color: initial");
            
            if (this.label) {
                const playsound = new SoundEffect('disable');
            }
            
            if (this.object.hasClass('enable')) {EventHandler.info(this.object, 'disable')};
            this.disable();

            console.groupCollapsed(`%c[%cPath%c]`, "color: #5946B2", "color: #9C51B6", "color: #5946B2");
            Path.backspace(this);
            console.groupEnd();

            console.warn('path', path);

            console.groupEnd();
            return this;
        }
    }

    class Update {
        static execute(obj, usage) {
            const self = {
                "object": $(obj),
                "data": repository[classNameLower].button[$(obj).data('name')]
            };
            const call = {
                "cost": parseInt(classAPool.text()) <= 2,
                "require": Gadget.defined(self.data.demand),
                "archetype": Gadget.nonNull(self.data.archetype.name)
            }
            Update.cost();
            if (call.require) {Update.require(self, usage)}
            if (call.archetype) {Update.archetype(self)}
            if (Object.values(call).some((value)=>value) || force[classNameLower] > 0) {Update.force()}

            return false;
        }

        static cost() {

            classObject.each(function(){
                if ($(this).data('cost') > parseInt(classAPool.text())) {
                    $(this).siblings('span.tooltip').find('[data-tooltip="footer"] span:has(span[data-update="point"])')
                    .removeClass('checkmark')
                    .addClass('ban');
                }
                else {
                    $(this).siblings('span.tooltip').find('[data-tooltip="footer"] span:has(span[data-update="point"])')
                    .removeClass('ban')
                    .addClass('checkmark');
                }
            });

            return false;
        }

        static require(self, usage) {

            //console.info(`<${self.data.name}>`, self.data.state);

            Gadget.classFilter(self.data.demand).each(function(){
                if (usage == 'enable') {
                    $(this).siblings('span.tooltip').find('[data-tooltip="footer"] span:has(span[data-update="required"])')
                    .removeClass('ban')
                    .addClass('checkmark');
                }
                else {
                    $(this).siblings('span.tooltip').find('[data-tooltip="footer"] span:has(span[data-update="required"])')
                    .removeClass('checkmark')
                    .addClass('ban');
                }
            });

            return false;
        }

        static archetype(self) {
            
            const archetype = parseInt(classInfo.filter(function(){return $(this).data('type') == self.data.archetype.name}).text());

            classObject.filter(function(){
                return ($(this).data('type-req') == self.data.archetype.name) && ($(this).data('type-req-min') > 0)
            }).each(function(){

                console.log(`<${$(this).data('name')}>\narchetype: ${$(this).data('type-req')} [${archetype}/${$(this).data('type-req-min')}]`);

                const element = $(this).siblings('span.tooltip').find('[data-tooltip="footer"] span:has(span[data-update="archetype"])');
                
                if ($(this).data('type-req-min') <= archetype) {
                    element.removeClass('ban').addClass('checkmark')
                    .find('span[data-update="archetype"]')
                    .css({"color":"#FFFFFF", "text-shadow": "2px 2px #3F3F3F"})
                    .text(archetype);
                }
                else {
                    element.removeClass('checkmark').addClass('ban')
                    .find('span[data-update="archetype"]')
                    .css({"color":"#FF5555", "text-shadow": "2px 2px #3F1515"})
                    .text(archetype);
                }

            });

            return false;
        }

        static force() {

            classObject.each(function(){
                if (!$(this).hasClass('enable')) {
                    
                    if ($(this).siblings('span.tooltip').find('span[data-tooltip="footer"] span.ban').exist()) {
                        $(this).addClass('force');
                        force[classNameLower] += 1;
                    }
                    else {
                        $(this).removeClass('force');
                        force[classNameLower] -= 1;
                    }

                }
            });

            return false;
        }

        static afterDecode() {
            
            classObject.each(function(){

                const self = {
                    "object": $(this),
                    "data": repository[classNameLower].button[$(this).data('name')]
                };
                
                // cost
                if ($(this).data('cost') > parseInt(classAPool.text())) {
                    $(this).siblings('span.tooltip').find('[data-tooltip="footer"] span:has(span[data-update="point"])')
                    .removeClass('checkmark')
                    .addClass('ban');
                }
                else {
                    $(this).siblings('span.tooltip').find('[data-tooltip="footer"] span:has(span[data-update="point"])')
                    .removeClass('ban')
                    .addClass('checkmark');
                }
                
                // require
                if ($(this).hasClass('enable') && Gadget.defined(self.data.demand)) {
                    Update.require(self);
                }

                // archetype
                if (Gadget.nonNull(self.data.archetype.name)) {

                    const archetype = parseInt(classInfo.filter(function(){return $(this).data('type') == self.data.archetype.name}).text());
                    const element = $(this).siblings('span.tooltip').find('[data-tooltip="footer"] span:has(span[data-update="archetype"])');
                
                    if ($(this).data('type-req-min') <= archetype) {
                        element.removeClass('ban').addClass('checkmark')
                        .find('span[data-update="archetype"]')
                        .css({"color":"#FFFFFF", "text-shadow": "2px 2px #3F3F3F"})
                        .text(archetype);
                    }
                    else {
                        element.removeClass('checkmark').addClass('ban')
                        .find('span[data-update="archetype"]')
                        .css({"color":"#FF5555", "text-shadow": "2px 2px #3F1515"})
                        .text(archetype);
                    }

                }
            });

            return false;

        }
    }

    class Path {
        static memorize(data) {
            console.groupCollapsed(`%c[%cPath%c.%cmemorize%c]%c Start Execution...`, "color: #5946B2", "color: #9C51B6", "color: initial", "color: #5DADEC", "color: #5946B2", "color: initial");
            const self = data;
            
            if (path[classNameLower].length == 0) {
                path[classNameLower].push([self.data.name]);
            }
            else {
                const list = {
                    "arrayNumber": [],
                    "arrayStorage": [],
                    "elementIndex": [],
                };
                const temp = [];

                $.each(self.data.import, function(indexI, name){
                    $.each(path[classNameLower], function(indexII, array){
                        const index = $.inArray(name, array);
                        if (index != -1) {
                            list.arrayNumber.push(indexII);
                            list.arrayStorage.push(array);
                            list.elementIndex.push(index);
                        }
                    });
                });

                $.each(list.arrayStorage, function(indexI, array){
                    if ((array.length - 1) == list.elementIndex[indexI]) {
                        array.push(self.data.name);
                        path[classNameLower][list.arrayNumber[indexI]] = array;
                        temp.push(array.toString());

                        console.log(`已添加 <${self.data.name}> 至現存路徑`);
                    }
                    else {
                        array = array.slice(0, (list.elementIndex[indexI] + 1));
                        array.push(self.data.name);
                        if (!temp.includes(array.toString())) {
                            path[classNameLower].push(array);
                            temp.push(array.toString());

                            console.log(`已添加 <${self.data.name}> 至新的路徑分支`);
                        }
                    }
                    console.info(`array: ${JSON.stringify(array)}`);
                });
            }

            console.warn(`path: `, path[classNameLower]);
            console.groupEnd();
            return false;
        }

        static draw(data) {
            console.groupCollapsed(`%c[%cPath%c.%cdraw%c]%c Start Execution...`, "color: #5946B2", "color: #9C51B6", "color: initial", "color: #5DADEC", "color: #5946B2", "color: initial");
            const self = data;
            const list = $.grep(Gadget.combine(self.data.import, self.data.export), function(name, index){return repository[classNameLower].button[name].state.includes('enable')});
            let targetBranch = $();

            console.warn(`list: `, list);

            $.each(list, function(index, name){
                targetBranch = targetBranch.add(classBranch.filter(function(){
                    return [self.data.name, name].every(element => $(this).data('connect').includes(element))
                }));
            });

            $.each(targetBranch, function(){
                
                BranchFactory.identifyForEnable(BranchFactory.direction($(this)));

            });
            


            console.groupEnd();
            return false;
        }
        
        static backspace(data) {
            console.groupCollapsed(`%c[%cPath%c.%cbackspace%c]%c Start Execution...`, "color: #5946B2", "color: #9C51B6", "color: initial", "color: #5DADEC", "color: #5946B2", "color: initial");
            const self = data;
            let callTruncate = false;

            $.each(path[classNameLower], function(index, array){
                const key = $.inArray(self.data.name, array);
                if ((key != -1) && (key == array.length-1)) {

                    path[classNameLower][index].splice(array.length-1, 1);

                }
                else if ((key != -1) && (key < array.length-1)) {
                    callTruncate = true;
                }
            });

            try {
                $(classObject).filter(function(){return repository[classNameLower].button[self.data.name].export.includes($(this).data('name'))})
                .each(function(){
                    if (!Gadget.anyEnable(repository[classNameLower].button[$(this).data('name')].import)) {
                        if ($(this).hasClass('enable')) {EventHandler.info($(this), 'disable')}
                        Gadget.state($(this).removeClass('toggle enable').addClass('disable'));
                    }
                });
            }
            finally {
                if (callTruncate) {
                    if (Gadget.defined(self.data.demand)) {
                        if (self.data.demand.some((name) => repository[classNameLower].button[name].state.includes('enable'))) {
                            classObject.filter(function(){return $(this).hasClass('enable') && self.data.demand.includes($(this).data('name'))})
                            .each(function(){
                                const object = new EventHandler($(this), false);
                                object.disableEvent();
                            });
                        }
                    }
                    Path.truncate(data);
                    Path.overhaul('disable');
                }
                else {
                    Path.erase(self);
                    if ([self.data.location.row, self.data.location.column].toString() == [0, 4]) {
                        Path.uniquify();
                    }
                }

                console.groupEnd();
                return false;
            }
        }

        static truncate(data) {
            console.groupCollapsed(`%c[%cPath%c.%ctruncate%c]%c Start Execution...`, "color: #5946B2", "color: #9C51B6", "color: initial", "color: #5DADEC", "color: #5946B2", "color: initial");
            const self = data;
            const info = [
                {
                    "array": [],
                    "index": []
                },
                {
                    "object": [],
                    "list": {}
                },
                {
                    "after": []
                }
            ];

            $.each(path[classNameLower], function(index, array){
                
                const key = $.inArray(self.data.name, array);
                if (key != -1) {
                    info[0].array.push(array.slice(key-1));
                    info[0].index.push(index);
                    $.each(array.slice(key+1), function(i, obj){
                        if (!info[2].after.includes(obj)) {info[2].after.push(obj)}
                    });
                    array.splice(key);
                }
            
            });

            $.each(info[0].array, function(index, array){

                const key = $.inArray(array[0], info[1].object);
                if (key == -1) {
                    info[1].object.push(array[0]);
                    info[1].list[array[0]] = [];
                    info[1].list[array[0]].push(info[0].index[index]);
                }
                else {
                    info[1].list[array[0]].push(info[0].index[index]);
                }

            });

            $.each(info[1].object, function(index1, object){

                let exist = false;
                $.each(path[classNameLower], function(index2, array){

                    if (($.inArray(object, array) > -1) && !(info[1].list[object].includes(index2))) {
                        exist = true;
                        return false;
                    }

                });

                if (exist) {
                    $.each(info[1].list[object], function(index2, indexNum){
                        path[classNameLower][indexNum] = [];
                    });
                }
                else {
                    const temp = Array.from(path[classNameLower][info[1].list[object][0]]);
                    $.each(info[1].list[object], function(index2, indexNum){
                        path[classNameLower][indexNum] = [];
                    });
                    path[classNameLower].push(temp);
                }


            });

            $.each(info[2].after, function(index1, object){
                const target = classObject.filter(`button[data-name="${object}"]`);

                let exist = false;
                $.each(path[classNameLower], function(index2, array){
                    if (array.includes(object)) {
                        exist = true;
                        return false;
                    }
                });

                console.info(`\u274F object: <${object}>\n\u3000 exist: ${exist}`);
                
                if (!exist) {
                    console.log(`\u26A0 Disable <${object}>`);
                    if (target.hasClass('enable')) {EventHandler.info(target, 'disable')}
                    Gadget.state(target.addClass('disable').removeClass('toggle enable'));

                    //解決因路徑截斷而被孤立，但卻持有 toggle 的物件
                    $.each(repository[classNameLower].button[object].export, function(index2, name){

                        const states = repository[classNameLower].button[name].state;
                        console.warn(`Starting check if <${name}> is isolated\nstate: ${JSON.stringify(states)}`);

                        if (states.includes('disable') && states.includes('toggle')) {
                            
                            let isolated = true;
                            $.each(repository[classNameLower].button[name].import, function(index3, objName){
                                if (Path.inPath(objName)) {
                                    isolated = false;
                                    return false;
                                }
                            });
                            
                            if (isolated) {
                                console.log(`<${name}> is isolated, remove its toggle permission.`);
                                Gadget.state(classObject.filter(`button[data-name="${name}"]`).removeClass('toggle'));
                            }
                            else {
                                console.log(`<${name}> is linked.`);
                            }
                            
                        }
                        
                    });
                }

            });

            Path.uniquify();

            console.groupEnd();
            return false;
        }

        static erase(data) {
            console.groupCollapsed(`%c[%cPath%c.%cerase%c]%c Start Execution...`, "color: #5946B2", "color: #9C51B6", "color: initial", "color: #5DADEC", "color: #5946B2", "color: initial");
            const self = data;
            const list = Gadget.combine(self.data.import, self.data.export);
            let targetBranch = $();

            console.warn(`list: `, list);

            $.each(list, function(index, name){
                targetBranch = targetBranch.add(classBranch.filter(function(){
                    return [self.data.name, name].every(element => $(this).data('connect').includes(element))
                }));
            });

            /*console.groupCollapsed(`targetBranch: `);
            targetBranch.each(function(){
                console.log($(this).data('connect'));
            });
            console.groupEnd();*/

            $.each(targetBranch, function(){
                
                BranchFactory.identifyForDisable(BranchFactory.direction($(this)));

            });
            


            console.groupEnd();
            return false;
        }

        static overhaul(usage) {
            console.groupCollapsed(`%c[%cPath%c.%coverhaul%c]%c Start Execution...`, "color: #5946B2", "color: #9C51B6", "color: initial", "color: #5DADEC", "color: #5946B2", "color: initial");
            
            if (usage == 'disable') {
                classBranch.each(function(index, branch){
                    BranchFactory.identifyForDisable(BranchFactory.direction($(this)));
                });
            }
            else if (usage == 'enable') {
                classBranch.each(function(index, branch){
                    BranchFactory.identifyForEnable(BranchFactory.direction($(this)));
                });
            }
            else {
                console.warn(`You forgot to assign usage!`);
            }
            
            console.groupEnd();
            return false;
        }

        static inPath(name) {
            let result = false;
            $.each(path[classNameLower], function(index, array){
                if (array.includes(name)) {
                    result = true;
                    return false;;
                }
            });
            return result;
        }

        static uniquify() {
            path[classNameLower] = $.grep(path[classNameLower], function(array, index){
                return array.toString() != []
            });
            return false;
        }
    }

    class BranchFactory {
        static direction(target) {
            const self = $(target);
            const location = `${self.data('location').row}-${self.data('location').column}`;
            const branch = {
                "object": self.next('img'),
                "data": repository[classNameLower].branch[location],
                "direction": {
                    "top": false,
                    "down": false,
                    "left": false,
                    "right": false
                }
            };

            if (Gadget.anyEnable(branch.data.top)) {branch.direction.top = true}
            if (Gadget.anyEnable(branch.data.down)) {branch.direction.down = true}
            if (Gadget.anyEnable(branch.data.left)) {branch.direction.left = true}
            if (Gadget.anyEnable(branch.data.right)) {branch.direction.right = true}
            console.groupCollapsed(`Branch ${location}`);
            console.info(`branch.data: `, branch.data);
            console.info(`branch.direction: `, branch.direction);
            console.groupEnd();

            return branch;
        }

        static identifyForEnable(data) {
            const branch = data;
            const direction = [branch.direction.top, branch.direction.down, branch.direction.left, branch.direction.right].toString();
            
            switch (branch.object.attr('class')) {
                case 'br_vertical':
                    if (direction == [true, true, false, false]) {branch.object.addClass('active');}
                    break;
                case 'br_horizontal':
                    if (direction == [false, false, true, true]) {branch.object.addClass('active');}
                    break;
                case 'br_typeL_LD':
                    if (direction == [false, true, true, false]) {branch.object.addClass('active');}
                    break;
                case 'br_typeL_LT':
                    if (direction == [true, false, true, false]) {branch.object.addClass('active');}
                    break;
                case 'br_typeL_RD':
                    if (direction == [false, true, false, true]) {branch.object.addClass('active');}
                    break;
                case 'br_typeL_RT':
                    if (direction == [true, false, false, true]) {branch.object.addClass('active');}
                    break;
                case 'br_typeT_LRD':
                    if (direction == [false, false, true, true]) {branch.object.nextAll().remove();branch.object.after($(document.createElement('img')).addClass('br_typeT_LRD_active_LR active'))}
                    else if (direction == [false, true, true, false]) {branch.object.nextAll().remove();branch.object.after($(document.createElement('img')).addClass('br_typeT_LRD_active_LD active'))}
                    else if (direction == [false, true, false, true]) {branch.object.nextAll().remove();branch.object.after($(document.createElement('img')).addClass('br_typeT_LRD_active_RD active'))}
                    else if (direction == [false, true, true, true]) {branch.object.nextAll().remove();branch.object.addClass('active').after($(document.createElement('img')).addClass('br_typeT_LRD_active_LRD active'))}
                    break;
                case 'br_typeT_LTD':
                    if (direction == [true, false, true, false]) {branch.object.nextAll().remove();branch.object.after($(document.createElement('img')).addClass('br_typeT_LTD_active_LT active'))}
                    else if (direction == [false, true, true, false]) {branch.object.nextAll().remove();branch.object.after($(document.createElement('img')).addClass('br_typeT_LTD_active_LD active'))}
                    else if (direction == [true, true, false, false]) {branch.object.nextAll().remove();branch.object.after($(document.createElement('img')).addClass('br_typeT_LTD_active_TD active'))}
                    else if (direction == [true, true, true, false]) {branch.object.nextAll().remove();branch.object.addClass('active').after($(document.createElement('img')).addClass('br_typeT_LTD_active_LTD active'))}
                    break;
                case 'br_typeT_RTD':
                    if (direction == [true, false, false, true]) {branch.object.nextAll().remove();branch.object.after($(document.createElement('img')).addClass('br_typeT_RTD_active_RT active'))}
                    else if (direction == [false, true, false, true]) {branch.object.nextAll().remove();branch.object.after($(document.createElement('img')).addClass('br_typeT_RTD_active_RD active'))}
                    else if (direction == [true, true, false, false]) {branch.object.nextAll().remove();branch.object.after($(document.createElement('img')).addClass('br_typeT_RTD_active_TD active'))}
                    else if (direction == [true, true, false, true]) {branch.object.nextAll().remove();branch.object.addClass('active').after($(document.createElement('img')).addClass('br_typeT_RTD_active_RTD active'))}
                    break;
                case 'br_typeX_LRTD':
                    if (direction == [false, false, true, true]) {branch.object.nextAll().remove();branch.object.after($(document.createElement('img')).addClass('br_typeX_LRTD_active_LR active'))}
                    else if (direction == [true, false, true, false]) {branch.object.nextAll().remove();branch.object.after($(document.createElement('img')).addClass('br_typeX_LRTD_active_LT active'))}
                    else if (direction == [false, true, true, false]) {branch.object.nextAll().remove();branch.object.after($(document.createElement('img')).addClass('br_typeX_LRTD_active_LD active'))}
                    else if (direction == [true, false, false, true]) {branch.object.nextAll().remove();branch.object.after($(document.createElement('img')).addClass('br_typeX_LRTD_active_RT active'))}
                    else if (direction == [false, true, false, true]) {branch.object.nextAll().remove();branch.object.after($(document.createElement('img')).addClass('br_typeX_LRTD_active_RD active'))}
                    else if (direction == [true, true, false, false]) {branch.object.nextAll().remove();branch.object.after($(document.createElement('img')).addClass('br_typeX_LRTD_active_TD active'))}
                    else if (direction == [false, true, true, true]) {branch.object.nextAll().remove();branch.object.after($(document.createElement('img')).addClass('br_typeX_LRTD_active_LRD active'))}
                    else if (direction == [true, false, true, true]) {branch.object.nextAll().remove();branch.object.after($(document.createElement('img')).addClass('br_typeX_LRTD_active_LRT active'))}
                    else if (direction == [true, true, true, false]) {branch.object.nextAll().remove();branch.object.after($(document.createElement('img')).addClass('br_typeX_LRTD_active_LTD active'))}
                    else if (direction == [true, true, false, true]) {branch.object.nextAll().remove();branch.object.after($(document.createElement('img')).addClass('br_typeX_LRTD_active_RTD active'))}
                    else if (direction == [true, true, true, true]) {branch.object.nextAll().remove();branch.object.addClass('active').after($(document.createElement('img')).addClass('br_typeX_LRTD_active_LRTD active'))}
                    break;
            }
        }

        static identifyForDisable(data) {
            const branch = data;
            const direction = [branch.direction.top, branch.direction.down, branch.direction.left, branch.direction.right].toString();


            
            switch (branch.object.attr('class').match(RegExp(/br\w+/, 'gmu')).toString()) {
                case 'br_vertical':
                    if (direction == [true, true, false, false]) {branch.object.addClass('active');}
                    else {branch.object.removeClass('active');}
                    break;
                case 'br_horizontal':
                    if (direction == [false, false, true, true]) {branch.object.addClass('active');}
                    else {branch.object.removeClass('active');}
                    break;
                case 'br_typeL_LD':
                    if (direction == [false, true, true, false]) {branch.object.addClass('active');}
                    else {branch.object.removeClass('active');}
                    break;
                case 'br_typeL_LT':
                    if (direction == [true, false, true, false]) {branch.object.addClass('active');}
                    else {branch.object.removeClass('active');}
                    break;
                case 'br_typeL_RD':
                    if (direction == [false, true, false, true]) {branch.object.addClass('active');}
                    else {branch.object.removeClass('active');}
                    break;
                case 'br_typeL_RT':
                    if (direction == [true, false, false, true]) {branch.object.addClass('active');}
                    else {branch.object.removeClass('active');}
                    break;
                case 'br_typeT_LRD':
                    branch.object.nextAll().remove();
                    if (direction == [false, true, true, true]) {branch.object.addClass('active').after($(document.createElement('img')).addClass('br_typeT_LRD_active_LRD active'))}
                    else {
                        branch.object.removeClass('active');
                        if (direction == [false, false, true, true]) {branch.object.after($(document.createElement('img')).addClass('br_typeT_LRD_active_LR active'))}
                        else if (direction == [false, true, true, false]) {branch.object.after($(document.createElement('img')).addClass('br_typeT_LRD_active_LD active'))}
                        else if (direction == [false, true, false, true]) {branch.object.after($(document.createElement('img')).addClass('br_typeT_LRD_active_RD active'))}
                    }
                    break;
                case 'br_typeT_LTD':
                    branch.object.nextAll().remove();
                    if (direction == [true, true, true, false]) {branch.object.addClass('active').after($(document.createElement('img')).addClass('br_typeT_LTD_active_LTD active'))}
                    else {
                        branch.object.removeClass('active');
                        if (direction == [true, false, true, false]) {branch.object.after($(document.createElement('img')).addClass('br_typeT_LTD_active_LT active'))}
                        else if (direction == [false, true, true, false]) {branch.object.after($(document.createElement('img')).addClass('br_typeT_LTD_active_LD active'))}
                        else if (direction == [true, true, false, false]) {branch.object.after($(document.createElement('img')).addClass('br_typeT_LTD_active_TD active'))}
                    }
                    break;
                case 'br_typeT_RTD':
                    branch.object.nextAll().remove();
                    if (direction == [true, true, false, true]) {branch.object.addClass('active').after($(document.createElement('img')).addClass('br_typeT_RTD_active_RTD active'))}
                    else {
                        branch.object.removeClass('active');
                        if (direction == [true, false, false, true]) {branch.object.after($(document.createElement('img')).addClass('br_typeT_RTD_active_RT active'))}
                        else if (direction == [false, true, false, true]) {branch.object.after($(document.createElement('img')).addClass('br_typeT_RTD_active_RD active'))}
                        else if (direction == [true, true, false, false]) {branch.object.removeClass('active').after($(document.createElement('img')).addClass('br_typeT_RTD_active_TD active'))}
                    }
                    break;
                case 'br_typeX_LRTD':
                    branch.object.nextAll().remove();
                    if (direction == [true, true, true, true]) {branch.object.addClass('active').after($(document.createElement('img')).addClass('br_typeX_LRTD_active_LRTD active'))}
                    else {
                        branch.object.removeClass('active');
                        if (direction == [false, false, true, true]) {branch.object.after($(document.createElement('img')).addClass('br_typeX_LRTD_active_LR active'))}
                        else if (direction == [true, false, true, false]) {branch.object.after($(document.createElement('img')).addClass('br_typeX_LRTD_active_LT active'))}
                        else if (direction == [false, true, true, false]) {branch.object.after($(document.createElement('img')).addClass('br_typeX_LRTD_active_LD active'))}
                        else if (direction == [true, false, false, true]) {branch.object.after($(document.createElement('img')).addClass('br_typeX_LRTD_active_RT active'))}
                        else if (direction == [false, true, false, true]) {branch.object.after($(document.createElement('img')).addClass('br_typeX_LRTD_active_RD active'))}
                        else if (direction == [true, true, false, false]) {branch.object.after($(document.createElement('img')).addClass('br_typeX_LRTD_active_TD active'))}
                        else if (direction == [false, true, true, true]) {branch.object.after($(document.createElement('img')).addClass('br_typeX_LRTD_active_LRD active'))}
                        else if (direction == [true, false, true, true]) {branch.object.after($(document.createElement('img')).addClass('br_typeX_LRTD_active_LRT active'))}
                        else if (direction == [true, true, true, false]) {branch.object.after($(document.createElement('img')).addClass('br_typeX_LRTD_active_LTD active'))}
                        else if (direction == [true, true, false, true]) {branch.object.after($(document.createElement('img')).addClass('br_typeX_LRTD_active_RTD active'))}
                    }
                    break;
            }
        }
    }

    class Tooltip {
        static execute(cls) {

            console.groupCollapsed(`%c[%cTooltip%c]%c`, "color: #5946B2", "color: #9C51B6", "color: #5946B2", "color: initial");
            $(`div#${cls} .content button[data-name]`).each(function(){
                const objName = $(this).data('name');
                const getID = $(this).closest('div.tabcontent').attr('id');

                Tooltip.HeaderText($(this), objName, getID.toLowerCase());
                Tooltip.FooterText($(this), objName, getID.toLowerCase());
                Tooltip.BodyText($(this), objName, getID);
            });
            console.groupEnd();
            return false;

        }

        static HeaderText(object, name, cls) {
            const header = $(object).siblings('span.tooltip').find('span[data-tooltip="header"]');

            if (Gadget.defined(repository[cls].button[name].display)) {name = repository[cls].button[name].display}
            switch (repository[cls].button[name].level) {
                case 0:
                    const combo = repository[cls].button[name].combo;
                    header.css({"font-size": "1.25em", "font-weight": "800", "color": "#55FF55", "text-shadow": "2px 2px #153F15"}).text(name);
                    header.after(`<span data-tooltip="combo" style="display: block; color: #FFAA00; text-shadow: 2px 2px #2A2A00">Click Combo\uFF1A<span style="color: #FF55FF; text-shadow: 2px 2px #3F153F">${combo[0]}<span style="color: #AAAAAA; text-shadow: 2px 2px #2A2A2A">-</span>${combo[1]}<span style="color: #AAAAAA; text-shadow: 2px 2px #2A2A2A">-</span>${combo[2]}</span></span>`);
                    break;
                case 1:
                    header.css({"font-size": "1.25em", "font-weight": "800", "color": "#FFFFFF", "text-shadow": "2px 2px #3F3F3F"}).text(name);
                    break;
                case 2:
                    header.css({"font-size": "1.25em", "font-weight": "800", "color": "#FFAA00", "text-shadow": "2px 2px #2A2A00"}).text(name);
                    break;
                case 3:
                    header.css({"font-size": "1.25em", "font-weight": "800", "color": "#FF55FF", "text-shadow": "2px 2px #3F153F"}).text(name);
                    break;
                case 4:
                    header.css({"font-size": "1.25em", "font-weight": "800", "color": "#FF5555", "text-shadow": "2px 2px #3F1515"}).text(name);
                    break;
            }
        }

        static BodyText(object, name, id) {
            
            //if (!["Archer", "Mage", "Shaman", "Warrior"].includes(id)) {return false}

            $.ajax({
                url: `https://raw.githubusercontent.com/qiuzilay/Website-Code/main/Ability%20Tree/storage/tooltip/CHI/${id}/${name}.txt`,
                dataType: "text",
                success: function(text){
                    text = Tooltip.colorTransform(text);
                    repository[id.toLowerCase()].button[name].content = text;
                    $(object).siblings('span.tooltip').find('span[data-tooltip="body"]').html(text);
                },
                error: function(){
                    console.error(`<${name}> Failed to Load.`);
                }
            });
        }

        static FooterText(object, name, cls) {
            
            console.log(`<${name}>`);
            
            const footer = $(object).siblings('span.tooltip').find('span[data-tooltip="footer"]');
            const get = {
                "cost": repository[cls].button[name].cost,
                "lock": repository[cls].button[name].lock,
                "required": repository[cls].button[name].required,
                "archetype": repository[cls].button[name].archetype
                };
            const archetype = {};
            const info = {};
            const blank = function(){return $(document.createElement('span')).css({"display":"block"}).text('\u200D')};

            //create Ability point cost
            info.cost = $(document.createElement('span')).addClass('checkmark')
            .css({"display":"block"})
            .html(` 技能點數\uff1a<span data-update="point" style="color: #FFFFFF; text-shadow: 2px 2px #3F3F3F">${get.cost}</span>`);

            //create Archetype Information
            if (Gadget.nonNull(get.archetype.name)) {
                archetype.name = $(document.createElement('span'));
                switch (get.archetype.name) {
                    case 'Fallen':
                        archetype.name.css({"color":"#FF5555", "text-shadow": "2px 2px #3F1515", "font-size": "1.25em", "font-weight":"800", "display":"block"}).text(`${get.archetype.name} Archetype`);
                        break;
                    case 'Battle Monk':
                        archetype.name.css({"color":"#FFFF55", "text-shadow": "2px 2px #3F3F15", "font-size": "1.25em", "font-weight":"800", "display":"block"}).text(`${get.archetype.name} Archetype`);
                        break;
                    case 'Paladin':
                        archetype.name.css({"color":"#55FFFF", "text-shadow": "2px 2px #153F3F", "font-size": "1.25em", "font-weight":"800", "display":"block"}).text(`${get.archetype.name} Archetype`);
                        break;
                    case 'Boltslinger':
                        archetype.name.css({"color":"#FFFF55", "text-shadow": "2px 2px #3F3F15", "font-size": "1.25em", "font-weight":"800", "display":"block"}).text(`${get.archetype.name} Archetype`);
                        break;
                    case 'Sharpshooter':
                        archetype.name.css({"color":"#FF55FF", "text-shadow": "2px 2px #3F153F", "font-size": "1.25em", "font-weight":"800", "display":"block"}).text(`${get.archetype.name} Archetype`);
                        break;
                    case 'Trapper':
                        archetype.name.css({"color":"#00AA00", "text-shadow": "2px 2px #002A00", "font-size": "1.25em", "font-weight":"800", "display":"block"}).text(`${get.archetype.name} Archetype`);
                        break;
                    case 'Riftwalker':
                        archetype.name.css({"color":"#55FFFF", "text-shadow": "2px 2px #153F3F", "font-size": "1.25em", "font-weight":"800", "display":"block"}).text(`${get.archetype.name} Archetype`);
                        break;
                    case 'Light Bender':
                        archetype.name.css({"color":"#FFFFFF", "text-shadow": "2px 2px #3F3F3F", "font-size": "1.25em", "font-weight":"800", "display":"block"}).text(`${get.archetype.name} Archetype`);
                        break;
                    case 'Arcanist':
                        archetype.name.css({"color":"#AA00AA", "text-shadow": "2px 2px #2A002A", "font-size": "1.25em", "font-weight":"800", "display":"block"}).text(`${get.archetype.name} Archetype`);
                        break;
                    case 'Acrobat':
                        archetype.name.css({"color":"#FFFFFF", "text-shadow": "2px 2px #3F3F3F", "font-size": "1.25em", "font-weight":"800", "display":"block"}).text(`${get.archetype.name} Archetype`);
                        break;
                    case 'Trickster':
                        archetype.name.css({"color":"#FF55FF", "text-shadow": "2px 2px #3F153F", "font-size": "1.25em", "font-weight":"800", "display":"block"}).text(`${get.archetype.name} Archetype`);
                        break;
                    case 'Shadestepper':
                        archetype.name.css({"color":"#AA0000", "text-shadow": "2px 2px #2A0000", "font-size": "1.25em", "font-weight":"800", "display":"block"}).text(`${get.archetype.name} Archetype`);
                        break;
                    case 'Acolyte':
                        archetype.name.css({"color":"#FF5555", "text-shadow": "2px 2px #3F1515", "font-size": "1.25em", "font-weight":"800", "display":"block"}).text(`${get.archetype.name} Archetype`);
                        break;
                    case 'Summoner':
                        archetype.name.css({"color":"#FFAA00", "text-shadow": "2px 2px #2A2A00", "font-size": "1.25em", "font-weight":"800", "display":"block"}).text(`${get.archetype.name} Archetype`);
                        break;
                    case 'Ritualist':
                        archetype.name.css({"color":"#55FF55", "text-shadow": "2px 2px #153F15", "font-size": "1.25em", "font-weight":"800", "display":"block"}).text(`${get.archetype.name} Archetype`);
                        break;
                }

                if (get.archetype.min > 0) {
                    archetype.min = $(document.createElement('span')).addClass('ban')
                    .css({"display":"block"})
                    .html(` 最低 ${get.archetype.name} Archetype 點數需求\uff1a<span data-update="archetype" style="color: #FF5555; text-shadow: 2px 2px #3F1515">0</span><span style="color: #AAAAAA; text-shadow: 2px 2px #2A2A2A">/${get.archetype.min}</span>`);
                }
            }
            
            //create Require Ability 
            if (Gadget.nonNull(get.required)) {
                info.required = $(document.createElement('span')).addClass('ban')
                .css({"display":"block"})
                .html(` 技能需求\uff1a<span data-update="required" style="color: #FFFFFF; text-shadow: 2px 2px #3F3F3F">${get.required}</span>`);
            }

            //create Lock Target Information
            if (Gadget.nonNull(get.lock)) {
                const locker = function(target){return `\n- <span style="color: #AAAAAA; text-shadow: 2px 2px #2A2A2A">${target}</span>`};

                info.lock = $(document.createElement('span'))
                .css({"display":"block", "color":"#FF5555", "text-shadow": "2px 2px #3F1515"})
                .html(`衝突技能\uff1a` + get.lock.reduce(function(previous, current){return previous + locker(current)}, ''));
            }



            footer.append(blank).append(info.cost);

            if (Gadget.defined(info.required)) {
                footer.append(info.required);
            }

            if (Gadget.defined(archetype.name)) {
                footer.prepend(archetype.name).prepend(blank);
                if (get.archetype.min > 0) {
                    footer.append(archetype.min);
                }
            }

            if (Gadget.defined(info.lock)) {
                footer.prepend(info.lock).prepend(blank);
            }
        }

        static colorTransform(content) {
            let result = '';

            $.each(content.split(RegExp(/\u00a7r/, 'gsu')), function(index, text){
                result += TextFactory.extract(text);
            });

            return result;
        }
    }

    class TextFactory {
        static extract(text) {
            if (Gadget.nonNull(text.match(RegExp(/\u00a7\S/, 'gsu')))) {
                
                const temp = text.split(RegExp(/\u00a7\S(.+)/, 'su')); temp.pop();
                const label = TextFactory.palette(text.match(RegExp(/\u00a7\S/, 'su'))[0][1]);
                if (label[1] == 'css') {
                    text = temp[0] + `<span style="${label[0]}">` + TextFactory.extract(temp[1]) + `</span>`;
                }
                else if (label[1] == 'class') {
                    text = temp[0] + `<span class="${label[0]}">` + TextFactory.extract(temp[1]) + `</span>`;
                }

            }
            
            return text
        }

        static palette(hashtag) {
            switch (hashtag) {
                case '0':
                    return ["color: #000000; text-shadow: 2px 2px #000000", "css"];
                case '1':
                    return ["color: #0000AA; text-shadow: 2px 2px #00002A", "css"];
                case '2':
                    return ["color: #00AA00; text-shadow: 2px 2px #002A00", "css"];
                case '3':
                    return ["color: #00AAAA; text-shadow: 2px 2px #002A2A", "css"];
                case '4':
                    return ["color: #AA0000; text-shadow: 2px 2px #2A0000", "css"];
                case '5':
                    return ["color: #AA00AA; text-shadow: 2px 2px #2A002A", "css"];
                case '6':
                    return ["color: #FFAA00; text-shadow: 2px 2px #2A2A00", "css"];
                case '7':
                    return ["color: #AAAAAA; text-shadow: 2px 2px #2A2A2A", "css"];
                case '8':
                    return ["color: #555555; text-shadow: 2px 2px #151515", "css"];
                case '9':
                    return ["color: #5555FF; text-shadow: 2px 2px #15153F", "css"];
                case 'a':
                    return ["color: #55FF55; text-shadow: 2px 2px #153F15", "css"];
                case 'b':
                    return ["color: #55FFFF; text-shadow: 2px 2px #153F3F", "css"];
                case 'c':
                    return ["color: #FF5555; text-shadow: 2px 2px #3F1515", "css"];
                case 'd':
                    return ["color: #FF55FF; text-shadow: 2px 2px #3F153F", "css"];
                case 'e':
                    return ["color: #FFFF55; text-shadow: 2px 2px #3F3F15", "css"];
                case 'f':
                    return ["color: #FFFFFF; text-shadow: 2px 2px #3F3F3F", "css"];
                case 'l':
                    return ["font-weight: 800", "css"];
                case 'n':
                    return ["text-decoration: underline; text-underline-offset: 3px; vertical-align: top;", "css"];
                case 'o':
                    return ["font-size: 0.75em", "css"];
                case 'h':
                    return ["font-size: 1.25em; line-height: 2em", "css"];
                case 'I':
                    return ["font-style: oblique", "css"];
                case 'B':
                    return ["display: inline-block", "css"];
                case 'U':
                    return ["neutral", "class"];
                case 'E':
                    return ["earth", "class"];
                case 'T':
                    return ["thunder", "class"];
                case 'W':
                    return ["water", "class"];
                case 'F':
                    return ["fire", "class"];
                case 'A':
                    return ["air", "class"];
                case 'M':
                    return ["mana", "class"];
                case 'Y':
                    return ["checkmark", "class"];
                case 'N':
                    return ["ban", "class"];
                case 'S':
                    return ["sword", "class"];
                case 'D':
                    return ["duration", "class"];
                case 'R':
                    return ["range", "class"];
                case 'O':
                    return ["areaEffect", "class"];
                case 'H':
                    return ["heart", "class"];
                case 'V':
                    return ["shield", "class"];
                case 'G':
                    return ["blankGap", "class"];
                default:
                    return ["", "class"];
            }
        }
    }

    class LaunchEvent {
        static execute() {
            const parseDate = function(str) {
                const date = latest.split('-');
                return new Date(date[0], date[1] - 1, date[2]);
            }
            const diffDate = function(start, end) {
                return Math.round((end - start) / (1000 * 60 * 60 * 24));
            }

            console.warn(repository);
            LaunchEvent.createObject();
            LaunchEvent.createBranch();
            LaunchEvent.demand();
            LaunchEvent.warning();
            
            time.latest = parseDate(latest);
            time.now = new Date();
            
            if (!( (diffDate(time.latest, time.now) > 14) || !display.changelog )) {
                LaunchEvent.changelog();
            }
        }

        static createObject() {
            console.groupCollapsed(`%c[%cLaunchEvent%c.%ccreateObject%c]%c`, "color: #5946B2", "color: #9C51B6", "color: initial", "color: #5DADEC", "color: #5946B2", "color: initial");
            
            $('.containerslot span.pointer[data-name]').each(function(){
                
                console.log(`<${$(this).data('name')}>`);
                const self = {};
                self.className = $(this).closest('div.tabcontent').attr('id').toLowerCase();
                self.data = repository[self.className].button[$(this).data('name')];
                console.log(self.data);
                
                let style;
                switch (self.data.level) {
                    case 0:
                        switch (self.className) {
                            case 'warrior':
                                style = 'button_warrior';
                                break;
                            case 'archer':
                                style = 'button_archer';
                                break;
                            case 'mage':
                                style = 'button_mage';
                                break;
                            case 'assassin':
                                style = 'button_assassin';
                                break;
                            case 'shaman':
                                style = 'button_shaman';
                                break;
                        }
                        break;
                    case 1:
                        style = 'button_ability1';
                        break;
                    case 2:
                        style = 'button_ability2';
                        break;
                    case 3:
                        style = 'button_ability3';
                        break;
                    case 4:
                        style = 'button_ability4';
                        break;
                }

                $(this).addClass('active').after($(document.createElement('button'))
                .addClass('disable')
                .attr('data-name', repository[self.className].button[self.data.name].name)
                .attr('data-cost', repository[self.className].button[self.data.name].cost)
                .attr('data-import', JSON.stringify(repository[self.className].button[self.data.name].import))
                .attr('data-export', JSON.stringify(repository[self.className].button[self.data.name].export))
                .attr('data-lock', JSON.stringify(repository[self.className].button[self.data.name].lock))
                .attr('data-req', Gadget.stringifyNull(repository[self.className].button[self.data.name].required))
                .attr('data-type-req', Gadget.stringifyNull(repository[self.className].button[self.data.name].archetype.name))
                .attr('data-type-req-min', Gadget.stringifyNull(repository[self.className].button[self.data.name].archetype.min))
                .append(`<img class=${style}>`), `<span class="tooltip"><span data-tooltip="header" style="display: block"></span><span style="display; block">\u200D</span><span data-tooltip="body" style="display: block"></span><span data-tooltip="footer" style="display: block"></span></span>`);

                repository[self.className].button[self.data.name].location = {
                    "row": $(this).closest('tr').index(),
                    "column": $(this).parent('td').index()
                }

                self.obj = $(this).siblings('button');
                if ((repository[self.className].button[self.data.name].location.row == 0) && (repository[self.className].button[self.data.name].location.column == 4)) {
                    self.obj.addClass('toggle');
                }

                Gadget.state(self.obj);
            });

            console.groupEnd();
            return false;
        }

        static createBranch() {
            console.groupCollapsed(`%c[%cLaunchEvent%c.%ccreateBranch%c]%c`, "color: #5946B2", "color: #9C51B6", "color: initial", "color: #5DADEC", "color: #5946B2", "color: initial");
            
            $('.containerslot span.pointer[data-connect]').each(function(){

                const self = {};
                self.idName = $(this).closest('div.tabcontent').attr('id');
                self.className = self.idName.toLowerCase();
                self.connect = $(this).data('connect');
                self.location = {
                    "row": $(this).closest('tr').index(),
                    "column": $(this).parent('td').index()
                };
                self.relative = {
                    "top": [],
                    "down": [],
                    "left": [],
                    "right": []
                };
                const existVal = function(json){
                    const result = []
                    $.each(json, function(index, element){
                        if (element.length > 0) {
                            result.push(true);
                        }
                        else {
                            result.push(false);
                        }
                    });

                    return result;
                };

                $.each(self.connect, function(index, name){
                    const target = {
                        "location": {
                            "row": repository[self.className].button[name].location.row,
                            "column": repository[self.className].button[name].location.column
                        }
                    };

                    if (target.location.column == self.location.column) {
                        if (target.location.row < self.location.row) {self.relative.top.push(name)}
                        else if (target.location.row > self.location.row) {self.relative.down.push(name)}
                        else {console.error(`錯誤，按鈕與支架的位置發生重疊\n位於 (${self.location.row}-${self.location.column}) 的支架\n衝突對象為 <${name}>`)}
                    }
                    else if (target.location.row == self.location.row) {
                        if (target.location.column < self.location.column) {self.relative.left.push(name)}
                        else if (target.location.column > self.location.column) {self.relative.right.push(name)}
                        else {console.error(`錯誤，按鈕與支架的位置發生重疊\n位於 (${self.location.row}-${self.location.column}) 的支架\n衝突對象為 <${name}>`)}
                    }
                    else {
                        const exist = function(larger, smaller, row, column){
                            let result = false;
                            const targetBranch = $(`div#${self.idName} .content table tr`).eq(row).find('td').eq(column).children('span[data-connect]').data('connect');
                            if (Gadget.defined(targetBranch)) {
                                if ((larger > smaller) && (targetBranch.includes(name))) {
                                    result = true;
                                }
                            }

                            return result;
                        };
                        if (exist(self.location.row, target.location.row, self.location.row-1, self.location.column)) {self.relative.top.push(name)}
                        else if (exist(target.location.row, self.location.row, self.location.row+1, self.location.column)) {self.relative.down.push(name)}
                        else if (exist(self.location.column, target.location.column, self.location.row, self.location.column-1)) {self.relative.left.push(name)}
                        else if (exist(target.location.column, self.location.column, self.location.row, self.location.column+1)) {self.relative.right.push(name)}
                        else {console.error('支架與按鈕的相對位置判斷發生邏輯錯誤\uFF01', self, target)}
                    }
                });

                repository[self.className].branch[`${self.location.row}-${self.location.column}`] = self.relative;

                let style;
                const states = existVal(self.relative).toString();
                if (states == [true, true, true, true]) {style = 'br_typeX_LRTD'}
                else if (states == [true, true, true, false]) {style = 'br_typeT_LTD'}
                else if (states == [true, true, false, true]) {style = 'br_typeT_RTD'}
                else if (states == [true, false, true, true]) {style = 'br_typeT_LRT'}
                else if (states == [false, true, true, true]) {style = 'br_typeT_LRD'}
                else if (states == [true, true, false, false]) {style = 'br_vertical'}
                else if (states == [true, false, true, false]) {style = 'br_typeL_LT'}
                else if (states == [true, false, false, true]) {style = 'br_typeL_RT'}
                else if (states == [false, true, true, false]) {style = 'br_typeL_LD'}
                else if (states == [false, true, false, true]) {style = 'br_typeL_RD'}
                else if (states == [false, false, true, true]) {style = 'br_horizontal'}
                else {console.warn('支架判斷發生邏輯錯誤\uFF01'); $(this).before($(document.createElement('span')).css({"color": "white", "width": "100%", "height": "100%", "display": "flex", "align-items": "center", "position": "absolute", "justify-content": "center"}).text(`${self.location.row}-${self.location.column}`))}

                $(this).attr('data-location', JSON.stringify(self.location)).after($(document.createElement('img')).addClass(style));
            });
            
            console.groupEnd();
            return false;
        }

        static demand() {
            console.groupCollapsed(`%c[%cLaunchEvent%c.%cdemand%c]%c`, "color: #5946B2", "color: #9C51B6", "color: initial", "color: #5DADEC", "color: #5946B2", "color: initial");

            $.each(['warrior', 'archer', 'mage', 'assassin', 'shaman'], function(index1, clsName){
                $.each(Object.keys(repository[clsName].button), function(index, objName){
                    
                    console.log(`<${objName}>`, repository[clsName].button[objName]);
                    
                    const target = repository[clsName].button[objName].required;
                    if (Gadget.nonNull(target)) {
                        if (Gadget.defined(repository[clsName].button[target].demand)) {
                            repository[clsName].button[target].demand.push(objName);
                        }
                        else {
                            repository[clsName].button[target].demand = Array(objName);
                        }
                    }
                })
            })

            console.groupEnd();
            return false;
        }
        
        static warning() {
            alertor.find('img').attr('src', '../storage/images/icon-warning.png')
            .siblings('span#Textarea').html('從連結導入的技能樹無法修改<br>請重置技能樹以進行操作');

            alertor.find('button#Reset').text('重置').siblings('button#Close').text('了解');
        }

        static changelog() {
            console.groupCollapsed(`%c[%cLaunchEvent%c.%cchangelog%c]%c`, "color: #5946B2", "color: #9C51B6", "color: initial", "color: #5DADEC", "color: #5946B2", "color: initial");
            console.log(`Cookie(original): `, document.cookie, `[${$.type(document.cookie)}]`);
            console.log('display-changelog: ', Cookie.getItem('display-changelog'));
            console.log('last-view: ', Cookie.getItem('last-view'));

            if ( (Cookie.getItem('display-changelog') == "false") && (Cookie.getItem('last-view', latest) == latest) ) {return false}
            else {

                changelog.element.find('label[for="check"]').text("直至下次更新前不再顯示")
                changelog.element.find('button.changelog-exit').text("\u2718");
                changelog.element.css({"display": "flex"})
                .find('span.header')
                .html(`Changelog <span style="font-size: medium; font-weight: 400;">Update on ${latest.replace(RegExp("-", 'g'), "/")}</span>`);

                changelog.button.each(function(){
                    switch ($(this).data('class')) {
                        case 'warrior':
                            $(this).text("戰士");
                            break;
                        case 'archer':
                            $(this).text("弓箭手");
                            break;
                        case 'mage':
                            $(this).text("法師");
                            break;
                        case 'assassin':
                            $(this).text("刺客");
                            break;
                        case 'shaman':
                            $(this).text("薩滿");
                            break;
                    }
                });

                changelog.button.one('click', function(){
                    const cls = $(this).data('class');

                    if (!["archer", "mage", "warrior", "shaman"].includes(cls)) {
                        changelog.element.find(`span[data-changelog="${cls}"]`).text("尚未追蹤");
                        return false;
                    }
                    
                    $.ajax({
                        url : `https://raw.githubusercontent.com/qiuzilay/Website-Code/main/Ability%20Tree/storage/changelog/${latest}/${cls}.txt`,
                        dataType: "text",
                        success : function(text){
                            changelog.element.find(`span[data-changelog="${cls}"]`).html(Tooltip.colorTransform(text));
                        }
                    });
                })

                changelog.element.find('button.changelog-exit').one('click', function(){

                    changelog.element.css({"display": "none"});

                    if (changelog.element.find('input#check').is(':checked')) {Cookie.setItem('display-changelog', 'false')}
                    else {Cookie.setItem('display-changelog', 'true')}

                    Cookie.setItem('last-view', latest);
                })
            }

            console.warn(`Cookie(new):`, document.cookie);
            console.groupEnd();
            return false;
        }
    }

    class Cookie {
        static getItem(name) {
            const cookie = document.cookie + ";";
            const item = RegExp(`${name}=(.+?);{1}`, 'gmu').exec(cookie);
            
            if (Gadget.nonNull(item)) {
                return item[1];
            }
            else {
                return item;
            }
        }

        static setItem(name, value) {
            time.expire = new Date(time.now.getTime() + 60*60*24*400)
            document.cookie = `${name}=${value}; domain=wynncraft-news.blogspot.com; path=/; expires=${time.expire.toUTCString()}`;
            return false;
        }

        static removeItem(name) {
            document.cookie = `${name}=; domain=wynncraft-news.blogspot.com; path=/`;
            return false;
        }
    }

    class Misc {
        static confirm(obj) {
            const self = {
                "object": $(obj),
                "cell": $(obj).parent('td'),
                "tooltip": $(obj).siblings('span.tooltip'),
            };

            copyTooltip = $(obj).siblings('span.tooltip').clone();

            self.object.addClass('reset').removeClass('trigger');
            self.cell.find('img.orb').addClass('red_checkmark').removeClass('orb');
            self.tooltip.empty().html($(document.createElement('span')).css({"color":"#FF5555", "text-shadow": "2px 2px #3F1515", "font-size": "1.25em", "font-weight":"800"}).text('確認重置\uFF1F'));
            setTimeout(() => {
                self.object.removeClass('reset').addClass('trigger').find('img.red_checkmark').addClass('orb').removeClass('red_checkmark');
                if (self.object.siblings('span.tooltip').prop('outerHTML') != copyTooltip.prop('outerHTML')) {
                    self.object.siblings('span.tooltip').replaceWith(copyTooltip);
                    classAPool = $(`div#${className} span[data-type="point"]`);
                }
            }, 3000);
        }

        static reset(obj, fromRegular=true) {
            console.groupCollapsed(`%c[%cMisc%c.%creset%c]%c`, "color: #5946B2", "color: #9C51B6", "color: initial", "color: #5DADEC", "color: #5946B2", "color: initial");
            
            if (fromRegular) {
                $(obj).addClass('trigger')
                .removeClass('reset')
                .find('img.red_checkmark')
                .addClass('orb')
                .removeClass('red_checkmark')
                
                $(obj).siblings('span.tooltip').replaceWith(copyTooltip);
            }

            const self = {
                "object": $(obj),
                "cell": $(obj).parent('td'),
                "class": {
                    "object": currentClass.find('.content button[data-name]'),
                    "info": currentClass.find('.content_bottom span[data-type]')
                }
            };

            self.class.info.each(function(){
                if ($(this).data('type') == 'point') {$(this).text(45)}
                else {$(this).text(0)}
            });
            
            self.class.object.each(function(){

                const target = {
                    "object": $(this),
                    "data": repository[classNameLower].button[$(this).data('name')],
                    "tooltip": $(this).siblings('span.tooltip')
                };
                
                if ((target.data.location.row == 0) && (target.data.location.column == 4)) {
                    Gadget.state($(this).addClass('disable toggle').removeClass('enable force lock read-only'))
                }
                else {
                    Gadget.state($(this).addClass('disable').removeClass('enable force lock toggle read-only'));
                }

                target.tooltip.find('span[data-update]').each(function(){
                    
                    switch ($(this).data('update')) {
                        case 'point':
                            $(this).parent('span').addClass('checkmark').removeClass('ban');
                            break;
                        case 'required':
                            $(this).parent('span').addClass('ban').removeClass('checkmark');
                            break;
                        case 'archetype':
                            $(this).text(0)
                            .css({"color":"#FF5555", "text-shadow": "2px 2px #3F1515"})
                            .parent('span').addClass('ban').removeClass('checkmark');
                            break;
                    }

                });

            });

            if (window.location.href.includes('\u0023')) {
                history.replaceState('', document.title, window.location.href.replace(RegExp(/(?=[\u0023])\S+/, 'gmu'), ''))
            }

            path[classNameLower] = [];
            Path.overhaul('disable');

            classInfo = $(`div#${className} span[data-type]`);
            classAPool = $(`div#${className} span[data-type="point"]`);

            window.scrollTo({ top: 0, behavior: 'smooth' });
            Gadget.popup(`技能樹重置成功\uFF01`, '../storage/images/icon-checkmark.png');
            const playsound = new SoundEffect('levelup', 0.5);


            console.groupEnd();
            return false;
        }

        static encoder(obj) {
            console.groupCollapsed(`%c[%cMisc%c.%cencoder%c]%c`, "color: #5946B2", "color: #9C51B6", "color: initial", "color: #5DADEC", "color: #5946B2", "color: initial");
            const classELEMENT = $(obj).closest('div.tabcontent');
            const self = {
                "url": {
                    "original": window.location.href.replace(RegExp(/(?=[\u0023])\S+/, 'gsu'), ''),
                    "new": {
                        "info": [],
                        "object": [],
                        "output": null
                    }
                },
                "class": {
                    "name": className,
                    "info": classInfo
                }
            };


            self.class.info.each(function(){self.url.new.info.push($(this).text())});

            const final = [];
            const previous = [0];
            classObject.each(function(){

                const classList = $(this).attr('class').split(/\s+/);
                const temp = {
                    "check": {
                        "disable": classList.includes('disable'),
                        "enable": classList.includes('enable'),
                        "force": classList.includes('force'),
                        "lock": classList.includes('lock'),
                        "toggle": classList.includes('toggle')
                    },
                    "string": null
                };

                /**
                    * enable <-//-> force
                    * enable <-//-> lock
                */

                if (temp.check.enable) {
                    temp.string = "E";
                }
                else if (temp.check.disable) {
                    if (temp.check.toggle) {
                        switch (`[${temp.check.lock}, ${temp.check.force}]`) {
                            case '[true, true]':
                                temp.string = "T";
                                break;
                            case '[true, false]':
                                temp.string = "L";
                                break;
                            case '[false, true]':
                                temp.string = "F";
                                break;
                            default:
                                temp.string = "D";
                                break;
                        }
                    }
                    else {
                        switch (`[${temp.check.lock}, ${temp.check.force}]`) {
                            case '[true, true]':
                                temp.string = "t";
                                break;
                            case '[true, false]':
                                temp.string = "l";
                                break;
                            case '[false, true]':
                                temp.string = "f";
                                break;
                            default:
                                temp.string = "d";
                                break;
                        }
                    }
                }
                else {console.warn('Weird')}

                //console.info(`<${$(this).data('name')}>`, temp.check, `\nResult: ${temp.string}`);



                if (previous[1] == temp.string) {
                    previous[0] += 1;
                }
                else if (!Gadget.defined(previous[1])) {
                    previous[1] = temp.string;
                    previous[0] += 1;
                }
                else {
                    final.push(previous[0].toString() + previous[1]);
                    previous[0] = 1;
                    previous[1] = temp.string;
                }

            });

            final.push(previous[0].toString() + previous[1]);

            self.url.new.object = final.join('');

            self.url.new.output = self.url.original + '\u0023' + self.class.name + '\u002D' + self.url.new.info.join('\u002F') + '\u002D' + self.url.new.object;
            console.info('生成連結\uFF1A' + self.url.new.output);
            navigator.clipboard.writeText(self.url.new.output);
            Gadget.popup('連結已複製至剪貼簿', '../storage/images/icon-checkmark.png');
            new SoundEffect('levelup');
            
            console.groupEnd();
            return false;
        }

        static decoder(getHash) {
            console.groupCollapsed(`%c[%cMisc%c.%cdecoder%c]%c`, "color: #5946B2", "color: #9C51B6", "color: initial", "color: #5DADEC", "color: #5946B2", "color: initial");

            const proc = getHash.split('\u002D'); $(`button.tablinks[data-class="${proc[0]}"]`).click();
            const hashtag = {
                "class": proc[0],
                "info": proc[1].split('\u002F'),
                "object": proc[2],
                "state": []
            }

            classInfo.each(function(index){
                $(this).text(hashtag.info[index]);
            });

            const regex = RegExp(/(\d+)|(\D)/, 'gsu');
            $.each(hashtag.object.match(RegExp(/(\d+\D)/, 'gsu')), function(index, value){

                const temp = value.match(regex);
                console.log(`value[${$.type(value)}]: `, value);
                console.log(`temp[${$.type(temp)}]: `, temp);
                for (let count = 0; count < parseInt(temp[0]); count++) {
                    hashtag.state.push(temp[1]);
                }
                
            });

            //console.log(`state: `, hashtag.state)

            classObject.each(function(index){

                //console.log(`<${$(this).data('name')}> ${hashtag.state[index]}`);
                
                switch (hashtag.state[index]) {
                    case 'E':
                        $(this).addClass('toggle enable').removeClass('disable');
                        break;
                    case 'T':
                        $(this).addClass('toggle disable force lock').removeClass('enable');
                        break;
                    case 'L':
                        $(this).addClass('toggle disable lock').removeClass('enable');
                        break;
                    case 'F':
                        $(this).addClass('toggle disable force').removeClass('enable');
                        break;
                    case 'D':
                        $(this).addClass('toggle disable').removeClass('enable');
                        break;
                    case 't':
                        $(this).addClass('disable force lock').removeClass('enable');
                        break;
                    case 'l':
                        $(this).addClass('disable lock').removeClass('enable');
                        break;
                    case 'f':
                        $(this).addClass('disable force').removeClass('enable');
                        break;
                    case 'd':
                        $(this).addClass('disable').removeClass('enable');
                        break;
                    default:
                        console.warn(`Exception occured during decoding!`);
                        break;
                }

                Gadget.state($(this).addClass('read-only'));

            });

            Update.afterDecode();
            Path.overhaul('enable');

            Gadget.popup(`技能樹匯入成功\uFF01`, '../storage/images/icon-checkmark.png');

            console.groupEnd();
            return false;
        }

    }

    LaunchEvent.execute();

    // Tooltip 分割載入
    $(`div.tab button.tablinks`).one('click', function(){Tooltip.execute($(this).data('class'))});

    // 防止 Tooltip 超出螢幕範圍
    $('td:has(.tooltip)').mouseenter(function(){
        const tooltip = this.querySelector('.tooltip');
        try {
            const rect = tooltip.getBoundingClientRect();
            if (rect.right > $(window).width()) {
                $(tooltip).addClass('reverse');
            }
        }
        finally {
            return false;
        }
    });

    // 防止滑鼠右鍵點擊物件時出現選單
    $('button').bind('contextmenu', function(){
        return false;
    });

    // 按鈕觸發
    $('.content button').on('click', function(){
        
        if (!$(this).hasClass('read-only')) {
            
            const object = new EventHandler($(this));

            if (!$(this).hasClass('enable')) {

                if ($(this).data('cost') <= parseInt(classAPool.text())) {
                    
                    if (!$(this).hasClass('lock')) {
                        if ($(this).hasClass('toggle')) {
                            
                            const require = repository[classNameLower].button[$(this).data('name')].required;
                            if (Gadget.nonNull(require)) {

                                if (repository[classNameLower].button[require].state.includes('enable')) {
                                    
                                    const archetype = repository[classNameLower].button[$(this).data('name')].archetype;
                                    if (Gadget.nonNull(archetype.name)) {

                                        if (archetype.min <= parseInt(classInfo.filter(function(){return $(this).data('type') == archetype.name}).text())) {
                                            object.enableEvent();
                                        }
                                        else {
                                            console.warn(`<${$(this).data('name')}> You haven't enough ${archetype.name} points to unlock this ability.`); Gadget.popup(`您的 ${archetype.name} 的點數不足\uFF01`, '../storage/images/icon-deny.png');
                                        }
                                    }
                                    else {
                                        object.enableEvent();
                                    }

                                }
                                else {
                                    console.warn(`<${$(this).data('name')}> The required ability of this button currently is disable.`); Gadget.popup(`您沒有 ${require} 這個技能\uFF01`, '../storage/images/icon-deny.png');
                                }

                            }
                            else {
                                
                                const archetype = repository[classNameLower].button[$(this).data('name')].archetype;
                                if (Gadget.nonNull(archetype.name)) {

                                    if (archetype.min <= parseInt(classInfo.filter(function(){return $(this).data('type') == archetype.name}).text())) {
                                        object.enableEvent();
                                    }
                                    else {
                                        console.warn(`<${$(this).data('name')}> You haven't enough ${archetype.name} points to unlock this ability.`); Gadget.popup(`您的 ${archetype.name} 的點數不足\uFF01`, '../storage/images/icon-deny.png');
                                    }
                                }
                                else {
                                    object.enableEvent();
                                }

                            }
                        }
                        else {console.warn(`<${$(this).data('name')}> This Toggle Button doesn't have 'toggle' class.`); Gadget.popup("沒有其他技能與此技能連結\uFF01", '../storage/images/icon-deny.png');}
                    }
                    else {console.warn(`<${$(this).data('name')}> This Button has been locked.`); Gadget.popup("此技能已被上鎖\uFF01", '../storage/images/icon-locker.png');}
                }
                else {console.warn(`<${$(this).data('name')}> You haven't enough ability points!`); Gadget.popup(`技能點數不足\uFF01`, '../storage/images/icon-deny.png');}

            }
            else {
                object.disableEvent();
            }

        }
        else {
            if (mobile()) {
                const objName = $(this).data('name');

                if (!Gadget.defined(touch[objName])) {
                    touch[objName] = 1;
                }
                else {
                    touch[objName] += 1;
                }

                setTimeout(() => {touch[objName] -= 1}, 1000)

                if (touch[objName] > 1) {alertor.css({"display": "flex"})}
                else if (touch[objName] <= 0) {delete touch[objName]}
            }
            else {alertor.css({"display": "flex"})}
        }

        return false;
    })

    // Trigger
    $('.content_bottom td:has(span[data-type="point"])').on('click', 'button.trigger', function(event){
        
        if (!mobile()) {
            if (event.shiftKey) {Misc.confirm($(this))}
            else {Misc.encoder($(this))}
        }

        return false;
    });
    
    $('.content_bottom td:has(span[data-type="point"])').on('touchstart', 'button.trigger', function(event){
        event.preventDefault();
        time.start = Date.now();
    }).on('touchend', 'button.trigger', function(event){
        time.end = Date.now();
        if (time.end - time.start > 1000) {Misc.confirm($(this))}
        else {Misc.encoder($(this))}

        return false;
    });

    // Reset
    $('.content_bottom td:has(span[data-type="point"])').on('click', 'button.reset', function(event){
        
        Misc.reset($(this));

        return false;
    });
    // Decoder
    $(function(){
        const hashtag = window.location.href.match(RegExp(/(?=\u0023)\S+/, 'gsu'));

        if (hashtag == null) {return false}
        else {Misc.decoder(hashtag.toString().substring(1))}

        return false;
    });

    // Alert
    $('.alert-window button#Reset').on('click', function(){
        alertor.css({"display": "none"});
        Misc.reset(currentClass.find('.content_bottom button'), false);
    })
    $('.alert-window button#Close').on('click', function(){
        alertor.css({"display": "none"});
    })

    // Changelog
    changelog.button.not('.active').on('click', function(){
        const self = {
            "button": $(this),
            "info": $(`div.changelog span[data-changelog="${$(this).data('class')}"]`)
        };

        changelog.button.removeClass('active');
        self.button.addClass('active');

        changelog.info.not(self.info).add(self.info.parent('div.info')).removeClass('active');
        
        setTimeout(() => {
            changelog.info.not(self.info).css({"display": "none"});
        }, 500)

        self.info.appendTo('div.changelog .info');
        self.info.css({"display": "block"}).scrollTop(0);
        self.button.addClass('active');
        setTimeout(() => {self.info.add(self.info.parent('div.info')).addClass('active')}, 500)
    })

})