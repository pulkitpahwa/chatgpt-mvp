import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { CardSkeleton } from '../components/Loading';

// Icons
const ConsultIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export function Home() {
  const navigate = useNavigate();
  const { toolOutput, isOpenAiAvailable } = useAppContext();

  // Route based on tool output intent
  React.useEffect(() => {
    if (toolOutput?.intent) {
      switch (toolOutput.intent) {
        case 'consultation':
          navigate('/consultation');
          break;
        case 'msa_draft':
          navigate('/msa');
          break;
        case 'finalization':
          navigate('/finalization');
          break;
        case 'payment':
          navigate('/payment');
          break;
      }
    }
  }, [toolOutput, navigate]);

  // Show loading while checking for tool output
  if (!isOpenAiAvailable && !toolOutput) {
    return (
      <div className="p-4">
        <CardSkeleton />
      </div>
    );
  }

  // If no specific intent, show service selection
  return (
    <div className="p-4 space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
          Inhouse Legal Services
        </h1>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
          Professional legal assistance for business and personal matters
        </p>
      </div>

      {/* Consultation Card */}
      <Card>
        <CardHeader
          icon={<ConsultIcon />}
          title="Consult an Attorney"
          subtitle="Business law & personal injury specialists"
        />
        <CardBody>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Connect with experienced attorneys who can provide expert guidance on your legal matters.
          </p>
        </CardBody>
        <CardFooter>
          <Button onClick={() => navigate('/consultation')} fullWidth>
            Start Consultation
          </Button>
        </CardFooter>
      </Card>

      {/* MSA Draft Card */}
      <Card>
        <CardHeader
          icon={<DocumentIcon />}
          title="Draft MSA"
          subtitle="Master Service Agreement generation"
        />
        <CardBody>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Generate a professionally structured Master Service Agreement tailored to your needs.
          </p>
        </CardBody>
        <CardFooter>
          <Button onClick={() => navigate('/msa')} fullWidth>
            Generate MSA
          </Button>
        </CardFooter>
      </Card>

      {/* Finalization Card */}
      <Card>
        <CardHeader
          icon={<CheckIcon />}
          title="Document Finalization"
          subtitle="Make your documents legally enforceable"
        />
        <CardBody>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Have a lawyer review and finalize your documents to ensure they're legally binding.
          </p>
        </CardBody>
        <CardFooter>
          <Button onClick={() => navigate('/finalization')} fullWidth>
            Finalize Document
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
