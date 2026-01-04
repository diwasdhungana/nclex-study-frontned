import { SelectOnewithModes } from './SelectOnewithModes';
import { MatrixNGridwithModes } from './MatrixNGridwithModes';
import { HighlightwithModes } from './HighlightwithModes';
import { ExtDropDownwithModes } from './ExtDropDownwithModes';
import { BowTiewithModes } from './BowTiewithModes';
import { DragNDropwithModes } from './DragNDropwithModes';
import { McqwithModes } from './McqwithModes';
import { FillBlankswithModes } from './FillBlankswithModes';
import { QuestionKinds } from '@/enum/QuestionKind.enum';

const QuestionViewWithModes = ({ mode = 'student', data }: { data: any; mode: string }) => {
  console.log(data.kind);
  // return <>this is the end</>;
  switch (data.kind) {
    case QuestionKinds.SELECT_ONE:
      return <SelectOnewithModes data={data} mode={mode} />;
    case QuestionKinds.GRID_AND_MATRIX:
      return <MatrixNGridwithModes data={data} mode={mode} />;
    case QuestionKinds.HIGHLIGHT:
      return <HighlightwithModes data={data} mode={mode} />;
    case QuestionKinds.EXTENDED_DROPDOWN:
      return <ExtDropDownwithModes data={data} mode={mode} />;
    case QuestionKinds.DRAG_AND_DROP:
      return <DragNDropwithModes data={data} mode={mode} />;
    case QuestionKinds.BOWTIE:
      return <BowTiewithModes data={data} mode={mode} />;
    case QuestionKinds.SATA:
      return <McqwithModes data={data} mode={mode} />;
    case QuestionKinds.FILL_THE_BLANK:
      return <FillBlankswithModes data={data} mode={mode} />;
      return null;
  }
};
export default QuestionViewWithModes;
