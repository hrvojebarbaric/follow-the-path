import "./App.css";
import {
  acbMatrix,
  abcdMatrix,
  acbLetterTurnMatrix,
  gooniesMatrix,
  blahMatrix,
  ignoreMatrix,
} from "./constants/matrices";
import MatrixView from "./components/MatrixView/MatrixView";

function App() {
  return (
    <div className="App">
      <MatrixView title={"acbMatrix"} matrix={acbMatrix} />
      <MatrixView title={"abcdMatrix"} matrix={abcdMatrix} />
      <MatrixView title={"acbLetterTurnMatrix"} matrix={acbLetterTurnMatrix} />
      <MatrixView title={"gooniesMatrix"} matrix={gooniesMatrix} />
      <MatrixView title={"blahMatrix"} matrix={blahMatrix} />
      <MatrixView title={"ignoreMatrix"} matrix={ignoreMatrix} />
    </div>
  );
}

export default App;
