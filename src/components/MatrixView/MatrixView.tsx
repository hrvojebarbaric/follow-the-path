import { findPath } from "../../utils/helpers";
import { MatrixViewProps } from "./MatrixView.types";

const MatrixView = (props: MatrixViewProps) => {
  const { title, matrix } = props;

  const matrixResult = findPath(matrix);

  return (
    <div>
      <h2>Result for: {title}</h2>
      {matrixResult.letters ? (
        <>
          <p>Path as characters: {matrixResult.path}</p>
          <p>Letters: {matrixResult.letters}</p>
        </>
      ) : (
        <p>Error</p>
      )}
    </div>
  );
};

export default MatrixView;
