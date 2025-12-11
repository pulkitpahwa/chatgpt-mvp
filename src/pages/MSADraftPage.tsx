import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { StatusBanner } from '../components/WidgetContainer';
import { LoadingSpinner, CardSkeleton } from '../components/Loading';
import {
  useDraftMSA,
  requestDisplayMode,
  setWidgetState,
} from '../hooks/useToolCall';
import { useAppContext } from '../context/AppContext';

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

interface MSAData {
  draftContent?: string;
  googleDocId?: string;
  isLocked?: boolean;
  paymentUrl?: string;
}

export function MSADraftPage() {
  const navigate = useNavigate();
  const { toolOutput, isLoading, isWaitingForBackend } = useAppContext();
  const [msaData, setMsaData] = useState<MSAData | null>(
    (toolOutput?.data as MSAData) || null
  );
  const { loading, error, callTool } = useDraftMSA();

  // Show loading shimmer while waiting for backend response
  if (isLoading || isWaitingForBackend) {
    return (
      <div className="p-4">
        <CardSkeleton />
      </div>
    );
  }

  const handleGenerateMSA = async () => {
    await requestDisplayMode('fullscreen');

    const result = await callTool({
      // Context from the conversation will be passed by ChatGPT
      document_type: 'MSA',
    });

    if (result) {
      setMsaData({
        draftContent: result.draftContent,
        googleDocId: result.googleDocId,
        isLocked: result.isLocked ?? true,
        paymentUrl: result.paymentUrl,
      });
      setWidgetState({
        msaGenerated: true,
        googleDocId: result.googleDocId,
      });
    }
  };

  const handleUnlock = () => {
    if (msaData?.paymentUrl) {
      navigate('/payment', { state: { paymentUrl: msaData.paymentUrl } });
    }
  };

  // Document preview with locked state
  const renderDocumentPreview = () => {
    if (!msaData?.draftContent) return null;

    const isLocked = msaData.isLocked !== false;

    return (
      <div className="mt-4 relative">
        <div
          className={`p-4 bg-white dark:bg-gray-900 border border-border-light dark:border-border-dark rounded-lg ${
            isLocked ? 'max-h-64 overflow-hidden' : 'max-h-96 overflow-y-auto'
          }`}
        >
          <pre className="text-sm text-text-primary-light dark:text-text-primary-dark whitespace-pre-wrap font-sans">
            {msaData.draftContent}
          </pre>
        </div>

        {/* Locked overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-gradient-to-t from-surface-light dark:from-surface-dark via-surface-light/80 dark:via-surface-dark/80 to-transparent flex items-end justify-center pb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full mb-3">
                <LockIcon />
              </div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">
                Document preview is locked
              </p>
              <Button onClick={handleUnlock} size="sm">
                Unlock Full Document
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Loading state while generating
  if (loading) {
    return (
      <div className="p-4">
        <Card>
          <CardBody>
            <div className="flex flex-col items-center justify-center py-8">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark">
                Generating your MSA document...
              </p>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">
                This may take a moment
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader
          icon={<DocumentIcon />}
          title="Master Service Agreement"
          subtitle={msaData ? 'Your MSA has been generated' : 'Generate a professional MSA'}
        />
        <CardBody>
          {!msaData ? (
            <>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                We'll generate a Master Service Agreement based on your conversation context.
                The document will include:
              </p>
              <ul className="text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Scope of services and deliverables
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Payment terms and conditions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Intellectual property provisions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Confidentiality and liability clauses
                </li>
              </ul>

              {error && (
                <StatusBanner
                  type="error"
                  message={error.message || 'Failed to generate MSA. Please try again.'}
                />
              )}

              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  The generated document is a draft and should be reviewed by a legal professional
                  before use.
                </p>
              </div>
            </>
          ) : (
            <>
              <StatusBanner
                type="success"
                message="Your MSA document has been generated successfully."
              />
              {renderDocumentPreview()}

              {msaData.googleDocId && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Document ID: {msaData.googleDocId}
                  </p>
                </div>
              )}
            </>
          )}
        </CardBody>
        <CardFooter className="flex-col sm:flex-row">
          <Button variant="outline" onClick={() => navigate('/')}>
            {msaData ? 'Back to Services' : 'Cancel'}
          </Button>
          {!msaData ? (
            <Button onClick={handleGenerateMSA} fullWidth>
              Generate MSA
            </Button>
          ) : msaData.isLocked ? (
            <Button onClick={handleUnlock} fullWidth>
              Unlock Document
            </Button>
          ) : (
            <Button
              onClick={() => {
                // Could implement download or copy functionality
                alert('Document is now unlocked and available');
              }}
              fullWidth
            >
              Download Document
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
