import React from "react";
import { Result } from './Result';

export const ResultsTable = ({results}) => {
    return (
        <table className="results-table">
            <thead>
                <tr>
                    <th>Weapon and Target</th>
                    <th>AvgDmg</th>
                    <th>%Kill</th>
                </tr>
            </thead>
            <tbody>
            {results.slice(0).reverse().map((result, index) => (
                <Result key={index} result={result}/>
            ))}
            </tbody>
        </table>
    )
}