import type { Feedback } from '../types';

const Details = ({ feedback }: { feedback: Feedback }) => {
  const categories = [
    { title: 'Tone & Style', data: feedback.toneAndStyle },
    { title: 'Content', data: feedback.content },
    { title: 'Structure', data: feedback.structure },
    { title: 'Skills', data: feedback.skills },
  ];

  return (
    <div className="bg-card rounded-2xl shadow-md w-full p-6 border">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Detailed Feedback</h2>
      
      <div className="space-y-6">
        {categories.map((category, index) => (
          <div key={index} className="border-b border-border pb-6 last:border-b-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-foreground">{category.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                category.data.score >= 80 
                  ? 'bg-green-100 text-green-800'
                  : category.data.score >= 60
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}>
                {category.data.score}/100
              </span>
            </div>
            
            <div className="space-y-2">
              {category.data.feedback.map((item, feedbackIndex) => (
                <div key={feedbackIndex} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <p className="text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Details; 