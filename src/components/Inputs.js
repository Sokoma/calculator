import React, { useRef } from "react";
import { useState } from "react";
import { Multiselect } from "./Multiselect";

export const Inputs = ({ onAdd }) => {
    const [weaponName, setWeaponName] = useState("Weapon");
    const [targetName, setTargetName] = useState("Target");
    const [normalDamage, setNormalDamage] = useState(0);
    const [criticalDamage, setCriticalDamage] = useState(0);
    const [nAttacks, setNAttacks] = useState(0);
    const [balisticSkill, setBalisticSkill] = useState(0);
    const [wSpecialRules, setWSpecialRules] = useState([]);
    const [tSpecialRules, setTSpecialRules] = useState("");
    const [defense, setDefense] = useState(3);
    const [save, setSave] = useState(0);
    const [wounds, setWounds] = useState(0);
    const [inCover, setInCover] = useState(0);

    const wSpecialRulesInput = useRef(null);
    const tSpecialRulesInput = useRef(null);

    const wSpecialRulesList = [
        "AP1",
        "AP2",
        "!P1",
        "!P2",
        "!Rending",
        "Lethal5+",
        "Lethal4+",
        "NoCover",
        "!MW1",
        "!MW2",
        "!MW3",
        "!MW4",
        "Relentless",
        "Ceaseless",
        "Balanced",
        "!Dakka"
    ];

    const tSpecialRulesList = [
        "Invul5+",
        "Invul4+",
        "IgnoreWound6+",
        "IgnoreWound5+"
    ]

    const config = {
        nRepetitions: 100000,
        logging: false
    }

    const diceRoll = (sides) => {
        return Math.floor(Math.random() * sides) + 1;
    }

    const calculate = () => {
        let currentDefense = defense;

        if (wSpecialRules.includes("AP1")) {
            currentDefense -= 1;
        }
        
        if (wSpecialRules.includes("AP2")) {
            currentDefense -= 2;
        }
        
        if (wSpecialRules.includes("AP3")) {
            currentDefense -= 3;
        }
        
        let totalDamageDealt = 0;
        let targetKilled = 0;
        let damageMap = {};
        
        for (let rep = 0; rep < config.nRepetitions; rep++) {
            // Shooting
            let successfulHits = 0;
            let criticalHits = 0;
            let damageDealt = 0;
            let balancedUsed = false;

            for (let si = 0; si < nAttacks; si++) {
                let roll = diceRoll(6);
                if (roll >= balisticSkill) {
                    if (wSpecialRules.includes("Lethal5+") && roll >= 5) {
                        criticalHits++;
                    } else if (wSpecialRules.includes("Lethal4+") && roll >= 4){
                        criticalHits++;
                    } else if (roll === 6) {
                        criticalHits++;
                    } else {
                        successfulHits++;
                    }
                } else if (
                    wSpecialRules.includes("Relentless") ||
                    (wSpecialRules.includes("Ceaseless") && roll === 1) ||
                    (wSpecialRules.includes("Balanced") && !balancedUsed)
                    ) {
                        roll = diceRoll(6);
                        if (roll >= balisticSkill) {
                            if (wSpecialRules.includes("Lethal5+") && roll >= 5) {
                                criticalHits++;
                            } else if (wSpecialRules.includes("Lethal4+") && roll >= 4){
                                criticalHits++;
                            } else if (roll === 6) {
                                criticalHits++;
                            } else {
                                successfulHits++;
                            }
                        }
                        balancedUsed = true;
                    } 
            }
        
            if (config.logging) {
                console.log("normal Hits:" + successfulHits);
                console.log("critical Hits:" + criticalHits);
            }
        
            // Special rules - active
            let defenseMod = 0;
            if (wSpecialRules.includes("!P1") && criticalHits) {
                defenseMod -= 1;
            }
        
            if (wSpecialRules.includes("!P2") && criticalHits) {
                defenseMod -= 2;
            }
        
            if (wSpecialRules.includes("!Rending") && criticalHits) {
                criticalHits++;
                successfulHits--;
            }
        
            if (wSpecialRules.includes("!Dakka") && criticalHits) {
                if (successfulHits + criticalHits < nAttacks)
                successfulHits++;
            }
        
            if (wSpecialRules.includes("!MW4") && criticalHits) {
                damageDealt += criticalHits * 4;
            }
        
            if (wSpecialRules.includes("!MW3") && criticalHits) {
                damageDealt += criticalHits * 3;
            }

            if (wSpecialRules.includes("!MW2") && criticalHits) {
                damageDealt += criticalHits * 2;
            }

            if (wSpecialRules.includes("!MW1") && criticalHits) {
                damageDealt += criticalHits * 1;
            }
        
            // Defense
            let successfulSaves = 0;
            let criticalSaves = 0;

            if (tSpecialRules.includes("Invul5+")) {
                defenseMod = 0;
                currentDefense = 3;
                setSave(5);
            } else if (tSpecialRules.includes("Invul4+")) {
                defenseMod = 0;
                currentDefense = 3;
                setSave(4);
            }
        
            if (inCover && !wSpecialRules.includes("NoCover")) {
                defenseMod--;
                successfulSaves++;
            }
        
            for (let di = 0; di < currentDefense + defenseMod; di++) {
                let roll = diceRoll(6);
                if (roll >= save) {
                    if (roll === 6) {
                        criticalSaves++;
                    }else{
                        successfulSaves++;
                    }
                }        
            }
        
            if (config.logging) {
                console.log("normal Saves:" + successfulSaves);
                console.log("critical Saves:" + criticalSaves);
            }
            
            while(criticalHits > 0 && criticalSaves > 0) {
                criticalSaves--;
                criticalHits--;
            }
            
            successfulSaves += criticalSaves;
        
            while(successfulSaves > 0 && successfulHits > 0 && 
                !(successfulSaves === 2 && successfulHits === 1 && criticalHits === 1)
                ) {
                successfulSaves--;
                successfulHits--;
            }
        
            while(successfulSaves > 1 && criticalHits > 0) {
                successfulSaves--;
                successfulSaves--;
                criticalHits--;
            }
        
            damageDealt = criticalHits * criticalDamage + successfulHits * normalDamage;

            if (tSpecialRules.includes("IgnoreWound6+") || tSpecialRules.includes("IgnoreWound5+")) {
                let damageIgnored = 0;
                for (let index = 0; index < damageDealt; index++) {
                    let roll = diceRoll(6);
                    if ((roll === 6 && tSpecialRules.includes("IgnoreWound6+")) || (roll >= 5 && tSpecialRules.includes("IgnoreWound5+"))) {
                        damageIgnored++;
                    }
                }
                damageDealt -= damageIgnored;
            }
            
        
            if (damageDealt >= wounds) {
                targetKilled++;
            }
        
            totalDamageDealt += damageDealt;
            if (typeof damageMap[String(damageDealt)] === 'undefined') {
                damageMap[String(damageDealt)] = 1;
            } else {
                damageMap[String(damageDealt)]++;
            }
        
            if (config.logging) {
                console.log("normal hits suffered:" + successfulHits);
                console.log("critical hits suffered:" + criticalHits);
            }
        }

        Object.keys(damageMap).forEach(key => {
            damageMap[key] = damageMap[key]/config.nRepetitions * 100;
          });

        //createResultRecord();
        onAdd(weaponName, targetName, (totalDamageDealt/config.nRepetitions).toFixed(1), ((targetKilled / config.nRepetitions) * 100).toFixed(1), damageMap)
        
        console.log();
        console.log("Average damage dealt: " + totalDamageDealt / config.nRepetitions);
        console.log("Chance to kill: " + ((targetKilled / config.nRepetitions) * 100) + " %");
        console.log("For the Emperor!")
    }

    return (
        <>
        <div className="weapon-block half-block">
            <div className="header-wrapper">
                <h2>Weapon Profile</h2>
            </div>
            <div className="name-wrapper">
                <input id="weaponName" type="text" placeholder="Weapon Name" onChange={(e)=>setWeaponName(e.target.value)}/>
            </div>
            <div className="input-block">
                <label>Damage</label>
                <div className="split-input">
                    <input placeholder="_" className="normal-damage" id="normalDmg" type="text" onChange={(e)=>setNormalDamage(e.target.value)}/>
                    <input placeholder="_" className="critical-damage" id="criticalDmg" type="text" onChange={(e)=>setCriticalDamage(e.target.value)}/>
                </div>
            </div>
            <div className="input-block">
                <label>A</label>
                <input placeholder="_" id="numberAttacks" type="text" onChange={(e)=>setNAttacks(parseInt(e.target.value))}/>
            </div>
            <div className="input-block hasPlus">
                <label>BS</label>
                <input placeholder="_" id="balisticSkill" type="text" onChange={(e)=>setBalisticSkill(parseInt(e.target.value))}/>
            </div>
            <div className="input-block">
                <label>Special Rules</label>
                <input ref={wSpecialRulesInput} placeholder="__, __, __" id="wSpecialRules" type="text" disabled={true} value={wSpecialRules}/>
                <Multiselect state={wSpecialRules} updateState={setWSpecialRules} inputElement={wSpecialRulesInput.current} options={wSpecialRulesList} classSuffix="wSpeacialRules"/>
            </div>
        </div><div className="target-block half-block">
            <div className="header-wrapper">
                <h2>Target Profile</h2>
            </div>
            <div className="name-wrapper">
                <input id="targetName"  type="text" placeholder="Target Name" onChange={(e)=>setTargetName(e.target.value)}/>
            </div>
            <div className="input-block">
                <label>DF</label>
                <input placeholder="_" id="defense" type="text" value="3" onChange={(e)=>setDefense(parseInt(e.target.value))}/>
            </div>
            <div className="input-block hasPlus">
                <label>SV</label>
                <input placeholder="_" id="save" type="text" onChange={(e)=>setSave(parseInt(e.target.value))}/>
            </div>
            <div className="input-block">
                <label>W</label>
                <input placeholder="_" id="wounds" type="text" onChange={(e)=>setWounds(parseInt(e.target.value))}/>
            </div>
            <div className="input-block">
                <label>Special Rules</label>
                <input ref={tSpecialRulesInput} placeholder="__, __, __" id="tSpecialRules" type="text" disabled={true} value={tSpecialRules}/>
                <Multiselect state={tSpecialRules} updateState={setTSpecialRules} inputElement={tSpecialRulesInput.current} options={tSpecialRulesList} classSuffix="wSpeacialRules"/>
            </div>
            <div className="input-block">
                <label>Is in Cover?</label>
                <select id="inCover" onChange={(e)=>setInCover(parseInt(e.target.value))}>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                </select>
            </div>
        </div>
        <div className="controls-block">
            <button id="submit" onClick={(e)=>calculate()}>Calculate</button>
        </div>
        </>
    )
}