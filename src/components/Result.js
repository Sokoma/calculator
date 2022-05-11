import React from "react";

export const Result = ({result}) => {
    return (
        <tr>
            <td>{result.weaponName + " vs " + result.targetName}</td>
            <td>{result.averageDamageDealt}</td>
            <td>{result.chancetoKill}</td>
        </tr>
    )
}