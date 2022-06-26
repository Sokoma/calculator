import React from "react";

export const DistributionChart = ({distribution}) => {

    const columnWidth = 100 / Object.keys(distribution).length;
    let highestValue = 0;



    for (const [key, value] of Object.entries(distribution)) {
        if (value > highestValue) {
            highestValue = value;
        }
    }
      
    console.log(highestValue)

    return (
        <div className="distributionChart">
            <div className="scale">
                {Object.keys(distribution).map((key, index) => {
                    return <div
                            className="column"
                            key={index}
                            data-damage={key}
                            data-percentage={distribution[key].toFixed(1) + "%" }
                            style={{width: columnWidth + "%", height: distribution[key]/highestValue * 100 + "%"}}
                            ></div>;
                })}
            </div>
        </div>
    )
}