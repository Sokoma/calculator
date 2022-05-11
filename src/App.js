import { Inputs } from './components/Inputs';
import { ResultsTable } from './components/ResultsTable';
import { useState } from "react";
import './App.css';

function App() {
  const [results, setResults] = useState([]);

  const addResult = (weaponName, targetName, averageDamageDealt, chancetoKill) => {
    const result = {weaponName, targetName, averageDamageDealt, chancetoKill}
    setResults([...results, result])
  }

  return (
    <div className="page-frame">
      <Inputs onAdd={addResult}></Inputs>
      <ResultsTable results={results}/>
    </div>
  );
}

export default App;
