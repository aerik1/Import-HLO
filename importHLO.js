//Version 1.00
//Initial Script for basic character attributes

on("chat:message",function(msg){
	if(msg.type=="api" && msg.content.indexOf("!importHLO")==0)
	{
	//Must have a token selected
		var selected = msg.selected;
		if (selected===undefined)
		{
			sendChat("API","Please select a character.");
			return;
		};
		
	   //selected token 
		var token = getObj("graphic",selected[0]._id);
		var character = getObj("character",token.get("represents"));
		
		var herolabData = [];
    		
      //JSON in GM Notes
        const toDo = (herolabData) => {
            
		//Row IDs needed for all the repeating rows in the sheet, use as neccessary per row
            var generateUUID = (function() {
                "use strict";
            
                var a = 0, b = [];
                return function() {
                    var c = (new Date()).getTime() + 0, d = c === a;
                    a = c;
                    for (var e = new Array(8), f = 7; 0 <= f; f--) {
                        e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64);
                        c = Math.floor(c / 64);
                    }
                    c = e.join("");
                    if (d) {
                        for (f = 11; 0 <= f && 63 === b[f]; f--) {
                            b[f] = 0;
                        }
                        b[f]++;
                    } else {
                        for (f = 0; 12 > f; f++) {
                            b[f] = Math.floor(64 * Math.random());
                        }
                    }
                    for (f = 0; 12 > f; f++){
                        c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
                    }
                    return c;
                };
            }()),
            
            generateRowID = function () {
                "use strict";
                return generateUUID().replace(/_/g, "Z");
            };		
		//End Row ID function
		
		//Proper Case if needed	
    		function toProperCase(s) {
                //split the string by space
    			let parts = s.split(" ");
    			let sb = [];
    				
    			for(i=0;i<parts.length;i++) {
    			    if (parts[i] != 'of') {           
                        sb.push(parts[i].substring(0,1).toUpperCase() + parts[i].substring(1).toLowerCase() + ' ');
    			    } else {
    			        sb.push(parts[i] + ' ');
    			    };
                };
    			return sb.join(' ').toString().trim();
    		};
		//End Proper Case function
		
		//Object creation function
		const createAttribute = (name, current) => {
		  if (current == undefined) {
			log(`HLO Import: no value found for ${name}, skipping create.`);
			return;
		  }
		  createObj('attribute', {
			  name : name,
			  current: current,
			  characterid: character.id
		  });
		};
		//End function
		
		
			
		//Begin Character Infomation
                //Import Character Name
        	var characterName = findObjs({type: 'attribute', characterid: character.id, name: 'character_name'})[0];
        	if (!characterName) {
        		createAttribute("character_name", herolabData.actors["actor.1"].name);
        	};   
        	
        	    //Import Class
        	var classJob = findObjs({type: 'attribute', characterid: character.id, name: 'class'})[0];
            str =  herolabData.actors["actor.1"].gameValues.actClassText;
                vals = str.split(" ");
                if (vals.length > 1) {
                    value = vals[0];
                    }
            
        	if (!classJob) {
				createAttribute("class", toProperCase(value));
        	};
        	
              
                //Import Level
        	var level = findObjs({type: 'attribute', characterid: character.id, name: 'level'})[0];
        	if (!level) {
				createAttribute("level", herolabData.actors["actor.1"].gameValues.actLevelNet);
        	};
			
				//Import XP
        	var experience = findObjs({type: 'attribute', characterid: character.id, name: 'xp'})[0];
        	if (!experience) {
        	    if (herolabData.actors["actor.1"].gameValues.actXPNet != undefined) {
					createAttribute("xp", herolabData.actors["actor.1"].gameValues.actXPNet);
        	    }
        	};
			
			    //Import Background
        	var background = findObjs({type: 'attribute', characterid: character.id, name: 'background'})[0];
        	if (!background) {
				createAttribute("background", herolabData.actors["actor.1"].gameValues.actBackgroundText);
        	};
			

        	    //Import Ancestry and Heritage
        	var ancestry = findObjs({type: 'attribute', characterid: character.id, name: 'ancestry_heritage'})[0];
        	var heritage = [];
        	Object.keys(herolabData.actors["actor.1"].items).forEach(function(k){
				if (herolabData.actors["actor.1"].items[k].compset === "Heritage") {
					heritage.push(herolabData.actors["actor.1"].items[k].name)
				}
			});
			
			if (heritage.length == 0){
			    heritage.push(herolabData.actors["actor.1"].gameValues.actRace)
			};

        	if (!ancestry) {
				createAttribute("ancestry_heritage", heritage);
        	};
        	
        	    //Import Deity
        	var deity = findObjs({type: 'attribute', characterid: character.id, name: 'deity'})[0];
        	var deityName = [];
        	Object.keys(herolabData.actors["actor.1"].items).forEach(function(k){
				if (herolabData.actors["actor.1"].items[k].compset === "Deity") {
					deityName.push(herolabData.actors["actor.1"].items[k].name)
				}
			});
			
			if (deityName.length == 0){
			    deityName.push("No Deity")
			};

        	if (!deity) {
				createAttribute("deity", deityName);
        	};
        	
        	    //Import Alignment
        	var alignment = findObjs({type: 'attribute', characterid: character.id, name: 'alignment'})[0];
        	if (!alignment) {
				createAttribute("alignment", herolabData.actors["actor.1"].gameValues.actAlignment);
        	};
        //End Character Information
        	
		//Import Ability Scores
			var abilityScores = [];

			Object.keys(herolabData.actors["actor.1"].items).forEach(function(k){
				if (herolabData.actors["actor.1"].items[k].compset === "AbilScore") {
					abilityScores.push(herolabData.actors["actor.1"].items[k])
				}
			});

				//create Ability Scores and Modifiers
			for (i=0; i < abilityScores.length; i++) {
				var ability = findObjs({type: 'attribute', characterid: character.id, name: `${abilityScores[i].name}`})[0];
				var abilityMod = findObjs({type: 'attribute', characterid: character.id, name: `${abilityScores[i].name}_modifier`})[0];
				
				if (!ability) {
					createAttribute(abilityScores[i].name, abilityScores[i].stNet);
					if (abilityScores[i].stAbScModifier != undefined) {
						createAttribute(`${abilityScores[i].name}_modifier`, abilityScores[i].stAbScModifier);
					};
				};
			};
        //End Ability Scores
			
		//Import Skills
			var skills = [];
			Object.keys(herolabData.actors["actor.1"].items).forEach(function(k){
				if (herolabData.actors["actor.1"].items[k].compset === "Skill") {
					skills.push(herolabData.actors["actor.1"].items[k])
					console.log(skills.length)
				}
			});

				//create Skill Attributes
			for (i=0; i < skills.length; i++) {
				var skillName = findObjs({type: 'attribute', characterid: character.id, name: `${skills[i].name}`})[0];
				var skillAbilityMod = findObjs({type: 'attribute', characterid: character.id, name: `${skills[i].name}_ability`})[0];
				var skillRank = findObjs({type: 'attribute', characterid: character.id, name: `${skills[i].name}_rank`})[0];
				var skillProf = findObjs({type: 'attribute', characterid: character.id, name: `${skills[i].name}_proficiency`})[0];
				var skillProfDisplay = findObjs({type: 'attribute', characterid: character.id, name: `${skills[i].name}_proficiency_display`})[0];
				
				//format inputs for character sheet attributes, default case is Untrained skill
				switch (skills[i].ProfLevel) {
					case "Trained": nameRank = 2;
									nameProfDisplay = "T";
									break;
					case "Expert": nameRank = 4;
								   nameProfDisplay = "E";
								   break;
					case "Master": nameRank = 6;
								   nameProfDisplay = "M";
								   break;
					case "Legendary": nameRank = 8;
									  nameProfDisplay = "L";
									  break;
					default: nameRank = null;
							 nameProfDisplay = null;
							 break;
				};	
				
				if (!skills[i].name.includes("Lore")) {
					if (!skillName) {
						//Skill Name (i.e., acrobatics) and total bonus
						createAttribute(skills[i].name, skills[i].stNet);
							
						//Ability modifier to skill
						if (skills[i].stAbScModifier != undefined) {
							createAttribute(`${skills[i].name}_ability`, skills[i].stAbScModifier);
						};

						//Base bonus from proficiency: 0, 2, 4, 6, or 8
						createAttribute(`${skills[i].name}_rank`, nameRank);

						//Proficiency Display: 0, T, E, M, or L 
					    createAttribute(`${skills[i].name}_proficiency_display`, nameProfDisplay);

						//Proficiency plus level score
						if (skills[i].proLevelBonNet != undefined) {
							createAttribute(`${skills[i].name}_proficiency`, skills[i].proLevelBonNet);
						};
					}
				} else {
					var rowID = generateRowID();
						//Lore Name
					createAttribute("repeating_lore_" + rowID + "_lore_name", `${skills[i].name.replace(" Lore", "")}`);

						//Total Lore score
					createAttribute("repeating_lore_" + rowID + "_lore", skills[i].stNet);	

						//Base bonus from proficiency: 0, 2, 4, 6, or 8
					createAttribute("repeating_lore_" + rowID + "_lore_rank", nameRank);

						//Proficiency Display: 0, T, E, M, or L 
					createAttribute("repeating_lore_" + rowID + "_lore_proficiency_display", nameProfDisplay);

						//Proficiency plus level score
					if (skills[i].proLevelBonNet != undefined) {
						createAttribute("repeating_lore_" + rowID + "_lore_proficiency", skills[i].proLevelBonNet);
					};
						
						//Ability modifier to skill
					if (skills[i].stAbScModifier != undefined) {
						createAttribute("repeating_lore_" + rowID + "_lore_ability", skills[i].stAbScModifier);	
					};
				};
			};
		//End Skills
			
			
		//Import Saving Throws
			var savingThrows= [];
			Object.keys(herolabData.actors["actor.1"].items).forEach(function(k){
				if (herolabData.actors["actor.1"].items[k].compset === "Save") {
					savingThrows.push(herolabData.actors["actor.1"].items[k])
				}
			});
			
					//create Saving Throws and Modifiers
			for (i=0; i < savingThrows.length; i++) {
					
					//Format names to input into attributes
				switch (savingThrows[i].name) {
					case "Fortitude Save": saveName = "fortitude";
											break;
					case "Reflex Save": saveName = "reflex";
											break;
					default: saveName = "will";
											break;											
				};
			
				var save = findObjs({type: 'attribute', characterid: character.id, name: `saving_throws_${saveName}`})[0];
				var saveMod = findObjs({type: 'attribute', characterid: character.id, name: `saving_throws_${saveName}_ability`})[0];
				var saveRankModifier = findObjs({type: 'attribute', characterid: character.id, name: `saving_throws_${saveName}_rank`})[0];
								
					//format inputs for character sheet attributes, default case is Untrained 
				switch (savingThrows[i].ProfLevel) {
					case "Trained": saveRank = 2;
									saveProfDisplay = "T";
									break;
					case "Expert": saveRank = 4;
								   saveProfDisplay = "E";
								   break;
					case "Master": saveRank = 6;
								   saveProfDisplay = "M";
								   break;
					case "Legendary": saveRank = 8;
									  saveProfDisplay = "L";
									  break;
					default: saveRank = null;
							 break;
				};
				
				if (!save) {
					createAttribute(`saving_throws_${saveName}`, savingThrows[i].stNet);
					createAttribute(`saving_throws_${saveName}_rank`, saveRank);
					createAttribute(`saving_throws_${saveName}_proficiency_display`, saveProfDisplay);
					createAttribute(`saving_throws_${saveName}_ability`, savingThrows[i].stAbScModifier);
			    };
			};
		//End Saving Throws
		
		//Import Languages
			var languages = [];
        	Object.keys(herolabData.actors["actor.1"].items).forEach(function(k){
				if (herolabData.actors["actor.1"].items[k].compset === "Language") {
					languages.push(herolabData.actors["actor.1"].items[k])
				}
			});
			
			for (i=0; i < languages.length; i++) {
			    var rowID = generateRowID();
				createAttribute("repeating_languages_" + rowID + "_language", `${languages[i].name}`);
			};
		//End Languages

		//Import Hit, Hero, and Focus Points
			var variousPoints = [];
        	Object.keys(herolabData.actors["actor.1"].items).forEach(function(k){
				if (herolabData.actors["actor.1"].items[k].compset === "Reserves") {
					variousPoints.push(herolabData.actors["actor.1"].items[k])
				}
			});
			
			
			for (i=0; i < variousPoints.length; i++) {	
				switch (variousPoints[i].name) {
					case "Hit Points": 	var points = findObjs({type: 'attribute', characterid: character.id, name: 'hit_points'})[0];
										var pointsName = "hit_points"
										break;			
					case "Focus Points": var points = findObjs({type: 'attribute', characterid: character.id, name: 'focus_points'})[0];
										 var pointsName = "focus_points"
										 break;
					default: var points = findObjs({type: 'attribute', characterid: character.id, name: 'hero_points'})[0];
							 var pointsName = "hero_points"
							 break;
				};
				
				if (variousPoints[i].rvCurrent != undefined) {
					createObj('attribute', {
						name: pointsName,
						current: variousPoints[i].rvCurrent,
						max: variousPoints[i].rvMax,
						characterid: character.id
					})
			    }
			};
		//End Hit, Hero, and Focus Points
			
		//Import Feats
			var allFeats = [];
			var heritageFeats = [];
			var classFeats = [];
			var otherFeats = [];
			
			var heritageFilter = toProperCase(herolabData.actors["actor.1"].gameValues.actRace);
			var classFilter = getAttrByName(character.id, "class");
			if (classFilter == "Liberator") {
			    classFilter = "Champion"
			};
			
			if (classFilter == "Paladin") {
			    classFilter = "Champion"
			};
			
			if (classFilter == "Redeemer") {
			    classFilter = "Champion"
			};

			//Get All feats
        	Object.keys(herolabData.actors["actor.1"].items).forEach(function(k){
				if (herolabData.actors["actor.1"].items[k].compset === "Feat") {
					allFeats.push(herolabData.actors["actor.1"].items[k])
				}
			});
			
			//Find just Class Feats
			Object.keys(allFeats).forEach(function(k){
				if (allFeats[k].Trait.includes(classFilter)) {
					classFeats.push(allFeats[k])
				}
			});
			
		    //Create Class Feats
			for (i=0; i < classFeats.length; i++) {
				var rowID = generateRowID();
				if (classFeats[i].Action != undefined) {
					switch (classFeats[i].Action) {
						case "Action1": numberActions = "1-action";
							break;
						case "Action2": numberActions = "2-action";
							break;
						case "Action3": numberActions = "3-action";
							break;
						case "Free": numberActions = "free_action";
							break;
						case "Reaction": numberActions = "reaction";
							break;
						case "Action1,Action2": numberActions = "1-to-2-actions";
							break;
						case "Action1,Action2,Action3": numberActions = "1-to-3-actions";
							break;
						default: numberActions = "other";
									break;
					};
				};	
				
					//Feat Name
				createAttribute("repeating_feat-class_" + rowID + "_feat_class", classFeats[i].name);

					//Level Requirement
				createAttribute("repeating_feat-class_" + rowID + "_feat_class_level", classFeats[i].reqLevelNet);

					//Traits
				createAttribute("repeating_feat-class_" + rowID + "_feat_class_traits", classFeats[i].Trait.replace(/trt/g,"").replace("cl",""));
		
					//Description
				createAttribute("repeating_feat-class_" + rowID + "_feat_class_notes", classFeats[i].description);
	
					//Benefits
				if (classFeats[i].summary != undefined) {
					createAttribute("repeating_feat-class_" + rowID + "_feat_class_benefits", classFeats[i].summary);
				};
			
					//Trigger
				if (classFeats[i].reTrigger != undefined) {
					createAttribute("repeating_feat-class_" + rowID + "_feat_class_trigger", classFeats[i].reTrigger);
				};
				
					//Pre-req
				if (classFeats[i].rePrerequisites != undefined) {
					createAttribute("repeating_feat-class_" + rowID + "_feat_class_prerequisites", classFeats[i].rePrerequisites);
				};
				
					//Number of Actions
				if (classFeats[i].Action != undefined) {
					createAttribute("repeating_feat-class_" + rowID + "_feat_class_action", classFeats[i].numberActions);
				};

					//Requirements
				if (classFeats[i].reRequirements != undefined) {
					createAttribute("repeating_feat-class_" + rowID + "_feat_class_requirements", classFeats[i].reRequirements);
				};
				
					//Special
				if (classFeats[i].reSpecial != undefined) {
					createAttribute("repeating_feat-class_" + rowID + "_feat_class_special", classFeats[i].reSpecial);
				};
			};
			//End Class Feats
			
				//Find Heritage Feats
			Object.keys(allFeats).forEach(function(k){
				if (allFeats[k].Trait.includes(heritageFilter)) {
					heritageFeats.push(allFeats[k])
				}
			});
			
				//Create Heritage Feats 
			for (i=0; i < heritageFeats.length; i++) {
				var rowID = generateRowID();
				if (heritageFeats[i].Action != undefined) {
					switch (heritageFeats[i].Action) {
						case "Action1": numberActions = "1-action";
							break;
						case "Action2": numberActions = "2-action";
							break;
						case "Action3": numberActions = "3-action";
							break;
						case "Free": numberActions = "free_action";
							break;
						case "Reaction": numberActions = "reaction";
							break;
						case "Action1,Action2": numberActions = "1-to-2-actions";
							break;
						case "Action1,Action2,Action3": numberActions = "1-to-3-actions";
							break;
						default: numberActions = "other";
									break;
					};
				};	
				
					//Feat Name
				createAttribute("repeating_feat-ancestry_" + rowID + "_feat_ancestry", heritageFeats[i].name);

					//Level Requirement
				createAttribute("repeating_feat-ancestry_" + rowID + "_feat_ancestry_level", heritageFeats[i].reqLevelNet);

					//Traits
				createAttribute("repeating_feat-ancestry_" + rowID + "_feat_ancestry_traits", heritageFeats[i].Trait.replace(/trt/g,"").replace("cl",""));
	
					//Description
				createAttribute("repeating_feat-ancestry_" + rowID + "_feat_ancestry_notes", heritageFeats[i].description);

					//Benefits
				if (heritageFeats[i].summary != undefined) {
					createAttribute("repeating_feat-ancestry_" + rowID + "_feat_ancestry_benefits", heritageFeats[i].summary);
				};
				
					//Trigger
				if (heritageFeats[i].reTrigger != undefined) {
					createAttribute("repeating_feat-ancestry_" + rowID + "_feat_ancestry_trigger", heritageFeats[i].reTrigger);
				};
				
					//Pre-req
				if (heritageFeats[i].rePrerequisites != undefined) {
					createAttribute("repeating_feat-ancestry_" + rowID + "_feat_ancestry_prerequisites", heritageFeats[i].rePrerequisites);
				};
				
					//Number of Actions
				if (heritageFeats[i].Action != undefined) {
					createAttribute("repeating_feat-ancestry_" + rowID + "_feat_ancestry_action", numberActions);
				};
				
					//Requirements
				if (heritageFeats[i].reRequirements != undefined) {
					createAttribute("repeating_feat-ancestry_" + rowID + "_feat_ancestry_requirements", heritageFeats[i].reRequirements);
				};
				
					//Special
				if (heritageFeats[i].reSpecial != undefined) {
					createAttribute("repeating_feat-ancestry_" + rowID + "_feat_ancestry_special", heritageFeats[i].reSpecial);
				};
			};			
			//End Heritage Feats
			
			//Start General feats. 
			
				//Find General Feats
			Object.keys(allFeats).forEach(function(k){
				if (!allFeats[k].Trait.includes(classFilter) && !allFeats[k].Trait.includes(heritageFilter)) {
					otherFeats.push(allFeats[k])
				}
			});
			
				//Create non-class Feats in General
			for (i=0; i < otherFeats.length; i++) {
				var rowID = generateRowID();
				if (otherFeats[i].Action != undefined) {
					switch (otherFeats[i].Action) {
						case "Action1": numberActions = "1-action";
							break;
						case "Action2": numberActions = "2-action";
							break;
						case "Action3": numberActions = "3-action";
							break;
						case "Free": numberActions = "free_action";
							break;
						case "Reaction": numberActions = "reaction";
							break;
						case "Action1,Action2": numberActions = "1-to-2-actions";
							break;
						case "Action1,Action2,Action3": numberActions = "1-to-3-actions";
							break;
						default: numberActions = "other";
									break;
					};
				};	
				
					//Feat Name
				createAttribute("repeating_feat-general_" + rowID + "_feat_general", otherFeats[i].name);

					//Level Requirement
				createAttribute("repeating_feat-general_" + rowID + "_feat_general_level", otherFeats[i].reqLevelNet);

					//Traits
				createAttribute("repeating_feat-general_" + rowID + "_feat_general_traits", otherFeats[i].Trait.replace(/trt/g,"").replace("cl",""));
		
					//Description
				createAttribute("repeating_feat-general_" + rowID + "_feat_general_notes", otherFeats[i].description);

					//Benefits
				if (otherFeats[i].summary != undefined) {	
					createAttribute("repeating_feat-general_" + rowID + "_feat_general_benefits", otherFeats[i].summary);
				};
				
					//Trigger
				if (otherFeats[i].reTrigger != undefined) {
					createAttribute("repeating_feat-general_" + rowID + "_feat_general_trigger", otherFeats[i].reTrigger);
				};
				
					//Pre-req
				if (otherFeats[i].rePrerequisites != undefined) {
					createAttribute("repeating_feat-general_" + rowID + "_feat_general_prerequisites", otherFeats[i].rePrerequisites);
				};

					//Number of Actions
				if (otherFeats[i].Action != undefined) {
					createAttribute("repeating_feat-general_" + rowID + "_feat_general_action", numberActions);
				};
					//Requirements
				
				if (otherFeats[i].reRequirements != undefined) {
					createAttribute("repeating_feat-general_" + rowID + "_feat_general_requirements", otherFeats[i].reRequirements);	
				};
					//Special
				
				if (otherFeats[i].reSpecial != undefined) {
					createAttribute("repeating_feat-general_" + rowID + "_feat_general_special", otherFeats[i].reSpecial);
				};
			};			
			//End General Feats
		//End Feats
		
		//Import Action/Abilities
			var charAbilities = [];
			
			//Get Abilities
        	Object.keys(herolabData.actors["actor.1"].items).forEach(function(k){
				if (herolabData.actors["actor.1"].items[k].compset === "Ability") {
					charAbilities.push(herolabData.actors["actor.1"].items[k])
				}
			});
			
			for (i=0; i < charAbilities.length; i++) {
				var rowID = generateRowID();
			
					//Action Name
				createAttribute("repeating_actions_" + rowID + "_name", charAbilities[i].name);
				
					//Description
				createAttribute("repeating_actions_" + rowID + "_description", charAbilities[i].description);
				
					//Traits
				if (charAbilities[i].Trait != undefined) {
					createAttribute("repeating_actions_" + rowID + "_traits", charAbilities[i].Trait.replace(/trt/g,"").replace("cl",""));
				};
				
					//Number of Actions
				if (charAbilities[i].Action != undefined) {
					switch (charAbilities[i].Action) {
						case "Action1": numberActions = "1-action";
							break;
						case "Action2": numberActions = "2-action";
							break;
						case "Action3": numberActions = "3-action";
							break;
						case "Free": numberActions = "free_action";
							break;
						case "Reaction": numberActions = "reaction";
							break;
						case "Action1,Action2": numberActions = "1-to-2-actions";
							break;
						case "Action1,Action2,Action3": numberActions = "1-to-3-actions";
							break;
						default: numberActions = "other";
									break;
					};
					createAttribute("repeating_actions_" + rowID + "_requirements", charAbilities[i].reRequirements);
				};
			
					//Trigger
				if (charAbilities[i].reTrigger != undefined) {
					createAttribute("repeating_actions_" + rowID + "_trigger", charAbilities[i].reTrigger);
				};
				
					//Requirements
				if (charAbilities[i].reRequirements != undefined) {
					createAttribute("repeating_actions_" + rowID + "_requirements", charAbilities[i].reRequirements);
				};
				
					//Frequency
				if (charAbilities[i].trkMaximum != undefined) {
					createAttribute("repeating_actions_" + rowID + "_frequency", `${charAbilities[i].trkMaximum} per ${charAbilities[i].Period}`);
				};
			};
		//End Action/Abilities
        	

		
		
            sendChat("HLO Import", `Script Complete, check for import errors.`);
        };
    
        character.get("gmnotes", function(gmnotes) {
            const strip = /<[^>]*>/g;
            gmnotes = gmnotes.replace(strip, '');
            toDo(JSON.parse(gmnotes));
        });
		

		
	};
});