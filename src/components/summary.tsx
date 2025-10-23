import type { Feedback } from '../types';
import { ScoreBadge, ScoreGauge } from './score-components';

const Category = ({ title, score }: { title: string, score: number }) => {
  const textColor = score > 70 ? 'text-green-600'
    : score > 49
      ? 'text-yellow-600' 
      : 'text-red-600';

  return (
    <div className="border-t border-border p-4">
      <div className="flex flex-row gap-2 items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-lg font-medium text-foreground">{title}</p>
          <ScoreBadge score={score} />
        </div>
        <p className="text-lg text-foreground">
          <span className={textColor}>{score}</span>/100
        </p>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="bg-card rounded-2xl shadow-md w-full border">
      <div className="flex flex-row items-center p-6 gap-6">
        <ScoreGauge score={feedback.overallScore} />

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-foreground">Your Resume Score</h2>
          <p className="text-sm text-muted-foreground">
            This score is calculated based on the variables listed below.
          </p>
        </div>
      </div>

      <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
      <Category title="Content" score={feedback.content.score} />
      <Category title="Structure" score={feedback.structure.score} />
      <Category title="Skills" score={feedback.skills.score} />
    </div>
  );
};

export default Summary; 