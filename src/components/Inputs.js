import React from "react";
import { useState } from "react";

export const Inputs = ({ onAdd }) => {
    const [weaponName, setWeaponName] = useState("");
    const [targetName, setTargetName] = useState("");
    const [normalDamage, setNormalDamage] = useState(0);
    const [criticalDamage, setCriticalDamage] = useState(0);
    const [nAttacks, setNAttacks] = useState(0);
    const [balisticSkill, setBalisticSkill] = useState(0);
    const [wSpecialRules, setWSpecialRules] = useState("");
    const [tSpecialRules, setTSpecialRules] = useState("");
    const [defense, setDefense] = useState(3);
    const [save, setSave] = useState(0);
    const [wounds, setWounds] = useState(0);
    const [inCover, setInCover] = useState(0);

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
            console.log("AP1")
            currentDefense -= 1;
            console.log(currentDefense)
        }
        
        if (wSpecialRules.includes("AP2")) {
            currentDefense -= 2;
        }
        
        if (wSpecialRules.includes("AP3")) {
            currentDefense -= 3;
        }
        
        let totalDamageDealt = 0;
        let targetKilled = 0;
        
        for (let rep = 0; rep < config.nRepetitions; rep++) {
            // Shooting
            let successfulHits = 0;
            let criticalHits = 0;
            let appliedEffects = [];
            let damageDealt = 0;
            
            for (let si = 0; si < nAttacks; si++) {
                let roll = diceRoll(6);
                if(roll >= balisticSkill) {
                    if(roll === 6) {
                        criticalHits++;
                    } else {
                        successfulHits++;
                    }
                } else if (wSpecialRules.includes("Relentless")) {
                    roll = diceRoll(6);
                    if(roll >= balisticSkill) {
                        if(roll === 6) {
                            criticalHits++;
                        }else{
                            successfulHits++;
                        }
                    }
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
        
            // Defense
            let successfulSaves = 0;
            let criticalSaves = 0;
        
            if(inCover && !wSpecialRules.includes("NoCover")) {
                defenseMod--;
                successfulSaves++;
            }
        
            for (let di = 0; di < currentDefense + defenseMod; di++) {
                let roll = diceRoll(6);
                if(roll >= save) {
                    if(roll === 6) {
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
        
            while(successfulSaves > 0 && successfulHits > 0) {
                successfulSaves--;
                successfulHits--;
            }
        
            while(successfulSaves > 1 && criticalHits > 0) {
                successfulSaves--;
                successfulSaves--;
                successfulHits--;
            }
        
            damageDealt = criticalHits * criticalDamage + successfulHits * normalDamage;
        
            if (damageDealt >= wounds) {
                targetKilled++;
            }
        
            totalDamageDealt += damageDealt;
        
            if (config.logging) {
                console.log("normal hits suffered:" + successfulHits);
                console.log("critical hits suffered:" + criticalHits);
            }
        }
        
        //createResultRecord();
        onAdd(weaponName, targetName, (totalDamageDealt/config.nRepetitions).toFixed(1), ((targetKilled / config.nRepetitions) * 100).toFixed(1) )
        
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
                <input placeholder="__, __, __" id="wSpecialRules" type="text" onChange={(e)=>setWSpecialRules(e.target.value)}/>
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
                <input placeholder="__, __, __" id="tSpecialRules" type="text" onChange={(e)=>setWSpecialRules(e.target.value)}/>
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