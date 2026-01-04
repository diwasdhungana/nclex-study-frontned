import { SelectOnewithModes } from './SelectOnewithModes';
import { MatrixNGridwithModes } from './MatrixNGridwithModes';
import { HighlightwithModes } from './HighlightwithModes';
import { ExtDropDownwithModes } from './ExtDropDownwithModes';
import { BowTiewithModes } from './BowTiewithModes';
import { DragNDropwithModes } from './DragNDropwithModes';
import { McqwithModes } from './McqwithModes';

const QuestionViewWithModes = ({ mode = 'student', data }: { data: any; mode: string }) => {
  console.log(data.kind);
  // return <>this is the end</>;
  switch (data.kind) {
    case 'Select One':
      return <SelectOnewithModes data={data} mode={mode} />;
    case 'Grid and Matrix':
      return <MatrixNGridwithModes data={data} mode={mode} />;
    case 'Highlight':
      return <HighlightwithModes data={data} mode={mode} />;
    case 'Extended Dropdown':
      return <ExtDropDownwithModes data={data} mode={mode} />;
    case 'Drag and Drop':
      return <DragNDropwithModes data={data} mode={mode} />;
    case 'Bowtie':
      return <BowTiewithModes data={data} mode={mode} />;
    case 'Select all that apply':
      return <McqwithModes data={data} mode={mode} />;
    default:
      return null;
  }
};
export default QuestionViewWithModes;
