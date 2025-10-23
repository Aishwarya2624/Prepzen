import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { interviewService, userAnswerService } from '@/lib/api-service';
import type { Interview, UserAnswer } from '@/types';
import { LoaderPage } from './loader-page';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, TrendingUp, AlertCircle } from 'lucide-react';

export const Feedback = () => {
  const { id: interviewId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!interviewId || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const [interviewResponse, answersResponse] = await Promise.all([
          interviewService.getById(interviewId),
          userAnswerService.getByInterviewId(interviewId)
        ]);
        
        const interviewData = interviewResponse.data;
        if (!interviewData) {
          toast.error('Interview not found');
          navigate('/dashboard');
          return;
        }
        setInterview(interviewData);

        const answers = answersResponse.data || [];
        setUserAnswers(answers);
        
        if (answers.length > 0) {
          // Explicitly type the parameters in the reduce function
          const totalRating = answers.reduce((sum: number, answer: { rating: number }) => sum + answer.rating, 0);
          setAverageRating(Math.round((totalRating / answers.length) * 10) / 10);
        }
        
      } catch (error) {
        console.error('Error fetching feedback data:', error);
        toast.error('Failed to load feedback', { description: 'Please try again later.'});
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [interviewId, user, navigate]);

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600 bg-green-100';
    if (rating >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getOverallPerformance = () => {
    if (averageRating >= 8) return { text: 'Excellent', color: 'text-green-600', icon: TrendingUp };
    if (averageRating >= 6) return { text: 'Good', color: 'text-yellow-600', icon: Star };
    return { text: 'Needs Improvement', color: 'text-red-600', icon: AlertCircle };
  };

  if (loading) {
    return <LoaderPage />;
  }

  if (!interview) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Interview Not Found</h1>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  const performance = getOverallPerformance();
  const Icon = performance.icon;

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Interview Feedback</h1>
          <p className="text-muted-foreground mb-4">{interview.position}</p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Icon className={`h-6 w-6 ${performance.color}`} />
            <span className={`text-lg font-semibold ${performance.color}`}>
              {performance.text}
            </span>
            <Badge variant="secondary" className="ml-2">
              {averageRating}/10 Average
            </Badge>
          </div>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Interview Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{userAnswers.length}</div>
              <div className="text-sm text-muted-foreground">Answered</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${performance.color}`}>{averageRating}/10</div>
              <div className="text-sm text-muted-foreground">Avg. Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{interview.questions?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Total Questions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Detailed Feedback</h2>
        {userAnswers.length > 0 ? (
          userAnswers.map((answer, index) => (
            <Card key={answer.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">Question {index + 1}</CardTitle>
                    <CardTitle className="text-base font-medium text-foreground">
                      {answer.question}
                    </CardTitle>
                  </div>
                  <Badge className={getRatingColor(answer.rating)}>
                    {answer.rating}/10
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div>
                    <h4 className="font-semibold mb-2 text-blue-600">Your Answer:</h4>
                    <p className="text-sm bg-blue-50 p-3 rounded-lg border">
                      {answer.user_ans || 'No answer provided'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-purple-600">AI Feedback:</h4>
                    <p className="text-sm bg-purple-50 p-3 rounded-lg border">
                      {answer.feedback}
                    </p>
                  </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
                <p>No answers were recorded for this interview.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};