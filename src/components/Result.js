import React from "react";
import { DistributionChart } from "./DistributionChart";

export const Result = ({result}) => {
    return (
        <tr>
            <td>{result.weaponName + " vs " + result.targetName}</td>
            <td>{result.averageDamageDealt}</td>
            <td>{result.chancetoKill}</td>
            <DistributionChart distribution={result.distribution}/>
        </tr>
    )
}