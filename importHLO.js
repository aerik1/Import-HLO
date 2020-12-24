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
			
		//Begin Character Infomation
                //Import Character Name
        	var characterName = findObjs({type: 'attribute', characterid: character.id, name: 'character_name'})[0];
        	if (!characterName) {
        		createObj('attribute', {
        		    name :"character_name", 
        		    current: herolabData.actors["actor.1"].name,
        		    characterid: character.id
        		});
        	};   
        	
        	    //Import Class
        	var classJob = findObjs({type: 'attribute', characterid: character.id, name: 'class'})[0];
            str =  herolabData.actors["actor.1"].gameValues.actClassText;
                vals = str.split(" ");
                if (vals.length > 1) {
                    value = vals[0];
                    }
            
        	if (!classJob) {
        		createObj('attribute', {
        		    name :"class", 
        		    current: toProperCase(value),
        		    characterid: character.id
        		});
        	};
        	
              
                //Import Level
        	var level = findObjs({type: 'attribute', characterid: character.id, name: 'level'})[0];
        	if (!level) {
        		createObj('attribute', {
        		    name :"level", 
        		    current: herolabData.actors["actor.1"].gameValues.actLevelNet,
        		    characterid: character.id
        		});
        	};
			
				//Import XP
        	var experience = findObjs({type: 'attribute', characterid: character.id, name: 'xp'})[0];
        	if (!experience) {
        		createObj('attribute', {
        		    name :"xp", 
        		    current: herolabData.actors["actor.1"].gameValues.actXPNet,
        		    characterid: character.id
        		});
        	};
			
			    //Import Background
        	var background = findObjs({type: 'attribute', characterid: character.id, name: 'background'})[0];
        	if (!background) {
        		createObj('attribute', {
        		    name :"background", 
        		    current: herolabData.actors["actor.1"].gameValues.actBackgroundText,
        		    characterid: character.id
        		});
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
        		createObj('attribute', {
        		    name :"ancestry_heritage", 
        		    current: `${heritage}`,
        		    characterid: character.id
        		});
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
        		createObj('attribute', {
        		    name :"deity", 
        		    current: `${deityName}`,
        		    characterid: character.id
        		});
        	};
        	
        	    //Import Alignment
        	var alignment = findObjs({type: 'attribute', characterid: character.id, name: 'alignment'})[0];
        	if (!alignment) {
        		createObj('attribute', {
        		    name :"alignment", 
        		    current: herolabData.actors["actor.1"].gameValues.actAlignment,
        		    characterid: character.id
        		});
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
					createObj('attribute', {
						name: abilityScores[i].name, 
						current: abilityScores[i].stNet,
						characterid: character.id
					})
					if (abilityScores[i].stAbScModifier != undefined) {
    					createObj('attribute', {
    						name: `${abilityScores[i].name}_modifier`, 
    						current: abilityScores[i].stAbScModifier,
    						characterid: character.id
    					})
					}
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
						createObj('attribute', {
							name: skills[i].name, 
							current: skills[i].stNet,
							characterid: character.id
						})
							//Ability modifier to skill
						if (skills[i].stAbScModifier != undefined) {
							createObj('attribute', {
								name: `${skills[i].name}_ability`, 
								current: skills[i].stAbScModifier,
								characterid: character.id
							})
						} else {
							createObj('attribute', {
								name: `${skills[i].name}_ability`, 
								current: 0,
								characterid: character.id
							})
						}
							//Base bonus from proficiency: 0, 2, 4, 6, or 8
						createObj('attribute', {
								name: `${skills[i].name}_rank`, 
								current: nameRank,
								characterid: character.id
							})
							//Proficiency Display: 0, T, E, M, or L 
						createObj('attribute', {
								name: `${skills[i].name}_proficiency_display`, 
								current: nameProfDisplay,
								characterid: character.id
							})
							//Proficiency plus level score
						if (skills[i].proLevelBonNet != undefined) {	
							createObj('attribute', {
									name: `${skills[i].name}_proficiency`, 
									current: skills[i].proLevelBonNet,
									characterid: character.id
								})	
						} else {
							createObj('attribute', {
									name: `${skills[i].name}_proficiency`, 
									current: 0,
									characterid: character.id
							})	
						}
					}
				} else {
					var rowID = generateRowID();
						//Lore Name
					createObj('attribute', {
						name: "repeating_lore_" + rowID + "_lore_name",
						current: `${skills[i].name.replace(" Lore", "")}`,
						characterid: character.id
						}); 
						//Total Lore score
					createObj('attribute', {
						name: "repeating_lore_" + rowID + "_lore",
						current: skills[i].stNet,
						characterid: character.id
					});
							//Base bonus from proficiency: 0, 2, 4, 6, or 8
					createObj('attribute', {
						name: "repeating_lore_" + rowID + "_lore_rank",
						current: nameRank,
						characterid: character.id
					}); 
							//Proficiency Display: 0, T, E, M, or L 
					createObj('attribute', {
						name: "repeating_lore_" + rowID + "_lore_proficiency_display", 
						current: nameProfDisplay,
						characterid: character.id
					});
						
						//Proficiency plus level score						
					if (skills[i].proLevelBonNet != undefined) {	
					createObj('attribute', {
							name: "repeating_lore_" + rowID + "_lore_proficiency", 
							current: skills[i].proLevelBonNet,
							characterid: character.id
						})	
					} else {
					createObj('attribute', {
							name: "repeating_lore_" + rowID + "_lore_proficiency", 
							current: 0,
							characterid: character.id
						})	
					};
						
						//Ability modifier to skill
					if (skills[i].stAbScModifier != undefined) {
						createObj('attribute', {
							name: "repeating_lore_" + rowID + "_lore_ability", 
							current: skills[i].stAbScModifier,
							characterid: character.id
						})
					} else {
						createObj('attribute', {
							name: "repeating_lore_" + rowID + "_lore_ability", 
							current: 0,
							characterid: character.id
						})
					}
				    
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
					createObj('attribute', {
						name: `saving_throws_${saveName}`, 
						current: savingThrows[i].stNet,
						characterid: character.id
					})
					createObj('attribute', {
						name: `saving_throws_${saveName}_rank`,
						current: saveRank, 
						characterid: character.id
					})
					createObj('attribute', {
						name: `saving_throws_${saveName}_proficiency_display`,
						current: saveProfDisplay, 
						characterid: character.id
					})
					if (savingThrows[i].stAbScModifier != undefined) {
    					createObj('attribute', {
    						name: `saving_throws_${saveName}_ability`, 
    						current: savingThrows[i].stAbScModifier,
    						characterid: character.id
    					})
					}
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
				createObj ('attribute', {
					name: "repeating_languages_" + rowID + "_language",
					current: `${languages[i].name}`,
					characterid: character.id
				})
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
				
				
					createObj('attribute', {
						name: pointsName,
						current: variousPoints[i].rvCurrent,
						max: variousPoints[i].rvMax,
						characterid: character.id
					})

			};
		//End Hit, Hero, and Focus Points
		
		//Import Feats
			var allFeats = [];
			var heritageFeats = [];
			var classFeats = [];
			var otherFeats = [];
			
			var heritageFilter = toProperCase(herolabData.actors["actor.1"].gameValues.actRace);
			var classFilter = getAttrByName(character.id, "class");

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
				createObj('attribute', {
					name: "repeating_feat-class_" + rowID + "_feat_class",
					current: classFeats[i].name,
					characterid: character.id
				});
					//Level Requirement
				createObj('attribute', {
					name: "repeating_feat-class_" + rowID + "_feat_class_level",
					current: classFeats[i].reqLevelNet,
					characterid: character.id
				});
					//Traits
				createObj('attribute', {
					name: "repeating_feat-class_" + rowID + "_feat_class_traits",
					current: classFeats[i].Trait.replace(/trt/g,"").replace("cl",""),
					characterid: character.id
				});			
					//Description
				createObj('attribute', {
					name: "repeating_feat-class_" + rowID + "_feat_class_notes",
					current: classFeats[i].description,
					characterid: character.id
				});		
					//Benefits
				createObj('attribute', {
					name: "repeating_feat-class_" + rowID + "_feat_class_benefits",
					current: classFeats[i].summary,
					characterid: character.id
				});					
					//Trigger
				if (classFeats[i].reTrigger != undefined) {
				createObj('attribute', {
						name: "repeating_feat-class_" + rowID + "_feat_class_trigger",
						current: classFeats[i].reTrigger,
						characterid: character.id
					});	
				};
					//Pre-req
				if (classFeats[i].rePrerequisites != undefined) {
				createObj('attribute', {
						name: "repeating_feat-class_" + rowID + "_feat_class_prerequisites",
						current: classFeats[i].rePrerequisites,
						characterid: character.id
					});	
				};
					//Number of Actions
				if (classFeats[i].Action != undefined) {
				createObj('attribute', {
						name: "repeating_feat-class_" + rowID + "_feat_class_action",
						current: numberActions,
						characterid: character.id
					});	
				};
					//Requirements
				if (classFeats[i].reRequirements != undefined) {
				createObj('attribute', {
						name: "repeating_feat-class_" + rowID + "_feat_class_requirements",
						current: classFeats[i].reRequirements,
						characterid: character.id
					});	
				};
					//Special
				if (classFeats[i].reSpecial != undefined) {
				createObj('attribute', {
						name: "repeating_feat-class_" + rowID + "_feat_class_special",
						current: classFeats[i].reSpecial,
						characterid: character.id
					});	
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
				createObj('attribute', {
					name: "repeating_feat-ancestry_" + rowID + "_feat_ancestry",
					current: heritageFeats[i].name,
					characterid: character.id
				});
					//Level Requirement
				createObj('attribute', {
					name: "repeating_feat-ancestry_" + rowID + "_feat_ancestry_level",
					current: heritageFeats[i].reqLevelNet,
					characterid: character.id
				});
					//Traits
				createObj('attribute', {
					name: "repeating_feat-ancestry_" + rowID + "_feat_ancestry_traits",
					current: heritageFeats[i].Trait.replace(/trt/g,"").replace("cl",""),
					characterid: character.id
				});			
					//Description
				createObj('attribute', {
					name: "repeating_feat-ancestry_" + rowID + "_feat_ancestry_notes",
					current: heritageFeats[i].description,
					characterid: character.id
				});
					//Benefits
				createObj('attribute', {
					name: "repeating_feat-ancestry_" + rowID + "_feat_ancestry_benefits",
					current: heritageFeats[i].summary,
					characterid: character.id
				});			
					//Trigger
				if (heritageFeats[i].reTrigger != undefined) {
				createObj('attribute', {
						name: "repeating_feat-ancestry_" + rowID + "_feat_ancestry_trigger",
						current: heritageFeats[i].reTrigger,
						characterid: character.id
					});	
				};
					//Pre-req
				if (heritageFeats[i].rePrerequisites != undefined) {
				createObj('attribute', {
						name: "repeating_feat-ancestry_" + rowID + "_feat_ancestry_prerequisites",
						current: heritageFeats[i].rePrerequisites,
						characterid: character.id
					});	
				};
					//Number of Actions
				if (heritageFeats[i].Action != undefined) {
				createObj('attribute', {
						name: "repeating_feat-ancestry_" + rowID + "_feat_ancestry_action",
						current: numberActions,
						characterid: character.id
					});	
				};
					//Requirements
				if (heritageFeats[i].reRequirements != undefined) {
				createObj('attribute', {
						name: "repeating_feat-ancestry_" + rowID + "_feat_ancestry_requirements",
						current: heritageFeats[i].reRequirements,
						characterid: character.id
					});	
				};
					//Special
				if (heritageFeats[i].reSpecial != undefined) {
				createObj('attribute', {
						name: "repeating_feat-ancestry_" + rowID + "_feat_ancestry_special",
						current: heritageFeats[i].reSpecial,
						characterid: character.id
					});	
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
				createObj('attribute', {
					name: "repeating_feat-general_" + rowID + "_feat_general",
					current: otherFeats[i].name,
					characterid: character.id
				});
					//Level Requirement
				createObj('attribute', {
					name: "repeating_feat-general_" + rowID + "_feat_general_level",
					current: otherFeats[i].reqLevelNet,
					characterid: character.id
				});
					//Traits
				createObj('attribute', {
					name: "repeating_feat-general_" + rowID + "_feat_general_traits",
					current: otherFeats[i].Trait.replace(/trt/g,"").replace("cl",""),
					characterid: character.id
				});			
					//Description
				createObj('attribute', {
					name: "repeating_feat-general_" + rowID + "_feat_general_notes",
					current: otherFeats[i].description,
					characterid: character.id
				});
					//Benefits
				createObj('attribute', {
					name: "repeating_feat-general_" + rowID + "_feat_general_benefits",
					current: otherFeats[i].summary,
					characterid: character.id
				});			
					//Trigger
				if (otherFeats[i].reTrigger != undefined) {
				createObj('attribute', {
						name: "repeating_feat-general_" + rowID + "_feat_general_trigger",
						current: otherFeats[i].reTrigger,
						characterid: character.id
					});	
				};
					//Pre-req
				if (otherFeats[i].rePrerequisites != undefined) {
				createObj('attribute', {
						name: "repeating_feat-general_" + rowID + "_feat_general_prerequisites",
						current: otherFeats[i].rePrerequisites,
						characterid: character.id
					});	
				};
					//Number of Actions
				if (otherFeats[i].Action != undefined) {
				createObj('attribute', {
						name: "repeating_feat-general_" + rowID + "_feat_general_action",
						current: numberActions,
						characterid: character.id
					});	
				};
					//Requirements
				if (otherFeats[i].reRequirements != undefined) {
				createObj('attribute', {
						name: "repeating_feat-general_" + rowID + "_feat_general_requirements",
						current: otherFeats[i].reRequirements,
						characterid: character.id
					});	
				};
					//Special
				if (otherFeats[i].reSpecial != undefined) {
				createObj('attribute', {
						name: "repeating_feat-general_" + rowID + "_feat_general_special",
						current: otherFeats[i].reSpecial,
						characterid: character.id
					});	
				};
			};			
			//End General Feats
		//End Feats
		
		
            sendChat("HLO Import", `Script Complete, check for import errors.`);
        };
    
        character.get("gmnotes", function(gmnotes) {
            const strip = /<[^>]*>/g;
            gmnotes = gmnotes.replace(strip, '');
            toDo(JSON.parse(gmnotes));
        });
		

		
	};
});